# Known Limitations

- JPEG pixel decode is unsupported. JPEG remains a metadata-only boundary.
- `SourceImagePackage` is not a training dataset and cannot skip correction, review queue, or dataset materialization.
- Browser UI cannot directly write CLI source image packages.
- Browser UI cannot auto-read CLI package relative paths from `source-image-manifest.json`.
- Artifact object URLs are temporary and require rebinding after page refresh.
- Production batch, library, package, app contract, and shell exports strip runtime-only references.
- Production `published` and Template Library `local_published` are local state only; there is no backend or online publish.
- `UserAppTemplatePackage` is a local consumption contract, not a real user app, backend publication, or online release.
- The app contract has compatibility targets, but no real iOS/Web production app has been implemented yet.
- The Phase 6L prototype consumer is read-only admin validation, not the real user app.
- Phase 7A builds only a local contract-driven MVP shell; it is not a production app.
- Phase 7B hardens guidance UX only; it is still not a production app.
- Phase 7C defines user photo intake and personalization placeholders only; it does not collect, upload, analyze, preview, store, or train on real user photos.
- Phase 7C disabled upload/camera controls are not real file inputs and do not request camera permission.
- User photo placeholders must reject object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, training input markers, and persistent photo references.
- Personalization is non-sensitive and local-only; it can affect display hints only and cannot mutate templates, export user profiles, or create training data.
- Phase 7D onboarding and preferences are local-only MVP shell features; they are not account onboarding, backend sync, cloud sync, database persistence, analytics, or production profile storage.
- Local preferences can only affect guidance hints and cannot mutate `UserAppTemplatePackage`, write templates, enter training datasets, or write user preference records into `project-state`.
- Preference boundary validation must reject object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, health information, sensitive identity fields, and training input markers.
- Phase 7E discovery and recommendations are local-only placeholders; they are not real AI recommendation, backend personalization, analytics, advertising, ecommerce, or user profiling.
- Recommendation ranking is deterministic and rule-based, using only `UserAppTemplatePackage` plus non-sensitive local preferences.
- Recommendation results cannot mutate `UserAppTemplatePackage`, call external APIs, enter training datasets, sync to backend/cloud, or write real user records into `project-state`.
- Phase 7F local session persistence is local-only MVP shell behavior; it is not account storage, backend sync, cloud sync, database persistence, analytics, or production app storage.
- Session payloads can store only selected template, active step, progress ids, onboarding summary, non-sensitive preferences, discovery filters, sort mode, last visited section, and dismissed local warning ids.
- Session payloads must reject object URLs, `data:image/`, base64 image-like strings, local absolute paths, image/photo bytes, face embeddings, biometric identifiers, health information, sensitive identity fields, React state, recommendation result records, and training input markers.
- Session recovery reconciles against the current `UserAppTemplatePackage` but cannot modify the package.
- Phase 7G readiness gate is local product/QA gating only; it is not production release approval, native iOS QA, backend readiness, app store readiness, camera readiness, AR readiness, or training readiness.
- Phase 7G mobile QA is deterministic checklist/DOM-level readiness; it does not replace future real browser/device pointer, screenshot, or accessibility QA.
- App readiness reports and mobile QA reports cannot store real user photos, object URLs, local paths, base64 images, biometric fields, sensitive profile fields, React state, recommendation records, or training input.
- Phase 7H browser/mobile QA is local deterministic prototype QA; it is not production release approval, real device lab QA, Playwright pointer/canvas/screenshot QA, native iOS QA, backend readiness, camera readiness, AR readiness, training readiness, or app store readiness.
- Phase 8A selected a React Web / PWA MVP first route only; it did not implement the production user app.
- Phase 8B adds PWA metadata and mobile shell polish only; it is not a production PWA release.
- Phase 8B does not add service worker, offline cache, push notification, background sync, install tracking, analytics, backend, camera, AR, native app, OpenAI/external API, ecommerce, community, paid, app store release, or training scope.
- Phase 8C adds an internal / small-scope MVP trial pack only; it is not production release, online user growth, App Store/TestFlight, backend form, analytics, camera, AR, training, or real user record collection.
- Phase 8C trial feedback must not collect real names, contact information, photos, health information, sensitive identity information, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 8D adds template content QA and trial content readiness only; it is not production release, App Store/TestFlight, backend, analytics, camera, AR, AI content generation, OpenAI/external API usage, training, or real user record collection.
- Phase 8D content QA reports cannot mutate `UserAppTemplatePackage`, write real user trial records into `project-state`, or enter training datasets.
- Phase 8E adds MVP release readiness and trial go/no-go gates only; it is not production release, App Store/TestFlight, backend readiness, analytics readiness, camera readiness, AR readiness, AI generation approval, OpenAI/external API approval, training readiness, online publication, or real user data collection approval.
- Phase 8E `go_for_internal_trial` or `go_with_warnings` means internal small-scope trial preparation only, not production ready.
- Phase 8E release readiness and go/no-go reports cannot mutate `UserAppTemplatePackage`, collect photos, write real user trial records into `project-state`, or enter training datasets.
- Phase 9A adds internal trial operations, observation templates, and outcome review only; it is not public recruitment, production release, App Store/TestFlight, backend form, analytics, camera, AR, AI analysis, OpenAI/external API usage, training, or real user record collection.
- Phase 9A participant types are broad categories only and cannot store real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 9A operations, observation notes, and outcome review cannot mutate `UserAppTemplatePackage`, write real user trial records into `project-state`, or enter training datasets.
- Phase 9B adds internal trial result review, issue taxonomy, and decision framework only; it is not production analytics, public recruitment, backend record collection, AI analysis, OpenAI/external API usage, training, or production release approval.
- Phase 9B review signals are anonymous/mock/example summaries only and cannot store real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, or training data.
- Phase 9B result review, issue taxonomy, decision framework, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- Phase 9C adds internal trial iteration plan, backlog, and priority framework only; it is not a formal production roadmap, backend issue tracker, production analytics, public recruitment, AI analysis, OpenAI/external API usage, training, or production release approval.
- Phase 9C iteration inputs are anonymous/mock/example summaries only and cannot store real names, contact information, health information, sensitive identity information, photos, face embeddings, biometric identifiers, backend records, analytics records, AI analysis records, or training data.
- Phase 9C iteration plan, backlog, priority framework, sessions, preferences, recommendations, and admin panels cannot mutate `UserAppTemplatePackage`, write real user records into `project-state`, or enter training datasets.
- The future production user-facing app should be planned as a separate app surface or repository and is not owned by Makeup Engine without a future explicit phase gate.
- Native iOS, React Native, Flutter, backend, accounts, analytics, camera/photo capture, AR, online publication, OpenAI/external APIs, ecommerce, community, paid features, and training remain deferred after Phase 8A.
- `SourceImagePackage` still cannot directly become user photo intake, User App Shell state, `TemplateLibraryEntry`, `UserAppTemplatePackage`, or training data.
- Full real photo distribution coverage is not established.
- A real deep segmentation model has not been trained yet.
- The ONNX writer is not real yet; export readiness is preparation-oriented.
- Makeup Engine is not the user-facing production app.
- External skill governance exists, but no external skill is installed or broadly approved by OPS-2.
- Candidate external skills remain explicit-only and cannot run scripts or install dependencies by default.
- `src/engine`, `src/runtime`, and `src/intelligence/runtime` are frozen compatibility areas, not the center for new mainline features.
- Real local MediaPipe FaceMesh requires machine-local files under ignored `public/mediapipe/**`; run `npm run mediapipe:prepare` after dependency install or machine changes, and do not commit `.task` / `.wasm` assets.

