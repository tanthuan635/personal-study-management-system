function StatCard({
  label,
  value,
  helper,
  code = "TK",
  tone = "blue",
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-600",
    sky: "bg-sky-50 text-sky-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <article className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-xs font-black tracking-wide ${toneClasses[tone] || toneClasses.blue}`}
        >
          {code}
        </span>
      </div>
      {helper ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p>
      ) : null}
    </article>
  );
}

export default StatCard;
