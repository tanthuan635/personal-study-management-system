import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";
import RequireAuth from "./components/auth/RequireAuth";
import AuthLayout from "./layouts/login/AuthLayout";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/Documents";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Schedule from "./pages/Schedule";
import Statistics from "./pages/Statistics";
import Subjects from "./pages/Subjects";
import Tasks from "./pages/Tasks";
import { isAuthenticated } from "./lib/auth";

function HomeRedirect() {
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <AuthLayout>
                <Login />
              </AuthLayout>
            </GuestOnlyRoute>
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
