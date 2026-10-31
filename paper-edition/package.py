import json, re, subprocess, os, shutil, time
from pypdf import PdfReader, PdfWriter
S=json.load(open('scales.json')); pages=json.load(open('pages.json'))
r=PdfReader('DPP_Check_Bank_v1.pdf')
txt=subprocess.run(['pdftotext','-layout','DPP_Check_Bank_v1.pdf','-'],capture_output=True,text=True).stdout.split('\f')
labels={}
for code in S['scales']:
    cid=code.replace('MA.7.','C-'); kp=txt[pages[cid]+1]
    m=re.search(r'Answer key\s+—\s+'+re.escape(cid)+r'\s+·\s+'+re.escape(code)+r'\s+·\s+(.+)', kp.split('\n')[0])
    labels[cid]=m.group(1).strip() if m else cid
back=[i+1 for i,pg in enumerate(txt) if pg.strip() and 'Cumulative Check' in pg.split('\n')[0] and 'continued' not in pg.split('\n')[0]]
# everything file
w=PdfWriter()
for f in ['DPP_Check_Bank_v1.pdf','DPP_Paper_Kit_v1.pdf']:
    for pg in PdfReader(f).pages: w.add_page(pg)
w.write('DPP_2026-27_Everything.pdf')
root='DPP_2026-27'; shutil.rmtree(root, ignore_errors=True); os.makedirs(root)
def save(src, rng, path):
    w=PdfWriter()
    for i in rng: w.add_page(src.pages[i-1])
    os.makedirs(os.path.dirname(path), exist_ok=True); w.write(path)
safe=lambda s: re.sub(r'[^A-Za-z0-9 .,()-]+','',s).strip()
save(r, range(1,5), f'{root}/00 READ ME FIRST.pdf')
for u,t,codes in S['order']:
    d=f'{root}/01 Weekly checks by unit/Unit {u:02d} {safe(t)}'
    for code in codes:
        cid=code.replace('MA.7.','C-'); p=pages[cid]
        save(r, range(p,p+6), f'{d}/{cid}  {safe(labels[cid])}.pdf')
k=PdfReader('DPP_Paper_Kit_v1.pdf')
for i,name in enumerate(['Tally sheet (2 per page)','Progress strip (4 per page)','Check calendar']):
    save(k, [i+1], f'{root}/02 Forms (tally sheet, progress strip, calendar)/{i+1:02d} {name}.pdf')
for q,p in zip(['Q2','Q3','Q4'], back):
    save(r, range(p,p+3), f'{root}/03 Backstop checks/BACKSTOP-{q} (check + key).pdf')
shutil.copy('7th_Grade_Math_Weekly_Check_Tracker.xlsx', f'{root}/04 Tracking sheet (import to Google Sheets).xlsx')
shutil.copy('DPP_2026-27_Everything.pdf', f'{root}/05 Everything in one PDF.pdf')
open(f'{root}/README.txt','w').write("""DPP 2026-27 - 7th Grade Math weekly checks

00 READ ME FIRST          What everything is, who writes on what, the weekly routine, index, scales.
01 Weekly checks by unit  One folder per Math Nation unit. One PDF per benchmark, six pages:
                          p1-2 check (front/back, copy two-sided)   p3 answer key   p4 reteach plan
                          p5 re-check halves (-R)   p6 comparison halves (-X)
02 Forms                  Tally sheet, progress strip, check calendar. Copy a stack once.
03 Backstop checks        Mixed review check for a week with no new check ready (Q2, Q3, Q4).
04 Tracking sheet         Import to the school Google Drive, clear the sample rows.
05 Everything in one PDF  Same content, one file, page numbers in the index.
""")
t=time.time()-100000
for dp, dns, fns in sorted(os.walk(root)):
    for name in sorted(dns+fns): os.utime(os.path.join(dp,name),(t,t)); t+=60
for i,name in enumerate(sorted(os.listdir(root))):
    tt=time.time()-50000+i*120; os.utime(os.path.join(root,name),(tt,tt))
if os.path.exists('DPP_2026-27.zip'): os.remove('DPP_2026-27.zip')
subprocess.run(['zip','-qr','DPP_2026-27.zip',root]); print('zip ok')
