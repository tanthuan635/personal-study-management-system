function PageTitle({ title, description, className = "" }) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold tracking-[-0.035em] text-[#183b5b]">
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

export default PageTitle;
