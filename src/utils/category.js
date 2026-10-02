import {
  IconGift,
  IconDeviceTv,
  IconShoppingBag,
  IconHome,
  IconTicket,
  IconCar,
} from "@/components/icons";

// 카테고리 값/한글 라벨/아이콘을 한 곳에서만 관리합니다.
// 필터 칩, 카드 메타 정보, 상세 페이지, 등록 폼이 전부 이 배열을 재사용해요.
// 새 카테고리를 추가/변경할 때도 여기 한 줄만 고치면 전체에 반영됩니다.
// (아이콘은 외부 폰트 CDN 대신 components/icons.js의 SVG 컴포넌트를 씁니다.)
export const CATEGORIES = [
  { value: "coupon", label: "쿠폰", Icon: IconGift },
  { value: "subscription", label: "구독", Icon: IconDeviceTv },
  { value: "shopping", label: "쇼핑", Icon: IconShoppingBag },
  { value: "life", label: "생활", Icon: IconHome },
  { value: "culture", label: "문화/여가", Icon: IconTicket },
  { value: "traffic", label: "교통", Icon: IconCar },
];

// 빠르게 값 -> 라벨로 바꿀 때 쓰는 맵. 예: CATEGORY_LABELS["coupon"] === "쿠폰"
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

// 등록 폼에 브랜드 입력란이 없어서 item.brand는 항상 비어 있었습니다.
// 그래서 브랜드별 로고 분기를 없애고 카테고리 이미지 하나로 통일합니다.
// (db.json에 brand 필드가 남아있어도 더 이상 사용하지 않으니 지우셔도 됩니다.)
export function getItemIconSrc(item) {
  return `/category/category-${item.category}.png`;
}
