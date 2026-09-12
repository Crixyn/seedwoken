# Milestone 2.2 — mobile exploration and environment study

Continues the same project and portable HTML. Rollback is saved Site version 10, source `e52978e7ae7b9cca9bcbd5b44bf4fb51a71e9ab5`, pinned before edits as `rollback-before-elaris-m22-20260911`. The previous HTML remains version 3 in its existing file history. No live deployment is authorized or performed.

## Implemented

- Compact phone HUD, expandable readings, atlas-based continent selector, independent thumb zones, portrait/landscape rules, safe-area spacing, dynamic viewport height, and clean-view restoration. Desktop retains continent cards.
- Pointer ownership and cancellation state, interruption resets, modal input suspension, multi-finger tap suppression, flight ascent/descent, speed steps and fast traversal. Existing orbit/pan/pinch and movement modes are retained. Actual simultaneous touch movement requires local hardware validation.
- Analytic world-space terrain material: broad substrate variation, rock blending by slope, bedding and fine grain, with normal perturbation above Mobile quality. No external texture dependency. This is shading detail, not displacement geometry.
- Additional axial secondary ridges and branching rib relief within the existing mountain envelope. Original source controls are unchanged. These are geometric approximations, not simulated erosion.
- River center/inner-bank/outer-bank and lake shoreline samples inserted into the existing tile triangulation. This reduces unresolved narrow channels without replacing shared boundary rings. Points on existing triangle edges are skipped to avoid degeneracy; exact constrained river edges and universal water/mesh intersection freedom are not established. Inspect tile crossings and distant narrow rivers locally.
- River water meshes now have five cross-channel samples carrying variable depth and course-aligned flow. Lake meshes have radial depth bands. Shared water shaders distinguish ocean, lake and river appearance, with depth-sensitive tint/opacity, animated normals, restrained shallow foam and inexpensive Fresnel sky tint. This is not ray-traced reflection, a depth-buffer shoreline pass or fluid simulation. Ocean depth is sampled on a coarse grid.
- Snow coverage is separate from the climate biome label and depends on temperature, slope and moisture. Exposed steep rock is retained even within a snow biome. Seasonal accumulation is not simulated and thresholds remain experimental.
- Reduced clear-weather haze, stronger light/ambient contrast and thicker cloud masses replace the former flattened cloud forms. Clouds remain inexpensive mesh approximations.
- Ecological clustering, varied canopy proportions, local ground cover retained, and lower-cost shared distant/prototype canopy geometry. Mobile halves Elaris local planting attempts and reduces other-continent vegetation attempts. Nythrune buttress meshes are omitted on Mobile. Other continents' geography is unchanged.
- Mobile/Balanced/High presets cap pixel ratio at 1/1.35/1.75. Geography does not change by preset. High retains shadows. Local vegetation remains limited to nearby cells; a forest impostor system and detailed botanical assets are not implemented.
- Added evaluation destinations, explicit reference correspondence register, frame-time/tile/instance readings and copyable evaluation reports with a text fallback.

## Reference and preservation

Reference 001 was visually inspected before edits. It shows snow concentrated on northern peaks, exposed ridges, forested lake country and lowland floodplains. Existing oblique-image controls were preserved rather than reinterpreting the silhouette. All 233 records, original reference files, classifications, unresolved names and species distributions remain unchanged. Surveyed projection, hidden relief, canonical dimensions and measured climate remain unknown. Material and erosion details are experimental. Sahrel and Caelune reconstruction was not started.

## Verification

- All 29 automated tests pass, including prior preservation, hydrology, mesh continuity and resource-turnover tests, plus touch ownership/reset, inserted triangle area/winding, bounded snow cover and shader-hook assembly checks.
- Production build passes. Type checking retains the existing missing Cloudflare declarations and two app/page union-addition errors. Lint retains the three pre-existing WorldExplorer errors (effect-state rules and portable root anchor); image recommendations are warnings. Shader-hook assembly tests are not GPU shader compilation tests.
- Actual application DOM inspected at 390×844, 844×390 and 320×740. Movement, speed, side controls and mode-row rectangles do not overlap in those layouts. Settings, archive (233 matching records), atlas and clean-view restoration were exercised. Active rendered-scene hints/readings and real multi-touch cannot be fully verified because this browser fails to create a WebGL context.
- CPU-only benchmark: 10,000 identical locations, five interleaved warm runs against exact M2.1 geography. Observed median 293 ms baseline vs 304 ms revised, approximately 3.9% overhead. See embedded elaris-performance.json. This does not measure mesh upload, shaders, rendering FPS or touch latency. Constraint insertion and geometry upload happen outside the existing 4 ms sample-loop budget and may cause occasional refinement spikes; local frame-time inspection is required.
- New GPU FPS and visual quality are unverified. No WebGL restriction was bypassed.

## Local acceptance check

Open the updated HTML on the same phone and desktop. Check portrait and landscape, movement while dragging the camera, flight ascent/descent, cancelled touches and panel opening. Compare each preset at the same location/time/weather. Visit northern lake country, lake outlet, major divide, confluence, delta and terrain-boundary destinations. Inspect submerged river beds, bank joins, shoreline edges, snow transitions, distant river visibility, vegetation grounding and refinement stutter. Copy the evaluation report and capture the problem view if something is wrong.

Elaris's visual/geographic quality gate remains open until these checks pass. Do not expand reconstruction to another continent based only on the passing automated suite.
