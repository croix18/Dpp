# Weekly check item review, 2026-10-30

The full review with the high/medium/low impact tiers lives in the Claude doc "Weekly Check Item Review and Improvement Tiers".
Summary: all 340 keys correct; question pictures left unnumbered so questions can be deleted on a copy; 25 of 34 benchmarks fully aligned; 13 re-checks run easier than their checks; review (control) items
are often number-swapped clones; 5 checks can be passed by one heuristic. Fixed this round:
3.14 values accepted on the 8 pi-key items, updateImages()/updateKeys() in the script kit.
Reviewer inputs: scratch dumps per strand (NSO, AR, GR, DP) with the brief in forms/review/.

## Rewrite (same day)
110 items rewritten to the review (forms/review/rewrites/: brief, per-strand fix lists, the items as JSON with keys, error meanings and
verification expressions). Each strand was written by one author and checked by a separate reviewer who recomputed every key and
every wrong-answer path; their corrections are applied. 67 of 102 forms changed (all except C-AR.1.1, given Oct 28, and C-DP.1.4).
Scale text changed on NSO.2.1 L4, AR.2.1 L4, AR.1.2 L4, AR.3.1 L3, GR.2.2 L4. Built forms must be rebuilt: startOver then buildForms.
Not done (design changes, flagged for the PLC): an L2 item on every check; converting GR typed items to multiple choice.
