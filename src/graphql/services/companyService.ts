import { companyAPI } from '../../datasources/companyAPI';
import { Company } from '../typeDefs/company';
import { wrapServiceError } from '../../utils/apiErrorUtils';
import { logger } from '../../utils/logger';

interface CreateCompanyInput {
  name: string;
  organizationId: string;
  [key: string]: unknown;
}

interface UpdateCompanyInput {
  name?: string;
  organizationId?: string;
  [key: string]: unknown;
}

class CompanyService {

  async createCompany(input: CreateCompanyInput): Promise<Company> {
      const sanitizedName = input.name?.replace(/[\r\n]/g, '') || 'unknown';
      logger.info('CompanyService::createCompany initiated', { name: sanitizedName, organizationId: input.organizationId });
      try {
        const result = await companyAPI.create(input);
        logger.info('CompanyService::createCompany completed successfully');
        return result;
      } catch (error) {
        logger.error('CompanyService::createCompany failed', error);
        throw wrapServiceError(error, 'Company service failed while creating company');
      }
  }

  async getById(id: string): Promise<Company | null>{
      logger.info('CompanyService::getById initiated', { companyId: id });
      try {
        const result = await companyAPI.getById(id);
        logger.info('CompanyService::getById completed successfully');
        return result;
      } catch (error) {
        logger.error('CompanyService::getById failed', error);
        throw wrapServiceError(error, 'Company service failed while fetching company');
      }
  }

  async  findByName(name: string): Promise<Company | null>{
      const sanitizedName = name.replace(/[\r\n]/g, '');
      logger.info('CompanyService::findByName initiated', { name: sanitizedName });
      try {
        const result = await companyAPI.findByName(sanitizedName);
        logger.info('CompanyService::findByName completed successfully');
        return result;
      } catch (error) {
        logger.error('CompanyService::findByName failed', error);
        throw wrapServiceError(error, 'Company service failed while fetching company');
      }
  }

  async getAllByOrganizationId(organizationId: string): Promise<Company[]> {
      logger.info('CompanyService::getAllByOrganizationId initiated', { organizationId });
      try {
        const result = await companyAPI.getByOrganizationId(organizationId);
        logger.info('CompanyService::getAllByOrganizationId completed successfully');
        return result || [];
      } catch (error) {
        logger.error('CompanyService::getAllByOrganizationId failed', error);
        throw wrapServiceError(error, 'Company service failed while fetching company by organization id');
      }
  }

  async getAllCompanies(): Promise<Company[]> {
      logger.info('CompanyService::getAllCompanies initiated');
      try {
        return await companyAPI.getAll();;
      } catch (error) {
        logger.error('CompanyService::getAllCompanies failed', error);
        throw wrapServiceError(error, 'Company service failed while fetching all companies');
      }
  }

  async updateCompany(id: string, input: UpdateCompanyInput): Promise<Company> {
      logger.info('CompanyService::updateCompany initiated', { companyId: id });
      try {
        const result = await companyAPI.update(id, input);
        logger.info('CompanyService::updateCompany completed successfully');
        return result;
      } catch (error) {
        logger.error('CompanyService::updateCompany failed', error);
        throw wrapServiceError(error, 'Company service failed while updating company');
      }
  }

  async deleteCompany(id: string): Promise<boolean> {
      const sanitizedId = id.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
      logger.info('CompanyService::deleteCompany initiated', { companyId: sanitizedId });
      try {
        await companyAPI.delete(sanitizedId);
        logger.info('CompanyService::deleteCompany completed successfully');
        return true;
      } catch (error) {
        logger.error('CompanyService::deleteCompany failed', error);
        throw wrapServiceError(error, 'Company service failed while deleting company');
      }
  }
  
}

export default new CompanyService();

