import { organizationAPI } from '../../datasources/organizationAPI';
import { wrapServiceError } from '../../error/apiErrorUtils';
import { logger } from '../../utils/logger';
import { CreateOrganizationInput, UpdateOrganizationInput,Organization } from '../types/organization';

class OrganizationService {
 
  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    const sanitizedName = input.name?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'unknown';
    logger.info('OrganizationService::createOrganization initiated', { name: sanitizedName });
    try {
      const result = await organizationAPI.create(input as Partial<Organization>);
      logger.info('OrganizationService::createOrganization completed successfully', { organizationId: result.id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::createOrganization failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while creating organization');
    }
  }

  async getById(id: string): Promise<Organization | null> {
    logger.info('OrganizationService::getById initiated', { organizationId: id });
    try {
      const result = await organizationAPI.getById(id);
      logger.info('OrganizationService::getById completed successfully', { organizationId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::getById failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while fetching organization by id');
    }
  }

  async findByName(name: string): Promise<Organization | null> {
    if (!name || typeof name !== 'string') {
      logger.error('OrganizationService::findByName failed - invalid name parameter');
      throw new Error('Name parameter is required and must be a string');
    }
    const sanitizedName = name.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
    logger.info('OrganizationService::findByName initiated', { name: sanitizedName });
    try {
      const result = await organizationAPI.findByName(sanitizedName);
      logger.info('OrganizationService::findByName completed successfully', result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::findByName failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while fetching organization by name');
    }
  }

  async getOrganizations(): Promise<Organization[]> {
    logger.info('OrganizationService::getOrganizations initiated');
    try {
      const result = await organizationAPI.getAll();
      logger.info('OrganizationService::getOrganizations completed successfully', { count: result.length });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::getOrganizations failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while fetching all organizations');
    }
  }

  async updateOrganization(id: string, input: UpdateOrganizationInput): Promise<Organization> {
    logger.info('OrganizationService::updateOrganization initiated', { organizationId: id });
    try {
      logger.debug('OrganizationService::updateOrganization input', { input });
      const result = await organizationAPI.update(id, input as Partial<Organization>);
      logger.info('OrganizationService::updateOrganization completed successfully', { organizationId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::updateOrganization failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while updating organization');
    }
  }

  async deleteOrganization(id: string): Promise<boolean> {
    logger.info('OrganizationService::deleteOrganization initiated', { organizationId: id });
    try {
      const result = await organizationAPI.delete(id);
      logger.info('OrganizationService::deleteOrganization completed successfully', { organizationId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('OrganizationService::deleteOrganization failed', { error: errorMessage });
      throw wrapServiceError(error, 'Organization service failed while deleting organization');
    }
  }

}

export default new OrganizationService();
