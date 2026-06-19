import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { UserAppTemplatePackageRegistryPreparationPanel } from '../src/components/template-studio/UserAppTemplatePackageRegistryPreparationPanel';
import {
  userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample,
  userAppTemplatePackageRegistryPreparationHandoffBlockedExample,
  userAppTemplatePackageRegistryPreparationHandoffReadyExample,
  userAppTemplatePackageRegistryPreparationReadyExample,
  userAppTemplatePackageRegistryPreparationValidationActualRegistryWriteExample,
  userAppTemplatePackageRegistryPreparationValidationReadyExample,
} from '../src/templates/examples';

describe('UserAppTemplatePackageRegistryPreparationPanel', () => {
  it('renders registry preparation, validation, and handoff boundaries', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageRegistryPreparationPanel
        handoff={userAppTemplatePackageRegistryPreparationHandoffReadyExample}
        preparation={userAppTemplatePackageRegistryPreparationReadyExample}
        validation={userAppTemplatePackageRegistryPreparationValidationReadyExample}
      />,
    );

    expect(html).toContain('用户 App 模板包 Registry 准备');
    expect(html).toContain('Registry Entry Preview');
    expect(html).toContain('Registry Preparation Validation');
    expect(html).toContain('Registry Handoff');
    expect(html).toContain('只是 registry 准备，不是写入');
    expect(html).toContain('不会发布');
    expect(html).toContain('不会替换当前用户 App 包');
    expect(html).toContain('可进入未来闸门');
    expect(html).not.toContain('已生成生产包');
    expect(html).not.toContain('已写入用户 App registry');
    expect(html).not.toContain('已发布到用户 App');
    expect(html).not.toContain('已替换当前用户 App 包');
    expect(html).not.toContain('已上线');
    expect(html).not.toContain('production ready');
    expect(html).not.toContain('自动发布');
    expect(html).not.toContain('AI 自动确认');
  });

  it('renders blocked validation reasons when actual registry write markers appear', () => {
    const html = renderToStaticMarkup(
      <UserAppTemplatePackageRegistryPreparationPanel
        handoff={userAppTemplatePackageRegistryPreparationHandoffBlockedExample}
        preparation={userAppTemplatePackageRegistryPreparationActualRegistryWriteBlockedExample}
        validation={userAppTemplatePackageRegistryPreparationValidationActualRegistryWriteExample}
      />,
    );

    expect(html).toContain('registry_preparation_blocked');
    expect(html).toContain('Blocked reasons');
    expect(html).toContain(
      'Registry preparation must not execute or mark an actual registry write',
    );
    expect(html).toContain('不可进入');
  });
});
