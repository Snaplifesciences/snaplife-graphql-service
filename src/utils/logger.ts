interface Logger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}

const sanitizeForLog = (input: any): string => {
  if (typeof input === 'string') {
    return input.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '_');
  }
  try {
    return JSON.stringify(input).replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '_');
  } catch (error) {
    return '[Circular Reference]';
  }
};

export const logger: Logger = {
  info: (message: string, meta?: any) => {
    const sanitizedMessage = message.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '_');
    console.log(`[INFO] ${sanitizedMessage}`, meta ? sanitizeForLog(meta) : '');
  },
  error: (message: string, meta?: any) => {
    const sanitizedMessage = message.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '_');
    console.error(`[ERROR] ${sanitizedMessage}`, meta ? sanitizeForLog(meta) : '');
  },
  debug: (message: string, meta?: any) => {
    const sanitizedMessage = message.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '_');
    console.log(`[DEBUG] ${sanitizedMessage}`, meta ? sanitizeForLog(meta) : '');
  }
};