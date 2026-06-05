import { stableStringify } from '../../templates/storage/datasetExport';
import type { LightweightSegmentationClassifier } from '../schema';
import type {
  OnnxExportPrototype,
  OnnxExportPrototypeManifest,
  OnnxGraphPrototype,
  OnnxNodePrototype,
  OnnxTensorSpec,
} from '../schema/onnx-export-prototype.schema';
import { ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION } from '../schema/onnx-export-prototype.schema';

export interface OnnxPrototypeWriterAdapter {
  mkdirp(path: string): Promise<void>;
  writeFile(path: string, content: string): Promise<void>;
}

const checksumText = (content: string): string => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

export const createOnnxGraphPrototypeForRegion = (
  model: LightweightSegmentationClassifier,
  regionId: string,
): OnnxGraphPrototype => {
  const classifier = model.regionClassifiers[regionId as keyof typeof model.regionClassifiers];
  const nodes: OnnxNodePrototype[] = [
    { nodeId: `${regionId}-features`, opType: 'FeatureInput', inputs: ['pixel_feature_matrix'], outputs: [`${regionId}_features`] },
    {
      nodeId: `${regionId}-score`,
      opType: model.classifierKind === 'logistic-linear' ? 'Linear' : 'NearestCentroidDistance',
      inputs: [`${regionId}_features`],
      outputs: [`${regionId}_score`],
      attributes: { classifierKind: model.classifierKind, featureNames: classifier?.featureNames ?? model.featureConfig.featureNames },
    },
    { nodeId: `${regionId}-alpha`, opType: model.classifierKind === 'logistic-linear' ? 'Sigmoid' : 'ThresholdToAlpha', inputs: [`${regionId}_score`], outputs: [`${regionId}_alpha`] },
  ];
  return {
    graphId: `onnx-graph-${model.modelId}-${regionId}`,
    regionId,
    nodes,
    inputs: [
      { name: 'pixel_feature_matrix', dataType: 'float32', shape: ['pixelCount', model.featureConfig.featureNames.length], description: 'Feature matrix produced by the training bridge' },
      { name: 'region_id', dataType: 'string', shape: [1], description: 'Cosmetic region id' },
    ],
    outputs: [
      { name: `${regionId}_alpha`, dataType: 'float32', shape: ['height', 'width'], description: 'Prototype alpha grid output' },
    ],
    initializers: model.featureConfig.featureNames.map((featureName) => ({
      name: `${regionId}_${featureName}_weight`,
      dataType: 'float32' as const,
      dims: [1],
      checksum: checksumText(`${regionId}:${featureName}:${classifier?.featureWeights?.[featureName] ?? 0}`),
    })),
  };
};

export const createOnnxExportPrototypeFromLightweightClassifier = (
  model: LightweightSegmentationClassifier,
): OnnxExportPrototype => {
  const graphs = [...model.trainedRegions].sort().map((regionId) =>
    createOnnxGraphPrototypeForRegion(model, regionId),
  );
  const base = {
    schemaVersion: ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION,
    prototypeId: `onnx-prototype-${model.modelId}`,
    modelId: model.modelId,
    modelVersion: model.modelVersion,
    classifierKind: model.classifierKind,
    graphs,
    tensorSpec: {
      inputs: graphs[0]?.inputs ?? [],
      outputs: graphs.flatMap((graph) => graph.outputs),
    },
    readiness: {
      status: 'prototype-only' as const,
      reasons: ['JSON graph prototype only; no .onnx binary is emitted'],
    },
    limitations: [
      { code: 'no-onnx-binary', message: 'Phase 6G does not emit a binary ONNX graph' },
      { code: 'no-onnx-runtime-validation', message: 'Phase 6G does not run ONNX Runtime' },
    ],
  };
  return { ...base, checksum: checksumText(stableStringify(base)) };
};

export const validateOnnxExportPrototype = (
  prototype: OnnxExportPrototype,
): string[] => [
  ...(prototype.schemaVersion !== ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION ? ['invalid onnx prototype schemaVersion'] : []),
  ...(prototype.graphs.length === 0 ? ['onnx prototype requires at least one region graph'] : []),
];

export const summarizeOnnxExportPrototype = (
  prototype: OnnxExportPrototype,
): string =>
  `${prototype.prototypeId}:graphs=${prototype.graphs.length}:readiness=${prototype.readiness.status}`;

export const exportOnnxPrototypeJson = (
  prototype: OnnxExportPrototype,
): string => stableStringify(prototype);

export const createOnnxExportPrototypeManifest = (
  prototype: OnnxExportPrototype,
): OnnxExportPrototypeManifest => ({
  schemaVersion: ONNX_EXPORT_PROTOTYPE_SCHEMA_VERSION,
  prototypeId: prototype.prototypeId,
  modelId: prototype.modelId,
  entries: [
    { entryId: 'onnx-prototype-json', relativePath: 'onnx-prototype.json', checksum: prototype.checksum },
    { entryId: 'tensor-spec-json', relativePath: 'tensor-spec.json', checksum: checksumText(stableStringify(prototype.tensorSpec)) },
    { entryId: 'limitations-json', relativePath: 'limitations.json', checksum: checksumText(stableStringify(prototype.limitations)) },
  ],
});

export const writeOnnxExportPrototype = async (input: {
  adapter: OnnxPrototypeWriterAdapter;
  outDir: string;
  model: LightweightSegmentationClassifier;
}): Promise<OnnxExportPrototype> => {
  const prototype = createOnnxExportPrototypeFromLightweightClassifier(input.model);
  const manifest = createOnnxExportPrototypeManifest(prototype);
  await input.adapter.mkdirp(input.outDir);
  await input.adapter.writeFile(`${input.outDir}/onnx-prototype.json`, `${stableStringify(prototype)}\n`);
  await input.adapter.writeFile(`${input.outDir}/onnx-prototype-manifest.json`, `${stableStringify(manifest)}\n`);
  await input.adapter.writeFile(`${input.outDir}/tensor-spec.json`, `${stableStringify(prototype.tensorSpec)}\n`);
  await input.adapter.writeFile(`${input.outDir}/limitations.json`, `${stableStringify(prototype.limitations)}\n`);
  return prototype;
};
