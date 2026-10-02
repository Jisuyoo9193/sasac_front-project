"use client";

import { useEffect, useMemo, useState } from "react";
import ItemCard from "@/components/ItemCard";
import { IconBell, IconCalendarEvent } from "@/components/icons";
import { getItems } from "@/api/items";
import { CATEGORIES } from "@/utils/category";
import {
  getDdayNumber,
  isDueThisMonth,
  isMissedThisMonth,
  parseLocalDate,
} from "@/utils/dday";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getItems();
        if (!ignore) setItems(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, []);

  // 완료되지 않은(아직 신경 써야 하는) 항목만 통계에 사용합니다.
  const activeItems = useMemo(
    () => items.filter((item) => item.status !== "done"),
    [items]
  );

  // ① 이번 달 안에 놓치면 안 되는 금액 (오늘 ~ 이번 달 말일)
  const thisMonthItems = useMemo(
    () => activeItems.filter((item) => isDueThisMonth(item.dueDate)),
    [activeItems]
  );
  const thisMonthAmount = thisMonthItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  // ② 7일 내 마감 (긴급)
  const urgentItems = useMemo(
    () =>
      activeItems.filter((item) => {
        const diff = getDdayNumber(item.dueDate);
        return diff >= 0 && diff <= 7;
      }),
    [activeItems]
  );
  const urgentAmount = urgentItems.reduce((sum, item) => sum + item.amount, 0);

  // ③ 이번 달에 이미 놓친 것 (이번 달 안에서 기한이 지난 것만 — 지난달 이전 것은 제외)
  const missedThisMonthItems = useMemo(
    () => activeItems.filter((item) => isMissedThisMonth(item.dueDate)),
    [activeItems]
  );
  const missedAmount = missedThisMonthItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const upcomingItems = useMemo(
    () =>
      [...activeItems]
        .sort(
          (a, b) => parseLocalDate(a.dueDate) - parseLocalDate(b.dueDate)
        )
        .slice(0, 8),
    [activeItems]
  );

  // 카테고리별 합계 금액.
  const categoryAmount = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.value, 0]));
    activeItems.forEach((item) => {
      map[item.category] = (map[item.category] ?? 0) + item.amount;
    });
    return map;
  }, [activeItems]);

  const maxCategoryAmount = Math.max(1, ...Object.values(categoryAmount));

  const getCategoryAmountPercent = (value) =>
    Math.round((value / maxCategoryAmount) * 100);

  const totalCategoryAmount = Object.values(categoryAmount).reduce(
    (sum, value) => sum + value,
    0
  );

  if (loading) {
    return (
      <div className="page">
        <main className="page-body">
          <p className="loading-state">불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <main className="page-body">
          <p className="error-state">
            정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page-body">
        <div className="hero-banner">
          <div>
            <p className="hero-banner__title">
              놓치기 전에,
              <br />
              지금 확인하세요
            </p>
            <p className="hero-banner__subtitle">
              구독, 쿠폰, 계약정보를 한 곳에서 관리해요.
            </p>
          </div>

          <div className="hero-banner__illustration">
            <span className="hero-banner__badge">Miss No More!</span>
            <span className="hero-banner__calendar">
              <IconCalendarEvent size={34} />
            </span>
            <span className="hero-banner__bell">
              <IconBell size={16} />
            </span>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__label">
              이번 달안에 놓치면 안 돼요!
            </span>
            <span className="stat-card__value">
              {thisMonthAmount.toLocaleString()}원
            </span>
            <span className="stat-card__count">{thisMonthItems.length}건</span>
          </div>

          <div className="stat-card stat-card--urgent">
            <span className="stat-card__label">🚨 긴급! 7일 내 마감돼요</span>
            <span className="stat-card__value">
              {urgentAmount.toLocaleString()}원
            </span>
            <span className="stat-card__count">{urgentItems.length}건</span>
          </div>

          <div className="stat-card stat-card--missed">
            <span className="stat-card__label">😢 이번 달에 놓쳤어요</span>
            <span className="stat-card__value">
              {missedAmount.toLocaleString()}원
            </span>
            <span className="stat-card__count">
              {missedThisMonthItems.length}건
            </span>
          </div>

        </div>

        <div className="two-col">
          <section>
            <h2 className="section-title">다가오는 일정</h2>

            {upcomingItems.length === 0 ? (
              <p className="empty-state">등록된 항목이 없어요.</p>
            ) : (
              <div className="card-grid">
                {/* 카드 마크업을 여기서 다시 쓰지 않고 ItemCard를 그대로
                    재사용합니다. (뱃지 색/카테고리 라벨 로직이 중복되지 않아요.) */}
                {upcomingItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>

          <aside className="side-panel">
            <h2 className="side-panel__title">카테고리별 금액</h2>

            {CATEGORIES.map((cat) => (
              <div className="category-row" key={cat.value}>
                <span
                  className="category-row__dot"
                  style={{ background: `var(--cat-${cat.value})` }}
                />
                <span>{cat.label}</span>
                <span className="category-row__bar">
                  <span
                    style={{
                      width: `${getCategoryAmountPercent(
                        categoryAmount[cat.value]
                      )}%`,
                      background: `var(--cat-${cat.value})`,
                    }}
                  />
                </span>
                <span className="category-row__amount">
                  {categoryAmount[cat.value].toLocaleString()}원
                </span>
              </div>
            ))}

            {/* 전에는 이 총액 줄이 있었는데 리팩토링하면서 빠졌었어요. 다시 넣었습니다. */}
            <div className="category-total">
              <span>전체 금액</span>
              <strong>{totalCategoryAmount.toLocaleString()}원</strong>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
