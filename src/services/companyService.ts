import { companyServiceClient } from '../clients/companyClient';
import { Company } from '../types/company';
import { wrapServiceError } from '../utils/apiErrorUtils';

class CompanyService {

  async createCompany(input: any): Promise<Company> {
      console.log('Creating company with input:', input);
      try {
        return await companyServiceClient.create(input);
      } catch (error) {
        throw wrapServiceError(error, 'Company service failed while creating company');
      }
  }

  async getById(id: string): Promise<Company | null>{
      console.log(`Fetching company by id: ${id}`);
      try {
        return await companyServiceClient.getById(id);
      } catch (error) {
        throw wrapServiceError(error, `Company service failed while fetching company id ${id}`);
      }
  }

  async  findByName(name: string): Promise<Company | null>{
      console.log(`Fetching company by name: ${name}`);
      try {
        return await companyServiceClient.findByName(name);
      } catch (error) {
        throw wrapServiceError(error, `Company service failed while fetching company ${name}`);
      }
  }

  async getAllByOrganizationId(organizationId: string): Promise<Company[] | null> {
      console.log(`Fetching company by organization id: ${organizationId}`);
      try {
        return await companyServiceClient.getByOrganizationId(organizationId);
      } catch (error) {
        throw wrapServiceError(error, `Company service failed while fetching company by organization id ${organizationId}`);
      }
  }

  async getAllCompanies(): Promise<Company[]> {
      console.log('Fetching all companies');
      try {
        return await companyServiceClient.getAll();
      } catch (error) {
        throw wrapServiceError(error, 'Company service failed while fetching all companies');
      }
  }

  async updateCompany (id: string, input: any): Promise<Company>{
      console.log(`Updating company with id: ${id}`, input);
      try {
        return await companyServiceClient.update(id, input);
      } catch (error) {
        throw wrapServiceError(error, 'Company service failed while updating company');
      }
  }

  async deleteCompany (id: string): Promise<boolean>{
      console.log(`Deleting company with id: ${id}`);
      try {
        return await companyServiceClient.delete(id);
      } catch (error) {
        throw wrapServiceError(error, `Company service failed while deleting company id ${id}`);
      }
  }
  
  }

export default new CompanyService();

