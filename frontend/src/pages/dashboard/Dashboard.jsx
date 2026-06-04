import { getSessionUser } from "../../lib/auth";

const overviewCards = [
  {
    label: "Môn học",
    value: "8",
    note: "Các môn đang theo dõi",
  },
  {
    label: "Deadline",
    value: "3",
    note: "Việc cần xử lý hôm nay",
  },
  {
    label: "Tài liệu",
    value: "12",
    note: "Tệp đang lưu trong hệ thống",
  },
];

function Dashboard() {
  const currentUser = getSessionUser();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-slate-900 px-6 py-6 text-white">
        <p className="text-sm text-slate-300">Trang tổng quan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Chào mừng trở lại, {currentUser?.fullName || currentUser?.email || "bạn"}
        </h1>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{card.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Gợi ý nhanh</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>• Thêm deadline mới trong mục Deadline.</li>
          <li>• Cập nhật thời khóa biểu ở mục Lịch học.</li>
          <li>• Tải tài liệu vào mục Tài liệu để dễ tra cứu.</li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
