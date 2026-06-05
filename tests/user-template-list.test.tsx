import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserTemplateList } from '../src/components/user-app';
import { createUserAppTemplateCards } from '../src/user-app';
import { userAppMvpShellExamplePackage } from '../src/templates/examples/user-app-mvp-shell.example';

describe('UserTemplateList', () => {
  it('renders app-facing template cards and empty states', () => {
    const cards = createUserAppTemplateCards(userAppMvpShellExamplePackage);
    const html = renderToStaticMarkup(
      <UserTemplateList
        onSelectTemplate={() => undefined}
        selectedTemplateId={cards[0].appTemplateId}
        templates={cards}
      />,
    );
    const emptyHtml = renderToStaticMarkup(
      <UserTemplateList onSelectTemplate={() => undefined} templates={[]} />,
    );

    expect(html).toContain('妆容模板');
    expect(html).toContain('Soft Rose Daily Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(html).toContain('Warm Bronze Evening Look');
    expect(emptyHtml).toContain('0');
  });
});
