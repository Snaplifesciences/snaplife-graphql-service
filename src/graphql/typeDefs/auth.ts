import { Company } from "./company";
import { Organization } from "./organization";
import { User } from "./user";

export interface AuthResult {
    token: string;
    refreshToken: string;
    expiresIn: number;
    userId: string;
}

export interface SignInResponse {
    token: string;
    user: User;
    organization: Organization;
    company: Company;
}

