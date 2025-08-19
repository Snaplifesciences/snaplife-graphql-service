import axios from "axios";
import { User } from "../graphql/typeDefs/user";
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../utils/apiErrorUtils';
import { logger } from '../utils/logger';

interface ActivationRequest {
  password?: string;
  [key: string]: any;
}

const IAM_BASE_URL = process.env.USER_SERVICE_BASE_URL;
if (!IAM_BASE_URL) {
  throw new Error('USER_SERVICE_BASE_URL environment variable is required');
}

const apiClient = createApiClient<User>(IAM_BASE_URL);

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

    async activateUser(activationToken: string, requestBody: ActivationRequest): Promise<void> {
        logger.info('UserAPI::activateUser initiated');
        await apiClient.get(`/activate/${activationToken}`);
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
