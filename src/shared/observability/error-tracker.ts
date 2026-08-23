/**
 * Interface de adaptador para rastreamento de erros.
 *
 * Nenhum provedor de SaaS (Sentry etc.) esta conectado ainda - isso e uma
 * decisao em aberto (ver ARCHITECTURE.md). A implementacao atual apenas
 * loga via logger estruturado, mas o resto do codigo deve depender desta
 * interface, nao de um provedor especifico, para trocar a implementacao
 * sem tocar em codigo de negocio.
 */
import { logger } from "@/shared/logging/logger";

export interface ErrorTracker {
  captureException(error: unknown, context?: Record<string, unknown>): void;
}

class ConsoleErrorTracker implements ErrorTracker {
  captureException(error: unknown, context?: Record<string, unknown>): void {
    logger.error({ err: error, ...context }, "unhandled exception captured");
  }
}

export const errorTracker: ErrorTracker = new ConsoleErrorTracker();
