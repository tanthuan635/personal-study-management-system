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
    : "border-blue-100 focus:border-[#6aa8e4] focus:ring-blue-100/70";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-2xl border bg-[#f7fbff] px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-[#8fc2ef] focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${borderClass} ${className}`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </label>
  );
}

export default AuthInput;
