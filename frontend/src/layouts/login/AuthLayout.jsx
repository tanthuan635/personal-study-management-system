function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Study Manager
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Quản lý học tập
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
