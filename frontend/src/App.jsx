import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Documents from "./pages/Documents";
import Statistics from "./pages/Statistics";

const pages = {
  dashboard: Dashboard,
  subjects: Subjects,
  tasks: Tasks,
  schedule: Schedule,
  documents: Documents,
  statistics: Statistics,
  login: Login,
  register: Register,
};

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "subjects", label: "Môn học" },
  { id: "tasks", label: "Deadline" },
  { id: "schedule", label: "Lịch học" },
  { id: "documents", label: "Tài liệu" },
  { id: "statistics", label: "Thống kê" },
  { id: "login", label: "Đăng nhập" },
  { id: "register", label: "Đăng ký" },
];

function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const Page = pages[currentPage];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "220px", padding: "20px", background: "#f1f1f1" }}>
        <h2>Study Manager</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentPage(item.id)}
              style={{
                border: "none",
                background: item.id === currentPage ? "#d9e8ff" : "transparent",
                color: "#1f2937",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "20px" }}>
        <Page />
      </main>
    </div>
  );
}

export default App;
