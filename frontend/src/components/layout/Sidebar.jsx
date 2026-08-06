import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/subjects", label: "Môn học", icon: "subjects" },
  { to: "/tasks", label: "Deadline", icon: "tasks" },
  { to: "/schedule", label: "Lịch học", icon: "schedule" },
  { to: "/documents", label: "Tài liệu", icon: "documents" },
  { to: "/statistics", label: "Thống kê", icon: "statistics" },
];

const iconPaths = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),
  subjects: (
    <>
      <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23.5v-18Z" />
      <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5a3.5 3.5 0 0 1 3.5 3.5v-18Z" />
    </>
  ),
  tasks: (
    <>
      <path d="M9 5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7" />
      <path d="m3 4 2 2 4-4M9 11h8M9 16h8" />
    </>
  ),
  schedule: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  documents: (
    <>
      <path d="M6 2h8l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path d="M14 2v6h6M8 13h8M8 17h8" />
    </>
  ),
  statistics: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5" />
    </>
  ),
};

function NavIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {iconPaths[name]}
    </svg>
  );
}

function SidebarTooltip({ children }) {
  return (
    <span className="pointer-events-none invisible absolute left-full top-1/2 z-[70] ml-3 hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg shadow-slate-900/20 transition duration-150 before:absolute before:-left-1 before:top-1/2 before:size-2 before:-translate-y-1/2 before:rotate-45 before:bg-slate-900 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 lg:block">
      {children}
    </span>
  );
}

function getInitials(value) {
  if (!value) {
    return "SM";
  }

  const words = value.trim().split(/\s+/).filter(Boolean);
  const selectedWords = words.length > 1 ? words.slice(-2) : words;

  return selectedWords
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

function Sidebar({
  currentUser,
  onLogout,
  isOpen,
  onClose,
  isCollapsed,
  isTextVisible,
  onCollapse,
  onExpand,
}) {
  const displayName =
    currentUser?.fullName || currentUser?.name || currentUser?.email || "Người dùng";
  const email = currentUser?.email || "Tài khoản học tập";
  const initials = getInitials(displayName);

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  const handleSidebarClick = (event) => {
    if (!isCollapsed || event.target.closest?.("a, button")) {
      return;
    }

    onExpand();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Đóng menu"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="main-sidebar"
        onClick={handleSidebarClick}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-blue-100 bg-[#fafdff] px-4 py-5 shadow-2xl shadow-slate-900/10 transition-[transform,width] duration-300 ease-in-out lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isCollapsed
            ? "lg:w-20 lg:cursor-e-resize lg:px-3"
            : "lg:w-72 lg:px-3"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2 lg:px-1.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#79b8f3] to-[#4f8edc] text-sm font-black text-white shadow-md shadow-blue-500/20">
              SM
            </span>
            <div
              className={`sidebar-collapse-text min-w-0 overflow-hidden whitespace-nowrap ${
                isCollapsed ? "lg:max-w-0" : "lg:max-w-48"
              } ${
                isTextVisible
                  ? "lg:opacity-100 lg:blur-0"
                  : "lg:opacity-0 lg:blur-[1px]"
              }`}
            >
              <p className="brand-name truncate text-base text-[#183b5b]">
                Study Manager
              </p>
              <p className="truncate text-xs text-slate-500">
                Quản lý học tập
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng sidebar"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 lg:hidden"
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
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>

          {!isCollapsed && isTextVisible ? (
            <button
              type="button"
              aria-label="Thu gọn sidebar"
              title="Thu gọn sidebar"
              onClick={onCollapse}
              className="hidden size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-white text-[#4f8edc] shadow-sm shadow-blue-100/50 transition hover:border-blue-200 hover:bg-blue-50 lg:grid"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <path d="M9 3v18M16 9l-3 3 3 3" />
              </svg>
            </button>
          ) : null}
        </div>

        <div className="mx-2 mt-5 border-t border-blue-100" />

        <nav className="mt-6 flex min-h-0 flex-1 flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex cursor-pointer items-center gap-3 overflow-visible rounded-2xl px-3.5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#e6f2ff] text-[#3979c2] shadow-sm shadow-blue-100/60"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                } lg:px-3 ${isCollapsed ? "lg:gap-0" : "lg:gap-3"}`
              }
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/70 text-current">
                <NavIcon name={item.icon} />
              </span>
              <span
                className={`sidebar-collapse-text overflow-hidden whitespace-nowrap ${
                  isCollapsed ? "lg:max-w-0" : "lg:max-w-36"
                } ${
                  isTextVisible
                    ? "lg:opacity-100 lg:blur-0"
                    : "lg:opacity-0 lg:blur-[1px]"
                }`}
              >
                {item.label}
              </span>
              {isCollapsed ? <SidebarTooltip>{item.label}</SidebarTooltip> : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-blue-100 pt-4">
          <div
            className="mb-3 overflow-hidden rounded-2xl border border-blue-100 bg-white p-2 shadow-sm shadow-blue-100/40 transition-[width,border-radius] duration-300 ease-out"
          >
            <div
              className={`flex items-center gap-3 transition-[gap] duration-300 ease-out ${
                isCollapsed ? "lg:gap-0" : "lg:gap-3"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-xs font-black text-[#4f8edc]">
                {initials}
              </span>
              <div
                className={`sidebar-collapse-text min-w-0 overflow-hidden whitespace-nowrap ${
                  isCollapsed ? "lg:max-w-0" : "lg:max-w-44"
                } ${
                  isTextVisible
                    ? "lg:opacity-100 lg:blur-0"
                    : "lg:opacity-0 lg:blur-[1px]"
                }`}
              >
                <p className="truncate text-sm font-bold text-slate-800">
                  {displayName}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">{email}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`group relative flex w-full cursor-pointer items-center gap-3 overflow-visible rounded-2xl px-3.5 py-3 text-left text-sm font-semibold text-rose-600 transition-all duration-300 hover:bg-rose-50 ${
              isCollapsed ? "lg:gap-0 lg:px-3" : "lg:gap-3 lg:px-3"
            }`}
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-rose-50">
              <NavIcon name="logout" />
            </span>
            <span
              className={`sidebar-collapse-text overflow-hidden whitespace-nowrap ${
                isCollapsed ? "lg:max-w-0" : "lg:max-w-24"
              } ${
                isTextVisible
                  ? "lg:opacity-100 lg:blur-0"
                  : "lg:opacity-0 lg:blur-[1px]"
              }`}
            >
              Đăng xuất
            </span>
            {isCollapsed ? <SidebarTooltip>Đăng xuất</SidebarTooltip> : null}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
