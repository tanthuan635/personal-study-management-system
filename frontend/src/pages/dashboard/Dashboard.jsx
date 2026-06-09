import { getSessionUser } from "../../lib/auth";
import { loadDocuments, loadSubjects, loadTasks } from "../../utils/storage";

function Dashboard() {
  const currentUser = getSessionUser();
  const subjects = loadSubjects();
  const tasks = loadTasks();
  const documents = loadDocuments();
  const completedTasks = tasks.filter((task) => task.status === "Hoàn thành").length;
  const pendingTasks = tasks.length - completedTasks;

  const overviewCards = [
    {
      label: "Môn học",
      value: subjects.length,
      note: "Môn đang quản lý",
      tone: "text-slate-900",
    },
    {
      label: "Deadline",
      value: tasks.length,
      note: `${pendingTasks} deadline chưa hoàn thành`,
      tone: "text-amber-700",
    },
    {
      label: "Tài liệu",
      value: documents.length,
      note: "Tài liệu đã lưu tên file",
      tone: "text-sky-700",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-slate-900 px-6 py-6 text-white shadow-sm">
        <p className="text-sm text-slate-300">Trang tổng quan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Chào mừng trở lại, {currentUser?.fullName || currentUser?.email || "bạn"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Đây là các số liệu nhanh từ dữ liệu đang lưu tạm trong trình duyệt.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`mt-3 text-3xl font-semibold tracking-tight ${card.tone}`}>
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Gợi ý nhanh</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          <li>Thêm deadline mới trong mục Deadline.</li>
          <li>Cập nhật thời khóa biểu ở mục Lịch học.</li>
          <li>Lưu tài liệu vào mục Tài liệu để dễ tra cứu.</li>
        </ul>
      </section>
    </div>
  );
}

export default Dashboard;
