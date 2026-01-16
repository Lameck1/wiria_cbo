import { createContext } from 'react';

import type { Member, User } from '@/shared/types';

export interface AuthContextType {
  user: User | Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: { identifier: string; password: string },
    isMember?: boolean
  ) => Promise<User | Member>;
  logout: (expired?: boolean) => Promise<void>;
  checkAuth: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

