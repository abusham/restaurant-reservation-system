import { toast } from "vue3-toastify";

import type {
  BranchesResponse,
  UpdateBranchPayload,
} from "@/types/reservations";

// In development, '/api' is used which gets proxied via vite.config.ts
// In production, VITE_API_BASE_URL is used
const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_BASE_URL || "/api";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        if (errorData?.errors) {
          const errorMessages = Object.values(errorData.errors)
            .flat()
            .join("\n");
          // Unified toaster for errors
          toast.error(
            "<p data-type='header'>" +
              errorData.message +
              "</p><p data-type='body'>" +
              errorMessages +
              "</p>"
          );
        }
        throw errorData;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Get all branches with sections and tables
  async getBranches(): Promise<BranchesResponse> {
    return this.request<BranchesResponse>(
      "/branches?include[0]=sections&include[1]=sections.tables"
    );
  }

  // Update branch (enable/disable reservations or update settings)
  async updateBranch(
    branchId: string,
    payload: UpdateBranchPayload
  ): Promise<{ data: any }> {
    return this.request(`/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  // Enable reservations for a branch
  async enableReservations(branchId: string): Promise<{ data: any }> {
    return this.updateBranch(branchId, { accepts_reservations: true });
  }

  // Disable reservations for a branch
  async disableReservations(branchId: string): Promise<{ data: any }> {
    return this.updateBranch(branchId, { accepts_reservations: false });
  }
}

export const apiService = new ApiService();
