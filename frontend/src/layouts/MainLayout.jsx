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
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />

        <div className="min-w-0 flex-1">
          <Header
            title={currentPage.title}
            description={currentPage.description}
            currentUser={currentUser}
          />

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
