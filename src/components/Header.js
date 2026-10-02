"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBell, IconUserCircle } from "@/components/icons";

const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/items", label: "전체 목록" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <div className="navbar__left">
        <Link href="/" className="navbar__logo">
          DON'T MISS
        </Link>
      </div>

      {/* 요청하신 대로 "홈 / 전체 목록 / 등록" 순서로 전부 오른쪽에
          모아뒀습니다. 로고만 왼쪽에 단독으로 남아요. */}
      <div className="navbar__right">
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`nav-link ${
                  pathname === link.href ? "nav-link--active" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/items/new"
          className="btn btn--primary btn--sm"
          style={{ flexShrink: 0 }}
        >
          + 등록
        </Link>

        {/* 알림/계정 기능은 이번 과제 범위에는 없지만, 다음 단계로
            넣을 예정이라 아이콘은 미리 보이게 둡니다. (동작은 없음) */}
        <button
          type="button"
          className="icon-btn"
          aria-label="알림 (준비 중)"
          title="알림 - 추후 추가 예정"
          style={{ flexShrink: 0 }}
        >
          <IconBell size={18} />
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="내 계정 (준비 중)"
          title="내 계정 - 추후 추가 예정"
          style={{ flexShrink: 0 }}
        >
          <IconUserCircle size={18} />
        </button>
      </div>
    </header>
  );
}
