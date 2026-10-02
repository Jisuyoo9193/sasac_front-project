import ItemForm from "@/components/ItemForm";
import { CATEGORIES } from "@/utils/category";

export default function NewItemPage() {
  return (
    // 원래 파일엔 이 div가 없어서 다른 화면들과 달리
    // 카드/여백 스타일(.page가 주는) 없이 화면에 붙어서 보였어요.
    <div className="page">
      <main className="page-body">
        <div className="two-col two-col--form">
          <section>
            <h1 className="page-title" style={{ marginBottom: 4 }}>
              새 항목 등록
            </h1>

            <p className="page-subtitle">
              잊기 쉬운 혜택과 일정을 등록하면 DON'T MISS가 대신 관리해요.
            </p>

            <ItemForm />
          </section>

          <aside className="side-panel">
            <h2 className="side-panel__title">이런 항목을 등록해보세요</h2>

            {/* 카테고리 예시 6개를 각각 적지 않고 CATEGORIES를 재사용합니다. */}
            {CATEGORIES.map((cat) => (
              <div className="example-row" key={cat.value}>
                <span className={`example-row__icon icon-${cat.value}`}>
                  <cat.Icon size={18} />
                </span>
                <span>
                  <span className="example-row__title">{cat.label}</span>
                  <span className="example-row__desc">
                    {CATEGORY_EXAMPLE_DESC[cat.value]}
                  </span>
                </span>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}

// 카테고리별 예시 문구. 라벨/아이콘은 CATEGORIES에 있으니
// 여기서는 설명 문구만 따로 관리합니다.
const CATEGORY_EXAMPLE_DESC = {
  coupon: "카페, 영화, 편의점 등 기프티콘",
  subscription: "넷플릭스, 유튜브, 멜론 등 정기결제",
  shopping: "반품 마감일, 무료체험 종료일",
  life: "전세계약, 보험 갱신, 정기 점검",
  culture: "영화, 공연, 여행 예약",
  traffic: "자동차 검사, 면허 갱신, 정기권",
};
