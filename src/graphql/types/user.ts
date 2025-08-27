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
  name: string;
  active: boolean;
  permissions?: string;
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

export interface ActivateAccountInput {
  password?: string;
  confirmPassword?: string;
}