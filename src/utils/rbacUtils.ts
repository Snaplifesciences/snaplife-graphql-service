import { withRBACAsync } from '../middleware/withRBAC';

// Role constants
export const ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  ORGANIZATION_ADMIN: 'ORGANIZATION_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  USER: 'COMPANY_USER'
} as const;

//
// 🛂 Permission Constants
//
export const PERMISSIONS = {
  MANAGE_USERS: 'manageUsers',
  MANAGE_COMPANIES: 'manageCompanies',
  MANAGE_ORGANIZATIONS: 'manageOrganizations',
  MANAGE_CONTACTS: 'manageContacts'
} as const;

//
// 🎯 Role → Permissions Mapping
//
export const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  [ROLES.PLATFORM_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.ORGANIZATION_ADMIN]: [
    PERMISSIONS.MANAGE_ORGANIZATIONS,
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_CONTACTS
  ],

  [ROLES.COMPANY_ADMIN]: [
    PERMISSIONS.MANAGE_COMPANIES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_CONTACTS
  ],

  [ROLES.USER]: []
};

//
// ✅ Middleware: Check RBAC permissions
//

export const createRBACHelpers = (permissions: string[]) => ({
  withAccess: withRBACAsync(permissions)
});

export const userRBAC = createRBACHelpers([
  PERMISSIONS.MANAGE_USERS
]);

export const companyRBAC = createRBACHelpers([
  PERMISSIONS.MANAGE_COMPANIES
]);

export const organizationRBAC = createRBACHelpers([
  PERMISSIONS.MANAGE_COMPANIES,
  PERMISSIONS.MANAGE_ORGANIZATIONS
]);