import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";
import RequireAuth from "./components/auth/RequireAuth";
import AuthLayout from "./layouts/login/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/Documents";
import DocumentViewer from "./pages/DocumentViewer";
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Privacy from "./pages/Privacy";
import Register from "./pages/auth/Register";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <AuthLayout>
                <Register />
              </AuthLayout>
            </GuestOnlyRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/subjects"
          element={
            <RequireAuth>
              <MainLayout>
                <Subjects />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/tasks"
          element={
            <RequireAuth>
              <MainLayout>
                <Tasks />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/schedule"
          element={
            <RequireAuth>
              <MainLayout>
                <Schedule />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/documents"
          element={
            <RequireAuth>
              <MainLayout>
                <Documents />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/documents/:id/view"
          element={
            <RequireAuth>
              <MainLayout>
                <DocumentViewer />
              </MainLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/statistics"
          element={
            <RequireAuth>
              <MainLayout>
                <Statistics />
              </MainLayout>
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
