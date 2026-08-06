const sidebarItems = [
  { code: "DB", label: "Dashboard", active: true },
  { code: "MH", label: "Môn học" },
  { code: "DL", label: "Deadline" },
  { code: "LH", label: "Lịch học" },
  { code: "TL", label: "Tài liệu" },
];

const scheduleItems = [
  { day: "Thứ 2", title: "Lập trình Web", time: "Tiết 1 - 3" },
  { day: "Thứ 4", title: "Cơ sở dữ liệu", time: "Tiết 7 - 9" },
  { day: "Thứ 6", title: "Kỹ thuật phần mềm", time: "Tiết 4 - 6" },
];

function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Bản xem trước giao diện Dashboard của Study Manager với sidebar, deadline và lịch học theo tuần"
      className="landing-product-preview relative"
    >
      <div className="absolute -inset-4 -z-10 border border-blue-100 bg-blue-50/50 sm:-inset-6" />
      <div className="overflow-hidden border border-blue-100 bg-white shadow-[0_28px_70px_rgba(44,99,155,0.16)]">
        <div className="flex h-10 items-center justify-between border-b border-blue-100 bg-[#fafdff] px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-2 rounded-full bg-rose-300" />
            <span className="size-2 rounded-full bg-amber-300" />
            <span className="size-2 rounded-full bg-emerald-300" />
          </div>
          <span className="rounded-md bg-blue-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-blue-500">
            Dữ liệu minh họa
          </span>
        </div>

        <div className="grid min-h-[370px] grid-cols-[58px_1fr] sm:grid-cols-[132px_1fr]">
          <aside className="border-r border-blue-100 bg-[#fafdff] p-2.5 sm:p-3">
            <div className="mb-5 flex items-center gap-2 px-1">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#4f8edc] text-[9px] font-black text-white">
                SM
              </span>
              <span className="hidden text-[10px] font-black text-[#183b5b] sm:block">
                Study Manager
              </span>
            </div>
            <div className="space-y-1.5">
              {sidebarItems.map((item) => (
                <div
                  key={item.code}
                  className={`flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] font-bold ${
                    item.active
                      ? "bg-[#e6f2ff] text-[#3979c2]"
                      : "text-slate-400"
                  }`}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white text-[8px]">
                    {item.code}
                  </span>
                  <span className="hidden sm:block">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="min-w-0 bg-[#f8fbff] p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-500">
                  Tổng quan tuần học
                </p>
                <p className="mt-1 text-sm font-black tracking-tight text-slate-900 sm:text-base">
                  Mọi việc cần làm, trong một nơi
                </p>
              </div>
              <span className="hidden rounded-lg border border-blue-100 bg-white px-2.5 py-1.5 text-[9px] font-bold text-slate-500 sm:block">
                Tuần này
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                ["Môn học", "Đang quản lý"],
                ["Deadline", "Theo mức ưu tiên"],
                ["Tiến độ", "Cập nhật tự động"],
              ].map(([title, description], index) => (
                <div key={title} className="border border-blue-100 bg-white p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-extrabold text-slate-700">{title}</p>
                    <span
                      className={`size-2 rounded-full ${
                        index === 1 ? "bg-amber-400" : "bg-[#6aa9e7]"
                      }`}
                    />
                  </div>
                  <p className="mt-1 hidden text-[9px] leading-4 text-slate-400 sm:block">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border border-blue-100 bg-white p-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-800">Lịch học trong tuần</p>
                  <span className="text-[8px] font-bold text-blue-500">Xem lịch</span>
                </div>
                <div className="mt-3 space-y-2">
                  {scheduleItems.map((item, index) => (
                    <div
                      key={item.day}
                      className="grid grid-cols-[38px_1fr] gap-2 border-t border-blue-50 pt-2"
                    >
                      <span className="text-[8px] font-bold text-slate-400">{item.day}</span>
                      <div className={`border-l-2 pl-2 ${index === 1 ? "border-amber-300" : "border-blue-300"}`}>
                        <p className="truncate text-[9px] font-bold text-slate-700">{item.title}</p>
                        <p className="mt-0.5 text-[8px] text-slate-400">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-blue-100 bg-white p-3.5">
                <p className="text-[10px] font-black text-slate-800">Deadline gần nhất</p>
                <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/70 p-2.5">
                  <p className="text-[8px] font-black uppercase tracking-wider text-amber-600">
                    Ưu tiên cao
                  </p>
                  <p className="mt-1 text-[9px] font-bold text-slate-700">Hoàn thiện bài React</p>
                  <p className="mt-1 text-[8px] text-slate-400">Lập trình Web</p>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[8px] font-bold text-slate-400">
                    <span>Tiến độ</span>
                    <span>Đang làm</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-blue-50">
                    <div className="h-full w-2/3 rounded-full bg-[#4f8edc]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreview;
