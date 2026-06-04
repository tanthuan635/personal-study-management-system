import { NavLink, useNavigate } from "react-router-dom";

import { clearSessionUser, getSessionUser } from "../../lib/auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", end: true },
  { to: "/subjects", label: "Môn học" },
  { to: "/tasks", label: "Deadline" },
  { to: "/schedule", label: "Lịch học" },
  { to: "/documents", label: "Tài liệu" },
  { to: "/statistics", label: "Thống kê" },
];

function MainLayout({ children }) {
  const navigate = useNavigate();
  const currentUser = getSessionUser();

  const handleLogout = () => {
    clearSessionUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-5 py-6">
          <h2 className="text-xl font-semibold tracking-tight">Study Manager</h2>
          <p className="mt-2 text-sm text-slate-500">Quản lý học tập</p>

          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Đã đăng nhập</p>
            <p className="mt-1 break-words text-sm font-medium text-slate-700">
              {currentUser?.fullName || currentUser?.email}
            </p>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white px-6 py-4 md:px-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">
                  Xin chào, {currentUser?.fullName || currentUser?.email}
                </p>
                <h1 className="text-xl font-semibold">Study Manager</h1>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Đăng xuất
              </button>
            </div>
          </header>

          <main className="p-6 md:p-10">
            <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
