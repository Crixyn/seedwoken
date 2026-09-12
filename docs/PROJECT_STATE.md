# Project state — GitHub integration preparation

## Real checkpoints

| Stage | Source commit | Status |
| --- | --- | --- |
| Archive v1.6 baseline | 66d0459 | Preserved |
| Milestone 2 | 3bfc8e1 | Geographic pipeline implemented; user reported local rendering |
| Milestone 2.1 | e52978e | Hydrology/terrain calibration implemented; visual gate open |
| Milestone 2.2 | 35afffd | Environment/material/input upgrade implemented |
| Milestone 2.2A | f9f233d | Mobile HUD correction implemented; current application baseline |

Existing rollback-before-elaris-* tags retain real source snapshots. Migration changes documentation, ignore rules and preservation artifacts only; no world development is included. GitHub account access was recognized, but no repositories were exposed and the preferred repository returned 404. No repository creation capability or local gh executable was available. GitHub is not yet the development source of record.

## Verification and outstanding issues

Prior 2.2A validation: 29 tests and production build passed. Mobile DOM checks covered 384×824, 320×740 and 824×384; desktop 1440×900 retained navigation. Clean view, restoration and tools were exercised. This is not real-device multi-touch or WebGL scene verification.

Known baseline TypeScript failures: missing Cloudflare Worker module/binding declarations and two union-addition errors in app/page.tsx (11 reported errors). Lint has three existing WorldExplorer errors: two effect-state updates and a portable root anchor. Image optimization warnings remain. Migration verification results are recorded separately in MIGRATION_VERIFICATION.md.

Managed browser WebGL is unavailable. User reports of desktop 80–111 FPS and mobile displayed 60 FPS (and 31 FPS in one Nythrune view) are observations of earlier local tests, not sustained or newly measured performance. The HUD patch supplies no GPU benchmark.

Local QA must verify rivers/confluences, lake margins, mixed-LOD transitions, vegetation grounding, shaders, snow, atmospheric depth, repeated continent switches, simultaneous movement/camera touch, pointer cancellation, tutorial placement, safe areas and browser chrome changes. The Elaris quality gate remains open.

## Canon and preservation

233 archive records, original references, source identifiers, conflicts and species data must remain intact. Classifications are CANON, SUPPORTED, INFERENCE, PROPOSAL, EXPERIMENTAL, CONFLICT, UNKNOWN and REJECTED. Unknown native species ranges remain unknown. Do not treat the specimen grove as evidence of habitat.

Reference projection, canonical dimensions, hidden terrain and exact named tributary assignment remain unresolved. Experimental relief, water widths, climate, substrate and individual vegetation positions are not canonical facts. No further continent reconstruction is authorized in this migration.
