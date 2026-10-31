# Gate 6: Reader integrity and source-preservation checks

- Original FEW Quest uploaded ZIP source comparison: **PASS**. Checked 70 original files; changed/missing: 0
- Existing guest-progress suite: PASS
- Existing catalogue/rewards suite: PASS
- First-answer reader source assertion: PASS
- Fixed StoryReader so a question cannot be answered repeatedly for credit; choices disable after first answer. Optional questions remain skippable.
- `npm install --ignore-scripts --no-audit --no-fund --fetch-retries=0 --fetch-timeout=7000 --prefer-offline` failed: `EAI_AGAIN registry.npmjs.org`.
- Production build, full typecheck, lint, browser regression: **NOT RUN**; do not mark as passed.
- No GitHub push, database change, or deployment.

## Reproduction

From the extracted checkout:

```bash
python qa/source-integrity.py /path/to/Few-quest-main.zip .
node storyverse-offline-tests.cjs
node storyverse-catalog-tests.cjs
node qa/reader-first-answer-test.cjs
bash qa/run-production-gate.sh
```

Do not merge or deploy until npm dependencies, build, browser tests and security checks pass. The first-answer check is a source assertion, **not** a browser interaction test.
