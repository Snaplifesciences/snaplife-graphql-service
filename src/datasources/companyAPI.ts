import dotenv from 'dotenv';
import { Company } from '../graphql/types/company';
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../error/apiErrorUtils';
import { logger } from '../utils/logger';

dotenv.config();

const BASE_URL = process.env.COMPANY_SERVICE_BASE_URL;
if (!BASE_URL) {
  throw new Error('COMPANY_SERVICE_BASE_URL environment variable is required');
}

const apiClient = createApiClient<Company>(BASE_URL);

export const companyAPI = {
  ...apiClient,
  async findByName(name: string): Promise<Company | null> {
    const sanitizedName = name.replace(/[\r\n]/g, '');
    logger.info('CompanyAPI::findByName initiated', { name: sanitizedName });
    try {
      const res = await apiClient.get(`/search?name=${encodeURIComponent(sanitizedName)}`);
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyAPI::findByName failed', { error: errorMessage });
      throw handleAxiosError(error, `Failed to fetch company by name`);
    }
  },

  async getAll(): Promise<Company[]> {
    logger.info('CompanyAPI::getAll initiated');
    try {
      const res = await apiClient.get(`/all`);
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyAPI::getAll failed', { error: errorMessage });
      throw handleAxiosError(error, `Failed to fetch all companies`);
    }
  },

  async getByOrganizationId(organizationId: string): Promise<Company[] | null> {
    logger.info('CompanyAPI::getByOrganizationId initiated', { organizationId });
    try {
      const res = await apiClient.get(`/?organizationId=${encodeURIComponent(organizationId)}`);
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyAPI::getByOrganizationId failed', { error: errorMessage });
      throw handleAxiosError(error, `Failed to fetch companies by organizationId`);
    }
  },
  
};