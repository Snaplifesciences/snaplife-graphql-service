import { organizationAPI } from '../../datasources/organizationAPI';
import { Organization } from '../typeDefs/organization';
import { wrapServiceError } from '../../utils/apiErrorUtils';
import { logger } from '../../utils/logger';
import { CreateOrganizationInput, UpdateOrganizationInput } from '../../types/inputs';

class OrganizationService {
 
  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    const sanitizedName = input.name?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'unknown';
    logger.info('OrganizationService::createOrganization initiated', { name: sanitizedName });
    try {
      const result = await organizationAPI.create(input);
      logger.info('OrganizationService::createOrganization completed successfully');
      return result;
    } catch (error) {
      logger.error('OrganizationService::createOrganization failed', error);
      throw wrapServiceError(error, 'Organization service failed while creating organization');
    }
  }

  async getById(id: string): Promise<Organization | null> {
      logger.info('OrganizationService::getById initiated', { organizationId: id });
      try {
        const result = await organizationAPI.getById(id);
        logger.info('OrganizationService::getById completed successfully');
        return result;
      } catch (error) {
        logger.error('OrganizationService::getById failed', error);
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
        logger.info('OrganizationService::findByName completed successfully');
        return result;
      } catch (error) {
        logger.error('OrganizationService::findByName failed', error);
        throw wrapServiceError(error, 'Organization service failed while fetching organization by name');
      }
  }

  async getAll(): Promise<Organization[]> {
      try {
        return await organizationAPI.getAll();
      } catch (error) {
        throw wrapServiceError(error, 'Organization service failed while fetching all organizations');
      }
  }

  async updateOrganization (id: string, input: UpdateOrganizationInput): Promise<Organization> {
      const sanitizedId = id.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
      logger.info('OrganizationService::updateOrganization initiated', { organizationId: sanitizedId });
      try {
        const result = await organizationAPI.update(sanitizedId, input);
        logger.info('OrganizationService::updateOrganization completed successfully');
        return result;
      } catch (error) {
        logger.error('OrganizationService::updateOrganization failed', error);
        throw wrapServiceError(error, 'Organization service failed while updating organization');
      }
  }

  async deleteOrganization(id: string): Promise<boolean>{
      const sanitizedId = id.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
      logger.info('OrganizationService::deleteOrganization initiated', { organizationId: sanitizedId });
      try {
        const result = await organizationAPI.delete(sanitizedId);
        logger.info('OrganizationService::deleteOrganization completed successfully');
        return result;
      } catch (error) {
        logger.error('OrganizationService::deleteOrganization failed', error);
        throw wrapServiceError(error, 'Organization service failed while deleting organization');
      }
  }

}

export default new OrganizationService();