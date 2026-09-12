# Milestone 2.2A — mobile HUD correction

Rollback: saved Site version 11, source 35afffdd834a65c16e6cbfa12d5b5ffd25006cf8, tag rollback-before-elaris-m22a-20260911. Previous standalone HTML is version 4 of the same file.

This patch changes WorldExplorer, HUD CSS and standalone CSS assembly only. All renderer, terrain, hydrology, environment, source/archive and geographic data files are byte-identical to Milestone 2.2.

Mobile now has a dedicated compact header with back, identity/location and one menu button. Desktop title, evidence panel, large cards, utilities and Codex status are explicitly excluded from mobile exploration. An expandable bottom sheet provides tools, destinations, continent switching and collapsible geographic readings. Speed cycles 1/4/16× in one small button. The joystick, mode selector and flight controls have reserved independent zones. Clean view retains navigation and an explicit restore button. Existing touch ownership, scene reset and modal input suspension are preserved; opening the new tools menu additionally clears displayed joystick and boost state.

The standalone exporter previously concatenated every CSS asset in the output directory. It now appends the current authoritative HUD stylesheet last so stale bundled CSS cannot override the intended mobile shell. This is an export-order safeguard; the exact cause of the user's earlier screenshot is not conclusively established.

Verification: actual application DOM at 384×824, 320×740 and 824×384; joystick, mode, speed, header, heading and flight-control bounds are separated and in the viewport. Desktop 1440×900 retains its prior navigation. Tools sheet, clean view and restoration were exercised. All 29 existing tests pass. Production build and standalone JS parsing pass. Type/lint reports contain only the pre-existing errors. The environment and archive files remain unchanged.

This browser still cannot create a WebGL context. No new GPU performance or real simultaneous multi-touch result is claimed. First-use tutorial placement uses a top coach panel separate from the navigation zones; actual rendered-scene tutorial/metadata and Samsung browser safe-area behavior need final device confirmation. The user's 60 FPS reading remains one observation, not a sustained benchmark. Live PHYVERA is not deployed by this patch.
