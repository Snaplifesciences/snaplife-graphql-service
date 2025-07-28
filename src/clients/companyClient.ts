import axios from 'axios';
import { Company } from '../types/company';
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../utils/apiErrorUtils';

//const BASE_URL = 'https://u4xrg11u25.execute-api.us-east-1.amazonaws.com/dev/api/companies';
const BASE_URL = 'http://localhost:8082/api/companies';

export const companyServiceClient = {
  ...createApiClient<Company>(BASE_URL),
  async findByName(name: string): Promise<Company | null> {
    try {
      const res = await axios.get(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
      return res.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch company by name ${name}`);
    }
  },

  async getAll(): Promise<Company[]> {
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      return res.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch all companies`);
    }
  },

  async getByOrganizationId(organizationId: string): Promise<Company[] | null> {
    try {
      const res = await axios.get(`${BASE_URL}?organizationId=${encodeURIComponent(organizationId)}`);
      return res.data;
    } catch (error) {
      throw handleAxiosError(error, `Failed to fetch companies by organizationId ${organizationId}`);
    }
  },
  
};
