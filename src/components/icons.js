// 네트워크로 아이콘 폰트(Tabler CDN)를 받아오다가 URL이 깨지면 전체
// 아이콘이 한꺼번에 안 보이는 문제가 있었습니다. (@tabler/icons-webfont의
// 2.47.0 버전은 실제로 존재하지 않는 버전이라 그 링크 자체가 404였어요.)
// 그래서 외부 폰트에 기대지 않고, 여기 있는 작은 SVG 아이콘들만 씁니다.
// 인터넷 연결과 상관없이 항상 똑같이 보입니다.

function IconBase({ size = 20, children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconBell(props) {
  return (
    <IconBase {...props}>
      <path d="M10 5a2 2 0 1 1 4 0c3 1 4 4 4 7v3l1.5 2.5h-15L6 15v-3c0-3 1-6 4-7Z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </IconBase>
  );
}

export function IconUserCircle(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 19a6 6 0 0 1 11 0" />
    </IconBase>
  );
}

export function IconCalendarEvent(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 3v4M16 3v4" />
      <circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function IconArrowLeft(props) {
  return (
    <IconBase {...props}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </IconBase>
  );
}

export function IconSearch(props) {
  return (
    <IconBase {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </IconBase>
  );
}

export function IconGift(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M4 9h16v4H4z" />
      <path d="M12 9v11" />
      <path d="M12 9c-1.3-4-6-4-6-1.3C6 9 8 9 12 9Z" />
      <path d="M12 9c1.3-4 6-4 6-1.3C18 9 16 9 12 9Z" />
    </IconBase>
  );
}

export function IconDeviceTv(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 18v3" />
    </IconBase>
  );
}

export function IconShoppingBag(props) {
  return (
    <IconBase {...props}>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </IconBase>
  );
}

export function IconHome(props) {
  return (
    <IconBase {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </IconBase>
  );
}

export function IconTicket(props) {
  return (
    <IconBase {...props}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
      <path d="M14 7v10" strokeDasharray="2 2" />
    </IconBase>
  );
}

export function IconCar(props) {
  return (
    <IconBase {...props}>
      <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" />
      <rect x="3" y="11" width="18" height="6" rx="2" />
      <circle cx="7.5" cy="17" r="1.5" />
      <circle cx="16.5" cy="17" r="1.5" />
    </IconBase>
  );
}
