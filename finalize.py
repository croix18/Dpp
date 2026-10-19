import os, time, subprocess, shutil, json
subprocess.run(['python3','package.py'],check=True)
root='DPP_2026-27'
singles=json.load(open('layout_singles.json')) if os.path.exists('layout_singles.json') else []
open(f'{root}/README.txt','w').write("""DPP 2026-27 - 7th Grade Math weekly checks          Edition 4.1 (frozen Oct 10, 2026)

00 READ ME FIRST          What everything is, who writes on what, the weekly routine, index, scales.
01 Weekly checks by unit  One folder per Math Nation unit. One PDF per benchmark, six pages:
                          p1-2 check (front/back, copy two-sided)   p3 answer key   p4 reteach plan
                          p5 re-check (-R)   p6 comparison (-X)
02 Forms                  Tally sheet, progress strip, check calendar. Copy a stack once.
03 Backstop checks        Mixed review check for a week with no new check ready (Q2, Q3, Q4).
04 Tracking sheet         Import to the school Google Drive, clear the sample rows.
05 Everything in one PDF  Same content, one file, page numbers in the index.
06 Item audit             What round 4 found, what edition 4.1 fixed, what is left.
07 Cadence generator handoff  Per benchmark: generators, items, open flags. For the Cadence session.

Re-check and comparison pages: when two copies fit with readable figures and room to
write, the page has two copies (cut in half, copy 13 for 25 students). When they don't,
the page has one copy (copy 25). %d of the 68 pages are one copy; you can tell by looking.

This edition is frozen: a new version of Cadence does not change these items. Fixes to
single items are made in place.
""" % len(singles))
shutil.copy('audit_v4.md', f'{root}/06 Item audit (what was fixed, what to watch).md')
shutil.copy('handoff_v4.md', f'{root}/07 Cadence generator handoff.md')
t=time.time()-50000
for i,name in enumerate(sorted(os.listdir(root))): tt=t+i*120; os.utime(os.path.join(root,name),(tt,tt))
if os.path.exists('DPP_2026-27.zip'): os.remove('DPP_2026-27.zip')
subprocess.run(['zip','-qr','DPP_2026-27.zip',root],check=True)
shutil.copy('DPP_2026-27.zip','/mnt/user-data/outputs/DPP_2026-27.zip')
shutil.copy('handoff_v4.md','/mnt/user-data/outputs/Cadence_generator_handoff_v4.md')
for f in ['Cadence_generator_handoff.md','Cadence_generator_handoff_v2.md','Cadence_generator_handoff_v3.md']:
    try: os.remove('/mnt/user-data/outputs/'+f)
    except FileNotFoundError: pass
print(sorted(os.listdir(root))); print(subprocess.run(['du','-sh','DPP_2026-27.zip'],capture_output=True,text=True).stdout)
