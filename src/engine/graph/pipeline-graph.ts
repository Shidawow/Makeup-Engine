export interface PipelineNode<TInput = unknown, TOutput = unknown> {
  id: string;
  name: string;
  stage: string;
  dependsOn: string[];
  execute: (input: TInput) => Promise<TOutput> | TOutput;
}

export interface DependencyGraphNode {
  id: string;
  dependsOn: string[];
}

export interface ExecutionGraphNode {
  id: string;
  stage: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface LayerGraphNode {
  id: string;
  region: string;
  order: number;
  zIndex: number;
}

export interface EngineGraph {
  dependencyGraph: DependencyGraphNode[];
  executionGraph: ExecutionGraphNode[];
  layerGraph: LayerGraphNode[];
}

export const createEmptyEngineGraph = (): EngineGraph => ({
  dependencyGraph: [],
  executionGraph: [],
  layerGraph: [],
});