- Phase 9D internal trial learning summary and product decision gate are local administrator decision aids only; they are not production analytics, backend collection, AI analysis, production app approval, production roadmap approval, public recruitment, App Store/TestFlight readiness, online publication, training, or real user record collection approval.
- Phase 9D uses anonymous/mock/example summaries only and cannot store real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, or real user trial records in project-state.

- Phase 9E internal trial evidence pack is local administrator evidence support only; it is not production analytics, backend evidence collection, AI analysis, public recruitment, production app approval, or production release approval.
- Phase 9E evidence must remain anonymous/mock/example summaries and cannot store real user names, contacts, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, or real user trial records in project-state.

- Phase 9F internal trial evidence collection preparation is local administrator preparation only; it is not real data collection, backend evidence storage, public recruitment, MVP validation approval, production analytics, AI analysis, training, or production release approval.
- Phase 9F protocol, checklist, and quality gate cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, or real user trial records in project-state.
- Phase 9G anonymous internal trial dry run is local administrator rehearsal only; it is not real trial launch, production analytics, backend evidence collection, public recruitment, MVP validation approval, production app approval, or production release approval.
- Phase 9G dry run pack, checklist, and review cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, upload data, or real user trial records in project-state.
- Phase 9H anonymous internal trial launch pack is local administrator launch preparation only; it is not public recruitment, production app launch, production analytics, backend evidence collection, MVP validation approval, production app approval, or production release approval.
- Phase 9H launch pack, readiness, and post-launch handoff cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, upload data, or real user trial records in project-state.
- Phase 9I anonymous internal trial evidence review is local administrator review only; it is not production analytics, backend evidence collection, AI analysis, training, public recruitment, MVP validation approval, production app approval, or production release approval.
- Phase 9I evidence review, gap review, and decision input cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, upload data, or real user trial records in project-state.
- Phase 9J anonymous internal trial follow-up iteration is local administrator planning only; it is not production roadmap approval, production analytics, backend evidence collection, AI analysis, training, public recruitment, MVP validation approval, production app approval, or production release approval.
- Phase 9J follow-up iteration, gap action plan, and readiness cannot collect real names, contact information, photos, health information, sensitive identity information, biometrics, backend records, analytics records, AI analysis records, training labels, upload data, or real user trial records in project-state.
- Phase 10A FaceMesh-driven makeup intelligence is a local template production
  baseline only; it is not final makeup recognition, automatic publishing,
  production user app behavior, backend analytics, AI analysis, OpenAI/external
  API usage, AR, camera capture, or training approval.
