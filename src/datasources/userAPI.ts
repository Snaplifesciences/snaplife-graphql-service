import { ActivateAccountInput, User } from "../graphql/types/user";
import { createApiClient } from '../utils/apiClientFactory';
import { logger } from '../utils/logger';
import axios, { AxiosError } from 'axios';
import { BackendError } from "../error/errors";

const IAM_BASE_URL = process.env.USER_SERVICE_BASE_URL;

export interface StatusResponse {
    success: boolean;
    message?: string;
}

if (!IAM_BASE_URL) {
  throw new Error('USER_SERVICE_BASE_URL environment variable is required');
}

const API_PATH = '/api/users';

// Standard client for resource-based operations (create, getById, etc.)
const apiClient = createApiClient<User>(`${IAM_BASE_URL}${API_PATH}`);

// A separate, configured axios instance for custom actions like activation
// that don't fit the standard resource pattern of `apiClient`.
// Ideally, the `apiClient` itself would expose generic post/put methods.
const customActionClient = axios.create({ baseURL: `${IAM_BASE_URL}${API_PATH}` });

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

    async activateUser(activationToken: string, input: ActivateAccountInput): Promise<StatusResponse> {
        logger.info('UserAPI::activateUser initiated');
        const path = `/activate/${encodeURIComponent(activationToken)}`;
        const body = {
            password: input?.password,
            confirmPassword: input?.confirmPassword
        };
        try {
            await customActionClient.post(path, body);
            logger.info('UserAPI::activateUser completed successfully');
            return { success: true, message: 'Account activated successfully.' };
        } catch (error) {
            const err = error as AxiosError<BackendError>;
            const message = err.response?.data?.debugMessage || 'Failed to activate account.';
            logger.error('UserAPI::activateUser failed', { error: err.message, response: err.response?.data });
            return { success: false, message };
        }
    },

    async resendActivationToken(activationToken: string): Promise<StatusResponse> {
        logger.info('UserAPI::resendActivationToken initiated');
        try {
            await apiClient.get(`/${activationToken}/activation/resend`);
            logger.info('UserAPI::resendActivationToken completed successfully');
            return { success: true, message: 'Activation token has been resent.' };
        } catch (error) {
            const err = error as AxiosError<BackendError>;
            const message = err.response?.data?.debugMessage || 'Failed to resend activation token.';
            logger.error('UserAPI::resendActivationToken failed', { error: err.message, response: err.response?.data });
            return { success: false, message };
        }
    },
    
    async validateToken(activationToken: string): Promise<StatusResponse> {
        logger.info('UserAPI::validateToken initiated');
        const path = `/activation/validate?activationToken=${encodeURIComponent(activationToken)}`;
        try {
            await apiClient.get(path);
            logger.info('UserAPI::validateToken completed successfully');
            return { success: true, message: 'Token is valid.' };
        } catch (error) {
            const err = error as AxiosError<BackendError>;
            const message = err.response?.data?.debugMessage || 'Token is invalid or has expired.';
            logger.error('UserAPI::validateToken failed', { error: err.message, response: err.response?.data });
            return { success: false, message };
        }
    }
};
