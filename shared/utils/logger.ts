/**
 * Structured logger. Swap implementation without touching callers.
 * Backend uses Pino directly (Step 5); this is the portable interface.
 */
type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMeta {
  [key: string]: unknown;
}

function emit(level: LogLevel, msg: string, meta?: LogMeta): void {
  const payload = {
    level,
    msg,
    ts: new Date().toISOString(),
    ...meta,
  };
  if (level === "error" || level === "warn") {
    // eslint-disable-next-line no-console
    console[level](JSON.stringify(payload));
  } else {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload));
  }
}

export const logger = {
  debug: (msg: string, meta?: LogMeta) => emit("debug", msg, meta),
  info: (msg: string, meta?: LogMeta) => emit("info", msg, meta),
  warn: (msg: string, meta?: LogMeta) => emit("warn", msg, meta),
  error: (msg: string, meta?: LogMeta) => emit("error", msg, meta),
};

export type Logger = typeof logger;
