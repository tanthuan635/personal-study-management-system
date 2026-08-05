import heroImage from "../../assets/hero.png";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[#79b8f3] to-[#4f8edc] text-sm font-black tracking-tight text-white shadow-lg shadow-blue-900/15">
        SM
      </span>
      <div>
        <p className="brand-name text-lg text-[#183b5b]">Study Manager</p>
        <p className="text-xs text-slate-500">Quản lý học tập thông minh</p>
      </div>
    </div>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dceeff_0%,#edf6ff_52%,#f8fbff_100%)]">
      <div className="pointer-events-none absolute -left-32 top-1/4 size-96 rounded-full bg-[#72b4ef]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-white/75 blur-3xl" />

      <main className="relative mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden min-h-screen flex-col justify-between px-12 py-10 text-slate-900 lg:flex xl:px-16">
          <BrandMark />

          <div className="relative isolate max-w-xl py-12">
            <div className="absolute -right-20 top-1/2 z-0 hidden size-64 -translate-y-1/2 place-items-center rounded-full border border-amber-100/90 bg-amber-50/60 opacity-75 shadow-xl shadow-amber-200/30 backdrop-blur-sm xl:grid">
              <div className="absolute inset-8 rounded-full border border-dashed border-amber-300/45" />
              <img
                src={heroImage}
                alt=""
                className="relative w-44 hue-rotate-[140deg] saturate-75 brightness-125 drop-shadow-[0_24px_45px_rgba(245,190,70,0.28)]"
              />
            </div>

            <div className="relative z-10">
              <p className="mb-5 inline-flex rounded-full border border-[#8fc2ef]/60 bg-white/45 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#356da9]">
                Học tập chủ động
              </p>
              <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-[-0.04em] xl:text-5xl">
                Mọi kế hoạch học tập trong một không gian.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
                Theo dõi môn học, deadline, lịch học và tài liệu để luôn biết
                việc cần ưu tiên tiếp theo.
              </p>

              <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
                {["Môn học", "Deadline", "Tiến độ"].map((item, index) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/80 bg-white/60 px-4 py-4 shadow-sm shadow-blue-200/30 backdrop-blur"
                  >
                    <span className="block text-lg font-bold text-[#4f8edc]">
                      0{index + 1}
                    </span>
                    <span className="mt-1 block text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Study Manager · Đồng hành cùng tiến độ của bạn
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px] rounded-[2rem] border border-white/90 bg-white/95 p-6 shadow-[0_30px_100px_rgba(60,120,180,0.2)] backdrop-blur sm:p-9">
            <div className="mb-8 text-slate-900 lg:hidden">
              <BrandMark />
            </div>

            {children}

            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              Dữ liệu tài khoản của bạn được bảo vệ bằng phiên đăng nhập riêng.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AuthLayout;
