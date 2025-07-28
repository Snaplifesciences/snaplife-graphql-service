export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    attributes: Record<string, any>;
    roles: UserRole[];
    status: string;
    organizationId: string;
    companyId: string;
  }
  
  export interface UserRole {
    role: string;
    permissions: Record<string, any>;
  }
  
  export interface OrganizationSummary {
    id: string;
    name: string;
  }
  
  export interface CompanySummary {
    id: string;
    name: string;
  }
  