# Elaris geographic reconstruction — Milestone 2

Implementation checkpoint, 2026-09-10. The full Elaris quality gate remains open because the available managed browser disables WebGL. This checkpoint is not claimed to be a visually approved or GPU-performance-verified continent.

## Baseline and preservation

Continues the same PHYVERA project and React / Three.js / Vinext / Cloudflare architecture. Baseline source is `66d045981b2d26b1b9e5fb3f7346db7acf0edf92`, saved Site version 8. Before source edits, the tag `rollback-before-elaris-m2-20260910` was created and pushed to the existing remote. Rollback by deploying saved version 8, or reverting the milestone source commit and rebuilding. Do not reset away subsequent work.

The existing `terrain.mjs` and `world-data.ts` remain byte-identical. Sahrel, Caelune, Vulkara, Thyrra and Nythrune use their original heightfields, water and vegetation. Continent switching, atmospheric controls, species guide, specimen studies, source search, source detail and portable export remain present. No database, authentication, API, migration, binding or existing live record was changed. The 233-record archive and every existing reference asset are retained.

## Canon and reconstruction

The accepted Elaris Geographic Reference 001 is the image embedded as `codex-plate-elaris` (original SHA-256 `0dc848997ae511b07fa583c0da9521ae36ed86504d707608ae7d36ebbbb73d0a`). Both the recovered v1.3 plate and the preserved v1.5 plate were inspected; the v1.6 text repeats its geographic constraints. Elaris-specific archive entries and current Codex text were read. The alternate `7607397d8bddcece` image was also inspected: it depicts more prominent western snow peaks and different interior detail. It remains preserved as an unverified alternate; the new spatial relation records the unresolved visual conflict and does not change its original archive classification.

The mainland boundary, eleven island groups, four mountain/divide systems, a plateau, eight connected river/distributary traces and three lake basins now come from explicit structured inputs. Traces follow recognizable features of the accepted plate. North is at the top of reference space. **The accepted image is oblique, not a surveyed map.** Tracing it does not recover its projection, hidden terrain, physical distances or precise drainage boundaries. Coastline microstructure and many small islands remain below the current trace resolution.

The Vaelorin identity, general source-to-delta route and major geographic regions are grounded in canon. The named Silren, Mossrun, Avenwater, Briarwash and Orin’s Fork remain unassigned to exact channels. Numerical climate, bed elevations, widths, local mountain relief, soil proxies, prevailing westerlies and individual vegetation positions are experimental or inferred. The 120 km-wide model domain is about 67 times the original 1,800-unit domain width; it is still compressed and **does not establish Elaris's canonical size**. Heights reach roughly 3,200 model metres at sampled northern peaks. These are not comparable to the unchanged other continents' prototype-unit elevations.

## Reusable pipeline

| Layer | Implementation | Role |
| --- | --- | --- |
| Structured inputs | `elaris-geography.mjs`, `geography-types.ts` | Boundary, islands, ridges, plateau, channels, outlets, climate parameters, regions, provenance and spatial relations |
| Terrain and environment | `geography.mjs` | Generic compiler; signed coast distance, ridge envelopes, valley/bed carving, lake basins, temperature, moisture, rain shadow, slope, drainage/soil indices and vegetation suitability |
| Catchment diagnostic | `drainage.mjs` | D8 priority-flood analysis, acyclic downstream links, depression-fill diagnostic, contributing area and channel catchments |
| Terrain rendering | `geographic-terrain.ts` | 144 persistent coarse tiles; adaptive 8/24/64 or 96-segment detail, shared edge samples and skirts; refinement sampling limited to about 4 ms per frame |
| Ecological rendering | `createLocalEcology` | Deterministic 900 m cells, at most nine nearby cells; instanced trunks, conifer/broadleaf crowns and ground cover; old cells and instance buffers released |
| Exploration | `scene.ts`, `WorldExplorer.tsx` | Preserved survey/ground systems, flight, speed 0.25–32×, Shift sprint, Page Up/Down, position, altitude and renderer statistics |
| Reference inspection | `GeographyPanel.tsx` | Terrain/elevation/moisture/watershed maps, reference-opacity comparison, regional zoom, selected-point metadata, evaluation travel and source links |
| Export | `scripts/export-geography.mjs` | Structured input plus 129×129 drainage grid in `public/world/elaris-geography.json`; included in the standalone HTML |

