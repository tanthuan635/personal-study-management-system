import { Link } from "react-router-dom";

import { getDocumentFileUrl } from "../../api/documentApi";

function formatDisplayDate(dateValue) {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getTypeStyle(type) {
  switch (type) {
    case "PDF":
      return {
        badge: "border-rose-200 bg-rose-50 text-rose-700",
        icon: "bg-rose-50 text-rose-600",
      };
    case "PPT":
    case "PPTX":
      return {
        badge: "border-amber-200 bg-amber-50 text-amber-700",
        icon: "bg-amber-50 text-amber-600",
      };
    case "DOC":
    case "DOCX":
      return {
        badge: "border-sky-200 bg-sky-50 text-sky-700",
        icon: "bg-sky-50 text-sky-600",
      };
    case "JPG":
    case "JPEG":
    case "PNG":
    case "GIF":
    case "WEBP":
      return {
        badge: "border-violet-200 bg-violet-50 text-violet-700",
        icon: "bg-violet-50 text-violet-600",
      };
    case "Video":
      return {
        badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
        icon: "bg-fuchsia-50 text-fuchsia-600",
      };
    case "Link":
      return {
        badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: "bg-emerald-50 text-emerald-600",
      };
    default:
      return {
        badge: "border-slate-200 bg-slate-100 text-slate-700",
        icon: "bg-slate-100 text-slate-600",
      };
  }
}

function getTypeLabel(type) {
  if (!type) {
    return "FILE";
  }

  return String(type).slice(0, 4).toUpperCase();
}

function DocumentCard({
  documentItem,
  subject,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const fileUrl = getDocumentFileUrl(documentItem.fileUrl);
  const typeStyle = getTypeStyle(documentItem.fileType);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/60">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#79b8f3] to-[#4f8edc]" />

      <div className="flex items-start justify-between gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-2xl text-xs font-black ${typeStyle.icon}`}>
          {getTypeLabel(documentItem.fileType)}
        </span>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${typeStyle.badge}`}>
          {documentItem.fileType || "Khác"}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-500">
          {subject?.code || `Môn #${documentItem.subject || "không xác định"}`}
        </p>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-7 tracking-tight text-slate-900">
          {documentItem.title}
        </h3>
        <p className="mt-1.5 truncate text-sm text-slate-500">
          {subject?.name || "Môn học đã bị xóa"}
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f7fbff] p-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#4f8edc] shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
              <path d="M6 3h8l4 4v14H6z" />
              <path d="M14 3v5h5" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800" title={documentItem.fileName}>
              {documentItem.fileName || "Chưa có tên file"}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Lưu ngày {formatDisplayDate(documentItem.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
        <span className={`size-2 rounded-full ${fileUrl ? "bg-emerald-500" : "bg-amber-400"}`} />
        <span className={fileUrl ? "text-emerald-700" : "text-amber-700"}>
          {fileUrl ? "Đã tải lên máy chủ" : "Chỉ lưu metadata"}
        </span>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-slate-500">
        {documentItem.description || "Chưa có mô tả cho tài liệu này."}
      </p>

      {fileUrl ? (
        <Link
          to={`/documents/${documentItem._id}/view`}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 text-sm font-bold text-[#3979c2] transition hover:bg-blue-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4">
            <path d="M14 5h5v5M10 14 19 5M19 13v6H5V5h6" />
          </svg>
          Mở file
        </Link>
      ) : null}

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onEdit(documentItem)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(documentItem._id)}
          disabled={isDeleting}
          className="flex-1 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default DocumentCard;
