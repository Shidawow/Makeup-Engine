# Local Dev Runbook

## Install

Use a clean install when setting up a new machine:

```bash
npm ci
```

For normal local iteration when the lockfile is already trusted:

```bash
npm install
```

## Dev Server

Run:

```bash
npm run dev
```

Vite normally serves the app at:

```text
http://localhost:5173
```

If the port is occupied, Vite may choose another local port and print it in the terminal.

## Template Studio Entry

Template Studio code lives under:

```text
src/components/template-studio
```

Use the app shell and existing Template Studio tests to verify the operator workflow before changing UI behavior.
