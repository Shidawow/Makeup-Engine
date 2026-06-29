export type MvpTrialContentSourceLabel = 'demo_fixture' | 'local_trial_content';

export interface MvpTrialTemplateStep {
  stepId: string;
  order: number;
  region: string;
  goal: string;
  instruction: string;
  beginnerTip: string;
  commonMistakes: string[];
  correctionTips: string[];
}

export interface MvpTrialTemplate {
  templateId: string;
  title: string;
  englishLabel?: string;
  summary: string;
  suitableScenarios: string[];
  targetUser: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  estimatedMinutes: number;
  toolsChecklist: string[];
  productPlaceholders: string[];
  steps: MvpTrialTemplateStep[];
  completionReview: string[];
  demoRiskNotes: string[];
  sourceLabel: MvpTrialContentSourceLabel;
  notFromAutomaticExtraction: true;
  humanReviewRecommended: true;
}

export interface MvpTrialContentPack {
  packId: string;
  title: string;
  purpose: string;
  templates: MvpTrialTemplate[];
  ordinaryUserDemoOrder: string[];
  templateStudioDemoOrder: string[];
  forbiddenClaims: string[];
  registryChainPausedAfter10U: true;
  trialContentNotOfficialTemplateLibrary: true;
  noRealUserPhotoIncluded: true;
  noRegistryWrite: true;
  noPublish: true;
}

export const countCompleteMvpTrialTemplates = (pack: MvpTrialContentPack): number =>
  pack.templates.filter(
    (template) =>
      Boolean(template.title) &&
      Boolean(template.summary) &&
      template.suitableScenarios.length > 0 &&
      template.toolsChecklist.length > 0 &&
      template.productPlaceholders.length > 0 &&
      template.steps.length > 0 &&
      template.steps.every(
        (step) =>
          Boolean(step.region) &&
          Boolean(step.goal) &&
          Boolean(step.instruction) &&
          Boolean(step.beginnerTip) &&
          step.commonMistakes.length > 0 &&
          step.correctionTips.length > 0,
      ) &&
      template.completionReview.length > 0 &&
      template.demoRiskNotes.length > 0 &&
      ['demo_fixture', 'local_trial_content'].includes(template.sourceLabel) &&
      template.notFromAutomaticExtraction &&
      template.humanReviewRecommended,
  ).length;
