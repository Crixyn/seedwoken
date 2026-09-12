# Migration verification — 2026-09-11

- npm test: production build passed; 29/29 tests passed.
- npm run lint: existing 3 errors and 11 warnings; not a clean lint gate.
- TypeScript --noEmit: existing 11 errors (Cloudflare declarations/bindings and app/page.tsx union addition); not a clean type gate.
- Archive: 233 records; byte-identical to f9f233d. All components/world and public/world files unchanged.
- Standalone regenerated successfully with 229 embedded assets; inline JavaScript parsed. Preserved deliverable is the original current export, not overwritten by regeneration.
- Scanned 406 historical Git blobs for common credential/token/private-key patterns; no matches. This is a bounded pattern scan, not a guarantee against every possible secret format. Largest historical blob: 1,040,817 bytes before adding the standalone.
- No GitHub Actions workflow added. No live deployment performed.
- WebGL visuals and GPU FPS not measured during this source-control task.
- GitHub import BLOCKED: linked account recognized, no repositories exposed; Crixyn/seedwoken-vaelora-3d returned 404 (absent or inaccessible). Available connector cannot create repositories; local gh is unavailable.

Excluded: node_modules, build caches/output, compiler state, local runtime/authentication data and environment secrets. The original standalone HTML is deliberately included under deliverables. Source history and existing rollback tags are retained in the migration archive. Original platform README is preserved as INHERITED_PLATFORM.md.

A plain bundle failed independent restoration because the inherited checkout is shallow. The deliverable is instead a source archive including Git objects, refs and shallow metadata; local remotes/auth configuration are excluded. Generated standalone whitespace is preserved byte-for-byte.
