# Development handoff

1. Read README.md, PROJECT_STATE.md and ELARIS_GEOGRAPHY.md, then the 2.2 and 2.2A milestone reports.
2. Inspect app/world/page.tsx and components/world/WorldExplorer.tsx for entry/lifecycle/UI. world.css provides desktop and dedicated mobile layouts. exploration-input.mjs owns touch motion, reset behavior and quality tiers; scene.ts applies movement and camera behavior. UI interactions must not propagate to world gestures. Opening panels, cancellation and loss of focus must clear input.
3. Inspect elaris-geography.mjs before geography.mjs, hydromorphology.mjs, drainage.mjs and geographic-terrain.ts. Geographic controls, terrain compilation, reference-constrained channels and diagnostic drainage are separate layers. Do not edit generated JSON instead of its source.
4. Preserve public/world/archive.json and every original reference. Verify all 233 records and source classifications against the baseline. Never infer native species ranges from visual placement.
5. Install locked dependencies, run npm test, npm run lint and npx tsc --noEmit. Compare failures with the recorded baseline. Run the standalone exporter after a successful build, as documented in README.
6. Use a local WebGL browser for final scene validation. Automated checks cover sampling, mesh continuity, hydrology relationships, environment, archive and input state; they cannot approve the Elaris visual gate.

## Import and rollback

The real 2.2A application checkpoint is f9f233d847353d2c60125a9c64dad8735b38d185. Existing rollback tags retain older source. Inspect historical versions with git show or a temporary checkout; do not reset away current work. The migration commit adds documents, ignore rules and the existing standalone artifact only. The migration archive preserves the shallow Git checkout and all available milestone commits/tags. Earlier ancestors are unavailable locally; do not claim complete pre-baseline history.

Once the private GitHub repository is available, inspect it before pushing. Push main and the preserved tags without force; verify remote commit and privacy. Do not overwrite a populated unrelated repository. No production deployment workflow should be connected. Keep the existing project structure, including inherited server context; deployment is distinct from source control.

Do not silently promote generated morphology, climate, snow, vegetation, source registration or numerical dimensions to CANON. Preserve SUPPORTED, INFERENCE, PROPOSAL, EXPERIMENTAL, CONFLICT, UNKNOWN and REJECTED independently. Local QA should cover survey/ground/flight, water/terrain alignment, boundary transitions, materials, snow, dense vegetation, frame times and mobile input at portrait/landscape sizes.
