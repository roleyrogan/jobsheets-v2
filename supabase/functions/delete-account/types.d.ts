/** Ambient types so the Node/Vite TypeScript language service can check this Deno Edge Function. */

declare namespace Deno {
  export namespace env {
    export function get(key: string): string | undefined
  }
}

declare module 'https://deno.land/std@0.224.0/http/server.ts' {
  export function serve(
    handler: (req: Request) => Response | Promise<Response>,
  ): void
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function createClient(url: string, key: string): any
}
