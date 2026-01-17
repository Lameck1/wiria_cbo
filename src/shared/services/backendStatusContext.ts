import { createContext } from 'react';

export interface BackendStatusContextType {
  isBackendConnected: boolean;
  isChecking: boolean;
}

export const BackendStatusContext = createContext<BackendStatusContextType>({
  isBackendConnected: false,
  isChecking: true,
});
