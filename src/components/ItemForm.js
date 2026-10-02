"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/utils/category";
import { createItem } from "@/api/items";

const INITIAL_FORM = {
  title: "",
  category: CATEGORIES[0].value,
  dueDate: "",
  amount: "",
  memo: "",
};

export default function ItemForm() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 필수값만 간단히 검증합니다. (제목 / 날짜 / 금액)
  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "제목을 입력해주세요.";
    }
    if (!form.dueDate) {
      nextErrors.dueDate = "날짜를 선택해주세요.";
    }
    if (!form.amount) {
      nextErrors.amount = "금액을 입력해주세요.";
    } else if (Number(form.amount) <= 0) {
      nextErrors.amount = "0보다 큰 금액을 입력해주세요.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);
    try {
      await createItem({
        ...form,
        amount: Number(form.amount),
        status: "active",
      });
      router.push("/items");
    } catch (err) {
      console.error(err);
      alert("등록에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="title">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`input ${errors.title ? "input--error" : ""}`}
          placeholder="예: 스타벅스 아메리카노 기프티콘"
          value={form.title}
          onChange={handleChange}
        />
        {errors.title && <p className="error-text">{errors.title}</p>}
      </div>

      <div className="form-field">
        <span className="form-label">카테고리</span>
        {/* 카테고리 6개를 각각 하드코딩하지 않고 CATEGORIES 배열을
            재사용합니다. 카테고리가 추가/변경돼도 이 파일은 그대로 두고
            utils/category.js 한 곳만 고치면 됩니다. */}
        <div className="segmented">
          {CATEGORIES.map((cat) => (
            <span key={cat.value}>
              <input
                type="radio"
                id={`category-${cat.value}`}
                name="category"
                value={cat.value}
                checked={form.category === cat.value}
                onChange={handleChange}
              />
              <label
                htmlFor={`category-${cat.value}`}
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
          className={`input ${errors.dueDate ? "input--error" : ""}`}
          value={form.dueDate}
          onChange={handleChange}
        />
        {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="amount">
          금액
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          className={`input ${errors.amount ? "input--error" : ""}`}
          placeholder="예: 5000"
          value={form.amount}
          onChange={handleChange}
        />
        {errors.amount && <p className="error-text">{errors.amount}</p>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="memo">
          메모 (선택)
        </label>
        <textarea
          id="memo"
          name="memo"
          className="textarea"
          placeholder="예: 유효기간 지나면 환불 안 됨"
          value={form.memo}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
