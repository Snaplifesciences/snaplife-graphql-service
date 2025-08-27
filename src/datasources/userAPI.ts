import { ActivateAccountInput, User } from "../graphql/types/user";
import { createApiClient } from '../utils/apiClientFactory';
import { logger } from '../utils/logger';

const IAM_BASE_URL = process.env.USER_SERVICE_BASE_URL;

if (!IAM_BASE_URL) {
  throw new Error('USER_SERVICE_BASE_URL environment variable is required');
}

const API_PATH = '/api/users';

const apiClient = createApiClient<User>(`${IAM_BASE_URL}${API_PATH}`);

export const userAPI = {
    ...apiClient,

    async getAuthenticatedUserById(id: string): Promise<User | null> {
        logger.info('UserAPI::getAuthenticatedUserById initiated', { userId: id });
        const data = await apiClient.get(`/authenticated/${id}`);
        logger.info('UserAPI::getAuthenticatedUserById completed successfully');
        return {
            id: data.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: data.status,
            attributes: data.attributes || {},
            roles: data.roles || [],
            organizationId: data.organizationId,
            companyId: data.companyId,
        };
    },

    async activateUser(activationToken: string, input: ActivateAccountInput): Promise<void> {
        logger.info('UserAPI::activateUser initiated');
        // Switch to POST request with payload as per new requirement
        const path = `/activate/${encodeURIComponent(activationToken)}`;
        const body = {
            password: input?.password,
            confirmPassword: input?.confirmPassword
        };
        const baseUrl = process.env.USER_SERVICE_BASE_URL;
        if (!baseUrl) {
            throw new Error('USER_SERVICE_BASE_URL environment variable is required');
        }
        const url = `${baseUrl}${API_PATH}${path}`;
        const axios = require('axios');
        await axios.post(url, body);
        logger.info('UserAPI::activateUser completed successfully');
    },

    async resendActivationToken(activationToken: string): Promise<void> {
        logger.info('UserAPI::resendActivationToken initiated');
        await apiClient.get(`/resend/${activationToken}`);
        logger.info('UserAPI::resendActivationToken completed successfully');
    },
    
    async validateToken(activationToken: string): Promise<void> {
        logger.info('UserAPI::validateToken initiated');
        await apiClient.get(`?activationToken=${encodeURIComponent(activationToken)}`);
        logger.info('UserAPI::validateToken completed successfully');
    }
};
