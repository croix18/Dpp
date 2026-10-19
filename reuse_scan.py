import json, re, html, sys
plan=json.load(open(sys.argv[1] if len(sys.argv)>1 else 'frozen_ed4.json'))
STOP={'3.14','2.2','2.54','3.785','1.609','0.62','1.61','28.35','0.454','2.205','1/2','1/3','1/4','3/4','2/3','0.5','0.25','0.75','1.5','2.5','100','360','1000','12','24','60','10','0.1','22/7'}
def clean(s): return html.unescape(re.sub(r'<[^>]+>',' ',str(s))).replace('−','-')
def qtext(o): return clean(o.get('q',''))+' '+' '.join(clean(x) for x in (o.get('opts') or []))+' '+' '.join(clean(x) for x in (o.get('rows') or []))
def nums(t):
    out=set()
    for m in re.finditer(r'(\d+(?:,\d{3})*(?:\.\d+)?)(?:\s*/\s*(\d+))?',t):
        a=m.group(1).replace(',','')
        x=a+'/'+m.group(2) if m.group(2) else a
        if x in STOP: continue
        if m.group(2) or '.' in a or int(a)>=13: out.add(x)
    return out
def strong(x): return ('/' in x) or ('.' in x and len(x.replace('.','').lstrip('0'))>=3)
def flag_pair(o, c):
    a_n=nums(qtext(o)); c_n=nums(qtext(c))
    sh=a_n & c_n
    oa=nums(clean(o.get('a',''))); ca=nums(clean(c.get('a','')))
    cross=(oa & c_n) | (ca & a_n)
    hit = len(sh)>=2 or any(strong(x) for x in sh) or any(strong(x) for x in cross) or len(cross)>=2
    return hit, sorted(sh), sorted(cross)
if __name__=='__main__':
    res=[]
    for code,sets in plan['bench'].items():
        for sname in ('re','cmp'):
            for i,o in enumerate(sets[sname]):
                for j,c in enumerate(sets['chk']):
                    hit,sh,cr=flag_pair(o,c)
                    if hit: res.append((code,sname,i,j,sh,cr,clean(o['q'])[:110].replace('\n',' '),clean(c['q'])[:110].replace('\n',' ')))
    for r in res: print(f"{r[0]} {r[1]}[{r[2]}] vs chk[{r[3]}] shared={r[4]} cross={r[5]}\n    R/X: {r[6]}\n    CHK: {r[7]}")
    print(len(res),'pairs')
