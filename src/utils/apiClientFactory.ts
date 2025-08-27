import axios from 'axios';
import { handleAxiosError } from '../error/apiErrorUtils';
import { logger } from './logger';

const SANITIZE_REGEX = /[\r\n\t\x00-\x1f\x7f-\x9f]/g;

function sanitizeId(id: string): string {
  return id.replace(SANITIZE_REGEX, '');
}

export function createApiClient<T>(baseUrl: string) {
  const client = axios.create({ baseURL: baseUrl });
  
  return {
    async create(input: Partial<T>): Promise<T> {
      logger.info('ApiClientFactory::create - Creating new resource', { 
        url: client.defaults.baseURL,
        input 
      });
      if (!input || typeof input !== 'object') {
        throw new Error('Invalid input: input must be a non-empty object');
      }
      try {
        const res = await client.post('', input);
        logger.info('ApiClientFactory::create - Resource created successfully', {
          url: client.defaults.baseURL,
          id: res.data?.id
        });
        return res.data;
      } catch (error: any) {
        logger.error('ApiClientFactory::create - Failed to create resource', {
          url: client.defaults.baseURL,
          error: error?.message || 'Unknown error'
        });
        throw handleAxiosError(error, `Failed to create resource`);
      }
    },
    async getById(id: string): Promise<T | null> {
      logger.info('ApiClientFactory::getById - Fetching resource by ID', { 
        url: client.defaults.baseURL,
        id 
      });
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid ID: ID must be a non-empty string');
      }
      const sanitizedId = sanitizeId(id);
      try {
        const res = await client.get(`${sanitizedId}`);
        logger.info('ApiClientFactory::getById - Resource fetched successfully', {
          url: client.defaults.baseURL,
          id: sanitizedId
        });
        return res.data;
      } catch (error: any) {
        logger.error('ApiClientFactory::getById - Failed to fetch resource', {
          url: client.defaults.baseURL,
          id: sanitizedId,
          error: error?.message || 'Unknown error'
        });
        throw handleAxiosError(error, `Failed to fetch resource`);
      }
    },
    async getAll(): Promise<T[]> {
      logger.info('ApiClientFactory::getAll - Fetching all resources', { url: client.defaults.baseURL });
      if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '') {
        throw new Error('Invalid base URL: base URL must be a non-empty string');
      }
      try {
        const res = await client.get('');
        logger.info('ApiClientFactory::getAll - Fetched resources successfully', { 
          url: client.defaults.baseURL,
          count: Array.isArray(res.data) ? res.data.length : 0 
        });
        return res.data;
      } catch (error: any) {
        logger.error('ApiClientFactory::getAll - Failed to fetch resources', {
          url: client.defaults.baseURL,
          error: error?.message || 'Unknown error'
        });
        throw handleAxiosError(error, `Failed to fetch all resources`);
      }
    },
    async update(id: string, input: Partial<T>): Promise<T> {
      logger.info('ApiClientFactory::update - Updating resource', { 
        url: client.defaults.baseURL,
        id,
        input
      });
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid ID: ID must be a non-empty string');
      }
      const sanitizedId = sanitizeId(id);
      try {
        const res = await client.put(`${sanitizedId}`, input);
        logger.info('ApiClientFactory::update - Resource updated successfully', {
          url: client.defaults.baseURL,
          id: sanitizedId
        });
        return res.data;
      } catch (error: any) {
        logger.error('ApiClientFactory::update - Failed to update resource', {
          url: client.defaults.baseURL,
          id: sanitizedId,
          error: error?.message || 'Unknown error'
        });
        throw handleAxiosError(error, `Failed to update resource`);
      }
    },
    async delete(id: string): Promise<boolean> {
      logger.info('ApiClientFactory::delete - Deleting resource', { 
        url: client.defaults.baseURL,
        id 
      });
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('Invalid ID: ID must be a non-empty string');
      }
      const sanitizedId = sanitizeId(id);
      try {
        await client.delete(`${sanitizedId}`);
        logger.info('ApiClientFactory::delete - Resource deleted successfully', {
          url: client.defaults.baseURL,
          id: sanitizedId
        });
        return true;
      } catch (error: any) {
        logger.error('ApiClientFactory::delete - Failed to delete resource', {
          url: client.defaults.baseURL,
          id: sanitizedId,
          error: error?.message || 'Unknown error'
        });
        throw handleAxiosError(error, `Failed to delete resource`);
      }
    },
    async get(path: string): Promise<any> {
      logger.info('ApiClientFactory::get - Fetching resource by path', { path });
      if (!path || typeof path !== 'string') {
        throw new Error('Invalid path: path must be a non-empty string');
      }
      // Validate path to prevent SSRF attacks
      if (path.includes('://') || path.startsWith('//') || path.includes('..')) {
        throw new Error('Invalid path: absolute URLs and path traversal not allowed');
      }
      try {
        const res = await client.get(path);
        return res.data;
      } catch (error) {
        throw handleAxiosError(error, `Failed to fetch resource`);
      }
    }
  };
}
