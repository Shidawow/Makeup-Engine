# Makeup Engine v0.1

## Goal

Build a structured makeup template editor.

The system should support:

- Makeup templates
- Structured makeup regions
- Step-by-step makeup instructions
- Makeup action DSL
- JSON export/import

---

# Core Modules

## 1. Makeup Template

Contains:

- metadata
- style tags
- regions
- steps

---

## 2. Makeup Regions

Supported regions:

- base
- brow
- eye
- contour
- blush
- lip

Each region supports structured parameters.

---

## 3. Makeup Steps

Each step contains:

- region
- visual goal
- tool
- action
- placement
- effect

---

## 4. Action DSL

Actions include:

- blend
- tap
- drag
- smudge
- line
- fill

Each action supports:

- direction
- pressure
- repeat
- speed

---

# Tech Stack

- React
- TypeScript
- Vite

---

# Initial UI

Need:

- left sidebar
- region editor
- step editor
- JSON preview

---

# Future Goals

- AI-generated makeup steps
- CV face adaptation
- AR guidance
