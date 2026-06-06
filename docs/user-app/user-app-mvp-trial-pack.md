# User App MVP Trial Pack

Phase 8C defines the first internal / small-scope MVP trial pack for the local mobile Web/PWA shell.

## Goal

Validate whether a user can understand the makeup guidance flow, choose a template, follow steps, use tool/product guidance, understand privacy boundaries, and decide whether the templates feel valuable.

## Included Trial Tasks

1. Open the local App Shell.
2. Browse the current recommended makeup look.
3. Select one makeup template.
4. Read template detail.
5. Start step-by-step guidance.
6. Complete at least three local steps.
7. View tools and product suggestions.
8. View region guidance.
9. Set or skip local preferences.
10. Read the privacy notice.
11. Exit and restore local progress.

## Trial Boundary

This is not a production release, online user growth campaign, App Store test, TestFlight build, backend form, analytics flow, or training collection.

The trial pack is deterministic and local-only. It does not collect real photos, does not request camera permission, does not upload data, does not use AR, does not create accounts, does not sync to cloud, and does not write trial feedback into training datasets or project-state user records.

## Admin Surface

The User App Shell exposes the trial pack only under administrator checks:

- MVP 试用包
- 反馈表预览
- 试用就绪度

The ordinary user path remains focused on 跟练, 发现妆容, 我的准备, 我的偏好, 照片占位, 本地进度, and 隐私说明.
