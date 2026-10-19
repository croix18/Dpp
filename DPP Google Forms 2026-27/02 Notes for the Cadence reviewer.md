# Notes for the Cadence reviewer (from the Google Forms build, Oct 2026)

These came up while turning edition 4.1 of the DPP check bank into self-grading Google Forms. Items 1–6 also affect Cadence's own paper output. The Forms images were rendered from a copy of cadence.html with fixes 2 and 3 applied; cadence.html itself was not changed.

## Renderer

1. **Answer keys print a mixed-number gloss inside expressions.** `fmtAns` runs `dualFrac`, which writes "= mixed number" after every improper fraction, even inside an expression or equation. Examples from the bank: `y = (5/4 = 1 1/4)x`, `(5/3 = 1 2/3)p + 2`, `Yes, because 8/5 = 1 3/5 × 40 = 64` (reads as 8/5 = 64), and `63 7/11 = 700/11 %(or …)`. Suggested fix: skip a fraction that touches a variable, `×`, `=`, `(`/`)` or a `%`, and only gloss a fraction that stands alone as the answer.
2. **Accented names break.** The text-to-math tokenizer's word pattern is `/^[A-Za-z]+′*/` (around line 1041), so "Tomás" becomes the word "Tom", the letter "á" and an italic math variable "s". Fix: `/^[A-Za-zÀ-ÖØ-öø-ɏ]+′*/`. It affects any name with an accent (Inés, Andrés, Jesús, Ramón, Martín, Nicolás, Iván, Rubén, Raúl, Renée).
3. **Square brackets stay text-sized around tall content.** The closer sizes `)` with `\left( … \right)` but never `]`, so `[(−1 1/2 − 1)² − 1.75] ÷ 2` prints small brackets around a tall parenthesis (NSO.2.1). Fix, after the `)` branch (around line 1312): `else if (at != null && tk.v === ']' && /\\d?frac|\\sqrt|\\left\(/.test(body)) { s = s.slice(0, at) + '\\left[' + body.slice(1) + '\\right]'; }`
4. **Lines cover tick labels in the four-graph choice planes.** `figChoicePlanes` draws the labels before the line, so a line runs over its "2" or "−2" (AR.4.3 which-graph items). Draw the labels last; they already have a white halo.
5. **One-letter axis titles are rotated.** A rotated "y" reads like the symbol ≻ at screen size. Keep one-letter axis titles upright.
6. **The dashed "removed part" lines in `figComposite` use the grid color** (`#d8d5cd`), which is very faint on a screen. A mid gray such as `#8a867d`, width 1.5, reads clearly.

## Generators

7. **MA.7.AR.1.2 regular G2** ("A student rewrote (a/b)(cx + d) as ___x"): the student's wrong answer is always the sum of the correct answer's two numbers (16x + 16 → 32x), so a student can find the key by adding. A more realistic error that removes the shortcut: the student multiplies only the first term, then combines (16x + 12 → 28x).
8. **Items Forms cannot grade.** Graphing items (AR.4.3 G0–G2 and H1, AR.2.1 G0, AR.4.5 G2), expression and inequality answers (AR.1.1, AR.2.1, AR.4.4 "write an equation"), set listings (DP.2.1 G0–G2) and multi-part "1 point for all parts" items have no auto-gradable form. If Cadence ever exports to Forms, these need a choice version. The Forms build used: a choice of four graphs with the y-axis running past the correct line's end (so the correct line never runs corner to corner) and a parallel twin for each line through the origin; equation-and-solution pairs; "select all the outcomes" checkboxes; and composite choices whose distractors each come from one named error.
9. **Article before amounts**: "a $18.00 entry fee" should be "an $18.00"; the template should use "an" before 8, 11, 18 and 80–89.
