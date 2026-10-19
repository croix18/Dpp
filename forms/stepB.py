# Forms edition, step B: the Google Forms build spec for every question.
# Reads plan_forms.json + forms_overrides.json, writes forms_spec.json.
import json, re, html

ROOT = '/home/claude/dpp/'
plan = json.load(open(ROOT + 'forms/plan_forms.json'))['bench']
over = json.load(open(ROOT + 'forms/forms_overrides.json'))
S = json.load(open(ROOT + 'scales.json'))
LT = 'ABCDEFGHI'

# One validation rule for every short-answer question: a plain number, decimal, fraction or mixed number.
REGEX = r'^-?(\d+(\.\d+)?|\.\d+|\d+/\d+|\d+ \d+/\d+)$'
REGEX_ERR = 'Type only a number, like 12 or -3.5 or 2/7 or 4 1/3. No units, $, %, π or commas.'
NOTE = {
    'num': 'Type a number only. No units, $ or %.',
    'frac': 'Type a whole number, a fraction like 2/7, or a mixed number like 4 1/3 with a space after the whole number.',
    'pi': 'Type only the number in front of π. Example: for 7π, type 7.',
}
NOCALC = re.compile(r'NSO\.2\.2|NSO\.2\.1|NSO\.1\.1|NSO\.1\.2|AR\.1\.')


