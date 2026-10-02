import Link from "next/link";
import { getDday, getDdayVariant } from "@/utils/dday";
import { CATEGORY_LABELS, getItemIconSrc } from "@/utils/category";

// 전체 목록 화면 전용 "한 줄짜리" 행. 체크박스 없이, 줄마다 수정 버튼만 둡니다.
export default function ItemRow({ item }) {
  const dday = getDday(item.dueDate);
  const ddayVariant = getDdayVariant(item.dueDate);

  return (
    <div className="item-row" data-status={item.status}>
      <span className={`item-row__icon icon-${item.category}`}>
        <img src={getItemIconSrc(item)} alt="" className="item-card__logo" />
      </span>

      <div className="item-row__body">
        <p className="item-row__title">{item.title}</p>
        <p className="item-row__meta">
          {CATEGORY_LABELS[item.category] ?? item.category} · {item.dueDate}
        </p>
      </div>

      <span className={`badge ${ddayVariant}`}>{dday}</span>

      <span className="item-row__amount">
        {item.amount.toLocaleString()}원
      </span>

      <Link href={`/items/${item.id}`} className="btn btn--sm">
        수정
      </Link>
    </div>
  );
}
