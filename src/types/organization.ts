export interface OrganizationAddress {
    id: string;
    status: string;
    organizationId: string;
    addressLine1: string;
    addressLine2?: string | null;
    addressLine3?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }
  
  export interface Organization {
    id: string;
    status: string;
    name: string;
    addresses: OrganizationAddress[];
  }
  