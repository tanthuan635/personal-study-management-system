import apiClient from "./apiClient";

export function getSchedules(params = {}) {
  return apiClient.get("/schedules", { params });
}

export function getScheduleById(id) {
  return apiClient.get(`/schedules/${id}`);
}

export function createSchedule(scheduleData) {
  return apiClient.post("/schedules", scheduleData);
}

export function updateSchedule(id, scheduleData) {
  return apiClient.put(`/schedules/${id}`, scheduleData);
}

export function deleteSchedule(id) {
  return apiClient.delete(`/schedules/${id}`);
}
