import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import {
  getRegisteredUser,
  normalizeEmail,
  saveSessionUser,
} from "../../lib/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const message = location.state?.message || "";

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    const registeredUser = getRegisteredUser();

    if (registeredUser) {
      const isValid =
        normalizeEmail(registeredUser.email) === normalizeEmail(trimmedEmail) &&
        registeredUser.password === password;

      if (!isValid) {
        setError("Email hoặc mật khẩu không đúng.");
        return;
      }

      saveSessionUser({
        fullName: registeredUser.fullName,
        email: registeredUser.email,
      });
    } else {
      saveSessionUser({
        fullName: trimmedEmail.split("@")[0],
        email: trimmedEmail,
      });
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Đăng nhập</h2>
        <p className="mt-2 text-sm text-slate-500">
          Nhập email và mật khẩu.
        </p>
      </div>

      {message ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
        />

        <AuthInput
          label="Mật khẩu"
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="current-password"
        />

        <AuthButton type="submit">Đăng nhập</AuthButton>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="font-medium text-slate-900 underline underline-offset-4">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}

export default Login;
