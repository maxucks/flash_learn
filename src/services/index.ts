import pino from "pino"
import type { Logger as PinoLogger, LoggerOptions } from "pino"

export class LoggerService {
  private readonly logger: PinoLogger

  constructor(options?: LoggerOptions) {
    this.logger = pino(options)
  }

  private log(level: pino.Level, message: string, data?: Record<string, unknown>): void {
    const childBindings = this.logger.bindings()
    const mergedData = { ...childBindings, ...data }
    this.logger[level](mergedData, message)
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log("info", message, data)
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log("error", message, data)
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log("warn", message, data)
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log("debug", message, data)
  }
}
