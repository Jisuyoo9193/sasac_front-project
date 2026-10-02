import Link from "next/link";
import { getDday, getDdayVariant } from "@/utils/dday";
import { CATEGORY_LABELS, getItemIconSrc } from "@/utils/category";

export default function ItemCard({ item }) {
  const dday = getDday(item.dueDate);
  const ddayVariant = getDdayVariant(item.dueDate);

  return (
    <Link
      className="item-card"
      href={`/items/${item.id}`}
      data-status={item.status}
      style={{ display: "block" }}
    >
      <span className={`item-card__icon icon-${item.category}`}>
        <img
          src={getItemIconSrc(item)}
          alt=""
          className="item-card__logo"
        />
      </span>

      <p className="item-card__title">{item.title}</p>

      <div className="item-card__row">
        {/* 이전에는 모든 항목이 badge--danger(빨강)로 고정되어 있어서
            D-17짜리 항목도 급한 것처럼 보였어요. 이제 D-Day에 따라
            danger/warning/neutral/muted 색이 달라집니다. */}
        <span className={`badge ${ddayVariant}`}>{dday}</span>

        <span className="item-card__amount">
          {item.amount.toLocaleString()}원
        </span>
      </div>

      <p className="item-card__meta">
        {item.dueDate} · {CATEGORY_LABELS[item.category] ?? item.category}
      </p>
    </Link>
  );
}
