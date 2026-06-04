function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6 text-center">
          <p className="text-xl font-medium uppercase tracking-[0.2em] text-slate-400">
            Study Manager
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Quản lý học tập
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
