import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { clearSessionUser, getSessionUser } from "../lib/auth";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Tổng quan tiến độ học tập của bạn.",
  },
  "/subjects": {
    title: "Môn học",
    description: "Theo dõi những môn học đang quản lý.",
  },
  "/tasks": {
    title: "Deadline",
    description: "Các đầu việc và hạn chót cần xử lý.",
  },
  "/schedule": {
    title: "Lịch học",
    description: "Xem thời khóa biểu trong tuần.",
  },
  "/documents": {
    title: "Tài liệu",
    description: "Quản lý tài liệu và file học tập.",
  },
  "/statistics": {
    title: "Thống kê",
    description: "Tổng hợp tiến độ và kết quả học tập.",
  },
};

function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getSessionUser();
  const currentPage = pageMeta[location.pathname] ?? pageMeta["/dashboard"];

  const handleLogout = () => {
    clearSessionUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />

        <div className="flex-1">
          <Header
            title={currentPage.title}
            description={currentPage.description}
            currentUser={currentUser}
          />

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
