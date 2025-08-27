import { Contact } from '../graphql/types/contact';
import { logger } from '../utils/logger';
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../error/apiErrorUtils';

const BASE_URL = process.env.CONTACT_SERVICE_BASE_URL || 'http://localhost:8082';
const API_PATH = '/api/company-contacts';
logger.info('ContactAPI::initialization', { BASE_URL, API_PATH });

const apiClient = createApiClient<Contact>(`${BASE_URL}${API_PATH}`);


export const contactAPI = {
   ...apiClient,

  async getContactsByOrganizationId(organizationId: string): Promise<Contact[]> {
    logger.info('ContactAPI::getContactsByOrganizationId - Fetching contacts by organization', { 
      organizationId 
    });
    try {
      const response = await apiClient.get(`/organization/${organizationId}`);
      return response.data || [];
    } catch (error) {
      logger.error('ContactAPI::getContactsByOrganizationId - Failed to fetch contacts', { 
        organizationId,
        error 
      });
      throw handleAxiosError(error, 'Failed to fetch contacts by organization');
    }
  },

  async getContactsByCompanyId(companyId: string): Promise<Contact[]> {
    logger.info('ContactAPI::getContactsByCompanyId - Fetching contacts by company', { 
      companyId 
    });
    try {
      const response = await apiClient.get(`/company/${companyId}`);
      return response.data || [];
    } catch (error) {
      logger.error('ContactAPI::getContactsByCompanyId - Failed to fetch contacts', { 
        companyId,
        error 
      });
      throw handleAxiosError(error, 'Failed to fetch contacts by company');
    }
  },
}
