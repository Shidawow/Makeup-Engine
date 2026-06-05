import { compileToRenderInstructions } from '../../compiler';
import type { RenderInstruction, MakeupPlan } from '../contracts';

export interface CompileLayersStage {
  id: 'compileLayers';
  execute(input: MakeupPlan): Promise<RenderInstruction[]>;
}

export const compileLayers = async (input: MakeupPlan): Promise<RenderInstruction[]> =>
  compileToRenderInstructions(input.sourceLook, input);

export const createCompileLayersStage = (): CompileLayersStage => ({
  id: 'compileLayers',
  execute: compileLayers,
});
