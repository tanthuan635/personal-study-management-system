import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { clearSessionUser, getSessionUser } from "../lib/auth";
import { removeToken } from "../utils/tokenStorage";

const SIDEBAR_FADE_DURATION = 120;
const SIDEBAR_RESIZE_DURATION = 300;

function MainLayout({ children }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarTextVisible, setIsSidebarTextVisible] = useState(true);
  const sidebarAnimationTimer = useRef(null);
  const currentUser = getSessionUser();

  useEffect(() => {
    return () => window.clearTimeout(sidebarAnimationTimer.current);
  }, []);

  const clearSidebarAnimationTimer = () => {
    window.clearTimeout(sidebarAnimationTimer.current);
    sidebarAnimationTimer.current = null;
  };

  const handleCollapseSidebar = () => {
    clearSidebarAnimationTimer();
    setIsSidebarTextVisible(false);

    sidebarAnimationTimer.current = window.setTimeout(() => {
      setIsSidebarCollapsed(true);
      sidebarAnimationTimer.current = null;
    }, SIDEBAR_FADE_DURATION);
  };

  const handleExpandSidebar = () => {
    clearSidebarAnimationTimer();
    setIsSidebarCollapsed(false);

    sidebarAnimationTimer.current = window.setTimeout(() => {
      setIsSidebarTextVisible(true);
      sidebarAnimationTimer.current = null;
    }, SIDEBAR_RESIZE_DURATION);
  };

  const handleLogout = () => {
    removeToken();
    clearSessionUser();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar
          currentUser={currentUser}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          isTextVisible={isSidebarTextVisible}
          onCollapse={handleCollapseSidebar}
          onExpand={handleExpandSidebar}
        />

        <div
          aria-hidden="true"
          className={`hidden h-screen shrink-0 transition-[width] duration-300 ease-in-out lg:block ${
            isSidebarCollapsed ? "w-20" : "w-72"
          }`}
        />

        <div className="min-w-0 flex-1">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
