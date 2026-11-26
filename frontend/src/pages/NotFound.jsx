import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import LandingLayout from "../components/landing/LandingLayout";

function NotFound() {
  const { pathname } = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Không tìm thấy trang | Study Manager";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <LandingLayout>
      <main
        aria-labelledby="not-found-title"
        className="mx-auto grid min-h-[calc(100vh-var(--landing-header-height))] w-full max-w-[1200px] place-items-center px-5 py-16 sm:px-8"
      >
        <section className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_58%,#ffffff_100%)] px-6 py-12 text-center shadow-sm shadow-blue-100/50 sm:px-10">
          <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full border-[26px] border-white/50" />

          <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-[#2f689f]">
            Lỗi 404
          </p>
          <p
            aria-hidden="true"
            className="relative mt-3 text-6xl font-black tracking-[-0.06em] text-[#4f8edc] sm:text-7xl"
          >
            404
          </p>
          <h1
            id="not-found-title"
            className="relative mt-4 text-2xl font-black tracking-[-0.04em] text-[#123552] sm:text-3xl"
          >
            Không tìm thấy trang
          </h1>
          <p className="relative mt-3 text-sm leading-6 text-slate-600">
            Trang bạn tìm có thể đã bị đổi địa chỉ hoặc không tồn tại.
          </p>
          <p className="relative mt-2 break-all text-xs font-semibold text-slate-500">
            {pathname}
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#4f8edc] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3979c2] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
            >
              Về trang chủ
            </Link>
            <Link
              to="/features"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-bold text-[#2f689f] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
            >
              Xem tính năng
            </Link>
          </div>
        </section>
      </main>
    </LandingLayout>
  );
}

export default NotFound;
