# Preferences To Guidance Hints

Phase 7D maps local preferences into display-only guidance hints.

## Mapping Rules

- beginner users see slower pacing, correction tips, and common-mistake reminders.
- advanced users can receive more concise hints focused on finish quality.
- short available time highlights key steps and estimated seconds.
- limited tools show runtime alternatives where appropriate.
- natural style preferences emphasize soft pressure, low intensity, and gradual build-up.
- cautious comfort level keeps reminders conservative.

## Contract Boundary

Preference hints do not change contract data.

They must not:

- mutate `UserAppTemplatePackage`
- mutate `UserAppTemplate`
- change makeup step order
- change region instructions
- create training input
- create a durable user profile export
- write user preferences into project-state
- infer sensitive attributes

## No Photo Requirement

Guidance still works without a user photo. Preferences are local text hints layered over `UserAppTemplatePackage`, not photo analysis and not personalization from biometric data.
