import apiClient from "./apiClient";

export function getSubjects(params = {}) {
  return apiClient.get("/subjects", { params });
}

export function getSubjectById(id) {
  return apiClient.get(`/subjects/${id}`);
}

export function createSubject(subjectData) {
  return apiClient.post("/subjects", subjectData);
}

export function updateSubject(id, subjectData) {
  return apiClient.put(`/subjects/${id}`, subjectData);
}

export function deleteSubject(id) {
  return apiClient.delete(`/subjects/${id}`);
}
