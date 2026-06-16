import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisDemo } from '../src/components/demo/vision-analysis-demo/VisionAnalysisDemo';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';
import {
  MediaPipeLocalAssetMissingError,
  formatVisionAnalysisErrorForUser,
} from '../src/vision';

describe('MediaPipe fallback copy', () => {
  it('explains public/mediapipe recovery and development fallback in Template Studio', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('MediaPipe 本地资源要求');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/vision_wasm_internal.js');
    expect(html).toContain('资源缺失');
    expect(html).toContain('MediaPipe model/wasm 文件已放回 public/mediapipe');
    expect(html).not.toContain('自动 fallback 到 mock vision provider');
    expect(html).not.toContain('模板工作台分析失败。');
  });

  it('explains public/mediapipe recovery and development fallback in the vision demo', () => {
    const html = renderToStaticMarkup(<VisionAnalysisDemo />);

    expect(html).toContain('真实 FaceMesh 需要');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/vision_wasm_internal.js');
    expect(html).toContain('资源缺失时页面会显示明确错误原因和恢复说明');
    expect(html).toContain('MediaPipe model/wasm 文件已放回 public/mediapipe');
    expect(html).not.toContain('localhost 开发环境会自动 fallback 到 mock vision provider');
    expect(html).not.toContain('FaceMesh 分析失败。');
  });

  it('shows a recovery hint for missing MediaPipe assets instead of generic failure', () => {
    const message = formatVisionAnalysisErrorForUser(
      new MediaPipeLocalAssetMissingError('/mediapipe/face_landmarker.task'),
    );

    expect(message).toContain('缺少本地 MediaPipe 资源');
    expect(message).toContain('/mediapipe/face_landmarker.task');
    expect(message).toContain('/mediapipe/wasm/vision_wasm_internal.js');
    expect(message).toContain('localhost 环境会 fallback 到 mock vision provider');
    expect(message).toContain('请把 MediaPipe model/wasm 文件放回 public/mediapipe');
    expect(message).not.toBe('FaceMesh 分析失败。');
    expect(message).not.toBe('模板工作台分析失败。');
  });

  it('uses an actionable mask-panel fallback when no error details are available', () => {
    const message = formatVisionAnalysisErrorForUser(undefined);

    expect(message).toContain('缺少本地 MediaPipe 资源');
    expect(message).toContain('/mediapipe/face_landmarker.task');
    expect(message).toContain('/mediapipe/wasm/vision_wasm_internal.js');
    expect(message).toContain('localhost 环境会 fallback 到 mock vision provider');
    expect(message).not.toBe('FaceMesh 分析失败。');
    expect(message).not.toBe('模板工作台分析失败。');
  });
});
