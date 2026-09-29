/**
 * Adapter Performance & Diagnostic Logger
 * Provides styled performance timing and normalizer validation across browser and server environments.
 */

export interface LoggerConfig {
  enabled: boolean;
  minDurationMs?: number; // Only log calls taking longer than this threshold if set
  logErrors: boolean;
}

const isBrowser = typeof window !== 'undefined';
const proc = (globalThis as any).process;
const isDev = typeof proc !== 'undefined' && proc.env?.NODE_ENV !== 'production';

let globalConfig: LoggerConfig = {
  enabled: isDev || (isBrowser && Boolean((window as any).__STOREFRONT_DEVTOOLS_ENABLED__)),
  minDurationMs: 0,
  logErrors: true,
};

export function configureAdapterLogger(config: Partial<LoggerConfig>): void {
  globalConfig = { ...globalConfig, ...config };
}

export function isLoggerEnabled(): boolean {
  return globalConfig.enabled;
}

/**
 * Wraps an asynchronous adapter call, measuring execution duration and logging with styled output.
 */
export async function measureAdapterCall<T>(
  domain: string,
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  if (!globalConfig.enabled) {
    return fn();
  }

  const start = performance.now();
  try {
    const result = await fn();
    const duration = Math.round(performance.now() - start);

    if (!globalConfig.minDurationMs || duration >= globalConfig.minDurationMs) {
      logSuccess(domain, operation, duration, metadata);
    }
    return result;
  } catch (err: any) {
    const duration = Math.round(performance.now() - start);
    if (globalConfig.logErrors) {
      logFailure(domain, operation, duration, err, metadata);
    }
    throw err;
  }
}

function logSuccess(
  domain: string,
  operation: string,
  durationMs: number,
  metadata?: Record<string, any>
): void {
  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  const durationLabel = `${durationMs}ms`;

  if (isBrowser) {
    // Browser styled console
    console.log(
      `%c[Storefront API]%c ${domain}.${operation}%c${metaStr} %c-> ${durationLabel}`,
      'color: #3b82f6; font-weight: bold; background: #eff6ff; padding: 2px 6px; border-radius: 4px;',
      'color: #10b981; font-weight: 600;',
      'color: #64748b; font-size: 11px;',
      durationMs > 300 ? 'color: #f59e0b; font-weight: bold;' : 'color: #64748b; font-weight: 500;'
    );
  } else {
    // Node ANSI console
    const colorDuration = durationMs > 300 ? `\x1b[33m${durationLabel}\x1b[0m` : `\x1b[36m${durationLabel}\x1b[0m`;
    console.log(
      `\x1b[34m[Storefront API]\x1b[0m \x1b[32m${domain}.${operation}\x1b[0m${metaStr} -> ${colorDuration}`
    );
  }
}

function logFailure(
  domain: string,
  operation: string,
  durationMs: number,
  error: any,
  metadata?: Record<string, any>
): void {
  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
  const message = error?.message || String(error);

  if (isBrowser) {
    console.error(
      `%c[Storefront API ERROR]%c ${domain}.${operation}%c${metaStr} %cfailed after ${durationMs}ms: ${message}`,
      'color: #ef4444; font-weight: bold; background: #fef2f2; padding: 2px 6px; border-radius: 4px;',
      'color: #b91c1c; font-weight: 600;',
      'color: #64748b; font-size: 11px;',
      'color: #ef4444;'
    );
  } else {
    console.error(
      `\x1b[31m[Storefront API ERROR]\x1b[0m \x1b[31m${domain}.${operation}\x1b[0m${metaStr} failed after ${durationMs}ms: ${message}`
    );
  }
}

/**
 * Validates normalized payload against required fields, logging diagnostic warnings if incomplete.
 */
export function validateNormalizedPayload(
  entityName: string,
  entityId: string,
  data: Record<string, any> | null | undefined,
  requiredFields: string[]
): boolean {
  if (!data) {
    warnDiagnostic(entityName, entityId, 'Payload is null or undefined');
    return false;
  }

  const missing = requiredFields.filter((field) => {
    const val = data[field];
    return val === undefined || val === null || val === '';
  });

  if (missing.length > 0) {
    warnDiagnostic(
      entityName,
      entityId,
      `Missing required normalized fields: [${missing.join(', ')}]`
    );
    return false;
  }

  return true;
}

function warnDiagnostic(entityName: string, entityId: string, reason: string): void {
  if (isBrowser) {
    console.warn(
      `%c[Storefront Diagnostic]%c ${entityName} (${entityId}): %c${reason}`,
      'color: #f59e0b; font-weight: bold; background: #fffbeb; padding: 2px 6px; border-radius: 4px;',
      'color: #b45309; font-weight: 600;',
      'color: #78350f;'
    );
  } else {
    console.warn(
      `\x1b[33m[Storefront Diagnostic]\x1b[0m \x1b[33m${entityName} (${entityId}): ${reason}\x1b[0m`
    );
  }
}
