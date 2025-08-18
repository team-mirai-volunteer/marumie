import { PoliticalOrganization } from '@/shared/model/political-organization';

export interface CreatePoliticalOrganizationRequest {
  name: string;
  description?: string;
}

export interface UpdatePoliticalOrganizationRequest {
  name?: string;
  description?: string;
}

export interface UploadCsvRequest {
  file: File;
  politicalOrganizationId: string;
}

export interface UploadCsvResponse {
  ok: boolean;
  processedCount: number;
  savedCount: number;
  message: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'development' ? '' : '';
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async requestFormData<T>(url: string, formData: FormData): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || 'Upload failed';
      const details = errorData.details ? ` Details: ${Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details}` : '';
      throw new Error(errorMsg + details);
    }

    return response.json();
  }

  async createPoliticalOrganization(data: CreatePoliticalOrganizationRequest): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>('/api/political-organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPoliticalOrganization(id: string): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>(`/api/political-organizations/${id}`);
  }

  async updatePoliticalOrganization(id: string, data: UpdatePoliticalOrganizationRequest): Promise<PoliticalOrganization> {
    return this.request<PoliticalOrganization>(`/api/political-organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePoliticalOrganization(id: string): Promise<void> {
    await this.request<void>(`/api/political-organizations/${id}`, {
      method: 'DELETE',
    });
  }

  async listPoliticalOrganizations(): Promise<PoliticalOrganization[]> {
    return this.request<PoliticalOrganization[]>('/api/political-organizations');
  }

  async uploadCsv(data: UploadCsvRequest): Promise<UploadCsvResponse> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('politicalOrganizationId', data.politicalOrganizationId);
    
    return this.requestFormData<UploadCsvResponse>('/api/upload-csv', formData);
  }
}

export const apiClient = new ApiClient();
