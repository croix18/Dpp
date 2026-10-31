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

## Outside read, second pass (language only)

ChatGPT's second pass (`forms/review/chatgpt_language_second_pass.md`) reviewed the 259 word problems for reading clarity only. 23 of its 24 rewrites were applied as wording-only changes (numbers, figures, tables, options and keys untouched): "holds" → "contains" in the three NSO.1.2 comparison items; the survey question stated in the stem for the three DP.1.4 circle-graph items; the negative-balance convention spelled out in the three NSO.2.3 items; "drip-irrigation hose (a hose that slowly waters plants)" in AR.3.2; museum visitors stated month to month in AR.3.1; the population given before the sample in DP.1.3/chk/0; "digital spinner … equally likely sections" in DP.2.3; "about how many purple draws would you expect" in DP.2.4/chk/4; round trays instead of paper cups in GR.1.3/re/1; closed sheet-metal tanks and a storage container in GR.2.2; "take-home income" in DP.1.5/cmp/1; and AR.2.2/chk/0 moved from a skating rink to a bike-rental shop ($25 rental fee + $12.50 per hour, same equation). The one REFER item, DP.1.1/chk/3, was left as is: the question asks which measure, multiplied by the count, gives the total, and that premise is the point of the item (mean × n = total), not a flaw in it.
