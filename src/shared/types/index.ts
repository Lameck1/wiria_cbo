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
export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

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

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Payment Types
export enum PaymentMethod {
  STK_PUSH = 'STK_PUSH',
  MANUAL = 'MANUAL',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  phone?: string;
  createdAt: string;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}
