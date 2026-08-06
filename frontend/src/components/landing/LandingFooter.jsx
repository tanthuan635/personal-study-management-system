import { Link } from "react-router-dom";

const currentYear = new Date().getFullYear();

function LandingFooter() {
  return (
    <footer className="border-t border-blue-100 bg-[#fafdff]">
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_0.6fr_0.8fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-[#4f8edc] text-xs font-black text-white">
              SM
            </span>
            <span className="brand-name text-base text-[#183b5b]">Study Manager</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Không gian cá nhân giúp sinh viên quản lý môn học, deadline, lịch học,
            tài liệu và tiến độ trên cùng một hệ thống.
          </p>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Khám phá
          </p>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
            <a className="block hover:text-[#3979c2]" href="#features">Tính năng</a>
            <a className="block hover:text-[#3979c2]" href="#workflow">Cách hoạt động</a>
            <Link className="block hover:text-[#3979c2]" to="/privacy">Quyền riêng tư</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Đồ án
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Sản phẩm học tập ngành Kỹ thuật phần mềm, xây dựng bằng React,
            Express và MongoDB.
          </p>
          <a
            href="https://github.com/Jun635/personal-study-management-system"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#3979c2] hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Xem mã nguồn
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className="border-t border-blue-100">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {currentYear} Study Manager.</p>
          <p>Thiết kế cho việc học có kế hoạch.</p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
