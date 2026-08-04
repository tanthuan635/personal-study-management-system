function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-blue-100 bg-[#fafdff]/95 px-4 shadow-sm shadow-blue-100/30 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex h-16 items-center">
        <button
          type="button"
          aria-label="Mở sidebar"
          aria-controls="main-sidebar"
          onClick={onMenuClick}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-[#4f8edc] transition hover:border-blue-200 hover:bg-blue-100 lg:hidden"
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
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
