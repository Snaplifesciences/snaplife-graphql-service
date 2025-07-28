import axios from "axios";
import { User } from "../types/user";
import { createApiClient } from '../utils/apiClientFactory';
import { handleAxiosError } from '../utils/apiErrorUtils';

//const IAM_BASE_URL = " https://le269y0k40.execute-api.us-east-1.amazonaws.com/dev/api/users";
const IAM_BASE_URL = " http://localhost:8083/api/users";

export const userServiceClient ={
    ...createApiClient<User>(IAM_BASE_URL),

    async getAuthenticatedUserById(id: string): Promise<User | null> {
      console.log(`Fetching authenticated user with ID: ${id}`);
        try {
            const response = await axios.get(
              `${IAM_BASE_URL}/authenticated/${id}`
              );
            const data = response.data;
            console.log(`Authenticated user data:`, data);
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
        } catch (error: any) {
            throw handleAxiosError(error, `Authentication failed`);
        }
    },

    async activateUser(activationToken: string, requestBody: any): Promise<void> {
        try {
          await axios.post(`${IAM_BASE_URL}/activate/${activationToken}`, requestBody); 
        } catch (error: any) {
          throw handleAxiosError(error, `Failed to activate user for token ${activationToken}`);
        }
    },

    async resendActivationToken(activationToken: string): Promise<void> {
        try {
          await axios.post(`${IAM_BASE_URL}/resend/${activationToken}`);
        } catch (error: any) {
          throw handleAxiosError(error, `Failed to resend activation token for ${activationToken}`);
        }
    },
    
    async validateToken(activationToken: string): Promise<void> {
        try {
          await axios.get(`${IAM_BASE_URL}?activationToken=${activationToken}`);
        } catch (error: any) {
          throw handleAxiosError(error, `Failed to validate activation token ${activationToken}`);
        }
    },
    
};


