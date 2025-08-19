export interface OrganizationAddress {
  id: string;
  status: string;
  organizationId: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
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