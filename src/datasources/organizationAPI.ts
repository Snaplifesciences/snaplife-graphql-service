import { createApiClient } from '../utils/apiClientFactory';
import { Organization } from '../graphql/typeDefs/organization';
import axios from 'axios';
import { handleAxiosError } from '../utils/apiErrorUtils';

const BASE_URL = process.env.ORG_SERVICE_BASE_URL || 'http://localhost:8081/api/organizations';

export const organizationAPI = {
  ...createApiClient<Organization>(BASE_URL),

  // Custom method: search by name
  async findByName(name: string): Promise<Organization | null> {
    try {
      const res = await axios.get(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
      if (Array.isArray(res.data)) {
        return res.data.length > 0 ? res.data[0] : null;
      }
      return res.data || null;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch organization by name ${name}`);
    }
  },
};
