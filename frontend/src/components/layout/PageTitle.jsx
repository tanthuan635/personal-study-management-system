function PageTitle({ title, description, className = "" }) {
  return (
    <div className={className}>
      <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export default PageTitle;
