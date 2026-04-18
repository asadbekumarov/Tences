/** Minimal typings for editor tooling; Deno runtime provides full APIs. */

declare namespace Deno {
  namespace env {
    function get(key: string): string | undefined;
  }
  function exit(code?: number): never;
  function serve(
    optionsOrHandler:
      | { port?: number }
      | ((request: Request) => Response | Promise<Response>),
    handler?: (request: Request) => Response | Promise<Response>,
  ): void;
}

declare module "https://deno.land/x/grammy/mod.ts" {
  export interface Context {
    from?: { first_name?: string };
    reply(text: string, extra?: Record<string, unknown>): Promise<unknown>;
    answerCallbackQuery(
      options?: { text?: string; show_alert?: boolean },
    ): Promise<void>;
    editMessageText(text: string, extra?: Record<string, unknown>): Promise<unknown>;
  }
  export class InlineKeyboard {
    text(text: string, data: string): this;
    row(): this;
  }
  export class Bot<C extends Context = Context> {
    constructor(token: string);
    readonly api: {
      deleteWebhook(options?: { drop_pending_updates?: boolean }): Promise<boolean>;
      getMe(): Promise<{ username?: string; first_name: string }>;
    };
    command(name: string, handler: (ctx: C) => void | Promise<void>): void;
    callbackQuery(
      filter: string,
      handler: (ctx: C) => void | Promise<void>,
    ): void;
    start(): Promise<void>;
  }
  export function webhookCallback(
    bot: Bot<unknown>,
    adapter: "std/http",
  ): (req: Request) => Promise<Response>;
}
