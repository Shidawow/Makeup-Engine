import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisDemo } from '../src/components/demo/vision-analysis-demo/VisionAnalysisDemo';
import { TemplateStudio } from '../src/components/template-studio/TemplateStudio';

describe('MediaPipe fallback copy', () => {
  it('explains public/mediapipe recovery and development fallback in Template Studio', () => {
    const html = renderToStaticMarkup(<TemplateStudio />);

    expect(html).toContain('MediaPipe 本地资源要求');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/');
    expect(html).toContain('自动 fallback 到 mock vision provider');
  });

  it('explains public/mediapipe recovery and development fallback in the vision demo', () => {
    const html = renderToStaticMarkup(<VisionAnalysisDemo />);

    expect(html).toContain('真实 FaceMesh 需要');
    expect(html).toContain('public/mediapipe/face_landmarker.task');
    expect(html).toContain('public/mediapipe/wasm/');
    expect(html).toContain('localhost 开发环境会自动 fallback 到 mock vision provider');
  });
});