- Phase 10A FaceMesh region QA, attribute candidates, rule-based steps, and
  template drafts require human review and cannot mutate `UserAppTemplatePackage`
  or enter training datasets automatically.
- Phase 10A uses machine-local ignored MediaPipe assets under
  `public/mediapipe/**`; `.task`, `.wasm`, and large runtime files must remain
  uncommitted.
- Phase 13A MVP Trial Content Pack & Founder Demo Review is founder-demo-only
  local content preparation. It is not production readiness, not official
  Template Library content, not registry readiness, not publication, not
  production writer scope, and not User App Shell package replacement.
- Phase 13A trial templates are local MVP trial content and require human
  review; they cannot be claimed as fully automatic photo extraction, AI
  confirmed final recognition, medical/product shade truth, registry-written
  content, or published templates.
- Phase 10B template draft QA and human review are local administrator workflow
  aids only; they are not final recognition, production publishing, backend
  workflow, AI approval, training approval, or production user app behavior.
- Phase 10B approval means template library candidate only and cannot
  automatically publish, write a formal template library entry, generate
  `UserAppTemplatePackage`, call external APIs, or enter training datasets.
- Phase 10C template library candidate packaging is a local administrator
  packaging, validation, and handoff layer only. Candidate packages are not
  published templates, not formal Template Library entries, not backend records,
  not training input, and not `UserAppTemplatePackage` exports.
