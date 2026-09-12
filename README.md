# SEEDWOKEN — VAELORA 3D TRIAL

A canon-informed 3D geographic/living-world prototype for Vaelora, using Elaris — The Mainland as the proof-of-pipeline continent.

Current implementation: **Milestone 2.2A mobile HUD correction**. The source baseline is `f9f233d847353d2c60125a9c64dad8735b38d185`. Geographic and visual acceptance remains open. GitHub migration is prepared but not complete until an authenticated repository import succeeds.

## Run and verify

Requires Node >=22.13, npm, Linux (or WSL), Bash and GNU timeout; the bounded installer also uses curl and flock. Preserve package-lock.json.

```sh
npm ci
npm run dev
# Open the displayed local URL at /world
npm test
npm run lint
npx tsc --noEmit
```

`npm test` runs the production build followed by `node --test tests/*.test.mjs`. Build separately with `npm run build`. Existing lint/type failures are recorded in docs/PROJECT_STATE.md. Server routes inherited from PHYVERA use Cloudflare D1/R2; the portable world export does not require those services or credentials.

## Standalone HTML

```sh
npm run build
node scripts/export-world.mjs "$PWD/Seedwoken-Vaelora-3D-Trial.html"
```

Open the HTML directly in a WebGL-capable desktop or mobile browser. It embeds world code, styles and 229 local assets including the archive. Links to original sources may require internet. A preserved current export is included under `deliverables/`; rebuilding need not reproduce identical bytes because CSS build output may differ.

## Source map

| Path | Responsibility |
| --- | --- |
| app/world/ | Trial route |
| components/world/ | Three.js renderer, geography compiler, ecology, inputs and responsive HUD |
| public/world/ | 233-record archive, reference assets and exported geography |
| scripts/ | Build, standalone and geographic export, CPU benchmark |
| tests/ | Structural, geographic, mesh, input and preservation tests |
| docs/ | Architecture, state, handoff and historical milestone reports |
| app/, db/, worker/, .openai/ | Inherited full application/platform context; retain without refactoring |

The React 19 / Three.js / Vinext architecture preserves Survey, Ground and Flight modes. Elaris uses a **120 km experimental model domain**, reference-constrained hydrology, adaptive terrain and environmental vegetation. Other continents retain their prototype systems. Mobile has a compact HUD, tools/destinations sheet, joystick, contextual flight controls and clean view; actual simultaneous touch and Samsung browser behavior still require local testing.

Reference 001 is an oblique illustration, not a surveyed map. Generated coordinates, relief, climate parameters and ecological placement do not become canon. See [Elaris geography](docs/ELARIS_GEOGRAPHY.md), [project state](docs/PROJECT_STATE.md) and [development handoff](docs/DEVELOPMENT_HANDOFF.md).

**The live PHYVERA Site is a separate deployment and is NOT automatically deployed from this repository.** No GitHub production workflow is established. Existing hosting configuration is preserved for historical context, not authorization to publish. Platform notes previously in this README are retained in docs/INHERITED_PLATFORM.md.
