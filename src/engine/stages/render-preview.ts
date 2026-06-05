import type { RenderInstruction } from '../contracts';
import type { IRenderRuntime, RenderFrame } from '../runtime';

export interface RenderPreviewStage {
  id: 'renderPreview';
  execute(input: RenderInstruction[]): Promise<RenderFrame>;
}

export const renderPreview = async (
  input: RenderInstruction[],
  runtime: IRenderRuntime,
): Promise<RenderFrame> => runtime.render(input);

export const createRenderPreviewStage = (runtime: IRenderRuntime): RenderPreviewStage => ({
  id: 'renderPreview',
  execute: (input) => renderPreview(input, runtime),
});
