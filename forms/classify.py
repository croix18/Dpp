import json, re, html, sys
SRC = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/dpp/frozen_ed4_1.json'
d = json.load(open(SRC))

def plain(s):
    s = s or ''
    s = re.sub(r'<span class="rep">(.*?)</span>', r'[rep \1]', s)
    s = re.sub(r'<sup>(.*?)</sup>', r'^\1', s)
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s)

NUM = r'[−-]?\$?\d{1,3}(?:,\d{3})*(?:\.\d+)?|[−-]?\$?\d+(?:\.\d+)?'
FRAC = r'[−-]?\d+/\d+'
MIXED = r'[−-]?\d+ \d+/\d+'
UNIT = r'(?:\s*(?:%|°C|°F|°|in\.²|m²|cm²|ft²|mm²|yd²|in\.|square [a-z]+|cubic [a-z]+|[a-zA-Z][a-zA-Z .]*))?'

def norm_minus(s): return s.replace('−', '-')

def classify(it):
    rt = it.get('rt')
    if rt in ('mc', 'etc'): return {'kind': 'mc', 'key': [it['key']], 'n': len(it['opts'])}
    if rt == 'ms': return {'kind': 'ms', 'key': it['key'], 'n': len(it['opts'])}
    if rt == 'match': return {'kind': 'grid', 'key': it['key'], 'rows': len(it['rows']), 'cols': len(it['cols'])}
    a = plain(it['a']).strip()
    if 'Score:' in a or ';' in a or 'graph' in a.lower() or 'line' in a.lower():
        return {'kind': 'TODO', 'why': 'multipart/graph/explanation'}
    variants = []
    m = re.search(r'\((?:or )?([^()]*?)(?: also accepted[^()]*)?\)\s*$', a)
    main = a
    if m:
        inner = m.group(1)
        main = a[:m.start()].strip()
        if 'rep' not in inner:
            variants.append(inner.replace(' also accepted', '').strip())
    main = re.sub(r'^(about|approximately)\s+', '', main)
    main = re.sub(r'^[a-z]\s*=\s*', '', main)  # h = -2
    if '[rep' in main: return {'kind': 'TODO', 'why': 'repeating decimal'}
    if '{' in main or ',' in main and not re.fullmatch(r'[−-]?\$?\d{1,3}(,\d{3})+(\.\d+)?' + UNIT, main):
        return {'kind': 'TODO', 'why': 'list/set'}
    if re.search(r'[≤≥<>]', main): return {'kind': 'TODO', 'why': 'inequality'}
    mpi = re.fullmatch(r'(\d+(?:\.\d+)?)π' + UNIT, main)
    if mpi: return {'kind': 'pi', 'val': mpi.group(1), 'main': main}
    if 'π' in main: return {'kind': 'TODO', 'why': 'pi other'}
    for kind, pat in (('mixed', MIXED), ('frac', FRAC), ('num', NUM)):
        mm = re.fullmatch('(' + pat + ')' + UNIT, main)
        if mm:
            return {'kind': kind, 'val': mm.group(1), 'main': main, 'variants': variants}
    return {'kind': 'TODO', 'why': 'expression/other'}

out = {}
from collections import Counter
cnt = Counter()
for code, sets in d['bench'].items():
    for s in ('chk', 're', 'cmp'):
        for i, it in enumerate(sets[s]):
            c = classify(it)
            out[f'{code}/{s}/{i}'] = c
            cnt[c['kind'] + ('' if c['kind'] != 'TODO' else ':' + c['why'])] += 1
json.dump(out, open('/home/claude/dpp/forms/classes.json', 'w'), indent=1, ensure_ascii=False)
for k, v in sorted(cnt.items()): print(k, v)
print(sum(cnt.values()))
