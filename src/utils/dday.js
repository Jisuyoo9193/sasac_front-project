/**
 * 날짜 문자열("YYYY-MM-DD")을 "로컬 자정" 기준 Date로 만듭니다.
 *
 * new Date("2026-10-15")처럼 날짜만 있는 문자열을 그냥 넣으면
 * UTC 자정으로 해석됩니다. 한국(UTC+9)에서는 대부분 같은 날짜로 보이지만,
 * 어떤 곳은 이 방식으로 날짜를 만들고 어떤 곳은 그냥 new Date(dueDate)를
 * 쓰면 두 기준이 섞여서 "정확히 7일째 되는 날" 같은 경계값에서
 * 하루 오차가 생길 수 있습니다. 그래서 날짜 비교가 필요한 곳은
 * 전부 이 함수를 통해서만 Date를 만듭니다.
 */
export function parseLocalDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

/** 오늘(로컬 자정) 기준 남은 일수. 0=오늘, 양수=며칠 남음, 음수=지남 */
export function getDdayNumber(dueDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = parseLocalDate(dueDate);

  const diffTime = targetDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/** 화면에 보여줄 텍스트: "D-3" / "D-DAY" / "만료됨" */
export function getDday(dueDate) {
  const diffDay = getDdayNumber(dueDate);

  if (diffDay > 0) {
    return `D-${diffDay}`;
  }
  if (diffDay === 0) {
    return "D-DAY";
  }
  return "만료됨";
}

/**
 * D-Day 뱃지 색상 클래스. globals.css에 있는
 * badge--danger / badge--warning / badge--neutral / badge--muted를 사용합니다.
 * (이전에는 ItemCard가 badge--danger를 하드코딩해서 D-17짜리 항목도
 *  빨간 뱃지로 보였습니다. 이 함수로 D-Day에 따라 색을 다르게 줍니다.)
 */
export function getDdayVariant(dueDate) {
  const diffDay = getDdayNumber(dueDate);

  if (diffDay < 0) return "badge--muted";
  if (diffDay <= 3) return "badge--danger";
  if (diffDay <= 7) return "badge--warning";
  return "badge--neutral";
}

/** 항목이 오늘 기준으로 이미 기한이 지났는지 (완료 여부와 무관) */
export function isExpired(dueDate) {
  return getDdayNumber(dueDate) < 0;
}

/** dueDate의 연/월이 오늘과 같은 달인지 */
function isSameMonthAsToday(dueDate) {
  const d = parseLocalDate(dueDate);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth()
  );
}

/** 오늘 ~ 이번 달 말일 사이에 마감인지 (이번 달 안에 "앞으로" 챙겨야 할 것) */
export function isDueThisMonth(dueDate) {
  return getDdayNumber(dueDate) >= 0 && isSameMonthAsToday(dueDate);
}

/** 이번 달 안에서 이미 지나버린 것 ("이번 달에 놓친" 것 — 지난달 이전 것은 제외) */
export function isMissedThisMonth(dueDate) {
  return getDdayNumber(dueDate) < 0 && isSameMonthAsToday(dueDate);
}
