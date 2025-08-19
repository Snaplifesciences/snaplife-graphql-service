export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes?: string;
  roles: UserRole[];
  status: string;
  organizationId: string;
  companyId: string;
}

export interface UserRole {
  role: string;
  permissions?: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
}

export interface CompanySummary {
  id: string;
  name: string;
}

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  companyId: string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
}

export interface ActivationInput {
  password?: string;
  [key: string]: unknown;
}