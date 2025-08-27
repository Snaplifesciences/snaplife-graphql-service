export interface SignInInput {
  email: string;
  password: string;
}

export interface SignInResponse {
  tokenId: string;
  user: any;
  company: any;
  organization: any;
}

export interface UserRole {
  name: string;
  active: boolean;
  permissions: Record<string, unknown>;
}



