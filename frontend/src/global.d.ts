declare const __UI_VERSION__: string;

// Minimal Node typings for vite.config.ts. The frontend intentionally keeps
// its devDependencies small, so avoid pulling in @types/node just for `git`.
declare module 'node:child_process' {
  export interface ExecSyncOptions {
    cwd?: string;
    encoding?: 'utf8';
    stdio?: ['ignore', 'pipe', 'ignore'];
  }

  export function execSync(command: string, options: ExecSyncOptions): string;
}
