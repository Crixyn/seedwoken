# Elaris geographic architecture

## Inputs and coordinates

Start with components/world/elaris-geography.mjs and geography-types.ts. The accepted Elaris Geographic Reference 001 is preserved as codex-plate-elaris in public/world reference material. The archive and GeographyPanel retain provenance, alternatives and comparison access.

Image UV is mapped to normalized x/z coordinates, north toward negative z. Normalized coordinates scale by 60,000 model metres, giving a 120 km domain. This is an experimental inspection scale. The oblique illustration supplies no surveyed projection or canonical distances. Hand-traced coastline, island groups, range axes, plateau, river controls, lake centres/outlets, regions and landmarks approximate visible relationships; hidden relief is unknown.

## Terrain and water

geography.mjs compiles structured data into coast distance, uplift, ridge/massif/spur relief, valley carving and environmental fields. This is geometric relief/erosion approximation, not tectonic or time-stepped erosion simulation. geological details do not establish canon.

geographic-terrain.ts maintains 144 coarse terrain tiles and refines interiors near the observer. Shared boundary rings, zipper triangulation and world-gradient normals preserve matching edges across detail levels. Refinement sampling has an approximately 4 ms budget; geometry construction can still cause spikes. terrain-constraints.mjs inserts local channel/shore points while retaining tile boundaries. On-edge constraints may be skipped; narrow water alignment still needs visual review.

hydromorphology.mjs uses reference-constrained, shape-preserving curved river stations shared by terrain carving and water geometry. Width/depth/valley profiles vary with flow proxies, gradient and confinement. Tributaries preserve shared confluences. A monotonic longitudinal water datum provides downstream levels; lakes use their outlet elevation. Irregular lake contours respond to uplift and bounded variation. These are static water surfaces with animated appearance, not fluid simulation or terrain-derived channel evolution.

drainage.mjs separately computes priority-flood/D8 catchment diagnostics on an exported 129×129 grid. Filled diagnostic depressions do not automatically change rendered terrain. Do not confuse this analysis with the prescribed river network.

## Climate and ecology

Temperature combines north–south position and elevation. Assumed westerlies, relief shelter, rainfall proxies, water proximity and slope affect moisture and environmental suitability. Snow uses temperature, moisture and slope; no canonical season is established. Numerical climate and substrate assumptions remain experimental.

Continuous fields select ocean, snow, alpine, wetland, coast, boreal, grassland, riparian and forest environments. Geographic region bounds are distinct from ecological fields. Deterministic vegetation cells use suitability, grouping and clearings, with instanced nearby cover and bounded cell turnover. This is habitat suitability presentation, not population ecology or canonical species distribution.

## Rendering and comparison

scene.ts and environment-materials.ts handle lighting, terrain shading, depth/flow-sensitive water and quality tiers. Mobile/Balanced/High change rendering budgets, not the canonical input. GeographyPanel.tsx exposes overlays, side-by-side reference, diagnostic layers and evaluation locations. scripts/export-geography.mjs produces public/world/elaris-geography.json. The standalone embeds it.

| Reference relationship | Current interpretation |
| --- | --- |
| Mainland silhouette, ranges, lakes and principal drainage | Visually registered approximation of accepted plate |
| Vaelorin identity and broad southern route | Canon-supported identity and relationship; coordinates approximate |
| Minor shore detail, exact widths/heights, climate and soils | Inference/experimental |
| Projection, canonical scale, hidden relief, native species ranges | Unknown/unresolved |
| Alternate geographic imagery | Preserved with conflict context; not silently substituted |

Read the historical milestone documents for numerical guardrails and tests. Automated correspondence checks do not establish geographic exactness or visual acceptance. Sahrel and the remaining continents retain components/world/terrain.mjs prototype geography.
