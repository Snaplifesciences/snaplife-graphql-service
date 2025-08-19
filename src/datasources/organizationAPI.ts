import { createApiClient } from '../utils/apiClientFactory';
import { Organization } from '../graphql/typeDefs/organization';
import axios from 'axios';
import { handleAxiosError } from '../utils/apiErrorUtils';

const BASE_URL = process.env.ORG_SERVICE_BASE_URL;
if (!BASE_URL) {
  throw new Error('ORG_SERVICE_BASE_URL environment variable is required');
}

export const organizationAPI = {
  ...createApiClient<Organization>(BASE_URL),

  /**
   * Fetches an organization by its name.
   * @param name 
   * @returns 
   */
  async findByName(name: string): Promise<Organization | null> {
    const sanitizedName = name.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
    try {
      const res = await axios.get(`${BASE_URL}/search?name=${encodeURIComponent(sanitizedName)}`);
      if (Array.isArray(res.data)) {
        return res.data.length > 0 ? res.data[0] : null;
      }
      return res.data || null;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to fetch organization by name');
    }
  },
};
