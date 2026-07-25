import apiClient from "./apiClient";

export function getStatisticsOverview() {
  return apiClient.get("/statistics/overview");
}
