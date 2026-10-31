# Authoring brief: replacement items for the weekly checks

You are writing replacement items for a 7th-grade on-level Florida B.E.S.T. (MA.7) weekly-check bank. A review found design problems; your job is to write the fixed items. You write JSON only; you do not edit any repo files.

## Inputs
- The current items for your strand: `items_<STRAND>.md` in this folder's parent (each item has a slot id like `MA.7.AR.3.3/chk/3` = benchmark / set / 0-based index). Note: that dump stripped HTML tags, so `<` in solutions, repeating bars and tables look broken there; the real forms render them. Do not "fix" those.
- The fix list for your strand: `fixes_<STRAND>.md`. Do every numbered fix. Where the fix list gives a concrete item, use it unless it has a math error (then fix the math and say so in `note`).
- Benchmark text and clarifications: look them up on CPALMS (https://www.cpalms.org, search "cpalms MA.7.XX.X.X") before writing, so every item stays inside the benchmark.

## Hard rules
1. **Do not touch MA.7.AR.1.1 at all** (its check was already given to students). For every other slot, replace only what the fix list calls for.
2. A replacement item is a complete item (new stem, choices, key, solution). Keep the same slot. Do not add or remove slots.
3. **No new figures.** If the current item has a FIGURE line, you may change the stem wording, choices, key and solution but the figure stays, so the item must still make sense with that figure. If a fix needs a figure that does not exist, write a figure-free item instead and say so in `note`.
4. Item types Forms can grade: `mc` (exactly 4 choices, one correct), `ms` (checkboxes, 4 or 5 choices, 2 or more correct, all-or-nothing), `sa` (typed: ONE number, fraction `a/b`, or mixed number `a b/c`; no units, $, %, π or commas). For `sa`, give `answer` as the exact string and `accept` as every equivalent form a student might type (decimal and fraction forms, trailing zeros like `12.50`, the π-key AND 3.14 values if the stem says to round with π). Never make a typed item whose answer is an expression, a word, or "in terms of π" unless the stem says "type only the number in front of π".
5. Notation (Cadence's): minus is `−` (U+2212), multiplication `×`, `≤ ≥`, fractions `(5/6)x` for a coefficient and `3/4` bare, mixed numbers `2 1/4`, exponents with `<sup>2</sup>`, repeating decimals `0.<span class="rep">39</span>`. Separate stem paragraphs with `\n\n`. Put a displayed expression or equation on its own paragraph. Keep stems short and plain; label figures, not sentences.
6. Every wrong choice must come from ONE named student error (and you name it in `why`). No throwaway or absurd options. The correct choice must not be identifiable by form, length, units, or by being the only internally consistent option. Paired "equation and solution" options must each be internally consistent so only the setup discriminates.
7. Re-check items (`re`) must match the difficulty and the hardest feature of the check item they parallel; review items (`cmp`) must match the check's skeleton with a different context and representation; no item may reuse another item's numbers in the same benchmark.
8. For the "rigor" slot (the check item flagged in the dump) the item must require a decision plus a reason or a two-step application, not just more arithmetic.
9. Verify every key with Python (sympy is installed; run `python3`). Include the verification expression in `check`.
10. Each MC/MS item gets `why`: a list parallel to `opts` with the student error behind each wrong choice and `null` for the correct one. Each SA item gets `typed`: 2 to 4 `[wrong_value, error]` pairs for the most likely wrong answers.

## Output
Write ONE file: `out_<STRAND>.json` in this folder, a JSON list. Each entry:
```
{"slot": "MA.7.AR.3.3/chk/2", "fix": "4", "note": "optional: anything the teacher should know",
 "rt": "mc" | "ms" | "sa",
 "q": "stem text with \n\n between paragraphs",
 "opts": ["...", "...", "...", "..."],          // mc/ms only
 "key": 2,                                     // mc: index; ms: list of indices
 "answer": "7.73",                             // sa only: the exact typed answer
 "accept": ["7.73"],                           // sa only: every accepted form
 "s": "worked solution, 2 to 4 short lines separated by \n",
 "why": [null, "multiplied instead of dividing", "...", "..."],   // mc/ms
 "typed": [["77.3", "forgot to divide by 10"], ...],               // sa
 "check": "python expression(s) used to verify the key",
 "keep_fig": true | false}                     // true only if the slot currently has a figure and you kept it
```
Also write `scales_<STRAND>.json`: `{"MA.7.XX.X.X": {"l4": "...", "l3": "...", "l2": "..."}}` for any benchmark whose scale text the fix list says to change (omit others).
Finally, in your reply, list every slot you changed with a one-line reason, and anything you could not do and why. Work through the whole fix list; do not sample.
