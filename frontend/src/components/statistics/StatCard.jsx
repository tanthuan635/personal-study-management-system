function StatCard({ label, value, helper, tone = "slate" }) {
  const toneClasses = {
    slate: "text-slate-900",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    rose: "text-rose-700",
    sky: "text-sky-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold tracking-tight ${toneClasses[tone] || toneClasses.slate}`}
      >
        {value}
      </p>
      {helper ? <p className="mt-2 text-sm text-slate-500">{helper}</p> : null}
    </article>
  );
}

export default StatCard;
