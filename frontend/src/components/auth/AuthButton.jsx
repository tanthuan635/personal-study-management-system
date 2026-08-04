function AuthButton({
  children,
  type = "submit",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#67a9e7] to-[#4f8edc] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:from-[#72b4ef] hover:to-[#4383ce] hover:shadow-xl hover:shadow-blue-500/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 active:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 disabled:shadow-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default AuthButton;
