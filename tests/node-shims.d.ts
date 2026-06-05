declare module 'node:assert/strict' {
  interface AssertStrict {
    equal(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
  }

  const assert: AssertStrict;
  export default assert;
}

declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function mkdtempSync(prefix: string): string;
  export function readdirSync(path: string): string[];
  export function readFileSync(path: string, encoding: 'utf8'): string;
  export function rmSync(
    path: string,
    options?: { recursive?: boolean; force?: boolean },
  ): void;
  export function statSync(path: string): {
    isDirectory(): boolean;
  };
  export function writeFileSync(path: string, content: string, encoding?: 'utf8'): void;
}

declare module 'node:child_process' {
  export interface SpawnSyncReturns {
    status: number | null;
    stdout: Buffer;
    stderr: Buffer;
  }

  export function spawnSync(
    command: string,
    args?: readonly string[],
    options?: { cwd?: string; encoding?: BufferEncoding },
  ): SpawnSyncReturns;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'node:path' {
  export function dirname(path: string): string;
  export function join(...parts: string[]): string;
  export function resolve(...parts: string[]): string;
}
type BufferEncoding = 'utf8';

interface Buffer {
  toString(encoding?: BufferEncoding): string;
}
