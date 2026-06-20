import type { FaceMeshRegionQaReport } from '../../vision';
import {
  buildTemplateStudioWorkflowState,
  createControlledRegistryWriteExecutionDesign,
  createControlledRegistryWriteExecutionHandoff,
  createControlledUserAppTemplatePackageRegistryWriterDraft,
  createControlledUserAppTemplatePackageRegistryWriterHandoff,
  createExplicitRegistryWriteAuthorizationChecklist,
  createExplicitRegistryWriteAuthorizationGate,
  createExplicitRegistryWriteAuthorizationHandoff,
  createRealRegistryWriteImplementationChecklist,
  createRealRegistryWriteImplementationDraft,
  createRealRegistryWriteImplementationDraftHandoff,
  createRealRegistryWriteImplementationGate,
  createRealRegistryWriteImplementationHandoff,
  buildOfficialUserAppTemplatePackageDraft,
  createCandidateToAppPackageContractPreparation,
  createCandidateToAppPackageHandoff,
  createOfficialUserAppTemplatePackageDraftHandoff,
  createOfficialUserAppPackageDraftGate,
  createOfficialUserAppPackageDraftGateHandoff,
  createUserAppPackageDraftPreview,
  createUserAppPackageDraftPreviewHandoff,
  createUserAppTemplatePackageDraftPublishGate,
  createUserAppTemplatePackageDraftPublishGateHandoff,
  createUserAppTemplatePackageRegistryPreparation,
  createUserAppTemplatePackageRegistryPreparationHandoff,
  createUserAppTemplatePackageRegistryWriteGate,
  createUserAppTemplatePackageRegistryWriteGateHandoff,
  createTemplateLibraryCandidateHandoff,
  createTemplateLibraryCandidatePackage,
  createTemplateDraftReviewWorkflow,
  evaluateTemplateDraftHumanReview,
  evaluateTemplateDraftQa,
  MakeupAttributeCandidateReport,
  MakeupTemplateDraftReport,
  RuleBasedStepSequence,
  validateCandidateToAppPackageContract,
  validateControlledRegistryWriteExecutionDesign,
  validateControlledUserAppTemplatePackageRegistryWriterDraft,
  validateRealRegistryWriteImplementationDraft,
  validateOfficialUserAppTemplatePackageDraft,
  validateUserAppPackageDraftPreview,
  validateUserAppTemplatePackageRegistryPreparation,
  validateTemplateLibraryCandidatePackage,
} from '../../template-engine';
import type {
  TemplateDraftHumanReview,
  TemplateDraftQaResult,
  TemplateDraftReviewWorkflow,
  TemplateStudioWorkflowReport,
} from '../../template-engine';
import { TemplateDraftReviewWorkflowPanel } from './TemplateDraftReviewWorkflowPanel';
import { TemplateLibraryCandidatePackagingPanel } from './TemplateLibraryCandidatePackagingPanel';
import { CandidateToAppPackageContractPanel } from './CandidateToAppPackageContractPanel';
import { UserAppPackageDraftPreviewPanel } from './UserAppPackageDraftPreviewPanel';
import { OfficialUserAppPackageDraftGatePanel } from './OfficialUserAppPackageDraftGatePanel';
import { OfficialUserAppTemplatePackageDraftBuilderPanel } from './OfficialUserAppTemplatePackageDraftBuilderPanel';
import { UserAppTemplatePackageDraftPublishGatePanel } from './UserAppTemplatePackageDraftPublishGatePanel';
import { UserAppTemplatePackageRegistryPreparationPanel } from './UserAppTemplatePackageRegistryPreparationPanel';
import { UserAppTemplatePackageRegistryWriteGatePanel } from './UserAppTemplatePackageRegistryWriteGatePanel';
import { ControlledUserAppTemplatePackageRegistryWriterDraftPanel } from './ControlledUserAppTemplatePackageRegistryWriterDraftPanel';
import { ExplicitRegistryWriteAuthorizationGatePanel } from './ExplicitRegistryWriteAuthorizationGatePanel';
import { ControlledRegistryWriteExecutionDesignPanel } from './ControlledRegistryWriteExecutionDesignPanel';
import { RealRegistryWriteImplementationGatePanel } from './RealRegistryWriteImplementationGatePanel';
import { RealRegistryWriteImplementationDraftPanel } from './RealRegistryWriteImplementationDraftPanel';

