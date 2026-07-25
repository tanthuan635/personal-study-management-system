import apiClient from "./apiClient";

export function getTasks(params = {}) {
  return apiClient.get("/tasks", { params });
}

export function getTaskById(id) {
  return apiClient.get(`/tasks/${id}`);
}

export function createTask(taskData) {
  return apiClient.post("/tasks", taskData);
}

export function updateTask(id, taskData) {
  return apiClient.put(`/tasks/${id}`, taskData);
}

export function updateTaskStatus(id, status) {
  return apiClient.patch(`/tasks/${id}/status`, { status });
}

export function deleteTask(id) {
  return apiClient.delete(`/tasks/${id}`);
}
