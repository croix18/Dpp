# Forms edition, step E: the kit the Apps Script builder reads.
#   DPP Forms script kit/DPP Forms kit/forms_manifest.json   every form: title, description, questions, keys
#   DPP Forms script kit/DPP Forms kit/images/*.png           question images and level scales, flat, unique names
# Code.gs, appsscript.json and the setup PDF are added next to "DPP Forms kit" by the packaging step.
import json, os, shutil, sys
sys.path.insert(0, '/home/claude/dpp/forms')
import stepD   # form_title, description, small (palette PNG copy)

ROOT = '/home/claude/dpp/'
KIT_PARENT = ROOT + 'script_kit/DPP Forms script kit/'
KIT = KIT_PARENT + 'DPP Forms kit/'
IMG = KIT + 'images/'
spec = json.load(open(ROOT + 'forms/forms_spec.json'))
SET_LABEL = {'chk': 'Check', 're': 'Re-check', 'cmp': 'Comparison'}

# ---- feedback students see on the score page: the worked solution, plus what each wrong answer means ----
import re, glob
PLAN = json.load(open(ROOT + 'forms/plan_forms.json'))['bench']
LT = 'ABCDEFGH'
SUPS = str.maketrans('0123456789-', '⁰¹²³⁴⁵⁶⁷⁸⁹⁻')
WHY = {}                                    # slot -> {'why': {letter: meaning}} or {'typed': [(value, meaning)]}
try:
    for slot, n in json.load(open(ROOT + 'units910/content.json'))['NOTES'].items():
        WHY[slot] = n
except FileNotFoundError:
    pass
ROT = {p['slot']: p.get('rotate', 0) for p in json.load(open(ROOT + 'forms/forms_patches.json')) if p.get('rewrite')}
for f in glob.glob(ROOT + 'forms/review/rewrites/out_*.json'):
    for e in json.load(open(f)):
        if e['slot'] in WHY:
            continue
        if e['rt'] == 'sa':
            WHY[e['slot']] = {'typed': e.get('typed', [])}
        else:
            sh, k = ROT.get(e['slot'], 0), len(e['opts'])
            WHY[e['slot']] = {'why': {LT[(i + sh) % k]: m for i, m in enumerate(e.get('why', [])) if m}}


def plain(h):
    t = str(h)
    t = re.sub(r'<sup>([^<]*)</sup>', lambda m: m.group(1).translate(SUPS) if re.fullmatch(r'-?\d+', m.group(1)) else '^(' + m.group(1) + ')', t)
    t = re.sub(r'<span class="rep">([^<]*)</span>', lambda m: m.group(1) + ' (repeating)', t)
    t = re.sub(r'<br\s*/?>', '\n', t)
    t = re.sub(r'</tr>', '\n', t); t = re.sub(r'</t[dh]>', '  ', t)
    t = re.sub(r'<[^>]+>', '', t)
    t = t.replace('&nbsp;', ' ').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
    return re.sub(r'[ \t]+', ' ', t).strip()


def feedback(Q):
    c, st, i = Q['slot'].split('/')
    it = PLAN[c][st][int(i)]
    sol = plain(it.get('s') or '')
    w = WHY.get(Q['slot'], {})
    mist = []
    if Q['type'] != 'Short answer' and w.get('why'):
        for L, m in sorted(w['why'].items()):
            mist.append(f'Choice {L}: {plain(m)}')
    elif Q['type'] == 'Short answer' and w.get('typed'):
        for v, m in w['typed']:
            mist.append(f'If you got {plain(v)}: {plain(m)}')
    ans = plain(it.get('a') or '')
    wrong = f'Answer: {ans}\n\n{sol}' if sol else f'Answer: {ans}'
    if mist:
        wrong += '\n\nCommon mistakes:\n' + '\n'.join('• ' + m for m in mist)
    right = f'Correct. {ans}\n\n{sol}' if sol else 'Correct.'
    cap = lambda t: t if len(t) <= 1500 else t[:1480].rsplit('\n', 1)[0] + '\n…'
    return cap(right), cap(wrong)

if os.path.exists(KIT):
    shutil.rmtree(KIT)
os.makedirs(IMG)

forms = []
for order, F in enumerate(spec['forms'], 1):
    qs = []
    for Q in F['questions']:
        name = f"{F['id']}-{F['set']}-Q{Q['n']}.png"
        stepD.small(stepD.PNG + Q['slot'].replace('/', '_') + '-q.png', IMG + name)
        right, wrong = feedback(Q)
        if Q['type'] == 'Short answer':
            qs.append({'n': Q['n'], 'image': name, 'type': 'sa', 'accept': Q['accept'], 'right': right, 'wrong': wrong})
        else:
            qs.append({'n': Q['n'], 'image': name, 'type': 'mc' if Q['type'] == 'Multiple choice' else 'cb',
                       'options': Q['options'], 'correct': Q['correct'], 'right': right, 'wrong': wrong})
    level = None
    if F['set'] == 'chk':
        level = f"{F['id']}-scale.png"
        stepD.small(stepD.PNG + F['code'] + '-scale.png', IMG + level)
    forms.append({'order': order, 'key': f"{F['id']} {SET_LABEL[F['set']]}", 'id': F['id'], 'set': F['set'],
                  'unit': F['unit'], 'title': stepD.form_title(F), 'description': stepD.description(F),
                  'calc': F['calc'], 'locked': 'on' if F['calc'] == 'no' else 'off',
                  'level_image': level, 'questions': qs})

manifest = {'edition': '4.1 Forms', 'regex': spec['regex'], 'regex_error': spec['regex_error'], 'forms': forms}
json.dump(manifest, open(KIT + 'forms_manifest.json', 'w'), indent=1, ensure_ascii=False)

# self-checks: every option list has its correct answers, every image exists, keys are unique
keys = [f['key'] for f in forms]
assert len(keys) == len(set(keys)) == 102
for f in forms:
    for q in f['questions']:
        assert os.path.exists(IMG + q['image']), q['image']
        if q['type'] in ('mc', 'cb'):
            assert q['correct'] and all(c in q['options'] for c in q['correct']), (f['key'], q)
            assert len(set(q['options'])) == len(q['options'])
            if q['type'] == 'mc':
                assert len(q['correct']) == 1
        else:
            assert q['accept']
        assert q['right'] and q['wrong'] and len(q['wrong']) <= 1500, (f['key'], q['n'])
    if f['level_image']:
        assert os.path.exists(IMG + f['level_image'])
n_img = len(os.listdir(IMG))
size = sum(os.path.getsize(IMG + x) for x in os.listdir(IMG))
print(f"{len(forms)} forms, {sum(len(f['questions']) for f in forms)} questions, {n_img} images ({size / 1e6:.1f} MB), "
      f"manifest {os.path.getsize(KIT + 'forms_manifest.json') / 1e3:.0f} KB")
