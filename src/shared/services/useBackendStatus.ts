import { use } from 'react';

import { BackendStatusContext, type BackendStatusContextType } from './backendStatusContext';

export function useBackendStatus(): BackendStatusContextType {
  return use(BackendStatusContext);
}


