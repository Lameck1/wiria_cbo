import { use } from 'react';

import { AuthContext, type AuthContextType } from './AuthContextBase';

export function useAuth(): AuthContextType {
    const context = use(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
