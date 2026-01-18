const isDevelopment = import.meta.env.DEV;

type LogMethod = (message: string, ...args: unknown[]) => void;

const { error, warn, log } = console;

const createLoggerMethod =
  (consoleMethod: 'error' | 'warn' | 'log'): LogMethod =>
  (message, ...args) => {
    if (!isDevelopment) {
      return;
    }

    if (consoleMethod === 'error') {
      error(`[ERROR] ${message}`, ...args);
    } else if (consoleMethod === 'warn') {
      warn(`[WARN] ${message}`, ...args);
    } else {
      log(`[DEBUG] ${message}`, ...args);
    }
  };

export const logger = {
  error: createLoggerMethod('error'),
  warn: createLoggerMethod('warn'),
  debug: createLoggerMethod('log'),
};
