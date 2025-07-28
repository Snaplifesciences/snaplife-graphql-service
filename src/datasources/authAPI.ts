import axios from 'axios';
import { handleAxiosError } from '../utils/apiErrorUtils';

const BASE_URL = process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3001/api/auth';


export const authAPI = {

  async signInWithPassword (email: string, password: string) {
    try {
      const res = await axios.post(`${BASE_URL}/signin`, {
        email,
        password,
      });
      console.log('Sign-in response:', res.data);
      // Validate response structure
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from authentication service');
      }
      return res.data;
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw handleAxiosError(error, `Failed to sign in user with email ${email}`);
    }
  },

  async refreshToken (refreshToken: string) {
    try {
      const res = await axios.post(`${BASE_URL}/refresh`, {
        refreshToken,
      });
      console.log('Refresh token response:', res.data);
      // Validate response structure
      if (!res.data || !res.data.token) {
        throw new Error('Invalid response from authentication service');
      }
      return res.data;
    } catch (error) {
      throw handleAxiosError(error, 'Failed to refresh user token');
    }
  },
};
