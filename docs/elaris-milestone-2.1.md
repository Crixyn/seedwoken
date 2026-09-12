# Elaris geographic calibration — Milestone 2.1

Continues Milestone 2 in the same PHYVERA project. Before editing, source `3bfc8e110909b1faeba6b98a511df231b4302e25` (saved Site version 9) was pinned and pushed as `rollback-before-elaris-m21-20260911`. The user confirmed that Milestone 2 renders locally, with working movement, atlas, ecology, archive and approximately 80–111 FPS. Those are user-reported baseline observations, not measurements of this revision.

## Changes

- River courses use shape-preserving cubic curves through the original reference controls, sampled into shared terrain/rendering stations. North-to-south ordering and confluence endpoints are preserved. This replaces straight water ribbons and polygon-corner carving.
- Channel widths respond to downstream flow proxies, tributary rank, longitudinal gradient and confinement by surrounding relief. Tributary contributions transition gradually around confluences. Distributaries have a smaller growth allowance than the main river. Depth varies with flow and gradient. These are experimental morphometric proxies, not measured discharge or a water-balance simulation.
- Parabolic submerged sections transition through gradual banks, floodplains and broader valleys. Adjacent channel profiles combine at confluences rather than selecting a single nearest channel and producing boundary walls. The outgoing channel is carved after lake blending so basin grading cannot close the outlet.
- Lakes retain reference centres and fixed outlets. Their shore contours respond to surrounding uplift and bounded geological variation. Terrain sampling, exported contours, the atlas and water meshes use the same shoreline function. Ellipse-only water meshes are removed for Elaris.
- Mountain relief now has an axial uplift envelope, massif variation, lateral spurs, secondary structure and gully-shaped reductions tied to the mountain axis. Nearest segments are blended to avoid sudden phase changes at range bends. This is a hierarchical geometric erosion analogue, not a time-stepped erosion simulation or tectonic reconstruction.
- Tiles use identical boundary rings at every LOD, stitched to variable-resolution interiors by a zipper triangulation. The old deep skirts are removed. Heights, colors and world-gradient normals match on shared edges; normals no longer depend on each tile's triangle resolution. Refinement retains the 4 ms sampling budget.
- Delta wetland suitability now tapers with river proximity and regional position rather than terminating at hard rectangular coordinate limits. Vegetation assets, instance distribution architecture, movement modes, atmosphere and the other five continents are preserved.
- Atlas diagnostics now show original control polylines alongside calibrated courses, actual lake outlines and evaluation landmarks. Side-by-side reference comparison complements the opacity overlay. Channel width ranges and the limits of reference registration are exposed. Structured calibration and CPU reports are downloadable.

## Reference fidelity

The authoritative input file `elaris-geography.mjs` is unchanged from Milestone 2. Coastline, island groups, mountain axes, lake centres, source/outlet controls, landmark coordinates and canon classifications are preserved. Every original river control appears in the calibrated curve. Automated checks bound departures from original control segments to less than 0.02 normalized units (1.2 km in the experimental model domain), and curve lengths to less than 110% of the original polylines. These are guardrails, not a claim that every control was perfectly digitized from the oblique illustration.

The accepted Reference 001 remains visible for comparison. Exact projection, hidden relief and canonical dimensions remain unresolved. Generated shore detail and river morphology are INFERENCE/EXPERIMENTAL. The original reference material, alternate depiction and conflict notes remain available. All 233 archive records and original reference assets are preserved. No species range was invented. Sahrel and Caelune reconstruction was not started.

## Verification and performance

All 25 tests pass: the existing suite plus four calibration checks. The existing river-bed test now evaluates the actual calibrated courses rather than the superseded straight interpolation; it retains all descending-level and submerged-bed assertions. Added checks verify source-control retention, corridor bounds, variable widths, tributary scale, fixed lake outlets, irregular submerged lake interiors, identical LOD boundary rings, exact triangle area coverage, edge-manifold counts and absence of flipped or degenerate triangles. Actual neighboring mesh edges match heights, normals and colors. The existing resource-turnover and mesh-buffer tests remain enabled.

Production build passes. Type checking reports only the same baseline missing Cloudflare Worker declarations and two union-addition errors in `app/page.tsx`. Lint retains the baseline three errors in `WorldExplorer.tsx` (two effect-state rules and the plain root anchor used by the portable exporter); no new lint error was introduced. Image-optimization recommendations remain warnings.

`public/world/elaris-performance.json` records a reproducible CPU-only comparison of 10,000 identical locations over five interleaved warm runs, against the exact rollback source. The sampling algorithm initially cost about 53% more CPU; eliminating redundant reach searches reduced the observed overhead to roughly 17% in a subsequent run. The final report contains the latest timings. This cannot establish GPU FPS. Shared-edge caching, bounded refinement, instancing and limited local vegetation cells remain in place.

No visual or WebGL performance verification of Milestone 2.1 is claimed. The managed browser's previously confirmed WebGL restriction was not bypassed. The user's local PC is the final visual/performance gate.

## Local comparison gate

Open the updated standalone HTML in the same local browser and use the same quality, hour, weather and window size as the baseline. Compare river valley, tributary joins, headwater lakes, northern mountain divide and delta from ground and survey views. Cross several tile edges and change altitude/quality. Inspect the atlas in overlay and side-by-side modes. Record FPS and visible issues at each location. In particular, check bank integration, distant narrow-channel visibility, lake margins and LOD transitions; these still need graphical acceptance. Do not begin another continent until those results are satisfactory.

Rollback remains available through saved Site version 9 or the dedicated source tag. The live Site is unchanged; this saved implementation is delivered through the updated standalone file.
