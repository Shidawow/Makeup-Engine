# User App Package Draft Preview

Phase 10E adds a local administrator-only User App Package Draft Preview after
Phase 10D candidate-to-app contract validation.

This is not formal `UserAppTemplatePackage` generation. It does not write a
user app package registry, publish to a user app, create a production app route,
call backend services, call OpenAI or external APIs, use camera/AR, train
models, or store real user data.

## Purpose

The preview lets Template Studio reviewers see how a validated 10D contract
preparation could read inside a future user app package draft before any formal
package generation gate exists.

The preview includes:

- title preview
- summary preview
- style tags preview
- difficulty preview
- estimated time preview
- suitable scenarios preview
- tools checklist preview
- product placeholder preview
- step guidance preview
- region guidance preview
- user-facing copy preview
- local-only privacy notice
- QA trace
- human review trace
- candidate trace
- contract trace

## Entry Conditions

Draft preview can become ready only when the source 10D app contract validation
is `app_contract_validation_ready` or `app_contract_validation_ready_with_warnings`.

Blocked 10D contract preparation cannot create a ready draft preview.

## Blocking Rules

The preview is blocked by:

- missing source contract readiness
- missing step guidance
- missing user-facing title or summary copy
- missing region guidance
- raw image references, object URLs, base64, local paths, or MediaPipe runtime
  asset names
- real personal data, contact data, health data, sensitive identity data, or
  biometric identifiers
- medical, diagnosis, treatment, final-recognition, or AI-confirmation claims
- specific product shade or unsupported brand claims
- any marker that suggests formal `UserAppTemplatePackage` mutation
- any automatic publish or user app package registry write
- JSON round-trip instability

## Boundary

The output is a draft preview only. It can feed a later explicit 10F gate, but
it cannot become the official app package by itself.
