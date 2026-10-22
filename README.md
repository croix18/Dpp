# Shaffer & Shaffer DPP 2026-27

Everything built for the 2026-27 Deliberate Practice Plan (common weekly checks on the MA.7 benchmarks, Windy Hill Middle School). Working folder of the Claude session, committed whole so nothing is lost. The Claude doc that holds the plan narrative and proposal text is saved here as `DPP plan doc 2026-10-18.md`.

## Deliverables (what to open)

| Path | What it is |
|---|---|
| `DPP plan doc 2026-10-18.md` | The plan doc: proposal text for TrueNorthLogic (final, Forms + Thursday PLC version), reviewer findings, cycle, targets, timeline. |
| `DPP Units 9 and 10.zip` / `DPP Units 9 and 10/` | **Units 9–10 packet** (Oct 26 – Dec 18): `00 Start here` (forms, weekly routine, calendar, Review pairing, Thursday PLC agenda, evidence list, PLC log), `01 Scales to post` (4 posters), `02 PLC item guide` (all 12 forms: key, solution, what each wrong answer means, reteach lesson), `03 Reteach lessons` (20 projected lessons + answer pages), `04 Paper copies of the forms`, and the current script kit. |
| `DPP Forms script kit.zip` / `script_kit/DPP Forms script kit/` | **Current build path.** Apps Script that builds all 102 Google Forms (`Code.gs`, `appsscript.json`), the kit it reads (`DPP Forms kit/`: `forms_manifest.json` + 374 images), and `00 Script setup.pdf`. `ONLY: 'Unit 9, Unit 10'` builds a subset; `updateMessages()` fixes the after-submit message on forms built with an earlier kit. |
| `DPP Google Forms 2026-27.zip` / `DPP Google Forms 2026-27/` | The manual Forms build: per-form folders with build sheet PDF, question images, answer images; `00 Start here.pdf`, `01 Form build list.xlsx`. |
| `DPP_2026-27.zip` / `DPP_2026-27/` | The paper edition (edition 4.1 item bank): weekly checks by unit, tally sheet, progress strip, calendar, backstop checks, tracking sheet, generator handoff. |
| `7th_Grade_Math_Weekly_Check_Tracker.xlsx` | Tracking sheet template (CHECKS / SCORES / RECHECKS / HUDDLE / UNITS / CYCLES). |
| `DPP_Paper_Kit_v1.pdf`, `DPP_Check_Bank_v1.pdf`, `DPP_2026-27_Everything.pdf` | Earlier one-file packages. |

## Build sources

- `cadence.html` (+ `cadence_ed4.html`, `cadence_v2/v3/old.html`): the Cadence item generator snapshots the bank was built from. `frozen_ed4_1.json` is the frozen edition 4.1 bank; `patches_ed4.json`, `plan_*.json`, `items_dump*.json` are build intermediates.
- `build_bank*.js`, `build_templates.py`, `build_sheet.py`, `finalize.py`, `package.py`, `make_handoff.py`: the paper-edition pipeline.
- `forms/`: the Forms pipeline. `classify.py` → `make_patches.py` (Forms-gradable rewrites, `forms_patches.json`) → `stepA.js` (apply in Cadence) → `stepB.py` (`forms_spec.json`, accept lists) → `stepC.js` (render PNGs with `cadence_render.html`) → `stepD.py` + `print_pdfs.js` (build sheets, start page) → `stepE.py` (script kit manifest + images). `cadence_notes.md` lists renderer/generator bugs for Cadence.
- `script_kit/test/`: offline mock of the Apps Script runtime (`mock_gas.js`) and the 42-case suite (`run_tests.js`); `script_kit/build/`: the setup guide HTML → PDF.
- `units910/`: the Units 9–10 packet. `content.py` (reteach lessons, posters, wrong-answer notes) → `verify.py` (recomputes every answer, figure and error path with sympy) → `content.json` → `build.js` (the five PDFs, math set by `forms/ctex.js` + KaTeX in Lexend; slides and posters auto-fit). `forms/ctex.js` is Cadence's text-to-TeX converter extracted for Node.
- `audit/`, `audit_v4.md`, `handoff_v4.md`: item audit rounds and the Cadence handoff.
- `*.png` at the root: render checks from the audits.

## Pushing from a Claude session

`tools/push.sh "message"` commits everything and pushes to `main` (needs `.github-token`, git-ignored). See `How_the_A7_session_pushes_to_GitHub.md` for why the plain `git push` route fails in the sandbox.

`node_modules/` is not committed; `npm install` in the root restores Playwright for the render steps (Chromium at `/opt/pw-browsers/chromium` in the session).
