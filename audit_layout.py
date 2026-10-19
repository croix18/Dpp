import subprocess, json, re, sys
pdf='DPP_Check_Bank_v1.pdf'
out=subprocess.run(['pdftotext','-layout',pdf,'-'],capture_output=True,text=True).stdout.split('\f')
pages={}
for i,pg in enumerate(out):
    head=pg.strip().split('\n')[0] if pg.strip() else ''
    m=re.search(r'Weekly Check.*?(C-[A-Z]+\.\d\.\d)\s*$', head)
    if m and m.group(1) not in pages and 'continued' not in head: pages[m.group(1)]=i+1
if len(sys.argv)>1 and sys.argv[1]=='map':
    json.dump(pages,open('pages.json','w')); print('page map', len(pages), 'parity', sorted(set(v%2 for v in pages.values()))); sys.exit()
old=json.load(open('pages.json'))
bad=[]; singles=[]
if pages!=old: bad.append('page map drifted')
for cid,p in pages.items():
    if p%2!=1: bad.append((cid,'check starts on even page'))
    for off,name,n in ((4,'recheck',3),(5,'comparison',2)):
        t=out[p+off-1]; sc=t.count('Score:'); items=len(re.findall(r'\n\s*%d\.\s'%n, t))
        if sc==1 and items==1: singles.append(cid+'-'+name[0].upper())
        elif sc<2 or items<2: bad.append((cid,name,sc,items))
    if 'Score:' not in out[p]: bad.append((cid,'check back no score'))
    if 'Turn over' not in out[p-1]: bad.append((cid,'front missing turn-over'))
    if 'Comparison strip' not in out[p+1]: bad.append((cid,'key incomplete'))
    if 'Reteach plan' not in out[p+2]: bad.append((cid,'reteach page missing'))
print('pages', len(out)-1, '| layout problems:', bad or 'none', '| single-copy strips:', len(singles))
