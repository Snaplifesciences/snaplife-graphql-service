import { createApiClient } from '../utils/apiClientFactory';
import { Organization } from '../graphql/types/organization';
import { handleAxiosError } from '../error/apiErrorUtils';

const BASE_URL = process.env.ORG_SERVICE_BASE_URL;
if (!BASE_URL) {
  throw new Error('ORG_SERVICE_BASE_URL environment variable is required');
}

const apiClient = createApiClient<Organization>(BASE_URL);

export const organizationAPI = {
  ...apiClient,


  async findByName(name: string): Promise<Organization | null> {
    const sanitizedName = name.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
    if (!sanitizedName.trim()) {
      return null;
    }
    try {
      const response = await apiClient.get(`/search?name=${encodeURIComponent(sanitizedName)}`);
      
      // Handle nested response structure
      const data = response.res || response.data || response;
      
      if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : null;
      }
      return data || null;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch organization by name');
    }
  },
};
