import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getDocumentById,
  getDocumentFileUrl,
  getDocumentPreview,
} from "../api/documentApi";

const IMAGE_TYPES = new Set(["JPG", "JPEG", "PNG", "GIF", "WEBP"]);
const OFFICE_TYPES = new Set(["DOC", "DOCX", "PPT", "PPTX"]);

function getRequestErrorMessage(error) {
  if (error.response?.status === 404) {
    return "Không tìm thấy tài liệu này.";
  }

  if (error.response?.status === 403) {
    return "Bạn không có quyền xem tài liệu này.";
  }

  if (!error.response) {
    return "Không thể kết nối tới máy chủ. Vui lòng thử lại.";
  }

  return error.response.data?.message || "Không thể tải thông tin tài liệu.";
}

function DocumentPreview({
  documentItem,
  fileUrl,
  officePreviewUrl,
  isPreviewLoading,
  previewError,
}) {
  const fileType = String(documentItem.fileType || "").toUpperCase();

  if (!fileUrl) {
    return (
      <div className="grid min-h-[440px] place-items-center rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-8 text-center">
        <div>
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-[#4f8edc] shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-6">
              <path d="M6 3h8l4 4v14H6z" />
              <path d="M14 3v5h5M9 13h6M9 17h4" />
            </svg>
          </span>
          <h2 className="mt-4 text-lg font-bold text-slate-800">Tài liệu chỉ có metadata</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Tài liệu này chưa có file thật trên máy chủ nên chưa thể xem trước.</p>
        </div>
      </div>
    );
  }

  if (IMAGE_TYPES.has(fileType)) {
    return (
      <div className="flex min-h-[440px] items-center justify-center overflow-auto rounded-2xl bg-slate-100 p-4 sm:p-8">
        <img
          src={fileUrl}
          alt={documentItem.title}
          className="max-h-[75vh] max-w-full rounded-xl bg-white object-contain shadow-lg"
        />
      </div>
    );
  }

  if (fileType === "PDF") {
    return (
      <iframe
        src={fileUrl}
        title={`Xem tài liệu ${documentItem.title}`}
        className="h-[75vh] min-h-[560px] w-full rounded-2xl border border-slate-200 bg-white"
      />
    );
  }

  if (OFFICE_TYPES.has(fileType)) {
    if (isPreviewLoading) {
      return (
        <div className="grid min-h-[560px] place-items-center rounded-2xl border border-blue-100 bg-blue-50/40 p-8 text-center">
          <div>
            <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#4f8edc]" />
            <h2 className="mt-4 text-lg font-bold text-slate-800">Đang tạo bản xem trước</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Lần mở đầu tiên có thể mất một lúc để chuyển file Office thành PDF.</p>
          </div>
        </div>
      );
    }

    if (!officePreviewUrl) {
      return (
        <div className="grid min-h-[440px] place-items-center rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-8 text-center">
          <div className="max-w-lg">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-xl font-black text-rose-600 shadow-sm">!</span>
            <h2 className="mt-4 text-lg font-bold text-slate-800">Không thể tạo bản xem trước</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{previewError || "Máy chủ không thể chuyển tài liệu Office sang định dạng xem trước."}</p>
          </div>
        </div>
      );
    }

    return (
      <iframe
        src={officePreviewUrl}
        title={`Xem tài liệu ${documentItem.title}`}
        className="h-[75vh] min-h-[560px] w-full rounded-2xl border border-slate-200 bg-white"
      />
    );
  }

  return (
    <div className="grid min-h-[440px] place-items-center rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-8 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-amber-600 shadow-sm">
          <span className="text-xs font-black">{fileType || "FILE"}</span>
        </span>
        <h2 className="mt-4 text-lg font-bold text-slate-800">Chưa thể xem trước file này</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Định dạng này chưa được trình xem tài liệu hỗ trợ.
        </p>
      </div>
    </div>
  );
}

function DocumentViewer() {
  const { id } = useParams();
  const [documentItem, setDocumentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [officePreviewUrl, setOfficePreviewUrl] = useState("");
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadDocument() {
      setIsLoading(true);
      setError("");

      try {
        const response = await getDocumentById(id);

        if (isActive) {
          setDocumentItem(response.data.data);
        }
      } catch (requestError) {
        if (isActive) {
          setError(getRequestErrorMessage(requestError));
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadDocument();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    const fileType = String(documentItem?.fileType || "").toUpperCase();

    if (
      !documentItem?.fileUrl ||
      !OFFICE_TYPES.has(fileType)
    ) {
      return undefined;
    }

    let isActive = true;
    let objectUrl = "";

    async function loadOfficePreview() {
      setOfficePreviewUrl("");
      setIsPreviewLoading(true);
      setPreviewError("");

      try {
        const response = await getDocumentPreview(id);
        objectUrl = URL.createObjectURL(response.data);

        if (isActive) {
          setOfficePreviewUrl(objectUrl);
        } else {
          URL.revokeObjectURL(objectUrl);
          objectUrl = "";
        }
      } catch {
        if (isActive) {
          setOfficePreviewUrl("");
          setPreviewError(
            "Không thể chuyển file Office sang PDF. Hãy kiểm tra Microsoft Office hoặc LibreOffice trên máy chạy backend.",
          );
        }
      } finally {
        if (isActive) {
          setIsPreviewLoading(false);
        }
      }
    }

    loadOfficePreview();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [documentItem?.fileType, documentItem?.fileUrl, id]);

  const fileUrl = useMemo(() => {
    return getDocumentFileUrl(documentItem?.fileUrl);
  }, [documentItem?.fileUrl]);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="h-28 animate-pulse rounded-[2rem] border border-blue-100 bg-white" />
        <div className="h-[560px] animate-pulse rounded-[2rem] border border-blue-100 bg-white" />
      </div>
    );
  }

  if (error && !documentItem) {
    return (
      <section className="rounded-[2rem] border border-rose-100 bg-white px-6 py-14 text-center shadow-sm">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-rose-50 text-xl font-black text-rose-600">!</span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">Không thể mở tài liệu</h1>
        <p className="mt-2 text-sm text-rose-600">{error}</p>
        <Link to="/documents" className="mt-6 inline-flex rounded-xl bg-[#4f8edc] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4383ce]">
          Quay lại tài liệu
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-blue-100 bg-white p-5 shadow-sm shadow-blue-100/30 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <Link
              to="/documents"
              aria-label="Quay lại danh sách tài liệu"
              className="grid size-11 shrink-0 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-[#3979c2] transition hover:bg-blue-100"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-500">Xem tài liệu</p>
              <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">{documentItem.title}</h1>
              <p className="mt-1 truncate text-sm text-slate-500">{documentItem.fileName}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center">
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#3979c2]">
              {documentItem.fileType || "FILE"}
            </span>
          </div>
        </div>

        {error ? (
          <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        ) : null}
      </section>

      <section className="rounded-[2rem] border border-blue-100 bg-white p-3 shadow-sm shadow-blue-100/30 sm:p-5">
        <DocumentPreview
          documentItem={documentItem}
          fileUrl={fileUrl}
          officePreviewUrl={officePreviewUrl}
          isPreviewLoading={isPreviewLoading}
          previewError={previewError}
        />
      </section>
    </div>
  );
}

export default DocumentViewer;
