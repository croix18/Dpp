import json, collections
banks=json.load(open('banks.json')); S=json.load(open('scales.json')); plan=json.load(open('frozen_ed4_1.json'))
import re, html
clean=lambda s: html.unescape(re.sub(r'<[^>]+>',' ',str(s))).replace('\n',' ').strip()
flags=collections.defaultdict(list); globalflags=[]
for line in open('audit/flags_v4.txt'):
    parts=[x.strip() for x in line.rstrip('\n').split('|')]
    if len(parts)<5: continue
    if parts[0]=='ALL': globalflags.append(parts); continue
    for cid in [c.strip() for c in parts[0].split('/')]: flags[cid].append(parts)
open_n=sum(1 for l in open('audit/flags_v4.txt') if '[fixed' not in l)
fixed_n=sum(1 for l in open('audit/flags_v4.txt') if '[fixed' in l)
out=["# Cadence generator handoff v4 — round 4 (Oct 10)\n",
"Round 4 reviewed edition 4 (built from the third Cadence revision): three reviewers, every item, every key recomputed. Of the 34 edition-3 flags, 14 were resolved and 20 persist. Round 4 raised 69 new flags: 5 high, 29 medium, 35 low. There was one key error (DP.2.4 Part C accepted wrong answers). The reviewers ran on a different model this round and were stricter: they rendered pages and checked CPALMS clarifications. Part of the rise in medium and low flags comes from the reviewer, not the bank.\n",
"**The bank is now frozen at edition 4.1.** The high flags, the key error, and nine re-check or comparison items that reused a check item's numbers were fixed in the bank by editing or redrawing single slots. A new Cadence no longer reshuffles the 340 items, so fixes stop introducing new problems. The fixes are still generator bugs, though, and the next full edition (next year) will hit them again unless Cadence fixes them. Those flags are marked **[fixed in bank]**: fix the generator, nothing more is needed for this year. Flags marked [fixed in build] or [fixed in scales] were fixed on the bank side and need nothing in Cadence.\n",
f"Open for Cadence: {open_n} flag lines. Already fixed on the bank side: {fixed_n}.\n",
"## Priority order\n",
"1. **Generator bugs fixed in this year's bank** (so next year's edition doesn't reintroduce them): GR.1.2 composite figure drawn out of proportion; DP.2.2 rigor wording; NSO.2.2 sign-free fraction subtraction and the mixed-number multiplication in gen 6's solution; DP.2.4 Part C key and Part B wording; DP.1.5 display item with two defensible answers; AR.4.1 situations that don't name the two quantities; AR.2.1 two-step distractors.",
"2. **Small number pools** that made re-check and comparison items repeat check items: carriage rates (AR.4.5), cylinder dimensions (GR.2.2, GR.2.3, GR.2.1 h = 24), pump and suitcase (AR.3.3), beef table (AR.3.2), 7/11 (NSO.1.2), sunflower bins (DP.1.5).",
"3. **Rigor is not the level-4 skill** on: AR.2.1, GR.1.4, GR.1.2, GR.1.5, DP.2.1, DP.1.4, AR.3.2, AR.3.1, AR.4.4, DP.1.2, AR.4.1, NSO.2.1, AR.4.3.",
"4. **Benchmark verbs with no item:** DP.1.4 construct; DP.1.5 create; AR.2.1 real-world and graph-the-solution; GR.1.1 rhombus by diagonals; GR.1.5 area scales by k²; GR.2.3 compare two cylinders; DP.2.2 certain/impossible.",
"5. **Template repeats** across a benchmark's three sets. For future editions the build now caps a generator at two of the three sets, but generators with one context per template will still repeat contexts.",
"6. **Key and stem text:** mixed-number annotations inside expressions in keys (AR.1.1, AR.1.2, AR.3.2, AR.4.4); numerals starting sentences (AR.2.2); GR.2.1 naming of length and width; implausible contexts (DP.1.2 R2).\n",
"## Fixed on the bank side this round (no Cadence work needed)\n"]
for g in globalflags: out.append(f"- {g[3]} → *{g[4]}*")
out.append("")
for u,t,codes in S['order']:
    for code in codes:
        cid=code.replace('MA.7.','C-'); b=banks[code]
        out.append(f"\n## {code} — {b['label']}  (Unit {u}: {t})\n")
        out.append(f"Regular generators: {len(b['reg'])} · Rigor generators: {len(b['hr'])}\n")
        for kind in ('reg','hr'):
            for g in b[kind]:
                out.append(f"- `{kind}[{g['gen']}]` ({g['rt']}): " + " ¦ ".join(s.replace('\n',' ') for s in g['samples']))
        B=plan['bench'][code]
        names=['check 1','check 2','check 3','check 4','check 5 (rigor)','re-check 1','re-check 2','re-check 3','comparison 1','comparison 2']
        out.append("\nItems in edition 4.1:")
        for i,it in enumerate(B['chk']+B['re']+B['cmp']):
            out.append(f"- {names[i]} ← `{'hr' if it.get('_hr') else 'reg'}[{it['_genIdx']}]` {it.get('rt') or 'sa'}: {clean(it['q'])[:140]}  → **{clean(it.get('a',''))[:60]}**")
        fl=flags.get(cid,[])
        out.append("\nFlags:" if fl else "\nFlags: none open.")
        for f in fl: out.append(f"- {f[1]} item {f[2]}: {f[3]} → *{f[4]}*")
open('handoff_v4.md','w').write('\n'.join(out)); print(len('\n'.join(out)), 'chars', open_n, 'open', fixed_n, 'fixed')
