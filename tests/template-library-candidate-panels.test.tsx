import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TemplateLibraryCandidatePackagingPanel } from '../src/components/template-studio/TemplateLibraryCandidatePackagingPanel';
import {
  templateLibraryCandidateHandoffBlockedExample,
  templateLibraryCandidateHandoffReadyExample,
  templateLibraryCandidatePackageMissingHumanReviewExample,
  templateLibraryCandidatePackageReadyExample,
  templateLibraryCandidateValidationMissingHumanReviewExample,
  templateLibraryCandidateValidationReadyExample,
} from '../src/templates/examples';

describe('TemplateLibraryCandidatePackagingPanel', () => {
  it('renders candidate package, validation, and handoff boundaries', () => {
    const html = renderToStaticMarkup(
      <TemplateLibraryCandidatePackagingPanel
        candidatePackage={templateLibraryCandidatePackageReadyExample}
        handoff={templateLibraryCandidateHandoffReadyExample}
        validation={templateLibraryCandidateValidationReadyExample}
      />,
    );

    expect(html).toContain('模板库候选包');
    expect(html).toContain('Candidate Package');
    expect(html).toContain('Candidate Validation');
    expect(html).toContain('Candidate Handoff');
    expect(html).toContain('仍为候选模板');
    expect(html).toContain('不会自动生成 UserAppTemplatePackage');
    expect(html).toContain('ready_for_candidate_library_review');
    expect(html).not.toContain('发布成功');
    expect(html).not.toContain('自动生成用户模板包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('AI 自动确认');
  });

  it('shows blocked reason when human review approval is missing', () => {
    const html = renderToStaticMarkup(
      <TemplateLibraryCandidatePackagingPanel
        candidatePackage={templateLibraryCandidatePackageMissingHumanReviewExample}
        handoff={templateLibraryCandidateHandoffBlockedExample}
        validation={templateLibraryCandidateValidationMissingHumanReviewExample}
      />,
    );

    expect(html).toContain('candidate_package_blocked');
    expect(html).toContain('Candidate package requires approved human review decision');
    expect(html).toContain('candidate_handoff_blocked');
  });
});
