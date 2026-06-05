import type { FaceFeatures } from '../../intelligence/types';
import type { MakeupLook } from '../../schema/makeup.schema';
import type {
  BeautyScoreResult,
  FaceAnalysisResult,
  MakeupPlan,
  RenderInstruction,
  StyleInferenceResult,
} from '../contracts';
import type { EngineGraph } from '../graph';
import { createEmptyEngineGraph } from '../graph';
import type {
  AnalyzeFaceStage,
  AnalyzeBeautyStage,
  InferStyleStage,
  BuildMakeupPlanStage,
  CompileLayersStage,
  RenderPreviewStage,
} from '../stages';
import type { IRenderRuntime, RuntimeLifecycle, RenderFrame } from '../runtime';

export interface EnginePipelineContext {
  input: {
    faceFeatures: FaceFeatures;
    look: MakeupLook;
  };
  faceAnalysis?: FaceAnalysisResult;
  beautyScore?: BeautyScoreResult;
  styleInference?: StyleInferenceResult;
  plan?: MakeupPlan;
  renderInstructions?: RenderInstruction[];
  renderFrame?: RenderFrame;
}

export interface MakeupEngineOptions {
  runtime: IRenderRuntime;
  analyzeFaceStage: AnalyzeFaceStage;
  analyzeBeautyStage: AnalyzeBeautyStage;
  inferStyleStage: InferStyleStage;
  buildMakeupPlanStage: BuildMakeupPlanStage;
  compileLayersStage: CompileLayersStage;
  renderPreviewStage: RenderPreviewStage;
}

export class MakeupEngine implements RuntimeLifecycle {
  private readonly runtime: IRenderRuntime;

  private readonly analyzeFaceStage: AnalyzeFaceStage;

  private readonly analyzeBeautyStage: AnalyzeBeautyStage;

  private readonly inferStyleStage: InferStyleStage;

  private readonly buildMakeupPlanStage: BuildMakeupPlanStage;

  private readonly compileLayersStage: CompileLayersStage;

  private readonly renderPreviewStage: RenderPreviewStage;

  private state: 'idle' | 'running' | 'stopped' = 'idle';

  private graph: EngineGraph = createEmptyEngineGraph();

  constructor(options: MakeupEngineOptions) {
    this.runtime = options.runtime;
    this.analyzeFaceStage = options.analyzeFaceStage;
    this.analyzeBeautyStage = options.analyzeBeautyStage;
    this.inferStyleStage = options.inferStyleStage;
    this.buildMakeupPlanStage = options.buildMakeupPlanStage;
    this.compileLayersStage = options.compileLayersStage;
    this.renderPreviewStage = options.renderPreviewStage;
  }

  async start(): Promise<void> {
    if (this.state === 'running') {
      return;
    }

    await this.runtime.init();
    this.state = 'running';
  }

  async stop(): Promise<void> {
    if (this.state === 'stopped') {
      return;
    }

    await this.runtime.destroy();
    this.state = 'stopped';
  }

  getGraph = (): EngineGraph => this.graph;

  async run(input: EnginePipelineContext['input']) {
    await this.start();

    const faceAnalysis = await this.analyzeFaceStage.execute({
      features: input.faceFeatures,
      source: 'manual',
    });
    const beautyScore = await this.analyzeBeautyStage.execute(faceAnalysis);
    const styleInference = await this.inferStyleStage.execute(faceAnalysis);
    const plan = await this.buildMakeupPlanStage.execute({
      look: input.look,
      faceAnalysis,
      beautyScore,
      styleInference,
    });
    const renderInstructions = await this.compileLayersStage.execute(plan);
    const renderFrame = await this.renderPreviewStage.execute(renderInstructions);

    this.graph = {
      dependencyGraph: [
        { id: 'analyzeFace', dependsOn: [] },
        { id: 'analyzeBeauty', dependsOn: ['analyzeFace'] },
        { id: 'inferStyle', dependsOn: ['analyzeFace'] },
        { id: 'buildMakeupPlan', dependsOn: ['analyzeFace', 'analyzeBeauty', 'inferStyle'] },
        { id: 'compileLayers', dependsOn: ['buildMakeupPlan'] },
        { id: 'renderPreview', dependsOn: ['compileLayers'] },
      ],
      executionGraph: [
        { id: 'analyzeFace', stage: 'analyzeFace', status: 'completed' },
        { id: 'analyzeBeauty', stage: 'analyzeBeauty', status: 'completed' },
        { id: 'inferStyle', stage: 'inferStyle', status: 'completed' },
        { id: 'buildMakeupPlan', stage: 'buildMakeupPlan', status: 'completed' },
        { id: 'compileLayers', stage: 'compileLayers', status: 'completed' },
        { id: 'renderPreview', stage: 'renderPreview', status: 'completed' },
      ],
      layerGraph: renderInstructions.map((instruction) => ({
        id: instruction.layer.id,
        region: instruction.region,
        order: instruction.layer.order,
        zIndex: instruction.layer.zIndex,
      })),
    };

    return {
      faceAnalysis,
      beautyScore,
      styleInference,
      plan,
      renderInstructions,
      renderFrame,
    };
  }
}
