function AuthInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = true,
  error,
  className = "",
  ...props
}) {
  const borderClass = error
    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
    : "border-slate-300 focus:border-slate-900 focus:ring-slate-100";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${borderClass} ${className}`}
        {...props}
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </label>
  );
}

export default AuthInput;
