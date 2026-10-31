# Shaffer & Shaffer DPP 2026-27

Common weekly formative checks on the MA.7 benchmarks (Windy Hill Middle School). Everything the plan needs is in **`deliverables/`**; the rest of the repo is how it was built.

## deliverables/ — open these

| File | What it is |
|---|---|
| `DPP Units 9 and 10.zip` (and the folder) | The current packet, Oct 26 – Dec 18: start-here guide and calendar, 4 scale posters, PLC item guide, 20 reteach lessons, paper copies of the 12 forms, and the script kit. |
| `DPP Forms script kit.zip` | The Google Forms builder: `Code.gs.txt`, `appsscript.json.txt`, `00 Script setup.pdf`, and the `DPP Forms kit` folder (manifest + 374 pictures). `ONLY: 'Unit 9, Unit 10'` builds a subset; `updateImages()` and `updateMessages()` bring forms built with an earlier kit up to date. |
| `DPP 2026-27 proposal (copy and paste).docx` | The TrueNorthLogic proposal text, both teachers' copies. |
| `DPP plan doc 2026-10-18.md` | The plan narrative: cycle, targets, timeline, reviewer findings. |
| `7th_Grade_Math_Weekly_Check_Tracker.xlsx` | Tracking sheet template (rebuilt to read the Forms responses after the first check). |

## How it is built

```
forms/            the Forms item pipeline (current)
  scales.json       the 4-level scale for every benchmark, in unit order
  classify.py → make_patches.py → stepA.js → stepB.py → stepC.js → stepD.py + print_pdfs.js → stepE.py
  plan_forms.json / forms_spec.json   the 340 items and the form spec stepA/stepB produce
  png/, thumbs/     the rendered question, answer and scale pictures (stepC)
  cadence_render.html, ctex.js        Cadence's renderer and its text-to-TeX converter (used by stepC and units910)
  cadence_notes.md  renderer/generator notes for Cadence
script_kit/       the Apps Script builder: source, offline mock + 43-test suite (test/), setup guide (build/), packaged copy (package/)
units910/         the Units 9–10 packet: content.py → verify.py (sympy recomputes every answer) → content.json → build.js (the five PDFs)
cadence/          the Cadence generator snapshots the item bank came from
paper-edition/    the earlier paper edition (edition 4.1 bank, build scripts, audits, handoff) — superseded by the Forms build
manual-forms-build/  the click-by-click Forms build (build sheets per form) — superseded by the script kit
fonts/            Lexend
archive/          render checks and probe scripts from the audits
tools/            push.sh and the GitHub notes
```

Pipeline order to rebuild the forms from scratch: `node forms/stepA.js && python3 forms/stepB.py && node forms/stepC.js && python3 forms/stepD.py && node forms/print_pdfs.js && python3 forms/stepD.py --finish && python3 forms/stepE.py`, then `cd script_kit/test && node run_tests.js`. `ONLY=MA.7.AR.2.2 node forms/stepC.js` renders one benchmark. `node_modules/` is not committed; `npm install` restores Playwright and KaTeX (Chromium at `/opt/pw-browsers/chromium` in the session).

## Pushing from a Claude session

`tools/push.sh "message"` commits everything and pushes to `main` (needs `.github-token` at the root, git-ignored). `tools/How_the_A7_session_pushes_to_GitHub.md` explains why plain `git push` fails in the sandbox.
