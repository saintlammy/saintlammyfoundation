/**
 * Production-safe logger
 * SECURITY: Prevents sensitive data logging in production
 * PERFORMANCE: Reduces console noise in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMessage {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Format log message with timestamp
   */
  private formatMessage(level: LogLevel, message: string, data?: any): LogMessage {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Sanitize data to remove sensitive information
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    // If data is a string, check for sensitive patterns
    if (typeof data === 'string') {
      // Redact potential private keys, passwords, tokens
      return data
        .replace(/([a-zA-Z0-9]{32,})/g, '[REDACTED]')
        .replace(/(password|token|key|secret)[\s:=]+[^\s]+/gi, '$1=[REDACTED]');
    }

    // If data is an object, recursively sanitize
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = Array.isArray(data) ? [] : {};

      for (const key in data) {
        const lowerKey = key.toLowerCase();

        // Redact sensitive fields
        if (
          lowerKey.includes('password') ||
          lowerKey.includes('secret') ||
          lowerKey.includes('token') ||
          lowerKey.includes('key') ||
          lowerKey.includes('private')
        ) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(data[key]);
        }
      }

      return sanitized;
    }

    return data;
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, data);
      console.debug(`[DEBUG] ${formatted.timestamp} - ${message}`, data || '');
    }
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any) {
    const sanitizedData = this.isProduction ? this.sanitizeData(data) : data;
    const formatted = this.formatMessage('info', message, sanitizedData);

    if (this.isDevelopment) {
      console.info(`[INFO] ${formatted.timestamp} - ${message}`, sanitizedData || '');
    } else {
      // In production, only log important info
      if (message.includes('Error') || message.includes('Failed') || message.includes('Success')) {
        console.info(`[INFO] ${message}`);
      }
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any) {
    const sanitizedData = this.isProduction ? this.sanitizeData(data) : data;
    const formatted = this.formatMessage('warn', message, sanitizedData);

    console.warn(`[WARN] ${formatted.timestamp} - ${message}`, sanitizedData || '');
  }

  /**
   * Error level logging (always logs)
   */
  error(message: string, error?: Error | any) {
    const sanitizedError = this.isProduction ? this.sanitizeData(error) : error;
    const formatted = this.formatMessage('error', message, sanitizedError);

    if (error instanceof Error) {
      console.error(`[ERROR] ${formatted.timestamp} - ${message}`, {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      });
    } else {
      console.error(`[ERROR] ${formatted.timestamp} - ${message}`, sanitizedError || '');
    }
  }

  /**
   * Log API requests (development only)
   */
  apiRequest(method: string, endpoint: string, data?: any) {
    if (this.isDevelopment) {
      this.debug(`API Request: ${method} ${endpoint}`, data);
    }
  }

  /**
   * Log API responses (development only)
   */
  apiResponse(endpoint: string, status: number, data?: any) {
    if (this.isDevelopment) {
      this.debug(`API Response: ${endpoint} - ${status}`, data);
    }
  }

  /**
   * Log database operations (development only)
   */
  database(operation: string, table: string, data?: any) {
    if (this.isDevelopment) {
      this.debug(`DB: ${operation} on ${table}`, data);
    }
  }

  /**
   * Log security events (always logs)
   */
  security(message: string, data?: any) {
    const sanitizedData = this.sanitizeData(data);
    console.warn(`[SECURITY] ${new Date().toISOString()} - ${message}`, sanitizedData || '');
  }

  /**
   * Log performance metrics (development only)
   */
  performance(label: string, duration: number) {
    if (this.isDevelopment) {
      console.log(`[PERF] ${label}: ${duration}ms`);
    }
  }
}

// Create global logger instance
const logger = new Logger();

// Export convenience functions
export const log = {
  debug: (message: string, data?: any) => logger.debug(message, data),
  info: (message: string, data?: any) => logger.info(message, data),
  warn: (message: string, data?: any) => logger.warn(message, data),
  error: (message: string, error?: Error | any) => logger.error(message, error),
  api: {
    request: (method: string, endpoint: string, data?: any) => logger.apiRequest(method, endpoint, data),
    response: (endpoint: string, status: number, data?: any) => logger.apiResponse(endpoint, status, data),
  },
  db: (operation: string, table: string, data?: any) => logger.database(operation, table, data),
  security: (message: string, data?: any) => logger.security(message, data),
  perf: (label: string, duration: number) => logger.performance(label, duration),
};

export default log;
