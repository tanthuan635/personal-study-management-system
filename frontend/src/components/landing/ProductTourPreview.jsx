import { DashboardMockup } from "./LearningOverview";

const navigation = [
  ["dashboard", "Dashboard", "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"],
  ["subjects", "Môn học", "M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3zM12 6v16"],
  ["tasks", "Deadline", "M9 5h10v17H5V9M2 4l3 3 5-5M9 12h7M9 17h7"],
  ["schedule", "Lịch học", "M3 5h18v16H3zM8 2v6M16 2v6M3 10h18"],
  ["documents", "Tài liệu", "M6 2h8l5 5v15H4V2zM14 2v6h6M8 13h7M8 17h7"],
  ["statistics", "Thống kê", "M4 20V10M10 20V4M16 20v-7M22 20H2"],
];

const subjects = [
  { code: "WEB301", name: "Lập trình Web", credits: 3, teacher: "Nguyễn Minh An", description: "Xây dựng ứng dụng web với React và Node.js." },
  { code: "CSDL202", name: "Cơ sở dữ liệu", credits: 3, teacher: "Trần Thanh Hà", description: "Mô hình dữ liệu, thiết kế và truy vấn SQL." },
];

function PreviewBanner({ label, title, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_60%,#ffffff_100%)] p-4 sm:p-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3979c2]">{label}</p>
        <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">{title}</p>
      </div>
      <span className="rounded-xl bg-[#4f8edc] px-3 py-2 text-xs font-bold text-white">+ {action}</span>
    </div>
  );
}