- Phase 10C candidate packages must block missing human approval, QA blocked
  state, privacy/scope risk, raw image references, object URLs, base64, local
  image paths, real personal data, product shade claims, medical claims,
  unsupported final claims, and UserAppTemplatePackage mutation markers.
- Phase 10D candidate-to-app contract preparation is a local administrator
  mapping preview, validation, and handoff layer only. It is not formal
  `UserAppTemplatePackage` generation, not a user app package registry write,
  not user app publication, not backend work, not production app readiness, and
  not training input.
- Phase 10D must block missing candidate validation, missing human review trace,
  unsafe privacy trace, raw image references, local paths, object URLs, base64,
  MediaPipe runtime asset names, personal data, product shade claims, medical
  claims, unsupported final claims, missing region guidance, and
  `UserAppTemplatePackage` mutation markers.
- Phase 10E User App Package Draft Preview is a local administrator preview layer only. It is not formal UserAppTemplatePackage generation, official package readiness, registry write, publication, production app readiness, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10E draft preview must block missing source contract readiness, missing step guidance, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, automatic publish markers, registry write markers, and UserAppTemplatePackage mutation markers.
- Phase 10F Official User App Package Draft Gate is a local administrator gate only. Gate ready means eligible for a future builder, not formal UserAppTemplatePackage generation, official package output, registry write, publication, production app readiness, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10F official draft gate must block missing source preview validation, missing step guidance, missing region guidance, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, automatic publish markers, registry write markers, and UserAppTemplatePackage mutation markers.
- Phase 10G Official UserAppTemplatePackage Draft Builder is a local administrator draft builder only. Draft ready means eligible for a future draft publish gate, not publication, registry write, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10G official draft builder must block missing source gate readiness, missing step sequence, missing privacy notice, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, automatic publish markers, registry write markers, production package markers, and UserAppTemplatePackage mutation markers.
- Phase 10H UserAppTemplatePackage Draft Publish Gate is a local administrator gate only. Gate ready means eligible for future registry preparation, not publication, registry write execution, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10H draft publish gate must block missing official draft validation, missing draftOnly, missing publishBlocked, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, automatic publish markers, registry write markers, production package markers, User App Shell package replacement, and UserAppTemplatePackage mutation markers.
- Phase 10I UserAppTemplatePackage Registry Preparation is a local administrator preparation layer only. Preparation ready means eligible for a future registry write gate, not registry write execution, publication, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10I registry preparation must block missing 10H source gate readiness, missing draftOnly, missing publishBlocked, missing registryWriteBlocked, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10J UserAppTemplatePackage Registry Write Gate is a local administrator gate only. Gate ready means eligible for a future controlled registry writer draft, not registry write execution, publication, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10J registry write gate must block missing 10I registry preparation validation readiness, missing draftOnly, missing publishBlocked, missing registryWriteBlocked, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production package markers, User App Shell package replacement, unsafe User App contract boundary, and unstable JSON.
- Phase 10K Controlled UserAppTemplatePackage Registry Writer Draft is a local administrator dry-run writer plan only. Writer ready means eligible for a future explicit registry write authorization gate, not registry write execution, publication, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10K controlled writer draft must block missing 10J registry write gate readiness, missing dryRunOnly, missing actualWriteBlocked, missing publishBlocked, missing packageReplacementBlocked, missing write plan, missing diff preview, missing rollback plan, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10L Explicit Registry Write Authorization Gate is a local administrator gate only. Gate ready means eligible for future controlled registry write execution design, not actual write authorization, registry write execution, publication, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10L explicit authorization gate must block missing 10K writer validation readiness, missing dryRunOnly, missing actualWriteBlocked, missing publishBlocked, missing packageReplacementBlocked, missing write plan, missing diff preview, missing rollback plan, missing reviewer acknowledgement, missing future owner authorization, missing production write disabled, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10M Controlled Registry Write Execution Design is a local administrator design layer only. Design ready means eligible for a future real write implementation gate, not actual write authorization, registry write execution, publication, production package output, User App Shell package replacement, backend work, OpenAI/external API usage, camera/AR scope, or training input.
- Phase 10M controlled execution design must block missing 10L authorization gate readiness, missing dryRunOnly, missing actualWriteBlocked, missing publishBlocked, missing packageReplacementBlocked, non-design execution mode, missing audit plan, missing rollback design, missing write lock requirements, missing owner authorization trace, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10N Real Registry Write Implementation Gate is a local administrator gate only. Gate ready means eligible for a future real registry write implementation draft, not actual write authorization, not real writer implementation, not registry write execution, not publication, not production package output, not User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10N implementation gate must block missing 10M execution validation readiness, missing dryRunOnly, missing actualWriteBlocked, missing publishBlocked, missing packageReplacementBlocked, missing audit plan, missing rollback design, missing write lock requirements, missing owner authorization trace, missing future explicit approval, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production writer or production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10O Real Registry Write Implementation Draft is a local administrator draft only. Draft ready means eligible for a future final real write review gate, not actual registry write, not production writer readiness, not registry write execution, not publication, not production package output, not User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10O implementation draft must block missing 10N implementation gate readiness, missing dryRunOnly, missing actualWriteBlocked, missing publishBlocked, missing packageReplacementBlocked, missing productionWriterBlocked, missing writer interface draft, missing transaction draft, missing write lock draft, missing audit event draft, missing rollback command draft, raw image references, local paths, object URLs, base64, MediaPipe runtime asset names, personal data, product shade claims, medical claims, unsupported final claims, actual registry write markers, production writer or production package markers, User App Shell package replacement, and unstable JSON.
- Phase 10P Final Real Write Review Gate is a local administrator review gate only. Gate ready means eligible for a future real write execution authorization phase, not actual registry write authorization, not production writer readiness, not registry write execution, not publication, not production package output, not User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10P owner authorization evidence is review-gate-only: it does not authorize real registry write, publication, current User App Shell package replacement, or production writer creation.
- Phase 10Q Real Write Execution Authorization is a local administrator authorization model only. Authorization ready means eligible for a future real write execution plan, not actual registry write authorization, not registry write execution, not production writer creation or readiness, not publication, not production package output, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10Q owner authorization evidence is phase-only: `授权范围：A。只授权进入 Phase 10Q — Real Write Execution Authorization，不授权真实写入 registry，不授权发布，不授权替换当前 User App Shell package，不授权创建 production writer。`
- Phase 10R Real Write Execution Plan is a local administrator execution-plan layer only. Plan ready means eligible for a future guarded execution simulator, not actual registry write authorization, not registry write execution, not production writer creation or readiness, not publication, not production package output, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10R execution plan, validation, and handoff must preserve dry-run-only, actual-write-blocked, publish-blocked, package-replacement-blocked, production-writer-blocked, execution sequence, preflight, write lock, audit, rollback, failure handling, dry-run verification, trace preservation, no actual registry write marker, no production package marker, no current User App Shell package replacement marker, no production writer creation marker, and JSON round-trip boundaries.

