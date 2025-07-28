import axios from 'axios';
import { handleAxiosError } from './apiErrorUtils';

export function createApiClient<T>(baseUrl: string) {
  return {
    async create(input: any): Promise<T> {
      try {
        const res = await axios.post(baseUrl, input);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to create resource`);
      }
    },
    async getById(id: string): Promise<T | null> {
      try {
        const res = await axios.get(`${baseUrl}/${id}`);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch resource by id ${id}`);
      }
    },
    async getAll(): Promise<T[]> {
      try {
        const res = await axios.get(baseUrl);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch all resources`);
      }
    },
    async update(id: string, input: any): Promise<T> {
      try {
        const res = await axios.put(`${baseUrl}/${id}`, input);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to update resource with id ${id}`);
      }
    },
    async delete(id: string): Promise<boolean> {
      try {
        await axios.delete(`${baseUrl}/${id}`);
        return true;
      } catch (error) {
        throw handleAxiosError(error, `Failed to delete resource with id ${id}`);
      }
    },
  };
}
