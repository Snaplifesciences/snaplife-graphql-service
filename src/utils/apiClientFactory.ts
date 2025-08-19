import axios from 'axios';
import { handleAxiosError } from './apiErrorUtils';

const SANITIZE_REGEX = /[\r\n\t\x00-\x1f\x7f-\x9f]/g;

export function createApiClient<T>(baseUrl: string) {
  const client = axios.create({ baseURL: baseUrl });
  
  return {
    async create(input: Partial<T>): Promise<T> {
      try {
        const res = await client.post('/', input);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to create resource`);
      }
    },
    async getById(id: string): Promise<T | null> {
      const sanitizedId = id.replace(SANITIZE_REGEX, '');
      try {
        const res = await client.get(`/${sanitizedId}`);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch resource`);
      }
    },
    async getAll(): Promise<T[]> {
      try {
        const res = await client.get('/');
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch all resources`);
      }
    },
    async update(id: string, input: Partial<T>): Promise<T> {
      const sanitizedId = id.replace(SANITIZE_REGEX, '');
      try {
        const res = await client.put(`/${sanitizedId}`, input);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to update resource`);
      }
    },
    async delete(id: string): Promise<boolean> {
      const sanitizedId = id.replace(SANITIZE_REGEX, '');
      try {
        await client.delete(`/${sanitizedId}`);
        return true;
      } catch (error) {
        throw handleAxiosError(error, `Failed to delete resource`);
      }
    },
    async get(path: string): Promise<any> {
      try {
        const res = await client.get(path);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch resource`);
      }
    }
  };
}
