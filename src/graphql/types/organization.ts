export interface Organization {
  id: string;
  status: string;
  name: string;
  country: string;
  addresses: OrganizationAddress[];
}

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

export interface CreateOrganizationAddressInput extends Omit<OrganizationAddress, 'id' | 'organizationId'> {}

export interface CreateOrganizationInput {
  name: string;
  country: string;
  status: string;
  addresses?: CreateOrganizationAddressInput[];
}

export interface UpdateOrganizationInput {
  name?: string;
  country?: string;
  status?: string;
  addresses?: CreateOrganizationAddressInput[];
}