function PreviewStats({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-blue-100 bg-white p-3">
          <p className="text-xs text-slate-600">{label}</p>
          <p className="mt-1 text-xl font-bold text-[#123552]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SubjectsPreview() {
  return (
    <>
      <PreviewBanner label="Quản lý môn học" title="Danh sách môn học" action="Thêm môn học" />
      <div className="rounded-xl border border-blue-100 bg-white px-4 py-3 text-xs text-slate-500">⌕ Tìm theo tên, mã môn hoặc giảng viên...</div>
      <p className="text-sm font-bold text-slate-800">Thông tin môn học hiện có · 2/6 môn</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {subjects.map((subject) => (
          <div key={subject.code} className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-4">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#79b8f3] to-[#4f8edc]" />
            <div className="flex items-center justify-between gap-2">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-xs font-black text-[#4f8edc]">{subject.code.slice(0, 2)}</span>
              <span className="rounded-full border border-blue-100 px-2 py-1 text-xs text-slate-600">{subject.credits} tín chỉ</span>
            </div>
            <p className="mt-4 text-[10px] font-bold tracking-widest text-[#3979c2]">{subject.code}</p>
            <p className="mt-1 text-base font-bold text-slate-900">{subject.name}</p>
            <div className="mt-3 rounded-xl bg-[#f7fbff] p-3 text-xs text-slate-600">Giảng viên<p className="mt-1 font-semibold text-slate-800">{subject.teacher}</p></div>
            <p className="mt-3 text-xs leading-5 text-slate-600">{subject.description}</p>
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 text-xs font-bold">
              <span className="flex-1 rounded-lg bg-blue-50 py-2 text-center text-[#3979c2]">Sửa</span>
              <span className="flex-1 rounded-lg bg-rose-50 py-2 text-center text-rose-600">Xóa</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function TasksPreview() {
  return (
    <>
      <PreviewBanner label="Quản lý deadline" title="Kế hoạch cần hoàn thành" action="Thêm deadline" />
      <PreviewStats items={[["Tổng deadline", 12], ["Quá hạn", 1], ["Sắp tới", 2], ["Hoàn thành", 9]]} />
      <div className="flex flex-wrap gap-2 rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-600">
        <span className="mr-auto font-bold">Bộ lọc</span>
        <span className="rounded-lg bg-[#f7fbff] px-3 py-2">Tất cả trạng thái ▾</span>
        <span className="rounded-lg bg-[#f7fbff] px-3 py-2">Tất cả ưu tiên ▾</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: "Hoàn thiện bài React", subject: subjects[0], status: "Đang làm", priority: "Cao", date: "20/10/2026", note: "Hoàn thiện giao diện và kiểm tra các route." },
          { title: "Bài tập truy vấn SQL", subject: subjects[1], status: "Hoàn thành", priority: "Trung bình", date: "15/10/2026", note: "Ôn lại JOIN và truy vấn nhóm dữ liệu." },
        ].map((task) => (
          <div key={task.title} className={`rounded-2xl border border-blue-100 border-t-4 bg-white p-4 ${task.status === "Hoàn thành" ? "border-t-emerald-400" : "border-t-[#79b8f3]"}`}>
            <p className="text-[10px] font-bold tracking-widest text-[#3979c2]">{task.subject.code}</p>
            <p className="mt-2 text-base font-bold text-slate-900">{task.title}</p>
            <p className="mt-1 text-xs text-slate-600">{task.subject.name}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
              <span className={`rounded-full px-2 py-1 ${task.priority === "Cao" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>{task.priority}</span>
              <span className={`rounded-full px-2 py-1 ${task.status === "Hoàn thành" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}>{task.status}</span>
            </div>
            <div className="mt-3 rounded-xl bg-[#f7fbff] p-3 text-xs text-slate-600">Hạn nộp<p className="mt-1 font-bold text-slate-800">{task.date}</p></div>
            <p className="mt-3 text-xs leading-5 text-slate-600">{task.note}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3 text-xs font-bold">
              {task.status !== "Hoàn thành" && <span className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">Hoàn thành</span>}
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-[#3979c2]">Sửa</span>
              <span className="rounded-lg bg-rose-50 px-3 py-2 text-rose-600">Xóa</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SchedulePreview() {
  return (
    <>
      <PreviewBanner label="Thời khóa biểu" title="Lịch học trong tuần" action="Thêm lịch học" />
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-600">
        <span className="font-bold">Xem lịch theo môn học</span><span className="rounded-lg bg-blue-50 px-3 py-2">Tất cả môn học ▾</span>
      </div>
      <p className="text-xs text-slate-600">Lịch tuần · Minh họa tiết 1–6. Trên điện thoại, vuốt ngang để xem các ngày.</p>
      <div tabIndex={0} role="region" aria-label="Minh họa lịch tuần, có thể cuộn ngang" className="overflow-x-auto rounded-xl border border-blue-100 bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
        <div role="img" aria-label="Lịch tuần mẫu: Lập trình Web thứ 2 tiết 1–3 phòng B201; Cơ sở dữ liệu thứ 4 tiết 3–5 phòng A302; Toán rời rạc thứ 6 tiết 1–2 phòng C104." className="grid min-w-[640px] grid-cols-[44px_repeat(7,minmax(0,1fr))] grid-rows-[36px_repeat(6,48px)] text-[10px]">
          {["Tiết", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map((day, index) => (
            <span key={day} style={{ gridColumn: index + 1, gridRow: 1 }} className="grid place-items-center border-b border-r border-blue-100 bg-[#f4f9ff] font-bold text-slate-600">{day}</span>
          ))}
          {Array.from({ length: 6 }, (_, period) => (
            <span key={period} style={{ gridColumn: 1, gridRow: period + 2 }} className="grid place-items-center border-b border-r border-blue-100 text-slate-500">{period + 1}</span>
          ))}
          {Array.from({ length: 42 }, (_, cell) => (
            <span key={cell} style={{ gridColumn: cell % 7 + 2, gridRow: Math.floor(cell / 7) + 2 }} className="border-b border-r border-blue-100" />
          ))}
          {[
            { column: 2, row: "2 / span 3", code: "WEB301", title: "Lập trình Web", details: "Tiết 1–3 · B201" },
            { column: 4, row: "4 / span 3", code: "CSDL202", title: "Cơ sở dữ liệu", details: "Tiết 3–5 · A302" },
            { column: 6, row: "2 / span 2", code: "TRR101", title: "Toán rời rạc", details: "Tiết 1–2 · C104" },
          ].map((event) => (
            <div key={event.code} style={{ gridColumn: event.column, gridRow: event.row }} className="z-10 m-0.5 rounded-lg border border-blue-200 border-l-[3px] border-l-[#4f8edc] bg-gradient-to-br from-[#eaf4ff] to-[#dcecff] p-1.5 text-[#123552]">
              <p className="font-bold text-[#3979c2]">{event.code}</p><p className="mt-1 font-bold">{event.title}</p><p className="mt-1">{event.details}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function DocumentsPreview() {
  return (
    <>
      <PreviewBanner label="Thư viện học tập" title="Tài liệu của bạn" action="Thêm tài liệu" />
      <PreviewStats items={[["Tổng tài liệu", 4], ["Đã tải file", 2], ["Chỉ metadata", 2], ["Loại tài liệu", 2]]} />
      <div className="grid gap-2 rounded-xl border border-blue-100 bg-white p-3 text-xs text-slate-600 sm:grid-cols-2">
        <span className="rounded-lg bg-[#f7fbff] p-3">⌕ Tên tài liệu, tên file, loại file...</span>
        <span className="rounded-lg bg-[#f7fbff] p-3">Tất cả môn học ▾</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: "Bài giảng React", fileName: "bai-giang-react.pdf", type: "PDF", subject: subjects[0], uploaded: true },
          { title: "Ôn tập truy vấn SQL", fileName: "on-tap-sql.docx", type: "DOCX", subject: subjects[1], uploaded: false },
        ].map((document) => (
          <div key={document.fileName} className="rounded-2xl border border-blue-100 border-t-4 border-t-[#79b8f3] bg-white p-4">
            <span className={`inline-grid size-10 place-items-center rounded-xl text-[10px] font-black ${document.type === "PDF" ? "bg-rose-50 text-rose-600" : "bg-sky-50 text-sky-600"}`}>{document.type}</span>
            <p className="mt-3 text-[10px] font-bold tracking-widest text-[#3979c2]">{document.subject.code}</p>
            <p className="mt-1 text-base font-bold text-slate-900">{document.title}</p>
            <p className="mt-1 text-xs text-slate-600">{document.subject.name}</p>
            <p className="mt-3 break-all rounded-xl bg-[#f7fbff] p-3 text-xs font-semibold text-slate-700">{document.fileName}</p>
            <p className={`mt-3 text-xs font-semibold ${document.uploaded ? "text-emerald-700" : "text-amber-700"}`}>{document.uploaded ? "● Đã tải lên máy chủ" : "● Chỉ lưu metadata"}</p>
            {document.uploaded && <p className="mt-3 rounded-lg bg-blue-50 py-2 text-center text-xs font-bold text-[#3979c2]">Mở file ↗</p>}
            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3 text-xs font-bold">
              <span className="flex-1 rounded-lg bg-slate-50 py-2 text-center text-slate-600">Sửa</span><span className="flex-1 rounded-lg bg-rose-50 py-2 text-center text-rose-600">Xóa</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StatisticsPreview() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-[linear-gradient(120deg,#ddecff_0%,#eef7ff_60%,#ffffff_100%)] p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3979c2]">Báo cáo học tập</p>
          <p className="mt-2 text-xl font-bold tracking-tight text-slate-950">Thống kê tiến độ</p>
        </div>
        <div className="min-w-[140px] rounded-xl border border-white/80 bg-white/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hoàn thành</p>
          <p className="mt-1 text-xl font-black text-[#4f8edc]">63%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-blue-100"><div className="h-full w-[63%] rounded-full bg-[#4f8edc]" /></div>
        </div>
      </div>
      <PreviewStats items={[["Tổng môn học", 3], ["Tổng deadline", 8], ["Đã hoàn thành", 5], ["Chưa hoàn thành", 3]]} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-100 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3979c2]">Phân bổ trạng thái</p>
          <p className="mt-2 text-sm font-bold text-slate-900">Deadline đã xử lý và còn lại</p>
          <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-amber-100"><div className="h-full w-[63%] bg-emerald-400" /></div>
          <div className="mt-3 flex justify-between gap-2 text-xs font-semibold"><span className="text-emerald-700">5 đã hoàn thành</span><span className="text-amber-700">3 chưa hoàn thành</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Quá hạn</p>
            <p className="mt-2 text-2xl font-black text-rose-700">1</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">7 ngày tới</p>
            <p className="mt-2 text-2xl font-black text-amber-700">2</p>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductTourPreview({ screen, title }) {
  if (screen === "overview" || screen === "dashboard") return <DashboardMockup />;

  return (
    <figure role={screen === "schedule" ? undefined : "img"} aria-label={screen === "schedule" ? undefined : `Minh họa tĩnh màn hình ${title} với thanh điều hướng, các bộ lọc và thẻ dữ liệu mẫu.`} className="min-w-0">
      <figcaption className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span className="font-bold text-[#123552]">Giao diện {title}</span><span>Dữ liệu minh họa · Bản xem tĩnh</span>
      </figcaption>
      <div className="overflow-hidden rounded-2xl border border-blue-200 bg-slate-50 shadow-sm sm:grid sm:grid-cols-[136px_minmax(0,1fr)]">
        <div aria-hidden="true" className="hidden border-r border-blue-100 bg-[#fafdff] p-3 sm:block">
          <div className="flex items-center gap-2 border-b border-blue-100 pb-4"><img src="/logo.svg" alt="" className="size-7" /><span className="brand-name text-[11px] text-[#183b5b]">Study Manager</span></div>
          <div className="mt-4 space-y-1">
            {navigation.map(([id, label, path]) => (
              <div key={id} className={`flex items-center gap-2 rounded-lg px-2 py-2.5 text-[11px] font-semibold ${id === screen ? "bg-[#e6f2ff] text-[#3979c2]" : "text-slate-600"}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0"><path d={path} /></svg>{label}
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <div aria-hidden="true" className="h-8 border-b border-blue-100 bg-[#fafdff]" />
          <div className="space-y-3 p-3 sm:p-4">
            {screen === "subjects" && <SubjectsPreview />}
            {screen === "tasks" && <TasksPreview />}
            {screen === "schedule" && <SchedulePreview />}
            {screen === "documents" && <DocumentsPreview />}
            {screen === "statistics" && <StatisticsPreview />}
          </div>
        </div>
      </div>
    </figure>
  );
}

export default ProductTourPreview;
