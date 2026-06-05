import type { PipelineNode } from '../graph';

export interface ExecutionTrace<TOutput = unknown> {
  nodeId: string;
  output: TOutput;
  startedAt: string;
  finishedAt: string;
}

export interface PipelineExecutor {
  execute<TInput, TOutput>(node: PipelineNode<TInput, TOutput>, input: TInput): Promise<ExecutionTrace<TOutput>>;
}

export const createPipelineExecutor = (): PipelineExecutor => ({
  async execute<TInput, TOutput>(node: PipelineNode<TInput, TOutput>, input: TInput) {
    const startedAt = new Date().toISOString();
    const output = await node.execute(input);
    const finishedAt = new Date().toISOString();

    return {
      nodeId: node.id,
      output,
      startedAt,
      finishedAt,
    };
  },
});
