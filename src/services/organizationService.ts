import { organizationServiceClient } from '../clients/organizationServiceClient';
import { Organization } from '../types/organization';
import { wrapServiceError } from '../utils/apiErrorUtils';

class OrganizationService {
 
  async createOrganization(input: any): Promise<Organization> {
    console.log('Creating organization with input:', input);
    try {
      return await organizationServiceClient.create(input);
    } catch (error) {
      throw wrapServiceError(error, 'Organization service failed while creating organization');
    }
  }

  async getById(id: string): Promise<Organization | null> {
      console.log(`Fetching organization by id: ${id}`);
      try {
        return await organizationServiceClient.getById(id);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while fetching organization by id ${id}`);
      }
  }

  async findByName(name: string): Promise<Organization | null> {
      console.log(`Fetching organization by name: ${name}`);
      try {
        return await organizationServiceClient.findByName(name);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while fetching organization by name ${name}`);
      }
  }

  async getAll(): Promise<Organization[]> {
      console.log('Fetching all organizations');
      try {
        return await organizationServiceClient.getAll();
      } catch (error) {
        throw wrapServiceError(error, 'Organization service failed while fetching all organizations');
      }
  }

  async updateOrganization (id: string, input: any): Promise<Organization> {
      console.log(`Updating organization with id: ${id}`, input);
      try {
        return await organizationServiceClient.update(id, input);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while updating organization id ${id}`);
      }
  }

  async deleteOrganization(id: string): Promise<boolean>{
      console.log(`Deleting organization with id: ${id}`);
      try {
        return await organizationServiceClient.delete(id);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while deleting organization id ${id}`);
      }
  }

}

export default new OrganizationService();