import { BadgeCheck, FileSearch } from 'lucide-react';
import type { TemplateEvidence } from '../../../templates/schema';
import type { QualityGateResult } from '../../../templates/storage';

export interface EvidencePanelProps {
  evidence: TemplateEvidence | null;
  qualityGateResult?: QualityGateResult | null;
}

const formatConfidence = (value: number): string => `${Math.round(value * 100)}%`;

export function EvidencePanel({ evidence, qualityGateResult }: EvidencePanelProps) {
  const rows = evidence
    ? [
        {
          label: 'FaceMesh evidence',
          confidence: evidence.faceGeometryEvidence.confidence,
          notes: [
            `face:${evidence.faceGeometryEvidence.faceId}`,
            `landmarks:${evidence.faceGeometryEvidence.landmarkCount}`,
          ],
        },
        {
          label: 'Segmentation evidence',
          confidence: evidence.segmentationEvidence.confidence,
          notes: [
            `provider:${evidence.segmentationEvidence.providerId}`,
            `masks:${evidence.segmentationEvidence.maskCount}`,
          ],
        },
        {
          label: 'Weighted sampling evidence',
          confidence: evidence.weightedSamplingEvidence.confidence,
          notes: evidence.weightedSamplingEvidence.sampleGroups,
        },
        {
          label: 'Human correction evidence',
          confidence: evidence.humanCorrectionEvidence.confidence,
          notes: [
            `edits:${evidence.humanCorrectionEvidence.editCount}`,
            `regions:${evidence.humanCorrectionEvidence.adjustedRegions.join(',') || 'none'}`,
          ],
        },
        {
          label: 'Convergence evidence',
          confidence: evidence.convergenceEvidence.confidence,
          notes: [
            `status:${evidence.convergenceEvidence.humanVerificationStatus}`,
            ...evidence.convergenceEvidence.evidenceNotes,
          ],
        },
        {
          label: 'Quality evidence',
          confidence: evidence.qualityEvidence.confidence,
          notes: [
            `ready:${evidence.qualityEvidence.readyForDataset ? 'yes' : 'no'}`,
            ...evidence.qualityEvidence.rejectionReasons,
          ],
        },
      ]
    : [];
  const confidenceDistribution = rows
    .map((row) => `${row.label.replace(' evidence', '')}:${formatConfidence(row.confidence)}`)
    .join(' / ');

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Template Evidence</h2>
          <p className="text-xs font-medium text-stone-500">
            {evidence
              ? `${evidence.convergenceEvidence.humanVerificationStatus} / ${evidence.evidenceId}`
              : 'no evidence'}
          </p>
        </div>
        {evidence?.qualityEvidence.readyForDataset ? (
          <BadgeCheck aria-hidden="true" className="text-teal-700" size={18} />
        ) : (
          <FileSearch aria-hidden="true" className="text-teal-700" size={18} />
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {!evidence ? (
          <div className="rounded-md border border-dashed border-stone-200 p-3 text-sm text-stone-500">
            Run analysis and convergence to populate TemplateEvidence.
          </div>
        ) : (
          rows.map((row) => (
            <div
              className="rounded-md border border-stone-200 bg-stone-50 p-3"
              key={row.label}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-stone-900">
                  {row.label}
                </span>
                <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-700">
                  {formatConfidence(row.confidence)}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.notes.slice(0, 5).map((note) => (
                  <span
                    className="rounded bg-white px-2 py-0.5 text-xs text-stone-600 ring-1 ring-stone-200"
                    key={note}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {qualityGateResult ? (
        <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-teal-950">
              Evidence Quality Gate
            </span>
            <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-teal-900 ring-1 ring-teal-100">
              {formatConfidence(qualityGateResult.qualityScore)}
            </span>
          </div>
          <div className="mt-2 grid gap-1 text-xs leading-5 text-teal-900">
            <p>suggested decision: {qualityGateResult.suggestedDecision}</p>
            <p>
              second review:{' '}
              {qualityGateResult.needsSecondReview ? 'yes' : 'no'} / training ready:{' '}
              {qualityGateResult.isTrainingReady ? 'yes' : 'no'}
            </p>
            <p>
              reasons:{' '}
              {qualityGateResult.suggestedReasons.length > 0
                ? qualityGateResult.suggestedReasons.join(', ')
                : 'none'}
            </p>
            {confidenceDistribution ? (
              <p>confidence distribution: {confidenceDistribution}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
