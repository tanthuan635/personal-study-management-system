import { useState } from "react";
import { Link } from "react-router-dom";

const navigationItems = [
  { label: "Trang chủ", href: "#home" },
  { label: "Tính năng", href: "#features" },
  { label: "Cách hoạt động", href: "#workflow" },
  { label: "Giới thiệu", href: "#about" },
];

function Brand() {
  return (
    <Link
      to="/"
      aria-label="Study Manager - Trang chủ"
      className="group flex shrink-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      <span className="grid size-10 place-items-center rounded-xl bg-[#4f8edc] text-xs font-black tracking-tight text-white shadow-md shadow-blue-500/20 transition group-hover:bg-[#3979c2]">
        SM
      </span>
      <span>
        <span className="brand-name block text-base leading-tight text-[#183b5b]">
          Study Manager
        </span>
        <span className="block text-[11px] font-medium text-slate-500">
          Quản lý học tập
        </span>
      </span>
    </Link>
  );
}

function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100/80 bg-[#fafdff]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Brand />

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 lg:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Đăng nhập
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-[#4f8edc] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Bắt đầu ngay
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={isMenuOpen}
          aria-controls="landing-mobile-menu"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="grid size-11 place-items-center rounded-xl border border-blue-100 bg-white text-[#3979c2] shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            className="size-5"
          >
            {isMenuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="landing-mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`overflow-hidden border-t border-blue-100 bg-white transition-[max-height,opacity] duration-200 lg:hidden ${
          isMenuOpen
            ? "max-h-[520px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Điều hướng trên điện thoại" className="space-y-1 px-5 py-5 sm:px-8">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              {item.label}
            </a>
          ))}
          <div className="grid grid-cols-2 gap-3 border-t border-blue-100 pt-4">
            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-xl border border-blue-200 bg-white px-4 py-3 text-center text-sm font-bold text-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="rounded-xl bg-[#4f8edc] px-4 py-3 text-center text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
              Đăng ký
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default LandingHeader;
