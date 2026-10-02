"use client";

import { useEffect, useState } from "react";
import ItemRow from "@/components/ItemRow";
import { IconSearch } from "@/components/icons";
import { getItems } from "@/api/items";
import { CATEGORIES } from "@/utils/category";
import { isExpired } from "@/utils/dday";

// 상태 필터: 전체 / 진행중 / 완료 / 만료
// - 진행중: status === "active" 이면서 아직 기한이 안 지난 것
// - 완료: status === "done" (사용자가 직접 완료 처리한 것)
// - 만료: status === "active" 인데 기한이 지난 것 (깜빡하고 놓친 것)
const STATUS_FILTERS = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행중" },
  { value: "done", label: "완료" },
  { value: "expired", label: "만료" },
];

function matchesStatusFilter(item, statusFilter) {
  if (statusFilter === "all") return true;
  if (statusFilter === "done") return item.status === "done";
  if (statusFilter === "expired") {
    return item.status !== "done" && isExpired(item.dueDate);
  }
  // "active": 완료되지 않았고 아직 기한도 안 지난 것
  return item.status !== "done" && !isExpired(item.dueDate);
}

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

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

  const filteredItems = items
    .filter((item) => category === "all" || item.category === category)
    .filter((item) => matchesStatusFilter(item, statusFilter))
    .filter((item) => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;
      // 제목뿐 아니라 메모에도 검색어가 있으면 찾아줍니다.
      return (
        item.title.toLowerCase().includes(keyword) ||
        (item.memo ?? "").toLowerCase().includes(keyword)
      );
    });

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
            목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page-body">
        <div className="items-header__top">
          <h1 className="page-title">전체 목록</h1>

          <div className="search-box">
            <IconSearch size={15} />
            <input
              type="text"
              placeholder="제목이나 메모로 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <ul className="filter-chips">
          <li>
            <button
              type="button"
              className="chip"
              aria-pressed={category === "all"}
              onClick={() => setCategory("all")}
            >
              전체
            </button>
          </li>
          {/* 카테고리 버튼 6개를 각각 적지 않고 CATEGORIES를 재사용합니다. */}
          {CATEGORIES.map((cat) => (
            <li key={cat.value}>
              <button
                type="button"
                className="chip"
                aria-pressed={category === cat.value}
                onClick={() => setCategory(cat.value)}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>

        <ul className="filter-chips">
          {STATUS_FILTERS.map((status) => (
            <li key={status.value}>
              <button
                type="button"
                className="chip"
                aria-pressed={statusFilter === status.value}
                onClick={() => setStatusFilter(status.value)}
              >
                {status.label}
              </button>
            </li>
          ))}
        </ul>

        {filteredItems.length === 0 ? (
          <p className="empty-state">조건에 맞는 항목이 없어요.</p>
        ) : (
          // 한 줄짜리 리스트로 보여주고,
          // 줄마다 수정 버튼을 바로 둡니다.
          <div className="item-list">
            {filteredItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
