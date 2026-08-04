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
      <div className="mb-7">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#4f8edc]">
          Chào mừng trở lại
        </p>
        <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950">
          Đăng nhập
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Tiếp tục quản lý kế hoạch và tiến độ học tập của bạn.
        </p>
      </div>

      {message ? (
        <div
          role="status"
          className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700"
        >
          {message}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {error}
        </div>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit}>
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
          {isLoading ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Đang đăng nhập...
            </>
          ) : (
            <>
              Đăng nhập
              <svg
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className="size-4"
              >
                <path
                  d="M4 10h12m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </AuthButton>
      </form>

      <div className="my-7 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Tài khoản mới
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <p className="text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="font-bold text-[#4f8edc] transition hover:text-[#3979c2] hover:underline hover:underline-offset-4"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default Login;
