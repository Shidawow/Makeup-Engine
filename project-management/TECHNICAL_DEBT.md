# Technical Debt Register

## Current Debt

### 1. Legacy UI still exists alongside engine-first architecture

- Risk: accidental import direction drift.
- Mitigation: architecture guard tests and future UI isolation work.

### 2. Test harness is custom and lightweight

- Risk: maintenance friction versus a standard framework.
- Mitigation: keep harness deterministic until a framework decision is made.

### 3. Renderer is still mock-only

- Risk: no visual backend realism yet.
- Mitigation: introduce renderer adapters incrementally.

### 4. Compiler and runtime graph are still evolving

- Risk: contract churn.
- Mitigation: snapshot tests and pipeline integration tests.

### 5. Intelligence rules are rule-based only

- Risk: limited inference depth.
- Mitigation: add scoring, heuristics, and future model adapters.

### 6. Test harness still uses a lightweight custom layer for some legacy paths

- Risk: duplicate execution styles during transition.
- Mitigation: converge all new coverage on Vitest and retire legacy runners gradually.
