import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CandidateToAppPackageContractPanel } from '../src/components/template-studio/CandidateToAppPackageContractPanel';
import {
  candidateToAppPackageContractMissingHumanReviewExample,
  candidateToAppPackageContractReadyExample,
  candidateToAppPackageHandoffBlockedExample,
  candidateToAppPackageHandoffReadyExample,
  candidateToAppPackageValidationMissingHumanReviewExample,
  candidateToAppPackageValidationReadyExample,
} from '../src/templates/examples';

describe('CandidateToAppPackageContractPanel', () => {
  it('renders contract preparation, validation, handoff, and preview-only boundaries', () => {
    const html = renderToStaticMarkup(
      <CandidateToAppPackageContractPanel
        handoff={candidateToAppPackageHandoffReadyExample}
        preparation={candidateToAppPackageContractReadyExample}
        validation={candidateToAppPackageValidationReadyExample}
      />,
    );

    expect(html).toContain('候选 App 包契约准备');
    expect(html).toContain('Contract Preparation');
    expect(html).toContain('App Contract Validation');
    expect(html).toContain('App Package Handoff');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
    expect(html).toContain('不会自动生成用户 App 模板包');
    expect(html).toContain('ready_for_user_app_package_draft');
    expect(html).toContain('Mapping Preview');
    expect(html).not.toContain('已生成正式 UserAppTemplatePackage');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked state when approved candidate package is missing', () => {
    const html = renderToStaticMarkup(
      <CandidateToAppPackageContractPanel
        handoff={candidateToAppPackageHandoffBlockedExample}
        preparation={candidateToAppPackageContractMissingHumanReviewExample}
        validation={candidateToAppPackageValidationMissingHumanReviewExample}
      />,
    );

    expect(html).toContain('contract_preparation_blocked');
    expect(html).toContain('Approved human review trace is required');
    expect(html).toContain('candidate_to_app_handoff_blocked');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
  });
});
