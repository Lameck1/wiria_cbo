import { use } from 'react';

import { BackendStatusContext } from './backendStatus';
import type { BackendStatusContextType } from './backendStatus';

export function useBackendStatus(): BackendStatusContextType {
  return use(BackendStatusContext);
}

export { recheckBackendStatus } from './backendStatus';
