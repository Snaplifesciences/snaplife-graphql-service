
export interface SignInResponse  {
  success: boolean;
  message: string;
  tokenId: string; 
  user: {
    id: string;
    email: string;
    companyId?: string | null;
    organizationId?: string | null;
    userId?: string | null;
  };
};

export interface SessionResponse {
  user: {
    id: string;
    email: string;
    companyId?: string | null;
    userId?: string | null;
    [k: string]: unknown;
  };
  accessToken: string;
  expired: boolean;
};

