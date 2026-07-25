import apiClient from "./apiClient";

export function getDocuments(params = {}) {
  return apiClient.get("/documents", { params });
}

export function getDocumentById(id) {
  return apiClient.get(`/documents/${id}`);
}

export function createDocument(documentData) {
  return apiClient.post("/documents", documentData);
}

export function updateDocument(id, documentData) {
  return apiClient.put(`/documents/${id}`, documentData);
}

export function deleteDocument(id) {
  return apiClient.delete(`/documents/${id}`);
}

export function getDocumentFileUrl(fileUrl) {
  if (!fileUrl) {
    return "";
  }

  try {
    const browserOrigin =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:5000";
    const apiUrl = new URL(apiClient.defaults.baseURL, browserOrigin);

    return new URL(fileUrl, apiUrl.origin).toString();
  } catch {
    return fileUrl;
  }
}

export async function downloadDocumentFile(fileUrl, fileName) {
  const response = await apiClient.get(getDocumentFileUrl(fileUrl), {
    responseType: "blob",
  });
  const objectUrl = URL.createObjectURL(response.data);
  const downloadLink = document.createElement("a");

  downloadLink.href = objectUrl;
  downloadLink.download = fileName || "tai-lieu";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
