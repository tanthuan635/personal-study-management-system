function formatDisplayDate(dateValue) {
  const parsedDate = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getTypeClasses(type) {
  switch (type) {
    case "PDF":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "PPTX":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "DOCX":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "Video":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "Link":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function DocumentCard({ documentItem, subject, onDelete }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {subject?.code || `Môn #${documentItem.subjectId}`}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            {documentItem.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {subject?.name || "Môn học đã bị xóa"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getTypeClasses(documentItem.type)}`}
        >
          {documentItem.type}
        </span>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div>
          <dt className="font-medium text-slate-500">Tên file</dt>
          <dd className="break-all font-medium text-slate-900">
            {documentItem.fileName}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Ngày lưu</dt>
          <dd>{formatDisplayDate(documentItem.uploadDate)}</dd>
        </div>
      </dl>

      {documentItem.description ? (
        <p className="mt-4 flex-1 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {documentItem.description}
        </p>
      ) : (
        <div className="mt-4 flex-1" />
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => onDelete(documentItem.id)}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          Xóa
        </button>
      </div>
    </article>
  );
}

export default DocumentCard;
