import { companyAPI } from '../../datasources/companyAPI';
import { wrapServiceError } from '../../error/apiErrorUtils';
import { logger } from '../../utils/logger';
import { Company, CreateCompanyInput, UpdateCompanyInput } from '../types/company';

class CompanyService {

  async createCompany(input: CreateCompanyInput): Promise<Company> {
    const sanitizedName = input.name?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'unknown';
    logger.info('CompanyService::createCompany initiated', { name: sanitizedName, organizationId: input.organizationId });
    try {
      const result = await companyAPI.create(input as Partial<Company>);
      logger.info('CompanyService::createCompany completed successfully', { companyId: result.id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::createCompany failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while creating company');
    }
  }

  async getById(id: string): Promise<Company | null> {
    logger.info('CompanyService::getById initiated', { companyId: id });
    try {
      const result = await companyAPI.getById(id);
      logger.info('CompanyService::getById completed successfully', { companyId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::getById failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while fetching company');
    }
  }

  async findByName(name: string): Promise<Company | null> {
    const sanitizedName = name.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
    logger.info('CompanyService::findByName initiated', { name: sanitizedName });
    try {
      const result = await companyAPI.findByName(sanitizedName);
      logger.info('CompanyService::findByName completed successfully', { name: sanitizedName });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::findByName failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while fetching company');
    }
  }

  async getAllByOrganizationId(organizationId: string): Promise<Company[]> {
    logger.info('CompanyService::getAllByOrganizationId initiated', { organizationId });
    try {
      const allCompanies = await companyAPI.getAll();
      const result = allCompanies.filter((company: Company) => company.organizationId === organizationId);
      logger.info('CompanyService::getAllByOrganizationId completed successfully', { organizationId, count: result.length });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::getAllByOrganizationId failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while fetching company by organization id');
    }
  }

  async getCompanies(): Promise<Company[]> {
    logger.info('CompanyService::getCompanies initiated');
    try {
      const result = await companyAPI.getAll();
      logger.info('CompanyService::getCompanies completed successfully', { count: result.length });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::getCompanies failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while fetching all companies');
    }
  }

  async updateCompany(id: string, input: UpdateCompanyInput): Promise<Company> {
    logger.info('CompanyService::updateCompany initiated', { companyId: id });
    try {
      const result = await companyAPI.update(id, input as Partial<Company>);
      logger.info('CompanyService::updateCompany completed successfully', { companyId: id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::updateCompany failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while updating company');
    }
  }

  async deleteCompany(id: string): Promise<boolean> {
    logger.info('CompanyService::deleteCompany initiated', { companyId: id });
    try {
      await companyAPI.delete(id);
      logger.info('CompanyService::deleteCompany completed successfully', { companyId: id });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('CompanyService::deleteCompany failed', { error: errorMessage });
      throw wrapServiceError(error, 'Company service failed while deleting company');
    }
  }
  
}

export default new CompanyService();


