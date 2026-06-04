import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import { saveRegisteredUser } from "../../lib/auth";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
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

    saveRegisteredUser({
      fullName: trimmedFullName,
      email: trimmedEmail,
      password,
    });

    navigate("/login", {
      replace: true,
      state: { message: "Đăng ký thành công. Hãy đăng nhập." },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Đăng ký
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Tạo tài khoản để lưu thông tin đăng nhập.
        </p>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
        />

        <AuthInput
          label="Email"
          id="register-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tenban@example.com"
          autoComplete="email"
        />

        <AuthInput
          label="Mật khẩu"
          id="register-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Nhập mật khẩu"
          autoComplete="new-password"
        />

        <AuthInput
          label="Xác nhận mật khẩu"
          id="register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
        />

        <AuthButton type="submit">Đăng ký</AuthButton>
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
