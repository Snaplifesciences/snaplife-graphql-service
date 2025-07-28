import { organizationAPI } from '../../datasources/organizationAPI';
import { Organization } from '../typeDefs/organization';
import { wrapServiceError } from '../../utils/apiErrorUtils';

class OrganizationService {
 
  async createOrganization(input: any): Promise<Organization> {
    console.log('Creating organization with input:', input);
    try {
      return await organizationAPI.create(input);
    } catch (error) {
      throw wrapServiceError(error, 'Organization service failed while creating organization');
    }
  }

  async getById(id: string): Promise<Organization | null> {
      console.log(`Fetching organization by id: ${id}`);
      try {
        return await organizationAPI.getById(id);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while fetching organization by id ${id}`);
      }
  }

  async findByName(name: string): Promise<Organization | null> {
      console.log(`Fetching organization by name: ${name}`);
      try {
        return await organizationAPI.findByName(name);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while fetching organization by name ${name}`);
      }
  }

  async getAll(): Promise<Organization[]> {
      console.log('Fetching all organizations');
      try {
        return await organizationAPI.getAll();
      } catch (error) {
        throw wrapServiceError(error, 'Organization service failed while fetching all organizations');
      }
  }

  async updateOrganization (id: string, input: any): Promise<Organization> {
      console.log(`Updating organization with id: ${id}`, input);
      try {
        return await organizationAPI.update(id, input);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while updating organization id ${id}`);
      }
  }

  async deleteOrganization(id: string): Promise<boolean>{
      console.log(`Deleting organization with id: ${id}`);
      try {
        return await organizationAPI.delete(id);
      } catch (error) {
        throw wrapServiceError(error, `Organization service failed while deleting organization id ${id}`);
      }
  }

}

export default new OrganizationService();