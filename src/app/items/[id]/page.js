"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getItem, updateItem, deleteItem } from "@/api/items";
import { CATEGORIES, CATEGORY_LABELS, getItemIconSrc } from "@/utils/category";
import { getDday, getDdayVariant } from "@/utils/dday";
import { IconArrowLeft } from "@/components/icons";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getItem(params.id);
        if (!ignore) {
          setItem(data);
          setForm(data);
        }
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
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await updateItem(params.id, {
        ...form,
        amount: Number(form.amount),
      });
      setItem(data);
      setForm(data);
      alert("저장되었어요.");
    } catch (err) {
      console.error(err);
      alert("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제할까요? 삭제하면 되돌릴 수 없어요.")) return;
    try {
      await deleteItem(params.id);
      router.push("/items");
    } catch (err) {
      console.error(err);
      alert("삭제에 실패했어요. 다시 시도해주세요.");
    }
  };

  // 사용 완료로 표시 / 다시 사용 중으로 변경
  // 실제 파일에는 이 기능 자체가 빠져 있었어요. 완료 처리를 했다가
  // 실수로 눌렀을 수도 있으니, 같은 버튼 자리에서 상태를 되돌릴 수 있게 했습니다.
  const handleStatusChange = async (nextStatus) => {
    try {
      const data = await updateItem(params.id, { status: nextStatus });
      setItem(data);
      setForm(data);
    } catch (err) {
      console.error(err);
      alert("처리에 실패했어요. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <main className="page-body">
          <p className="loading-state">불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="page">
        <main className="page-body">
          <p className="error-state">
            항목을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </p>
        </main>
      </div>
    );
  }

  const dday = getDday(item.dueDate);
  const ddayVariant = getDdayVariant(item.dueDate);

  return (
    <div className="page">
      <main className="page-body">
        <Link href="/items" className="back-link">
          <IconArrowLeft size={14} /> 전체 목록
        </Link>

        <div className="detail-header">
          {/* 이전에는 카테고리와 상관없이 icon-coupon / ti-gift로
              고정되어 있어서 구독·교통 항목도 쿠폰 아이콘으로 보였어요. */}
          <span className={`detail-header__icon icon-${item.category}`}>
            <img src={getItemIconSrc(item)} alt="" className="item-card__logo" />
          </span>

          <div>
            <p className="detail-header__title">{item.title}</p>
            <div className="detail-header__meta">
              <span>{CATEGORY_LABELS[item.category] ?? item.category}</span>
              <span>{item.dueDate}</span>
              <span className={`badge ${ddayVariant}`}>{dday}</span>
              {item.status === "done" && (
                <span className="badge badge--muted">사용 완료</span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-field">
            <label className="form-label" htmlFor="title">
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="input"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <span className="form-label">카테고리</span>
            {/* 이전엔 상세/수정 화면에 카테고리를 바꿀 방법이 없었어요.
                등록 폼과 같은 CATEGORIES 배열을 재사용합니다. */}
            <div className="segmented">
              {CATEGORIES.map((cat) => (
                <span key={cat.value}>
                  <input
                    type="radio"
                    id={`edit-category-${cat.value}`}
                    name="category"
                    value={cat.value}
                    checked={form.category === cat.value}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor={`edit-category-${cat.value}`}
                    className="segmented__label"
                  >
                    {cat.label}
                  </label>
                </span>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="dueDate">
              마감일
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              className="input"
              value={form.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="amount">
              금액
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              className="input"
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="memo">
              메모
            </label>
            <textarea
              id="memo"
              name="memo"
              className="textarea"
              value={form.memo ?? ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            {item.status === "done" ? (
              <button
                className="btn"
                type="button"
                onClick={() => handleStatusChange("active")}
              >
                다시 사용 중으로 변경
              </button>
            ) : (
              <button
                className="btn"
                type="button"
                onClick={() => handleStatusChange("done")}
              >
                사용 완료로 표시
              </button>
            )}

            <button
              className="btn btn--danger"
              type="button"
              onClick={handleDelete}
            >
              삭제
            </button>

            <button className="btn btn--primary" type="submit" disabled={saving}>
              {saving ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
