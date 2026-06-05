import { describe, expect, it } from 'vitest';
import { MockRenderRuntime } from '../src/engine/runtime/render-runtime';

describe('runtime integration', () => {
  it('mock runtime lifecycle renders deterministic frames', async () => {
    const runtime = new MockRenderRuntime();
    await runtime.init();
    const frame = await runtime.render([]);
    await runtime.destroy();

    expect(runtime.kind).toBe('Mock');
    expect(frame.instructions).toEqual([]);
    expect(frame.renderedAt).toEqual(expect.any(String));
  });
});
