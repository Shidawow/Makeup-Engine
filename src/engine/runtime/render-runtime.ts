import type { RenderInstruction } from '../contracts';

export interface RenderFrame {
  instructions: RenderInstruction[];
  renderedAt: string;
}

export interface IRenderRuntime {
  readonly kind: 'Canvas2D' | 'WebGL' | 'WebGPU' | 'Metal' | 'Mock';
  init(): Promise<void>;
  render(instructions: RenderInstruction[]): Promise<RenderFrame>;
  destroy(): Promise<void>;
}

export interface RuntimeLifecycle {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export class MockRenderRuntime implements IRenderRuntime {
  readonly kind = 'Mock' as const;

  async init(): Promise<void> {
    return;
  }

  async render(instructions: RenderInstruction[]): Promise<RenderFrame> {
    return {
      instructions,
      renderedAt: new Date().toISOString(),
    };
  }

  async destroy(): Promise<void> {
    return;
  }
}