def plain(s):
    s = s or ''
    s = re.sub(r'<span class="rep">(.*?)</span>', r'\1(repeating)', s)
    s = re.sub(r'<sup>(.*?)</sup>', r'^\1', s)
    s = re.sub(r'<br\s*/?>', '\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    return html.unescape(s)


def dec_forms(s, q):
    """Accepted spellings of one decimal or integer string (hyphen minus, no $ or commas)."""
    out = [s]
    neg = s.startswith('-')
    body = s[1:] if neg else s
    sg = '-' if neg else ''
    if '.' in body:
        w, f = body.split('.')
        f2 = f.rstrip('0')
        out.append(sg + w + ('.' + f2 if f2 else ''))
        if len(f) <= 2:                      # money and tenths: every spelling up to two places
            for places in range(len(f2), 3):
                if places:
                    out.append(sg + w + '.' + (f2 + '00')[:places])
    else:
        if re.search(r'nearest hundredth', q):
            out += [s + '.0', s + '.00']
        elif re.search(r'nearest tenth', q):
            out.append(s + '.0')
    more = []
    for v in out:
        b = v[1:] if v.startswith('-') else v
        if b.startswith('0.'):
            more.append(sg + b[1:])
    out += more
    seen = []
    for v in out:
        if v not in seen:
            seen.append(v)
    return seen


from fractions import Fraction


def note_for(q, kind):
    """The typing note follows the question, never the answer, so it cannot hint at the answer's form."""
    if kind == 'pi':
        return NOTE['pi']
    if re.search(r'fraction|mixed number|simplest form', q, re.I):
        return NOTE['frac']
    return NOTE['num']


def frac_forms(fr):
    """Fraction spellings of an exact value: proper or improper fraction, and the mixed number."""
    sg = '-' if fr < 0 else ''
    fr = abs(fr)
    out = [f'{sg}{fr.numerator}/{fr.denominator}']
    if fr.numerator > fr.denominator:
        w, r = divmod(fr.numerator, fr.denominator)
        out.insert(0, f'{sg}{w} {r}/{fr.denominator}')
    return out


def generic_extras(acc, a, q, kind):
    """Equivalent spellings a 7th grader may type: decimals of halves to tenths as fractions (unless the
    stem asks for a decimal, rounds, or the answer is money), improper fractions as mixed numbers, and
    terminating fractions as decimals when the stem does not ask for a fraction."""
    extra = []
    money = '$' in a or '$' in q or re.search(r'euro|franc|dollar', a + q, re.I)
    for v in acc:
        if re.fullmatch(r'-?\d+\.\d{1,2}', v) and not money and not re.search(r'decimal|round|nearest', q, re.I):
            fr = Fraction(v)
            if fr.denominator in (2, 4, 5, 8, 10):
                extra += frac_forms(fr)
        m = re.fullmatch(r'(-?)(\d+)/(\d+)', v)
        if m:
            fr = Fraction(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
            if abs(fr.numerator) > fr.denominator and fr.denominator > 1:
                extra += [x for x in frac_forms(fr) if ' ' in x]
            if not re.search(r'fraction', q, re.I) and fr.denominator > 1 and all(p in (2, 5) for p in _primes(fr.denominator)):
                d = str(float(fr)).rstrip('0').rstrip('.')
                extra += dec_forms(d if '.' in d else d, q)
    return [x for x in dict.fromkeys(acc + extra)]


def _primes(n):
    out, k = [], 2
    while n > 1:
        while n % k == 0:
            out.append(k); n //= k
        k += 1
    return out


def sa_spec(it, slot):
    a = plain(it['a']).strip()
    q = plain(it['q'])
    o = over.get(slot, {})
    if 'accept' in o:
        acc = []
        for v in o['accept']:
            acc += dec_forms(v, q) if re.fullmatch(r'-?\d+(\.\d+)?', v) else [v]
        kind = 'frac' if any('/' in v for v in o['accept']) else 'num'
        return list(dict.fromkeys(acc)), o.get('note') or note_for(q, kind), kind
    variants = []
    m = re.search(r'\((?:or )?([^()]*?)(?: also accepted[^()]*)?\)\s*$', a)
    main = a
    if m:
        main = a[:m.start()].strip()
        inner = m.group(1).replace(' also accepted', '').strip()
        if 'repeating' not in inner:
            variants.append(inner)
    main = re.sub(r'^(about|approximately)\s+', '', main)
    main = re.sub(r'^[a-z]\s*=\s*', '', main)
    main = main.replace('−', '-')
    mpi = re.match(r'^(\d+(?:\.\d+)?)π', main)
    if mpi:
        return [mpi.group(1)], note_for(q, 'pi'), 'pi'
    mm = re.match(r'^(-?)(\d+) (\d+)/(\d+)', main)
    if mm:
        sg, w, n, d = mm.group(1), int(mm.group(2)), int(mm.group(3)), int(mm.group(4))
        acc = [f'{sg}{w} {n}/{d}', f'{sg}{w * d + n}/{d}']
        for v in variants:
            v = v.replace('−', '-').replace('$', '')
            acc += dec_forms(v, q) if re.fullmatch(r'-?\d+(\.\d+)?', v) else [v]
        return generic_extras(acc, a, q, 'frac'), note_for(q, 'frac'), 'frac'
    mf = re.match(r'^(-?\d+/\d+)', main)
    if mf:
        acc = [mf.group(1)]
        for v in variants:
            v = v.replace('−', '-')
            acc += dec_forms(v, q) if re.fullmatch(r'-?\d+(\.\d+)?', v) else [v]
        return generic_extras(acc, a, q, 'frac'), note_for(q, 'frac'), 'frac'
    mn = re.match(r'^(-?)\$?(\d[\d,]*(?:\.\d+)?)', main)
    if mn:
        v = mn.group(1) + mn.group(2).replace(',', '')
        acc = dec_forms(v, q)
        if '$' in main and '.' not in v:
            acc += [v + '.00']
        for x in variants:
            x = x.replace('−', '-').replace('$', '')
            if re.fullmatch(r'-?\d+(\.\d+)?', x):
                acc += [y for y in dec_forms(x, q) if y not in acc]
        return generic_extras(list(dict.fromkeys(acc)), a, q, 'num'), note_for(q, 'num'), 'num'
    raise ValueError(f'{slot}: cannot read answer {a!r}')


spec = {'regex': REGEX, 'regex_error': REGEX_ERR, 'forms': []}
for unit, title, codes in S['order']:
    for code in codes:
        cid = code.replace('MA.7.', 'C-')
        calc = 'no' if NOCALC.search(code) else 'yes'
        for sn, label, nq in (('chk', 'Check', 5), ('re', 'Re-check', 3), ('cmp', 'Comparison', 2)):
            F = {'unit': unit, 'unit_title': title, 'code': code, 'id': cid, 'set': sn, 'label': label, 'calc': calc,
                 'name': plan[code][sn][0].get('label') or '', 'questions': []}
            for i, it in enumerate(plan[code][sn]):
                slot = f'{code}/{sn}/{i}'
                o = over.get(slot, {})
                Q = {'n': i + 1, 'slot': slot, 'hr': bool(it.get('_hr')), 'points': 1}
                rt = it.get('rt')
                if rt in ('mc', 'etc'):
                    Q.update(type='Multiple choice', options=[LT[k] for k in range(len(it['opts']))], correct=[LT[it['key']]])
                elif rt == 'ms':
                    if o.get('native'):
                        Q.update(type='Checkboxes', native=True, options=[plain(x) for x in it['opts']],
                                 correct=[plain(it['opts'][k]) for k in it['key']])
                    else:
                        Q.update(type='Checkboxes', options=[LT[k] for k in range(len(it['opts']))], correct=[LT[k] for k in it['key']])
                elif rt is None:
                    acc, note, kind = sa_spec(it, slot)
                    Q.update(type='Short answer', accept=acc, note=note, kind=kind)
                else:
                    raise ValueError(f'{slot}: response type {rt} not supported in Forms')
                F['questions'].append(Q)
            spec['forms'].append(F)

json.dump(spec, open(ROOT + 'forms/forms_spec.json', 'w'), indent=1, ensure_ascii=False)
from collections import Counter
c = Counter(q['type'] + (' (typed options)' if q.get('native') else '') for F in spec['forms'] for q in F['questions'])
print(len(spec['forms']), 'forms;', sum(c.values()), 'questions;', dict(c))
print('short-answer kinds', Counter(q.get('kind') for F in spec['forms'] for q in F['questions'] if q['type'] == 'Short answer'))
# every accepted answer must pass the validation rule
rx = re.compile(REGEX)
for F in spec['forms']:
    for q in F['questions']:
        for v in q.get('accept', []):
            if not rx.match(v):
                print('ACCEPT FAILS VALIDATION', q['slot'], repr(v))
