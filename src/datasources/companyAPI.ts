import dotenv from 'dotenv';
import axios from 'axios';
import { Company } from '../graphql/typeDefs/company';
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../utils/apiErrorUtils';
import { logger } from '../utils/logger';

dotenv.config();

const BASE_URL = process.env.COMPANY_SERVICE_BASE_URL;
if (!BASE_URL) {
  throw new Error('COMPANY_SERVICE_BASE_URL environment variable is required');
}

export const companyAPI = {
  ...createApiClient<Company>(BASE_URL),
  async findByName(name: string): Promise<Company | null> {
    const sanitizedName = name.replace(/[\r\n]/g, '');
    logger.info('CompanyAPI::findByName initiated', { name: sanitizedName });
    try {
      const res = await axios.get(`${BASE_URL}/search?name=${encodeURIComponent(sanitizedName)}`);
      return res.data;
    } catch (error) {
      logger.error('CompanyAPI::findByName failed', error);
      throw handleAxiosError(error, `Failed to fetch company by name`);
    }
  },

  async getAll(): Promise<Company[]> {
    logger.info('CompanyAPI::getAll initiated');
    try {
      const res = await axios.get(`${BASE_URL}/all`);
      return res.data;
    } catch (error) {
      logger.error('CompanyAPI::getAll failed', error);
      throw handleAxiosError(error, `Failed to fetch all companies`);
    }
  },

  async getByOrganizationId(organizationId: string): Promise<Company[] | null> {
    logger.info('CompanyAPI::getByOrganizationId initiated', { organizationId });
    try {
      const res = await axios.get(`${BASE_URL}?organizationId=${encodeURIComponent(organizationId)}`);
      return res.data;
    } catch (error) {
      logger.error('CompanyAPI::getByOrganizationId failed', error);
      throw handleAxiosError(error, `Failed to fetch companies by organizationId`);
    }
  },
  
};
