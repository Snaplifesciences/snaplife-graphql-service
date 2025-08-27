import companyService from '../services/companyService';
import organizationService from '../services/organizationService';
import { logger } from '../../utils/logger';
import { GraphQLError } from 'graphql';
import { ROLES, PERMISSIONS } from '../../utils/rbacUtils';
import { withRBACAsync, Context, UserRole } from '../../middleware/withRBAC';
import { Company, CreateCompanyInput, UpdateCompanyInput } from '../types/company';

export const companyResolver = {
  Query: {
    companies: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_COMPANIES]
    )(async (_: any, __: any, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('CompanyResolver::companies - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('CompanyResolver::companies - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        companyId: user.companyId,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      if (isPlatformAdmin) {
        logger.info('CompanyResolver::companies - Platform admin access granted');
        return companyService.getCompanies();
      }

      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.ORGANIZATION_ADMIN
      );
      if (isOrgAdmin && user.organizationId) {
        logger.info('CompanyResolver::companies - Organization admin access granted', {
          organizationId: user.organizationId
        });
        return companyService.getAllByOrganizationId(user.organizationId);
      }

      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.COMPANY_ADMIN
      );
      if (isCompanyAdmin && user.companyId) {
        logger.info('CompanyResolver::companies - Company admin access granted', {
          companyId: user.companyId
        });
        const company = await companyService.getById(user.companyId);
        return company ? [company] : [];
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    getCompanyById: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_COMPANIES]
    )(async (_: any, { id }: { id: string }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('CompanyResolver::getCompanyById - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('CompanyResolver::getCompanyById - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        companyId: user.companyId,
        targetCompanyId: id,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const company = await companyService.getById(id);
      if (!company) {
        logger.info('CompanyResolver::getCompanyById - Company not found', { id });
        return null;
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN &&
        user.organizationId === company.organizationId
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN &&
        user.companyId === company.id
      );

      logger.info('CompanyResolver::getCompanyById - Access check result', {
        companyId: id,
        isPlatformAdmin,
        isOrgAdmin,
        isCompanyAdmin,
        companyOrgId: company.organizationId,
        userOrgId: user.organizationId
      });

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return company;
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),
  },
  Mutation: {
    createCompany: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN],
      [PERMISSIONS.MANAGE_COMPANIES]
    )(async (_: any, { input }: { input: CreateCompanyInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('CompanyResolver::createCompany - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('CompanyResolver::createCompany - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        targetOrgId: input.organizationId,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN && 
        user.organizationId === input.organizationId
      );

      logger.info('CompanyResolver::createCompany - Access check result', {
        isPlatformAdmin,
        isOrgAdmin,
        userOrgId: user.organizationId,
        targetOrgId: input.organizationId
      });

      if (isPlatformAdmin || isOrgAdmin) {
        return companyService.createCompany(input);
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    updateCompany: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_COMPANIES]
    )(async (_: any, { id, input }: { id: string; input: UpdateCompanyInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('CompanyResolver::updateCompany - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('CompanyResolver::updateCompany - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        companyId: user.companyId,
        targetCompanyId: id,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const company = await companyService.getById(id);
      if (!company) {
        logger.error('CompanyResolver::updateCompany - Company not found', { id });
        throw new GraphQLError('Company not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN && 
        user.organizationId === company.organizationId
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === company.id
      );

      logger.info('CompanyResolver::updateCompany - Access check result', {
        companyId: id,
        isPlatformAdmin,
        isOrgAdmin,
        isCompanyAdmin,
        companyOrgId: company.organizationId,
        userOrgId: user.organizationId,
        userCompanyId: user.companyId
      });

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return companyService.updateCompany(id, input);
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    deleteCompany: withRBACAsync(
      [ROLES.PLATFORM_ADMIN],
      [PERMISSIONS.MANAGE_COMPANIES]
    )(async (_: any, { id }: { id: string }) => {
      return companyService.deleteCompany(id);
    })
  },

  Company: {
    contacts: (company: Company) => company.contacts,
    addresses: (company: Company) => company.addresses,
    organization: (company: Company) =>
      company.organizationId ? organizationService.getById(company.organizationId) : null
  }
};