export interface FaceMeshMakeupIntelligencePanelProps {
  regionQa: FaceMeshRegionQaReport | null;
  attributeCandidates: MakeupAttributeCandidateReport | null;
  stepSequence: RuleBasedStepSequence | null;
  templateDraft: MakeupTemplateDraftReport | null;
  draftQa?: TemplateDraftQaResult | null;
  humanReview?: TemplateDraftHumanReview | null;
  reviewWorkflow?: TemplateDraftReviewWorkflow | null;
  studioWorkflow?: TemplateStudioWorkflowReport | null;
}

const statusLabel: Record<string, string> = {
  region_qa_ready: '区域 QA 就绪',
  region_qa_ready_with_warnings: '区域 QA 有警告',
  region_qa_blocked: '区域 QA 阻断',
  candidates_ready: '候选属性就绪',
  candidates_ready_with_warnings: '候选属性有警告',
  candidates_blocked: '候选属性阻断',
  steps_ready: '草稿步骤就绪',
  steps_ready_with_warnings: '草稿步骤有警告',
  steps_blocked: '草稿步骤阻断',
  draft_ready: '模板草稿就绪',
  draft_ready_with_warnings: '模板草稿有警告',
  draft_blocked: '模板草稿阻断',
};

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

export function FaceMeshMakeupIntelligencePanel({
  regionQa,
  attributeCandidates,
  stepSequence,
  templateDraft,
  draftQa,
  humanReview,
  reviewWorkflow,
  studioWorkflow,
}: FaceMeshMakeupIntelligencePanelProps) {
  if (!regionQa || !attributeCandidates || !stepSequence || !templateDraft) {
    return (
      <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
        <h2 className="text-base font-semibold">FaceMesh 妆容智能基线</h2>
        <p className="mt-2 text-sm text-stone-500">
          运行真实 FaceMesh 分析后，这里会显示区域 QA、妆容属性候选、规则步骤和模板草稿。所有输出都只是候选 / 草稿，需要人工审核。
        </p>
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">模板草稿审核工作流</p>
          <p className="mt-1 text-xs leading-5">
            先完成视觉分析和区域 QA；区域就绪后，模板工作台会进入草稿 QA、人工审核 checklist、请求修改 / 拒绝 / 阻断、候选入库 handoff。
          </p>
          <p className="mt-1 text-xs leading-5">
            空状态不会重复展示候选属性、步骤草稿或模板草稿；不会自动生成 UserAppTemplatePackage。
          </p>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">模板库候选包</p>
            <p className="mt-1 text-xs leading-5">
              Candidate Package blocked：缺少人工审核通过结果。
            </p>
          </div>
          <div>
            <p className="font-semibold">Candidate Validation</p>
            <p className="mt-1 text-xs leading-5">
              需要 approved human review、QA trace 和隐私边界后才能验证。
            </p>
          </div>
          <div>
            <p className="font-semibold">Candidate Handoff</p>
            <p className="mt-1 text-xs leading-5">
              当前不会写正式模板库，仍为候选模板。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">候选 App 包契约准备</p>
            <p className="mt-1 text-xs leading-5">
              Contract Preparation blocked：缺少 approved candidate package。
            </p>
          </div>
          <div>
            <p className="font-semibold">App Contract Validation</p>
            <p className="mt-1 text-xs leading-5">
              需要 candidate validation ready、QA trace、human review trace 和 privacy trace。
            </p>
          </div>
          <div>
            <p className="font-semibold">App Package Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不是正式 UserAppTemplatePackage，不会自动生成用户 App 模板包。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">用户 App 包草稿预览</p>
            <p className="mt-1 text-xs leading-5">
              Draft Preview blocked：缺少 source contract ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Preview Validation</p>
            <p className="mt-1 text-xs leading-5">
              需要 10D app contract validation ready 后才能预览用户侧字段。
            </p>
          </div>
          <div>
            <p className="font-semibold">Preview Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不是正式 UserAppTemplatePackage，不会写入用户 App 包 registry。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">正式用户 App 包草稿闸门</p>
            <p className="mt-1 text-xs leading-5">
              Draft Gate blocked：缺少 source preview validation ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Checks</p>
            <p className="mt-1 text-xs leading-5">
              需要 10E draft preview validation ready 后才能进入 gate。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不是正式 UserAppTemplatePackage，不会写入 registry，不会发布。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">正式用户 App 模板包草稿构建器</p>
            <p className="mt-1 text-xs leading-5">
              Draft Builder blocked：缺少 10F source gate ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Draft Validation</p>
            <p className="mt-1 text-xs leading-5">
              需要 10F gate ready 后才能构建并验证草稿。
            </p>
          </div>
          <div>
            <p className="font-semibold">Draft Handoff</p>
            <p className="mt-1 text-xs leading-5">
              草稿，不是正式包，不会写入 registry，不会发布。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-fuchsia-200 bg-fuchsia-50 p-3 text-sm text-fuchsia-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">用户 App 模板包草稿发布闸门</p>
            <p className="mt-1 text-xs leading-5">
              Publish Gate blocked：缺少 10G official draft validation ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Checks</p>
            <p className="mt-1 text-xs leading-5">
              只判断是否可进入未来 registry 准备，不是发布。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不会写入 registry，也不会替换当前用户 App 包。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">用户 App 模板包 Registry 准备</p>
            <p className="mt-1 text-xs leading-5">
              Registry Preparation blocked：缺少 10H draft publish gate ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Preparation Validation</p>
            <p className="mt-1 text-xs leading-5">
              需要 10H gate ready 后才能准备 registry entry 预览。
            </p>
          </div>
          <div>
            <p className="font-semibold">Registry Handoff</p>
            <p className="mt-1 text-xs leading-5">
              只是 registry 准备，不是写入；不会发布，也不会替换当前用户 App 包。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 md:grid-cols-3">
          <div>
            <p className="font-semibold">用户 App 模板包 Registry 写入闸门</p>
            <p className="mt-1 text-xs leading-5">
              Registry Write Gate blocked：缺少 10I registry preparation validation ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Checks</p>
            <p className="mt-1 text-xs leading-5">
              只判断是否可进入未来受控 registry writer，不是实际写入。
            </p>
          </div>
          <div>
            <p className="font-semibold">Writer Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不会写入 registry，不会发布，也不会替换当前用户 App 包。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900 md:grid-cols-4">
          <div>
            <p className="font-semibold">受控 Registry 写入器草稿</p>
            <p className="mt-1 text-xs leading-5">
              Writer Draft blocked：缺少 10J registry write gate ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Dry-run Write Plan</p>
            <p className="mt-1 text-xs leading-5">
              dry-run only；只生成 write plan / diff preview / rollback plan，不是实际写入。
            </p>
          </div>
          <div>
            <p className="font-semibold">Writer Validation</p>
            <p className="mt-1 text-xs leading-5">
              校验 dry-run、no-write、no-publish、no-shell-replacement 边界。
            </p>
          </div>
          <div>
            <p className="font-semibold">Writer Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不会写入 registry，不会发布，也不会替换当前用户 App 包。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-fuchsia-200 bg-fuchsia-50 p-3 text-sm text-fuchsia-900 md:grid-cols-4">
          <div>
            <p className="font-semibold">显式 Registry 写入授权闸门</p>
            <p className="mt-1 text-xs leading-5">
              Authorization Gate blocked：缺少 10K writer validation ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Authorization Checklist</p>
            <p className="mt-1 text-xs leading-5">
              老板确认项仅用于未来授权准备，不触发写入。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Checks</p>
            <p className="mt-1 text-xs leading-5">
              校验 dry-run、no-write、no-publish、no-shell-replacement、production disabled。
            </p>
          </div>
          <div>
            <p className="font-semibold">Authorization Handoff</p>
            <p className="mt-1 text-xs leading-5">
              仍然 dry-run only；不是实际写入，不会发布，也不会替换当前用户 App 包。未来真实写入仍需老板单独授权。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900 md:grid-cols-4">
          <div>
            <p className="font-semibold">受控 Registry 写入执行设计</p>
            <p className="mt-1 text-xs leading-5">
              Execution Design blocked：缺少 10L authorization gate ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Preflight / Steps</p>
            <p className="mt-1 text-xs leading-5">
              design / dry-run only；只设计 preflight 和 planned execution steps，不是实际写入。
            </p>
          </div>
          <div>
            <p className="font-semibold">Audit Event / Rollback Command</p>
            <p className="mt-1 text-xs leading-5">
              需要 audit plan、rollback design 和 write lock requirements。
            </p>
          </div>
          <div>
            <p className="font-semibold">Execution Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不会写入 registry，不会发布，也不会替换当前用户 App 包。未来真实执行仍需老板单独授权。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900 md:grid-cols-4">
          <div>
            <p className="font-semibold">真实 Registry 写入实现闸门</p>
            <p className="mt-1 text-xs leading-5">
              Implementation Gate blocked：缺少 10M execution validation ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Implementation Checklist</p>
            <p className="mt-1 text-xs leading-5">
              只确认 gate 条件，不触发写入，不生成 production writer；不是
              production writer。
            </p>
          </div>
          <div>
            <p className="font-semibold">Gate Boundary</p>
            <p className="mt-1 text-xs leading-5">
              仍然 dry-run only；不是实际写入，不会发布。
            </p>
          </div>
          <div>
            <p className="font-semibold">Implementation Handoff</p>
            <p className="mt-1 text-xs leading-5">
              不会替换当前用户 App 包；未来真实实现仍需老板单独授权。
            </p>
          </div>
        </div>
        <div className="mt-3 grid gap-2 rounded-md border border-purple-200 bg-purple-50 p-3 text-sm text-purple-900 md:grid-cols-5">
          <div>
            <p className="font-semibold">真实 Registry 写入实现草稿</p>
            <p className="mt-1 text-xs leading-5">
              Implementation Draft blocked：缺少 10N implementation gate ready。
            </p>
          </div>
          <div>
            <p className="font-semibold">Writer Interface</p>
            <p className="mt-1 text-xs leading-5">
              只定义 dry-run interface draft；不是 actual writer。
            </p>
          </div>
          <div>
            <p className="font-semibold">Transaction / Write Lock</p>
            <p className="mt-1 text-xs leading-5">
              只定义 transaction draft 和 write lock draft，不写 registry。
            </p>
          </div>
          <div>
            <p className="font-semibold">Audit Event / Rollback Command</p>
            <p className="mt-1 text-xs leading-5">
              需要 audit event draft 和 rollback command draft。
            </p>
          </div>
          <div>
            <p className="font-semibold">Draft Handoff</p>
            <p className="mt-1 text-xs leading-5">
              仍然 dry-run only；不是 production writer，不会发布，不会替换当前用户 App 包。
            </p>
          </div>
        </div>
      </section>
    );
  }

  const resolvedDraftQa =
    draftQa ??
    evaluateTemplateDraftQa({
      regionQa,
      attributeCandidates,
      stepSequence,
      templateDraft,
    });
  const resolvedHumanReview =
    humanReview ?? evaluateTemplateDraftHumanReview({ qa: resolvedDraftQa });
  const resolvedReviewWorkflow =
    reviewWorkflow ??
    createTemplateDraftReviewWorkflow({
      qa: resolvedDraftQa,
      review: resolvedHumanReview,
    });
  const resolvedStudioWorkflow =
    studioWorkflow ??
    buildTemplateStudioWorkflowState({
      regionQa,
      attributeCandidates,
      stepSequence,
      templateDraft,
      draftQa: resolvedDraftQa,
      humanReview: resolvedHumanReview,
      reviewWorkflow: resolvedReviewWorkflow,
    });
  const candidatePackage = createTemplateLibraryCandidatePackage({
    attributeCandidates,
    stepSequence,
    templateDraft,
    draftQa: resolvedDraftQa,
    humanReview: resolvedHumanReview,
    reviewWorkflow: resolvedReviewWorkflow,
  });
  const candidateValidation =
    validateTemplateLibraryCandidatePackage(candidatePackage);
  const candidateHandoff = createTemplateLibraryCandidateHandoff({
    candidatePackage,
    validation: candidateValidation,
  });
  const appContractPreparation = createCandidateToAppPackageContractPreparation({
    candidatePackage,
    candidateValidation,
  });
  const appContractValidation =
    validateCandidateToAppPackageContract(appContractPreparation);
  const appPackageHandoff = createCandidateToAppPackageHandoff({
    preparation: appContractPreparation,
    validation: appContractValidation,
  });
  const userAppPackageDraftPreview = createUserAppPackageDraftPreview({
    preparation: appContractPreparation,
    validation: appContractValidation,
  });
  const userAppPackageDraftPreviewValidation =
    validateUserAppPackageDraftPreview(userAppPackageDraftPreview);
  const userAppPackageDraftPreviewHandoff =
    createUserAppPackageDraftPreviewHandoff({
      preview: userAppPackageDraftPreview,
      validation: userAppPackageDraftPreviewValidation,
    });
  const officialUserAppPackageDraftGate = createOfficialUserAppPackageDraftGate({
    preview: userAppPackageDraftPreview,
    validation: userAppPackageDraftPreviewValidation,
  });
  const officialUserAppPackageDraftGateHandoff =
    createOfficialUserAppPackageDraftGateHandoff({
      gate: officialUserAppPackageDraftGate,
    });
  const officialUserAppTemplatePackageDraftBuilder =
    buildOfficialUserAppTemplatePackageDraft({
      preview: userAppPackageDraftPreview,
      gate: officialUserAppPackageDraftGate,
      gateHandoff: officialUserAppPackageDraftGateHandoff,
    });
  const officialUserAppTemplatePackageDraftValidation =
    validateOfficialUserAppTemplatePackageDraft(
      officialUserAppTemplatePackageDraftBuilder.draft,
    );
  const officialUserAppTemplatePackageDraftHandoff =
    createOfficialUserAppTemplatePackageDraftHandoff({
      draft: officialUserAppTemplatePackageDraftBuilder.draft,
      validation: officialUserAppTemplatePackageDraftValidation,
    });
  const userAppTemplatePackageDraftPublishGate =
    createUserAppTemplatePackageDraftPublishGate({
      draft: officialUserAppTemplatePackageDraftBuilder.draft,
      validation: officialUserAppTemplatePackageDraftValidation,
    });
  const userAppTemplatePackageDraftPublishGateHandoff =
    createUserAppTemplatePackageDraftPublishGateHandoff({
      gate: userAppTemplatePackageDraftPublishGate,
    });
  const userAppTemplatePackageRegistryPreparation =
    createUserAppTemplatePackageRegistryPreparation({
      draft: officialUserAppTemplatePackageDraftBuilder.draft,
      gate: userAppTemplatePackageDraftPublishGate,
    });
  const userAppTemplatePackageRegistryPreparationValidation =
    validateUserAppTemplatePackageRegistryPreparation(
      userAppTemplatePackageRegistryPreparation,
    );
  const userAppTemplatePackageRegistryPreparationHandoff =
    createUserAppTemplatePackageRegistryPreparationHandoff({
      preparation: userAppTemplatePackageRegistryPreparation,
      validation: userAppTemplatePackageRegistryPreparationValidation,
    });
  const userAppTemplatePackageRegistryWriteGate =
    createUserAppTemplatePackageRegistryWriteGate({
      preparation: userAppTemplatePackageRegistryPreparation,
      validation: userAppTemplatePackageRegistryPreparationValidation,
    });
  const userAppTemplatePackageRegistryWriteGateHandoff =
    createUserAppTemplatePackageRegistryWriteGateHandoff({
      gate: userAppTemplatePackageRegistryWriteGate,
    });
  const controlledRegistryWriterDraft =
    createControlledUserAppTemplatePackageRegistryWriterDraft({
      gate: userAppTemplatePackageRegistryWriteGate,
    });
  const controlledRegistryWriterValidation =
    validateControlledUserAppTemplatePackageRegistryWriterDraft(
      controlledRegistryWriterDraft,
    );
  const controlledRegistryWriterHandoff =
    createControlledUserAppTemplatePackageRegistryWriterHandoff({
      draft: controlledRegistryWriterDraft,
      validation: controlledRegistryWriterValidation,
    });
  const explicitRegistryWriteAuthorizationChecklist =
    createExplicitRegistryWriteAuthorizationChecklist({
      draft: controlledRegistryWriterDraft,
      validation: controlledRegistryWriterValidation,
    });
  const explicitRegistryWriteAuthorizationGate =
    createExplicitRegistryWriteAuthorizationGate({
      draft: controlledRegistryWriterDraft,
      validation: controlledRegistryWriterValidation,
      checklist: explicitRegistryWriteAuthorizationChecklist,
    });
  const explicitRegistryWriteAuthorizationHandoff =
    createExplicitRegistryWriteAuthorizationHandoff({
      gate: explicitRegistryWriteAuthorizationGate,
      checklist: explicitRegistryWriteAuthorizationChecklist,
    });
  const controlledRegistryWriteExecutionDesign =
    createControlledRegistryWriteExecutionDesign({
      authorizationGate: explicitRegistryWriteAuthorizationGate,
      authorizationHandoff: explicitRegistryWriteAuthorizationHandoff,
    });
  const controlledRegistryWriteExecutionValidation =
    validateControlledRegistryWriteExecutionDesign(
      controlledRegistryWriteExecutionDesign,
    );
  const controlledRegistryWriteExecutionHandoff =
    createControlledRegistryWriteExecutionHandoff({
      design: controlledRegistryWriteExecutionDesign,
      validation: controlledRegistryWriteExecutionValidation,
    });
  const realRegistryWriteImplementationGate =
    createRealRegistryWriteImplementationGate({
      design: controlledRegistryWriteExecutionDesign,
      validation: controlledRegistryWriteExecutionValidation,
      handoff: controlledRegistryWriteExecutionHandoff,
    });
  const realRegistryWriteImplementationChecklist =
    createRealRegistryWriteImplementationChecklist({
      gate: realRegistryWriteImplementationGate,
    });
  const realRegistryWriteImplementationHandoff =
    createRealRegistryWriteImplementationHandoff({
      gate: realRegistryWriteImplementationGate,
      checklist: realRegistryWriteImplementationChecklist,
    });
  const realRegistryWriteImplementationDraft =
    createRealRegistryWriteImplementationDraft({
      gate: realRegistryWriteImplementationGate,
      handoff: realRegistryWriteImplementationHandoff,
    });
  const realRegistryWriteImplementationDraftValidation =
    validateRealRegistryWriteImplementationDraft(
      realRegistryWriteImplementationDraft,
    );
  const realRegistryWriteImplementationDraftHandoff =
    createRealRegistryWriteImplementationDraftHandoff({
      draft: realRegistryWriteImplementationDraft,
      validation: realRegistryWriteImplementationDraftValidation,
    });

  return (
    <section className="grid gap-4">
      <section className="rounded-lg border border-teal-100 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">FaceMesh 妆容智能基线</h2>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            模板工作台读取视觉分析摘要，生成候选属性、规则步骤和模板草稿；所有内容都是候选 / 草稿，必须人工审核。
          </p>
        </div>
        <span className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">
          Phase 10B review-only
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">视觉分析摘要</h3>
          <div className="mt-2 grid gap-1 text-xs text-stone-600">
            <p>状态：{statusLabel[regionQa.status]}</p>
            <p>Provider：{regionQa.provider}</p>
            <p>Landmarks：{regionQa.landmarkCount}</p>
            <p>置信度：{formatPercent(regionQa.confidence)}</p>
          </div>
          <p className="mt-2 rounded-md bg-white p-2 text-xs text-stone-500">
            {regionQa.status === 'region_qa_blocked'
              ? '视觉分析质量不足，需回到视觉分析 Tab 修正图片/区域后再生成草稿。'
              : '可以进入模板工作台生成/审核模板草稿。'}
          </p>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">妆容属性候选</h3>
          <p className="mt-1 text-xs text-stone-500">
            状态：{statusLabel[attributeCandidates.status]} / 全部需要人工审核
          </p>
          <div className="mt-2 grid gap-2 text-xs text-stone-600">
            {attributeCandidates.candidates.slice(0, 6).map((candidate) => (
              <div className="flex items-center justify-between gap-3" key={candidate.id}>
                <span>{candidate.kind}</span>
                <span className="text-right">
                  {candidate.value} / {formatPercent(candidate.confidence)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">规则步骤草稿</h3>
          <p className="mt-1 text-xs text-stone-500">
            状态：{statusLabel[stepSequence.status]} / 仅用于草稿审核
          </p>
          <ol className="mt-2 grid gap-1 text-xs text-stone-600">
            {stepSequence.steps.slice(0, 6).map((step) => (
              <li key={step.id}>
                {step.order}. {step.region} - {step.instruction}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
          <h3 className="text-sm font-semibold">模板草稿摘要</h3>
          <div className="mt-2 grid gap-1 text-xs text-amber-900">
            <p>状态：{statusLabel[templateDraft.status]}</p>
            <p>草稿：{templateDraft.draft?.name ?? '未生成'}</p>
            <p>人工审核：{templateDraft.humanReviewRequired ? '必须' : '未开启'}</p>
            <p>出库边界：只能进入模板库候选流程。</p>
            <p>边界：不接后端、不上传、不训练、不调用 OpenAI 或外部 AI。</p>
          </div>
        </div>
      </div>

      <details className="mt-3 rounded-md border border-stone-200 bg-stone-50 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          查看区域覆盖详情
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          {regionQa.regionCoverage.map((region) => (
            <span
              className={`rounded-md px-2 py-1 text-xs ${
                region.ready
                  ? 'bg-teal-50 text-teal-900'
                  : 'bg-rose-50 text-rose-800'
              }`}
              key={region.region}
            >
              {region.region}: {formatPercent(region.coverage)}
            </span>
          ))}
        </div>
      </details>
      </section>

      <TemplateDraftReviewWorkflowPanel
        draftQa={resolvedDraftQa}
        humanReview={resolvedHumanReview}
        reviewWorkflow={resolvedReviewWorkflow}
        studioWorkflow={resolvedStudioWorkflow}
      />
      <TemplateLibraryCandidatePackagingPanel
        candidatePackage={candidatePackage}
        handoff={candidateHandoff}
        validation={candidateValidation}
      />
      <CandidateToAppPackageContractPanel
        handoff={appPackageHandoff}
        preparation={appContractPreparation}
        validation={appContractValidation}
      />
      <UserAppPackageDraftPreviewPanel
        handoff={userAppPackageDraftPreviewHandoff}
        preview={userAppPackageDraftPreview}
        validation={userAppPackageDraftPreviewValidation}
      />
      <OfficialUserAppPackageDraftGatePanel
        gate={officialUserAppPackageDraftGate}
        handoff={officialUserAppPackageDraftGateHandoff}
      />
      <OfficialUserAppTemplatePackageDraftBuilderPanel
        builderResult={officialUserAppTemplatePackageDraftBuilder}
        handoff={officialUserAppTemplatePackageDraftHandoff}
        validation={officialUserAppTemplatePackageDraftValidation}
      />
      <UserAppTemplatePackageDraftPublishGatePanel
        gate={userAppTemplatePackageDraftPublishGate}
        handoff={userAppTemplatePackageDraftPublishGateHandoff}
      />
      <UserAppTemplatePackageRegistryPreparationPanel
        handoff={userAppTemplatePackageRegistryPreparationHandoff}
        preparation={userAppTemplatePackageRegistryPreparation}
        validation={userAppTemplatePackageRegistryPreparationValidation}
      />
      <UserAppTemplatePackageRegistryWriteGatePanel
        gate={userAppTemplatePackageRegistryWriteGate}
        handoff={userAppTemplatePackageRegistryWriteGateHandoff}
      />
      <ControlledUserAppTemplatePackageRegistryWriterDraftPanel
        draft={controlledRegistryWriterDraft}
        handoff={controlledRegistryWriterHandoff}
        validation={controlledRegistryWriterValidation}
      />
      <ExplicitRegistryWriteAuthorizationGatePanel
        checklist={explicitRegistryWriteAuthorizationChecklist}
        gate={explicitRegistryWriteAuthorizationGate}
        handoff={explicitRegistryWriteAuthorizationHandoff}
      />
      <ControlledRegistryWriteExecutionDesignPanel
        design={controlledRegistryWriteExecutionDesign}
        handoff={controlledRegistryWriteExecutionHandoff}
        validation={controlledRegistryWriteExecutionValidation}
      />
      <RealRegistryWriteImplementationGatePanel
        gate={realRegistryWriteImplementationGate}
        checklist={realRegistryWriteImplementationChecklist}
        handoff={realRegistryWriteImplementationHandoff}
      />
      <RealRegistryWriteImplementationDraftPanel
        draft={realRegistryWriteImplementationDraft}
        validation={realRegistryWriteImplementationDraftValidation}
        handoff={realRegistryWriteImplementationDraftHandoff}
      />
    </section>
  );
}
