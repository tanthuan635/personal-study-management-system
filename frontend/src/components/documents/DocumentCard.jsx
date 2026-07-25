import { useState } from "react";

import {
  downloadDocumentFile,
  getDocumentFileUrl,
} from "../../api/documentApi";

function formatDisplayDate(dateValue) {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Không xác định";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
}

function getTypeClasses(type) {
  switch (type) {
    case "PDF":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "PPT":
    case "PPTX":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "DOC":
    case "DOCX":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "JPG":
    case "JPEG":
    case "PNG":
    case "GIF":
    case "WEBP":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "Video":
      return "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700";
    case "Link":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

function DocumentCard({
  documentItem,
  subject,
  onEdit,
  onDelete,
  isDeleting = false,
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileActionError, setFileActionError] = useState("");
  const fileUrl = getDocumentFileUrl(documentItem.fileUrl);
  const isBusy = isDeleting || isDownloading;

  const handleDownload = async () => {
    setIsDownloading(true);
    setFileActionError("");

    try {
      await downloadDocumentFile(documentItem.fileUrl, documentItem.fileName);
    } catch {
      setFileActionError("Không thể tải file. Vui lòng thử lại.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {subject?.code ||
              `Môn #${documentItem.subject || "không xác định"}`}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
            {documentItem.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {subject?.name || "Môn học đã bị xóa"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getTypeClasses(documentItem.fileType)}`}
        >
          {documentItem.fileType || "Khác"}
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
          <dd>{formatDisplayDate(documentItem.createdAt)}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Trạng thái file</dt>
          <dd className={fileUrl ? "text-emerald-700" : "text-slate-500"}>
            {fileUrl ? "Đã tải lên máy chủ" : "Chỉ lưu metadata"}
          </dd>
        </div>
      </dl>

      {documentItem.description ? (
        <p className="mt-4 flex-1 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          {documentItem.description}
        </p>
      ) : (
        <div className="mt-4 flex-1" />
      )}

      {fileUrl ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
          >
            Mở file
          </a>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isBusy}
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? "Đang tải..." : "Tải xuống"}
          </button>
        </div>
      ) : null}

      {fileActionError ? (
        <p role="alert" className="mt-3 text-sm font-medium text-rose-600">
          {fileActionError}
        </p>
      ) : null}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onEdit(documentItem)}
          disabled={isBusy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={() => onDelete(documentItem._id)}
          disabled={isBusy}
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </button>
      </div>
    </article>
  );
}

export default DocumentCard;
