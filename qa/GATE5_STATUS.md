# FEW Quest + StoryVerse Gate 5 — Production and browser verification

## Confirmed in this environment
- Node v22.16.0, npm 10.9.2 and Chromium installed.
- `npm view react version` fails with DNS `EAI_AGAIN registry.npmjs.org`.
- `package-lock.json` is absent from the supplied checkout; `npm ci` cannot run until a lockfile is generated and committed.
- No production build or browser regression has been executed. Browser test scripts are **prepared**, not passed.
- Original FEW Quest source files are unchanged in the integrated candidate.

## Reproduction steps (network-enabled machine)
1. Unzip and enter checkout.
2. Run `bash qa/run-production-gate.sh` (installs dependencies, runs typecheck, lint, build, unit tests, starts app and HTTP route smoke tests).
3. To capture browser screenshots while the app runs, run `bash qa/chromium-smoke.sh` in another terminal.
4. Review `qa/results` and manually verify role permissions, StoryVerse navigation, mobile behavior, and accessibility. HTTP status smoke checks **do not** prove role-based authorization correctness.
5. Commit the generated `package-lock.json` only after dependency versions are reviewed, then use `npm ci` for reproducible CI.

## Deployment rule
Do not merge, run Supabase migrations, or deploy until all checks pass and browser interactions and permissions are verified.
