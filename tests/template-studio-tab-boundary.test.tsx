import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisionAnalysisReadinessSummary } from '../src/components/demo/vision-analysis-demo/VisionAnalysisReadinessSummary';
import { FaceMeshMakeupIntelligencePanel } from '../src/components/template-studio/FaceMeshMakeupIntelligencePanel';
import { UserAppShell } from '../src/components/user-app';
import {
  faceMeshRegionQaBlockedExample,
  faceMeshRegionQaReadyExample,
  makeupAttributeCandidatesReadyExample,
  makeupTemplateDraftReadyExample,
  ruleBasedStepSequenceReadyExample,
} from '../src/templates/examples';

describe('Template Studio tab boundary', () => {
  it('keeps Vision Analysis focused on FaceMesh, Region QA, and readiness', () => {
    const html = renderToStaticMarkup(
      <VisionAnalysisReadinessSummary regionQa={faceMeshRegionQaReadyExample} />,
    );

    expect(html).toContain('视觉分析 readiness');
    expect(html).toContain('FaceMesh');
    expect(html).toContain('Region QA');
    expect(html).toContain('可以进入模板工作台生成/审核模板草稿。');
    expect(html).not.toContain('人工审核 checklist');
    expect(html).not.toContain('已作为模板库候选');
    expect(html).not.toContain('模板库候选包');
    expect(html).not.toContain('Candidate Handoff');
    expect(html).not.toContain('候选 App 包契约准备');
    expect(html).not.toContain('App Contract Validation');
    expect(html).not.toContain('用户 App 包草稿预览');
    expect(html).not.toContain('Preview Validation');
    expect(html).not.toContain('正式用户 App 包草稿闸门');
    expect(html).not.toContain('Gate Handoff');
    expect(html).not.toContain('正式用户 App 模板包草稿构建器');
    expect(html).not.toContain('Draft Builder');
    expect(html).not.toContain('Draft Validation');
    expect(html).not.toContain('用户 App 模板包草稿发布闸门');
    expect(html).not.toContain('Publish Gate');
    expect(html).not.toContain('用户 App 模板包 Registry 准备');
    expect(html).not.toContain('Registry Preparation');
    expect(html).not.toContain('用户 App 模板包 Registry 写入闸门');
    expect(html).not.toContain('Registry Write Gate');
    expect(html).not.toContain('受控 Registry 写入器草稿');
    expect(html).not.toContain('controlled registry writer');
    expect(html).not.toContain('显式 Registry 写入授权闸门');
    expect(html).not.toContain('explicit authorization gate');
    expect(html).not.toContain('受控 Registry 写入执行设计');
    expect(html).not.toContain('controlled execution design');
    expect(html).not.toContain('真实 Registry 写入实现闸门');
    expect(html).not.toContain('real write implementation gate');
    expect(html).not.toContain('真实 Registry 写入实现草稿');
    expect(html).not.toContain('real write implementation draft');
    expect(html).not.toContain('最终真实写入复核闸门');
    expect(html).not.toContain('final real write review gate');
    expect(html).not.toContain('真实写入执行授权');
    expect(html).not.toContain('real write execution authorization');
    expect(html).not.toContain('真实写入执行计划');
    expect(html).not.toContain('real write execution plan');
    expect(html).not.toContain('受保护真实写入执行模拟器');
    expect(html).not.toContain('guarded real write execution simulator');
    expect(html).not.toContain('受保护模拟器复核闸门');
    expect(html).not.toContain('guarded simulator review gate');
    expect(html).not.toContain('真实写入批准边界');
    expect(html).not.toContain('real write approval boundary');
    expect(html).not.toContain('Photo-to-Template Draft Integration');
    expect(html).not.toContain('Photo-to-Template Human Review Editing');
    expect(html).not.toContain('Photo-to-Template Operator Workflow');
    expect(html).not.toContain('Photo-to-Template Draft Preview QA');
    expect(html).not.toContain('Photo-to-Template Acceptance Trial');
    expect(html).not.toContain('Founder Demo Review');
    expect(html).not.toContain('semantic candidate → draft field binding matrix');
  });

  it('tells the template workbench to return to Vision Analysis when Region QA is blocked', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaBlockedExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('视觉分析质量不足，需回到视觉分析 Tab');
  });

  it('renders candidates, steps, draft QA, human review, candidate packaging, and app contract preparation in the template workbench', () => {
    const html = renderToStaticMarkup(
      <FaceMeshMakeupIntelligencePanel
        attributeCandidates={makeupAttributeCandidatesReadyExample}
        regionQa={faceMeshRegionQaReadyExample}
        stepSequence={ruleBasedStepSequenceReadyExample}
        templateDraft={makeupTemplateDraftReadyExample}
      />,
    );

    expect(html).toContain('妆容属性候选');
    expect(html).toContain('规则步骤草稿');
    expect(html).toContain('模板草稿摘要');
    expect(html).toContain('草稿 QA');
    expect(html).toContain('人工审核 checklist');
    expect(html).toContain('模板库候选包');
    expect(html).toContain('Candidate Validation');
    expect(html).toContain('Candidate Handoff');
    expect(html).toContain('候选 App 包契约准备');
    expect(html).toContain('App Contract Validation');
    expect(html).toContain('App Package Handoff');
    expect(html).toContain('用户 App 包草稿预览');
    expect(html).toContain('Preview Validation');
    expect(html).toContain('Preview Handoff');
    expect(html).toContain('正式用户 App 包草稿闸门');
    expect(html).toContain('Gate Handoff');
    expect(html).toContain('可进入正式包草稿构建器');
    expect(html).toContain('正式用户 App 模板包草稿构建器');
    expect(html).toContain('Draft Builder');
    expect(html).toContain('Draft Validation');
    expect(html).toContain('Draft Handoff');
    expect(html).toContain('用户 App 模板包草稿发布闸门');
    expect(html).toContain('Publish Gate');
    expect(html).toContain('可进入未来 registry 准备');
    expect(html).toContain('草稿，不是正式包');
    expect(html).toContain('不是正式 UserAppTemplatePackage');
    expect(html).toContain('不会写入用户 App 包 registry');
    expect(html).toContain('不会写入 registry');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('用户 App 模板包 Registry 准备');
    expect(html).toContain('Registry Entry Preview');
    expect(html).toContain('Registry Preparation Validation');
    expect(html).toContain('Registry Handoff');
    expect(html).toContain('只是 registry 准备，不是写入');
    expect(html).toContain('registry_preparation_blocked');
    expect(html).toContain('Registry preparation requires a ready Phase 10H draft publish gate');
    expect(html).toContain('用户 App 模板包 Registry 写入闸门');
    expect(html).toContain('只是写入前闸门，不是实际写入');
    expect(html).toContain('registry_write_gate_blocked');
    expect(html).toContain(
      'Registry write gate requires a ready Phase 10I registry preparation validation result',
    );
    expect(html).toContain('受控 Registry 写入器草稿');
    expect(html).toContain('dry-run only');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('writer_draft_blocked');
    expect(html).toContain(
      'Controlled writer draft requires a ready Phase 10J registry write gate',
    );
    expect(html).toContain('显式 Registry 写入授权闸门');
    expect(html).toContain('Authorization Checklist');
    expect(html).toContain('未来真实写入仍需老板单独授权');
    expect(html).toContain('explicit_authorization_gate_blocked');
    expect(html).toContain(
      'Explicit authorization gate requires a ready Phase 10K writer validation result',
    );
    expect(html).toContain('受控 Registry 写入执行设计');
    expect(html).toContain('design / dry-run only');
    expect(html).toContain('未来真实执行仍需老板单独授权');
    expect(html).toContain('execution_design_blocked');
    expect(html).toContain(
      'Execution design requires a ready Phase 10L explicit authorization gate',
    );
    expect(html).toContain('真实 Registry 写入实现闸门');
    expect(html).toContain('不是 production writer');
    expect(html).toContain('未来真实实现仍需老板单独授权');
    expect(html).toContain('real_write_implementation_gate_blocked');
    expect(html).toContain(
      'Implementation gate requires a ready Phase 10M execution validation result',
    );
    expect(html).toContain('真实 Registry 写入实现草稿');
    expect(html).toContain('Writer Interface');
    expect(html).toContain('Transaction');
    expect(html).toContain('Write Lock');
    expect(html).toContain('Audit Event');
    expect(html).toContain('Rollback Command');
    expect(html).toContain('不是 production writer');
    expect(html).toContain('未来真实 writer 仍需老板单独授权');
    expect(html).toContain('implementation_draft_blocked');
    expect(html).toContain(
      'Implementation draft requires a ready Phase 10N implementation gate',
    );
    expect(html).toContain('最终真实写入复核闸门');
    expect(html).toContain('老板授权范围：只授权进入复核闸门');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('Final Review Checklist');
    expect(html).toContain('Final Review Handoff');
    expect(html).toContain('final_real_write_review_gate_blocked');
    expect(html).toContain(
      'Final real write review gate requires a ready Phase 10O implementation draft validation result',
    );
    expect(html).toContain('真实写入执行授权');
    expect(html).toContain('老板授权范围：只授权进入 10Q 授权阶段');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不授权发布');
    expect(html).toContain('不授权替换当前用户 App 包');
    expect(html).toContain('不授权创建 production writer');
    expect(html).toContain('不是实际写入');
    expect(html).toContain('Authorization Checklist');
    expect(html).toContain('Authorization Handoff');
    expect(html).toContain('real_write_execution_authorization_blocked');
    expect(html).toContain(
      'Real write execution authorization requires a ready Phase 10P final review gate',
    );
    expect(html).toContain('真实写入执行计划');
    expect(html).toContain('执行计划，不是实际写入');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('Execution sequence');
    expect(html).toContain('Preflight');
    expect(html).toContain('Write Lock');
    expect(html).toContain('Audit');
    expect(html).toContain('Rollback');
    expect(html).toContain('Failure Handling');
    expect(html).toContain('Dry-run Verification');
    expect(html).toContain('execution_plan_blocked');
    expect(html).toContain(
      'Real write execution plan requires a ready Phase 10Q execution authorization',
    );
    expect(html).toContain('受保护真实写入执行模拟器');
    expect(html).toContain('模拟器，不是实际写入');
    expect(html).toContain('不 mutation registry');
    expect(html).toContain('Simulated Preflight');
    expect(html).toContain('Simulated Write Lock');
    expect(html).toContain('Simulated Write Operation');
    expect(html).toContain('Simulated Audit Events');
    expect(html).toContain('Simulated Rollback');
    expect(html).toContain('Simulated Failure Handling');
    expect(html).toContain('simulation_blocked');
    expect(html).toContain(
      'Guarded real write execution simulator requires a ready Phase 10R execution plan validation',
    );
    expect(html).toContain('受保护模拟器复核闸门');
    expect(html).toContain('复核闸门，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('simulated preflight review');
    expect(html).toContain('simulated write lock review');
    expect(html).toContain('simulated write operation review');
    expect(html).toContain('simulated audit events review');
    expect(html).toContain('simulated rollback review');
    expect(html).toContain('simulated failure handling review');
    expect(html).toContain('simulator_review_gate_blocked');
    expect(html).toContain(
      'Guarded simulator review gate requires Phase 10S simulation validation ready',
    );
    expect(html).toContain('真实写入批准边界');
    expect(html).toContain('批准边界，不是实际写入');
    expect(html).toContain('不授权真实写入 registry');
    expect(html).toContain('不 mutation registry');
    expect(html).toContain('不发布');
    expect(html).toContain('不替换当前用户 App 包');
    expect(html).toContain('不创建 production writer');
    expect(html).toContain('未来真实写入仍需老板单独明确授权');
    expect(html).toContain('Approval Checklist');
    expect(html).toContain('audit requirements');
    expect(html).toContain('rollback approval requirements');
    expect(html).toContain('real_write_approval_boundary_blocked');
    expect(html).toContain(
      'Real write approval boundary requires Phase 10T simulator review gate ready',
    );
    expect(html).toContain('Photo-to-Template Draft Integration');
    expect(html).toContain('semantic candidate → draft field binding matrix');
    expect(html).toContain('Photo-to-Template Human Review Editing');
    expect(html).toContain('本地人工编辑草稿');
    expect(html).toContain('接受候选也只是进入草稿');
    expect(html).toContain('不能发布 / 不能写 registry');
    expect(html).toContain('Photo-to-Template Operator Workflow');
    expect(html).toContain('Workflow stepper / checklist');
    expect(html).toContain('当前是 operator workflow，不是用户 App 页面');
    expect(html).toContain('Photo-to-Template Draft Preview QA');
    expect(html).toContain('User-visible draft fields QA');
    expect(html).toContain('当前是 draft preview，不是 publish');
    expect(html).toContain('不会生成真实 UserAppTemplatePackage');
    expect(html).toContain('Photo-to-Template Acceptance Trial');
    expect(html).toContain('Acceptance Trial，不是发布');
    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('Demo Route A - User App MVP');
    expect(html).toContain('Founder Demo Review');
    expect(html).toContain('Founder Demo Review，不是发布');
    expect(html).toContain('当前仍是 MVP trial content');
    expect(html).toContain('当前内容可用于演示，不是正式模板库');
    expect(html).toContain('不能写 registry / 不能 publish');
    expect(html).toContain('新手通勤淡妆');
    expect(html).toContain('日系温柔约会妆');
    expect(html).toContain('韩系清透低饱和妆');
    expect(html).not.toContain('AI 已确认');
    expect(html).not.toContain('已生成正式用户模板包');
    expect(html).not.toContain('已生成正式 UserAppTemplatePackage');
    expect(html).not.toContain('已授权真实写入');
    expect(html).not.toContain('已可执行真实写入');
    expect(html).not.toContain('已可真实写入');
    expect(html).not.toContain('已实现真实写入');
    expect(html).not.toContain('已创建 production writer');
    expect(html).not.toContain('已 mutation registry');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('发布成功');
  });

  it('does not expose backend review terminology in the ordinary user path', () => {
    const html = renderToStaticMarkup(<UserAppShell packageData={null} />);
    const userPath = html.split('管理员检查')[0] ?? html;

    expect(userPath).not.toContain('视觉分析');
    expect(userPath).not.toContain('模板工作台');
    expect(userPath).not.toContain('草稿 QA');
    expect(userPath).not.toContain('人工审核');
    expect(userPath).not.toContain('模板库候选包');
    expect(userPath).not.toContain('candidate packaging');
    expect(userPath).not.toContain('候选 App 包契约准备');
    expect(userPath).not.toContain('candidate-to-app');
    expect(userPath).not.toContain('App Contract Validation');
    expect(userPath).not.toContain('用户 App 包草稿预览');
    expect(userPath).not.toContain('Preview Validation');
    expect(userPath).not.toContain('draft preview');
    expect(userPath).not.toContain('正式用户 App 包草稿闸门');
    expect(userPath).not.toContain('Gate Handoff');
    expect(userPath).not.toContain('official draft gate');
    expect(userPath).not.toContain('正式用户 App 模板包草稿构建器');
    expect(userPath).not.toContain('Draft Builder');
    expect(userPath).not.toContain('official UserAppTemplatePackage draft builder');
    expect(userPath).not.toContain('用户 App 模板包草稿发布闸门');
    expect(userPath).not.toContain('Publish Gate');
    expect(userPath).not.toContain('draft publish gate');
    expect(userPath).not.toContain('用户 App 模板包 Registry 准备');
    expect(userPath).not.toContain('Registry Preparation');
    expect(userPath).not.toContain('registry preparation');
    expect(userPath).not.toContain('用户 App 模板包 Registry 写入闸门');
    expect(userPath).not.toContain('Registry Write Gate');
    expect(userPath).not.toContain('registry write gate');
    expect(userPath).not.toContain('受控 Registry 写入器草稿');
    expect(userPath).not.toContain('controlled registry writer');
    expect(userPath).not.toContain('Writer Draft');
    expect(userPath).not.toContain('显式 Registry 写入授权闸门');
    expect(userPath).not.toContain('explicit authorization gate');
    expect(userPath).not.toContain('Authorization Checklist');
    expect(userPath).not.toContain('受控 Registry 写入执行设计');
    expect(userPath).not.toContain('controlled execution design');
    expect(userPath).not.toContain('Execution Design');
    expect(userPath).not.toContain('真实 Registry 写入实现闸门');
    expect(userPath).not.toContain('real write implementation gate');
    expect(userPath).not.toContain('Implementation Gate');
    expect(userPath).not.toContain('真实 Registry 写入实现草稿');
    expect(userPath).not.toContain('real write implementation draft');
    expect(userPath).not.toContain('Implementation Draft');
    expect(userPath).not.toContain('最终真实写入复核闸门');
    expect(userPath).not.toContain('final real write review gate');
    expect(userPath).not.toContain('Final Review Checklist');
    expect(userPath).not.toContain('Final Review Handoff');
    expect(userPath).not.toContain('真实写入执行授权');
    expect(userPath).not.toContain('real write execution authorization');
    expect(userPath).not.toContain('Authorization Handoff');
    expect(userPath).not.toContain('真实写入执行计划');
    expect(userPath).not.toContain('real write execution plan');
    expect(userPath).not.toContain('受保护真实写入执行模拟器');
    expect(userPath).not.toContain('guarded real write execution simulator');
    expect(userPath).not.toContain('guarded execution simulator');
    expect(userPath).not.toContain('受保护模拟器复核闸门');
    expect(userPath).not.toContain('guarded simulator review gate');
    expect(userPath).not.toContain('simulator review gate');
    expect(userPath).not.toContain('真实写入批准边界');
    expect(userPath).not.toContain('real write approval boundary');
    expect(userPath).not.toContain('Approval Checklist');
    expect(userPath).not.toContain('production writer');
    expect(userPath).not.toContain('Photo-to-Template Draft Integration');
    expect(userPath).not.toContain('Photo-to-Template Human Review Editing');
    expect(userPath).not.toContain('Photo-to-Template Operator Workflow');
    expect(userPath).not.toContain('Photo-to-Template Draft Preview QA');
    expect(userPath).not.toContain('Photo-to-Template Acceptance Trial');
    expect(userPath).not.toContain('Founder Demo Review');
    expect(userPath).not.toContain('MVP trial content');
    expect(userPath).not.toContain('trial content pack');
    expect(userPath).not.toContain('sourceLabel');
    expect(userPath).not.toContain('demo_fixture');
    expect(userPath).not.toContain('notFromAutomaticExtraction');
    expect(userPath).not.toContain('humanReviewRecommended');
    expect(userPath).not.toContain('Operator Workflow');
    expect(userPath).not.toContain('Draft Preview QA');
    expect(userPath).not.toContain('Acceptance Trial');
    expect(userPath).not.toContain('semantic candidate');
    expect(userPath).not.toContain('confidence band');
    expect(userPath).not.toContain('reviewer note');
    expect(userPath).not.toContain('sourceType');
    expect(userPath).not.toContain('confidenceBand');
    expect(userPath).not.toContain('evidence');
    expect(userPath).not.toContain('limitations');
    expect(userPath).not.toContain('reviewerDecision');
    expect(userPath).not.toContain('humanReviewRequired');
    expect(userPath).not.toContain('notFinal');
  });
});