- Phase 10S Guarded Real Write Execution Simulator is a local administrator simulator only. Simulation ready means eligible for a future simulator review gate, not actual registry write authorization, not registry write execution, not registry mutation, not production writer creation or readiness, not publication, not production package output, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10S simulator, validation, and handoff must preserve dry-run-only, actual-write-blocked, publish-blocked, package-replacement-blocked, production-writer-blocked, registry-mutation-blocked, simulated preflight, simulated write lock, simulated operation, simulated audit, simulated rollback, simulated failure handling, trace preservation, no actual registry write marker, no registry mutation marker, no production package marker, no current User App Shell package replacement marker, no production writer creation marker, and JSON round-trip boundaries.
- Phase 10T Guarded Simulator Review Gate is a local administrator review gate only. Review gate ready means eligible for a future real write approval boundary, not actual registry write authorization, not registry write execution, not registry mutation, not production writer creation or readiness, not publication, not production package output, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10T review gate, checklist, and handoff must preserve dry-run-only, actual-write-blocked, publish-blocked, package-replacement-blocked, production-writer-blocked, registry-mutation-blocked, simulated preflight review, simulated write lock review, simulated operation review, simulated audit review, simulated rollback review, simulated failure handling review, trace preservation, no actual registry write marker, no registry mutation marker, no production package marker, no current User App Shell package replacement marker, no production writer creation marker, and JSON round-trip boundaries.