The compiler was tested with independently modified structured input without adding continent-specific branches. Other continents were not reconstructed merely to demonstrate reuse. The old terrain implementation is a preserved fallback, not a second active Elaris source for the renderer.

Temperature follows north–south position and elevation. Moisture incorporates experimental rainfall, ridge shelter, channel proximity and slope. Cover suitability decreases with cold, steepness, low moisture and standing water. Jitter controls individual placement, not whether an environment is suitable. This is an ecological suitability model, not population dynamics, succession, species simulation or a validated Vaeloran climate model.

The monotonic longitudinal water datum gives tributaries matching confluence levels. Lake surfaces use the elevation of their outgoing channel. Terrain beds lie below water along tested traces. D8 depression filling is an analysis product and does not silently flood or modify the rendered terrain. Rivers are static water surfaces with animated visual ripples, not a fluid simulation. Coarse distant geometry, channel-bank fidelity and mixed-LOD appearance still require WebGL review.

## Spatial data and unknowns

The eight required classifications are supported without recategorizing the original archive. Region/source links connect Vaelorin and southern wetlands to their supporting records. All six species retain `UNKNOWN` native ranges with null continent/region values. The specimen grove remains a staged study, never evidence of a native population. The archive source IDs resolve to retained records; the full Codex can be opened from each relevant spatial entry.

## Verification

- Production build succeeds. All 21 available tests pass: 12 existing checks plus 9 geography/mesh checks.
- Tests cover reference land/ocean anchors, river-bed clearance, downstream levels, confluences, lake outlets, continuous samples, environmental bounds, climate response, drainage acyclicity and contributing-area conservation, compiler reuse, source preservation, actual mesh attribute/index validity, bounded tile geometry and vegetation resource turnover.
- A CPU-only mesh/streaming test completed in approximately 2 seconds with 30–35k generated vertices at its stopping point. This is not a frame-rate or GPU-performance claim. The 129×129 catchment export took about 356 ms in this environment; timings are observational, not universal performance guarantees.
- Browser UI checks passed for atlas opening, reference overlay, map layers, unknown-range filtering, spatial source-to-Codex navigation, archive search (13 Elaris matches), and six species entries including Lilloryn. Exploration and time-of-day sliders are present.
- Browser rendering fails before scene construction because the managed Chrome reports `GL_VENDOR = Disabled` and cannot create a WebGL context. The browser security policy also rejects graphics-settings access. No workaround was attempted. Ground/flight movement, continent rendering, atmospheric appearance, terrain seams, water visuals, mobile rendering and GPU frame rate remain **unverified**.
- Repository TypeScript checking still reports the baseline missing Cloudflare Worker types and two `app/page.tsx` union-addition errors. No new world/geography TypeScript errors remain.
- Repository lint still reports the same three pre-existing `WorldExplorer.tsx` errors: two synchronous effect-state warnings promoted to errors and its plain root anchor (used by the standalone exporter). Running the same lint against the rollback file reproduces these errors. Image-optimization and an unused baseline test constant produce warnings. No new lint error was added.

## Remaining quality gate

Use a WebGL-capable browser to compare Elaris against Reference 001 at the northern divide, both headwater lakes, river valley, western island chains, southwestern bay and delta. Check ground and flight controls at multiple speeds; inspect high/balanced detail, banks and tile transitions; record actual frame time and memory while travelling and switching continents. Only after that review should the pipeline be considered proven or applied substantially to other landmasses. The implementation checkpoint and rollback are ready; this verification dependency remains open.
