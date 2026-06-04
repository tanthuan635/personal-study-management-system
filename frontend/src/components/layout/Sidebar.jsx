import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/subjects", label: "Môn học" },
  { to: "/tasks", label: "Deadline" },
  { to: "/schedule", label: "Lịch học" },
  { to: "/documents", label: "Tài liệu" },
  { to: "/statistics", label: "Thống kê" },
];

function Sidebar({ currentUser, onLogout }) {
  const displayName = currentUser?.fullName || currentUser?.email || "Người dùng";

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Study Manager
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
          Quản lý học tập
        </h2>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
        >
          Đăng xuất
        </button>
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tài khoản</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">{displayName}</p>
      </div>
    </aside>
  );
}

export default Sidebar;