- Phase 10U Real Write Approval Boundary is a local administrator approval-boundary layer only. Boundary ready means eligible for a future actual write authorization request, not actual registry write authorization, not registry write execution, not registry mutation, not production writer creation or readiness, not publication, not production package output, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 10U approval boundary, checklist, and handoff must preserve boundary-only scope, dry-run-only, actual-write-blocked, registry-mutation-blocked, publish-blocked, package-replacement-blocked, production-writer-blocked, audit requirements, rollback approval requirements, trace preservation, no actual registry write marker, no registry mutation marker, no production package marker, no current User App Shell package replacement marker, no production writer creation marker, and JSON round-trip boundaries.
- Phase 11A User App MVP Experience Reset pauses the registry chain after Phase 10U and returns focus to the ordinary-user local MVP shell. It is not Phase 10V actual write authorization, not real registry write execution, not registry mutation, not publication, not production writer creation, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 11A ordinary-user paths must hide registry, write gate, publish gate, simulator, approval boundary, production writer, Pipeline Trace, FaceMesh debug JSON, and other administrator-only terminology by default.
- Phase 11B User App Guided Step Experience Polish improves preparation, step guidance, mobile touch actions, and completion summary only. It is not Phase 10V actual write authorization, not real registry write execution, not registry mutation, not publication, not production writer creation, not current User App Shell package replacement, not backend work, not OpenAI/external API usage, not camera/AR scope, and not training input.
- Phase 11B ordinary-user paths must keep registry, write gate, publish gate, simulator, approval boundary, production writer, Pipeline Trace, debug JSON, and Template Studio administrator terminology hidden by default.
- Phase 11B-Fix changes Vision Analysis FaceMesh readiness labeling only. `readinessScore` is a rule-based usability score based on landmark count, region coverage, normalized coordinates, and face crop margin; it is not MediaPipe model raw confidence.
- The current browser MediaPipe FaceLandmarker integration does not expose a reliable single per-image face confidence in this project. Runtime `confidence` values remain legacy/internal compatibility metadata and must not be displayed as model certainty.
- Phase 11C User App Visual Guidance & Template Content Polish improves local
  ordinary-user template copy and guidance UI only. It is not Phase 10V actual
  write authorization, not real registry write execution, not registry
  mutation, not publication, not production writer creation, not current User
  App Shell package replacement, not backend work, not OpenAI/external API
  usage, not camera/AR scope, and not training input.
- Phase 11C ordinary-user paths must keep registry, write gate, publish gate,
  simulator, approval boundary, production writer, Pipeline Trace, debug JSON,
  Template Studio administrator terminology, and production readiness wording
  hidden by default.
- Phase 11D User App Demo Readiness & Operator QA is local demo/QA packaging
  only. It is not a production app, not public release, not Phase 10V actual
  write authorization, not real registry write execution, not registry
  mutation, not publication, not production writer creation, and not current
  User App Shell package replacement.
- Phase 11D confirms the current limitations remain: local MVP shell, no
  backend, no account, no database, no camera, no AR, no OpenAI or external AI
  API, no model training, no real photo upload, no real registry write, no
  publish, no production writer, and no production User App Shell package
  replacement.
