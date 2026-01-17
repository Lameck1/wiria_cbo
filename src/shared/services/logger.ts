const isDevelopment = import.meta.env.DEV;

type LogMethod = (message: string, ...args: unknown[]) => void;

const createLoggerMethod =
  (consoleMethod: 'error' | 'warn' | 'log'): LogMethod =>
  (message, ...args) => {
    if (!isDevelopment) {
      return;
    }

    if (consoleMethod === 'error') {
      console.error(`[ERROR] ${message}`, ...args);
    } else if (consoleMethod === 'warn') {
      console.warn(`[WARN] ${message}`, ...args);
    } else {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  };

export const logger = {
  error: createLoggerMethod('error'),
  warn: createLoggerMethod('warn'),
  debug: createLoggerMethod('log'),
};
