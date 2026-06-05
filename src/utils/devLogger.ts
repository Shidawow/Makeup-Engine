export type LogLevel = 'info' | 'warn' | 'error';

export interface DevLogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: string;
}

export const createDevLog = (message: string, level: LogLevel = 'info'): DevLogEntry => ({
  id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
  level,
  message,
  timestamp: new Date().toISOString(),
});

export const devLogger = {
  info: (message: string) => createDevLog(message, 'info'),
  warn: (message: string) => createDevLog(message, 'warn'),
  error: (message: string) => createDevLog(message, 'error'),
};
