import type { PoliticalOrganization } from "@/shared/models/political-organization";
import type { Transaction } from "@/shared/models/transaction";
import type { PreviewMfCsvResult } from "@/server/usecases/preview-mf-csv-usecase";
import type { PreviewTransaction } from "@/server/lib/mf-record-converter";

export interface CreatePoliticalOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdatePoliticalOrganizationRequest {
  name?: string;
  description?: string;
}

export interface PreviewCsvRequest {
  file: File;
  politicalOrganizationId: string;
}

export interface UploadCsvRequest {
  validTransactions: PreviewTransaction[];
  politicalOrganizationId: string;
}

export interface UploadCsvResponse {
  ok: boolean;
  processedCount: number;
  savedCount: number;
  message: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DeleteAllTransactionsResponse {
  deletedCount: number;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
}

export interface InviteUserRequest {
  email: string;
}

export interface InviteUserResponse {
  message: string;
}

export interface SetupPasswordRequest {
  password: string;
}

export interface SetupPasswordResponse {
  success: boolean;
  message?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === "development" ? "" : "";
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  private async requestFormData<T>(
    url: string,
    formData: FormData,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || "Upload failed";
      const details = errorData.details
        ? ` Details: ${Array.isArray(errorData.details) ? errorData.details.join(", ") : errorData.details}`
        : "";
      throw new Error(errorMsg + details);
    }

    return response.json();
  }

  async createPoliticalOrganization(
    data: CreatePoliticalOrganizationRequest,
  ): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>("/api/political-organizations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getPoliticalOrganization(id: string): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>(
      `/api/political-organizations/${id}`,
    );
  }

  async updatePoliticalOrganization(
    id: string,
    data: UpdatePoliticalOrganizationRequest,
  ): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>(
      `/api/political-organizations/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
    );
  }

  async deletePoliticalOrganization(id: string): Promise<void> {
    await this.request<void>(`/api/political-organizations/${id}`, {
      method: "DELETE",
    });
  }

  async listPoliticalOrganizations(): Promise<PoliticalOrganization[]> {
    return this.request<PoliticalOrganization[]>(
      "/api/political-organizations",
    );
  }

  async previewCsv(data: PreviewCsvRequest): Promise<PreviewMfCsvResult> {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("politicalOrganizationId", data.politicalOrganizationId);

    return this.requestFormData<PreviewMfCsvResult>(
      "/api/preview-csv",
      formData,
    );
  }

  async uploadCsv(data: UploadCsvRequest): Promise<UploadCsvResponse> {
    return this.request<UploadCsvResponse>("/api/upload-csv", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getTransactions(params?: {
    page?: number;
    perPage?: number;
    politicalOrganizationId?: string;
    transactionType?: string;
    dateFrom?: string;
    dateTo?: string;
    financialYear?: number;
  }): Promise<TransactionListResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.perPage)
      searchParams.append("perPage", params.perPage.toString());
    if (params?.politicalOrganizationId)
      searchParams.append(
        "politicalOrganizationId",
        params.politicalOrganizationId,
      );
    if (params?.transactionType)
      searchParams.append("transactionType", params.transactionType);
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params?.financialYear)
      searchParams.append("financialYear", params.financialYear.toString());

    const url = `/api/transactions?${searchParams.toString()}`;
    return this.request<TransactionListResponse>(url);
  }

  async deleteAllTransactions(params?: {
    politicalOrganizationId?: string;
    transactionType?: string;
    dateFrom?: string;
    dateTo?: string;
    financialYear?: number;
  }): Promise<DeleteAllTransactionsResponse> {
    const searchParams = new URLSearchParams();

    if (params?.politicalOrganizationId)
      searchParams.append(
        "politicalOrganizationId",
        params.politicalOrganizationId,
      );
    if (params?.transactionType)
      searchParams.append("transactionType", params.transactionType);
    if (params?.dateFrom) searchParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) searchParams.append("dateTo", params.dateTo);
    if (params?.financialYear)
      searchParams.append("financialYear", params.financialYear.toString());

    const url = `/api/transactions?${searchParams.toString()}`;
    return this.request<DeleteAllTransactionsResponse>(url, {
      method: "DELETE",
    });
  }

  async updateUserRole(data: UpdateUserRoleRequest): Promise<void> {
    return this.request<void>("/api/users/role", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async inviteUser(data: InviteUserRequest): Promise<InviteUserResponse> {
    return this.request<InviteUserResponse>("/api/users/invite", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async setupPassword(
    data: SetupPasswordRequest,
  ): Promise<SetupPasswordResponse> {
    return this.request<SetupPasswordResponse>("/api/auth/setup-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient();