- Phase 11D demo templates and product suggestions remain local fixture/demo
  content. Photo-to-template remains a semi-automatic draft chain with required
  operator review; it is not fully automatic high-quality makeup extraction.
- Phase 11D keeps Readiness Score as a rule-based detection usability score,
  not MediaPipe model raw confidence.
- Phase 12A Photo-to-Template Draft Reality Check confirms the current system
  supports semi-automatic template draft generation with human review only. It
  does not support or claim fully automatic high-quality makeup extraction from
  arbitrary photos.
- Phase 12A field evidence must keep real photo / FaceMesh / region QA signals
  separate from pixel rules, semantic rules, template rules, demo fixtures,
  placeholders, human-required fields, and unsupported fields.
- Phase 12A must not treat lip color, lip finish, blush placement, eyeshadow
  tone, brow shape, contour, highlight, template copy, beginner tips, common
  mistakes, correction tips, or User App preview as final real photo semantic
  extraction without human review.
- Phase 12A does not resume Phase 10V, execute registry writes, mutate registry
  state, publish, create a production writer, replace the current User App
  Shell package, add backend/camera/AR/API scope, upload real photos, store
  real user data, or train models.
- Phase 12B Makeup Semantic Extraction Baseline is candidate-only. It can
  produce local deterministic semantic candidates for lip color, lip finish,
  blush placement, blush intensity, eye makeup intensity, eyeshadow tone, brow
  definition, highlight signal, contour signal, and overall style, but it is
  not final recognition, not AI-confirmed extraction, not product shade
  matching, not medical or skin diagnosis, and not fully automatic high-quality
  makeup extraction.
- Phase 12B semantic candidates require human review and cannot mutate
  `UserAppTemplatePackage`, write registry state, publish, create a production
  writer, replace the current User App Shell package, add backend/camera/AR/API
  scope, upload real photos, store real user data, enter training datasets, or
  resume Phase 10V.
- Phase 12C Photo-to-Template Draft Integration & Human Review Editing is
  draft-only and operator-only. It can bind semantic candidates to draft fields
  and simulate local human review editing, but it cannot treat accepted
  candidates as final recognition, AI-confirmed extraction, product shade
  matching, medical or skin diagnosis, fully automatic extraction, registry
  readiness, publish readiness, production readiness, production writer output,
  `UserAppTemplatePackage` mutation, or User App Shell package replacement.
- Phase 12C binding and editing outputs must preserve source type, confidence
  band, evidence, limitations, original candidate value, editable draft value,
  reviewer decision, reviewer note, `humanReviewRequired`, and `notFinal`.
  These internal traces must remain hidden from the ordinary User App path.
- Phase 12D Photo-to-Template Operator Workflow & Draft Preview QA is
  operator-only and draft-preview-only. It can show step status, next action,
  allowed handoff, blocked reasons, and user-visible draft preview QA, but it
  cannot treat a preview as final recognition, AI-confirmed extraction,
  fully automatic extraction, registry readiness, publish readiness, production
  readiness, production writer output, `UserAppTemplatePackage` mutation, or
  User App Shell package replacement.
- Phase 12D internal traces such as sourceType, confidenceBand, evidence,
  limitations, reviewerDecision, reviewer note, `humanReviewRequired`, and
  `notFinal` must remain in Template Studio only and must not appear in the
  ordinary User App path.
- Phase 12E Photo-to-Template End-to-End Demo Script & Acceptance Trial is an
  operator/founder demo readiness layer only. It is not production readiness,
  not registry readiness, not publish readiness, not fully automatic makeup
  extraction, and not real user data collection.
- Phase 12E acceptance trial must keep registry write, registry mutation,
  publish, production writer, User App Shell replacement, backend/API,
  camera/AR, OpenAI/external AI, training, real photo storage, base64, local
  photo paths, personal data, and biometric data blocked.
