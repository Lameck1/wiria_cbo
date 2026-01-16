import type { ReactNode} from 'react';
import { useEffect, useState } from 'react';

import { BackendStatusContext } from './backendStatusContext';
import { getBackendStatus } from './backendStatusService';

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void getBackendStatus().then((connected) => {
      setIsBackendConnected(connected);
      setIsChecking(false);
    });
  }, []);

  return (
    <BackendStatusContext.Provider value={{ isBackendConnected, isChecking }}>
      {children}
    </BackendStatusContext.Provider>
  );
}
