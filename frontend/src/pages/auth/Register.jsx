import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../../api/authApi";
import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import { saveSessionUser } from "../../lib/auth";
import { setToken } from "../../utils/tokenStorage";

function getRegisterErrorMessage(error) {
  if (error.message === "Invalid authentication response") {
    return "Phản hồi đăng ký từ máy chủ không hợp lệ.";
  }

  if (error.response?.status === 409) {
    return "Email này đã được sử dụng.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
}

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        name: trimmedFullName,
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
      setError(getRegisterErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Đăng ký
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Tạo tài khoản để bắt đầu quản lý thông tin học tập.
        </p>
      </div>

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
          label="Họ tên"
          id="register-full-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          disabled={isLoading}
        />

        <AuthInput
          label="Email"
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tenban@example.com"
          autoComplete="email"
          disabled={isLoading}
        />

        <AuthInput
          label="Mật khẩu"
          id="register-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <AuthInput
          label="Xác nhận mật khẩu"
          id="register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          disabled={isLoading}
        />

        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </AuthButton>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-medium text-slate-900 underline underline-offset-4"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default Register;
