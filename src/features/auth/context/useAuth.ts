import { use } from 'react';


import type { AuthContextType } from './AuthContext';
import { AuthContext } from './AuthContext';

export function useAuth(): AuthContextType {
    const context = use(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

