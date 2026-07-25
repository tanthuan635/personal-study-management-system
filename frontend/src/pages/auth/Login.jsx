import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { login } from "../../api/authApi";
import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import { saveSessionUser } from "../../lib/auth";
import { setToken } from "../../utils/tokenStorage";

function getLoginErrorMessage(error) {
  if (error.message === "Invalid authentication response") {
    return "Phản hồi đăng nhập từ máy chủ không hợp lệ.";
  }

  if (error.response?.status === 401) {
    return "Email hoặc mật khẩu không đúng.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const message = location.state?.message || "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({
        email: trimmedEmail,
        password,
      });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid authentication response");
      }

      setToken(token);
      saveSessionUser(user);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(getLoginErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Đăng nhập
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Nhập email và mật khẩu để vào trang quản lý học tập.
        </p>
      </div>

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <AuthInput
          label="Email"
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tenban@example.com"
          autoComplete="email"
          disabled={isLoading}
        />

        <AuthInput
          label="Mật khẩu"
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
          disabled={isLoading}
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </AuthButton>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-medium text-slate-900 underline underline-offset-4"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}

export default Login;
