# Vaelora 3D World Trial — 2026-09-10

The existing owner-private PHYVERA is preserved. Rollback source: 43b87e962c39188b1c67f756345477d90980b0d2, tagged rollback-before-vaelora-3d-20260910. No database schema, live records, authentication, or existing features are replaced.

## Delivered experience

/world adds six explorable continent interpretations: Elaris, Sahrel, Caelune, Vulkara, Thyrra, Nythrune. Procedural terrain, coastlines, water, vegetation, geology, atmosphere, time-of-day controls, survey/ground navigation, click-to-travel, touch joystick, landmarks, canonical reference panels and an attributed source archive. Six optional experimental botanical blockouts are staged in Elaris; this placement is not a species range claim. The standalone exporter bundles the same renderer and source collection into one HTML file, with no API key or network requirement for exploration. Drive video links still require internet and access.

## Recovered corpus

233 records: 26 documents, 199 image records and 8 video records. Includes Codex v0.1–v1.6, project directives, current Codex embedded plates, named creature/terrain images, the Drive game master and visual index, Library video variants and two linked Drive animations. The First Rain v17 source and 151-file original asset inventory were inspected; useful raster assets are included as historical references. One identical-text source pair is retained with distinct source identities and duplicate annotations.

Library and Drive originals remain authoritative. The app carries optimized image previews and extracted document text with source IDs, dates and SHA-256 fingerprints where available. Video records are indexed or linked, not embedded in the 3D renderer. No claim is made to having watched every video or recovered every conversation.

## Source hierarchy and conflicts

Codex v1.6 is the latest recovered canon. Species sequence: 001 Rosavyn; 002 Solavyr; 003 Tomavyn; 004 Lilavyn; 005 Irivyn; 006 Lilloryn, the last three locked concepts only. Nymphara and Mycelith are rejected. Every species now has an explicit sex-differences entry distinguishing established traits from proposed mechanisms. The exploratory atlas name Helivyn is not adopted. Lilavyn poster Species 002 is superseded. Solavyr male capitulum faces forward; female capitulum faces backward on its own upper-back peduncle. First Rain sunflower/camas/fern names and water-driven awakening are historical prototype ideas, not current species or Kindling canon. The old prototype remains untouched at source 7e8c1684fab9ebc152318911c5eaaacfa50d50a7.

The three accepted continental plates anchor major features. Local geometry and approximate silhouettes are interpretations, not map digitizations. Vulkara, Thyrra and Nythrune have text-grounded but provisional geography. Distances, absolute elevation, exact planetary arrangement, local species ranges and Mount Aevor morphology remain unresolved. No Firstroot location, human population, civilization map or invented canon is asserted.

## Coverage limits

Conversation retrieval initially failed twice; a later targeted query recovered user approval for Concepts 005/006. Broad conversation recovery remains incomplete. Unindexed conversations, unnamed media, inaccessible project state, and any unreturned material may remain missing. The Drive canonical-images and working-references folders were empty when inspected. Existing live PHYVERA database records are preserved and are not mirrored into this offline source collection.

## Validation

Production build succeeds. Four numeric terrain tests pass for determinism/bounds, downstream water profiles, Crownspine prominence and island separation. Three existing architecture checks pass. Archive asset paths and unique record identities are checked; standalone JavaScript parses successfully. Browser/visual QA was not performed because it was not requested. A repository-wide TypeScript check surfaced existing Cloudflare typing and existing app union-concatenation errors; no new world-file errors were reported. The trial is a source-grounded 3D prototype, not final photoreal terrain or production creature models.

## Reuse

components/world/terrain.mjs is renderer-independent deterministic terrain logic. world-data.ts preserves content/provenance separately from scene.ts. Height-grid export labels coordinates as experimental prototype units. Run scripts/export-world.mjs with an absolute HTML destination after building the application to regenerate the portable trial. This file is a handoff record, not a new canon document.

Continuation: v1.6 adds Irivyn and Lilloryn and explicit biology/sex-difference notes. The earlier saved trial version remains available as a rollback.
