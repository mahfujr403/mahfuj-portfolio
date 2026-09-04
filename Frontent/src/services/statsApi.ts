import { apiFetch } from "./apiClient";

export interface PortfolioStats {
  projects: number;
  publications: number;
}

export function fetchPortfolioStats(): Promise<PortfolioStats> {
  return apiFetch<PortfolioStats>("api/v1/stats");
}
