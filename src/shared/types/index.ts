/**
 * Shared TypeScript Types
 */

// User Roles
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER',
  MEMBER = 'MEMBER',
}

// User Type
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isActive: boolean;
}

// Member Type
export interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  membershipStatus: MembershipStatus;
  membershipNumber?: string;
  role: UserRole.MEMBER;
}

export enum MembershipStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

// Auth Types
// LoginCredentials interface removed - not currently used in the application
// export interface LoginCredentials {
//   identifier: string; // email or username
//   password: string;
// }

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: {
    user: User | Member;
    tokens: AuthTokens;
  };
  message: string;
}



// PaginatedResponse interface removed - not currently used in the application
// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }





// Form validation types
// ValidationError interface removed - not currently used in the application
// export interface ValidationError {
//   field: string;
//   message: string;
// }
