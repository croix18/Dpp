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

if os.path.exists(KIT):
    shutil.rmtree(KIT)
os.makedirs(IMG)

forms = []
for order, F in enumerate(spec['forms'], 1):
    qs = []
    for Q in F['questions']:
        name = f"{F['id']}-{F['set']}-Q{Q['n']}.png"
        stepD.small(stepD.PNG + Q['slot'].replace('/', '_') + '-q.png', IMG + name)
        if Q['type'] == 'Short answer':
            qs.append({'n': Q['n'], 'image': name, 'type': 'sa', 'accept': Q['accept']})
        else:
            qs.append({'n': Q['n'], 'image': name, 'type': 'mc' if Q['type'] == 'Multiple choice' else 'cb',
                       'options': Q['options'], 'correct': Q['correct']})
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
    if f['level_image']:
        assert os.path.exists(IMG + f['level_image'])
n_img = len(os.listdir(IMG))
size = sum(os.path.getsize(IMG + x) for x in os.listdir(IMG))
print(f"{len(forms)} forms, {sum(len(f['questions']) for f in forms)} questions, {n_img} images ({size / 1e6:.1f} MB), "
      f"manifest {os.path.getsize(KIT + 'forms_manifest.json') / 1e3:.0f} KB")
