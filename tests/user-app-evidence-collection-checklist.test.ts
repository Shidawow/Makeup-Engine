import { describe, expect, it } from 'vitest';
import {
  userAppEvidenceCollectionChecklistBlockedExample,
  userAppEvidenceCollectionChecklistMissingNoticeExample,
  userAppEvidenceCollectionChecklistReadyExample,
  userAppEvidenceCollectionChecklistWarningExample,
} from '../src/templates/examples';

describe('User App evidence collection checklist', () => {
  it('marks the complete checklist ready', () => {
    expect(userAppEvidenceCollectionChecklistReadyExample.status).toBe('checklist_ready');
    expect(
      userAppEvidenceCollectionChecklistReadyExample.items.find(
        (item) => item.itemId === 'check-privacy-no-photo',
      )?.passed,
    ).toBe(true);
    expect(
      userAppEvidenceCollectionChecklistReadyExample.items.find(
        (item) => item.itemId === 'check-after-no-ai-analysis',
      )?.passed,
    ).toBe(true);
  });

  it('keeps non-required evidence quality gaps as warnings', () => {
    expect(userAppEvidenceCollectionChecklistWarningExample.status).toBe(
      'checklist_ready_with_warnings',
    );
  });

  it('blocks missing notice and forbidden data requests', () => {
    expect(userAppEvidenceCollectionChecklistMissingNoticeExample.status).toBe(
      'checklist_blocked',
    );
    expect(userAppEvidenceCollectionChecklistBlockedExample.status).toBe(
      'checklist_blocked',
    );
    expect(
      userAppEvidenceCollectionChecklistBlockedExample.items.find(
        (item) => item.itemId === 'check-stop-no-forbidden-request',
      )?.blocking,
    ).toBe(true);
  });
});
