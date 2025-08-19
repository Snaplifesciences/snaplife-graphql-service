export interface CompanyContact {
    id: string;
    status: string;
    companyId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    jobTitle: string;
  }
  
  export interface CompanyAddress {
    id: string;
    status: string;
    companyId: string;
    addressLine1: string;
    addressLine2?: string | null;
    addressLine3?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressType?: string | null;
  }
  
  export interface Company {
    id: string;
    status: string;
    organizationId: string;
    name: string;
    companyType: string;
    financialStatus: string;
    developmentStage: string;
    headquarters: string;
    territory: string;
    partnerStatus: string;
    taxId?: string | null;
    attributes: Record<string, unknown>;
    contacts: CompanyContact[];
    addresses: CompanyAddress[];
  }
  