# Forms edition, step D: the folder a teacher builds Google Forms from.
#   Unit NN Title / N C-XX Label / 1 Check | 2 Re-check | 3 Comparison / Q1.png ... , Answers/Q1.png ..., Build sheet.pdf
# plus 00 Start here.pdf and 01 Form build list.xlsx. Build sheets and the start page are HTML printed to PDF
# by print_pdfs.js (Lexend). Run: python3 stepD.py && node print_pdfs.js && python3 stepD.py --finish
import json, re, os, shutil, sys, html, zipfile, time
from collections import Counter

ROOT = '/home/claude/dpp/'
F_DIR = ROOT + 'forms/'
PNG = F_DIR + 'png/'
OUT_NAME = 'DPP Google Forms 2026-27'
OUT = ROOT + OUT_NAME + '/'
HTML_DIR = F_DIR + 'build_html/'
spec = json.load(open(F_DIR + 'forms_spec.json'))
plan = json.load(open(F_DIR + 'plan_forms.json'))['bench']
report = {r['slot']: r for r in json.load(open(F_DIR + 'stepA_report.json'))}
patches = {p['slot']: p for p in json.load(open(F_DIR + 'forms_patches.json'))}
S = json.load(open(ROOT + 'scales.json'))
esc = html.escape

KIND_TITLE = {'chk': 'Check', 're': 'Re-check', 'cmp': 'Review'}
FOLDER = {'chk': '1 Check', 're': '2 Re-check', 'cmp': '3 Comparison'}
WHEN = {'chk': 'Thursday, on the week\'s benchmark',
        're': 'Wednesday, after the reteach, when this benchmark was retaught',
        'cmp': 'Wednesday, with a re-check, when this benchmark was taught earlier but not retaught'}


def clean(s):
    return re.sub(r'\s+', ' ', re.sub(r'[\\/:*?"<>|]', '', s)).strip()


def form_title(F):
    return f"{F['id']} {KIND_TITLE[F['set']]} · {F['name']}"


def description(F):
    goal = S['scales'][F['code']]['goal']
    n = len(F['questions'])
    calc = 'Calculator allowed.' if F['calc'] == 'yes' else 'No calculator.'
    lead = f'Learning goal: {goal} ' if F['set'] == 'chk' else ''
    return f"{lead}{n} questions, 1 point each. Work each one out on paper, then choose or type your answer. {calc}"


def folder_of(F):
    unit_idx = [u for u, t, c in S['order']].index(F['unit'])
    codes = S['order'][unit_idx][2]
    k = codes.index(F['code']) + 1
    return f"Unit {F['unit']:02d} {clean(F['unit_title'])}/{k} {F['id']} {clean(F['name'])}/{FOLDER[F['set']]}/"


WAS = {'sa': 'a written answer', 'match': 'a matching grid', 'mc': 'multiple choice', 'ms': 'select-all', 'etc': 'multiple choice'}


def change_note(slot):
    p = patches.get(slot)
    if not p or ('set' not in p and 'redraw' not in p):
        return ''
    if 'redraw' not in p and not p.get('set', {}).get('rt'):
        return ''   # wording or answer-key tweaks only; the format did not change
    was = WAS.get(report[slot]['before']['rt'], 'a written answer')
    if 'redraw' in p:
        return f'Redrawn from Cadence (the paper item was {was})'
    if p['set'].get('rt') == 'ms':
        return f'Same problem, now check-the-boxes (paper: {was})'
    return f'Same problem, now multiple choice (paper: {was})'


def key_cell(Q):
    if Q['type'] == 'Short answer':
        acc = ' &nbsp;·&nbsp; '.join(f'<b>{esc(a)}</b>' for a in Q['accept'])
        return f'{acc}<div class="sm">Tick “Mark all other answers incorrect.” Response validation: Regular expression, Matches (see top).</div>'
    if Q.get('native'):
        return 'Check: ' + ', '.join(f'<b>{esc(c)}</b>' for c in Q['correct']) + '<div class="sm">One point only if exactly these are checked.</div>'
    if Q['type'] == 'Checkboxes':
        return 'Check: <b>' + ', '.join(Q['correct']) + '</b><div class="sm">One point only if exactly these are checked.</div>'
    return f"<b>{Q['correct'][0]}</b>"


def options_cell(Q):
    if Q['type'] == 'Short answer':
        return '<span class="dim">none (typed answer)</span>'
    if Q.get('native'):
        return 'Type these: ' + ', '.join(esc(o) for o in Q['options'])
    return ' &nbsp;'.join(Q['options'])


CSS = """
@font-face{font-family:Lexend;src:url('file:///home/claude/dpp/lexend0.ttf')}
@page{size:letter;margin:0.45in 0.5in}
body{font-family:Lexend,Arial,sans-serif;color:#111;font-size:10.5px;line-height:1.4;margin:0}
h1{font-size:17px;margin:0 0 2px}
h2{font-size:12.5px;margin:14px 0 5px;padding-bottom:2px;border-bottom:1.2px solid #1f2a44}
.sub{color:#555;font-size:10.5px;margin-bottom:8px}
.box{border:1px solid #bbb;border-radius:6px;padding:7px 10px;margin:6px 0;background:#fafaf7}
.box b{font-weight:600}
.copy{background:#fff;border:1px solid #ddd;padding:1px 5px;border-radius:3px}
.mono{font-family:'Courier New',monospace;font-size:10px;word-break:break-all}
table{border-collapse:collapse;width:100%}
th{background:#1f2a44;color:#fff;font-weight:600;text-align:left;padding:4px 6px;font-size:9.5px}
td{border-bottom:1px solid #ddd;padding:5px 6px;vertical-align:top}
td.n{font-weight:700;font-size:13px;width:18px}
td.img img{width:1.9in;border:1px solid #ccc;display:block}
.sm{font-size:8.8px;color:#555;margin-top:2px}
.dim{color:#777}
.tag{display:inline-block;font-size:8px;border:1px solid #999;border-radius:3px;padding:0 3px;margin-left:3px;color:#444}
tr{page-break-inside:avoid}
ol{padding-left:18px;margin:4px 0}li{margin:2px 0}
.two{display:flex;gap:14px}.two>div{flex:1}
"""


THUMB = F_DIR + 'thumbs/'


def thumb(name):
    """A 560-pixel palette copy of a question image for the build sheet, so each PDF stays small."""
    from PIL import Image
    os.makedirs(THUMB, exist_ok=True)
    dst = THUMB + name.replace('.png', '.jpg')
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(PNG + name):
        im = Image.open(PNG + name).convert('RGB')
        w = 440
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        im.save(dst, 'JPEG', quality=72, optimize=True)
    return 'file://' + dst


def build_sheet_html(F, folder_abs):
    rows = []
    for Q in F['questions']:
        key = Q['slot'].replace('/', '_')
        tag = '<span class="tag">Rigor</span>' if Q['hr'] else ''
        chg = change_note(Q['slot'])
        rows.append(f"""<tr><td class="n">{Q['n']}</td><td class="img"><img src="{thumb(key + '-q.png')}"></td>
          <td><b>Q{Q['n']}.png</b>{tag}<div class="sm">{esc(Q['type'])}</div>{f'<div class="sm">{esc(chg)}</div>' if chg else ''}</td>
          <td>{options_cell(Q)}</td><td>{key_cell(Q)}</td><td>1</td></tr>""")
    if F['set'] == 'chk':
        rows.append(f"""<tr><td class="n">{len(F['questions']) + 1}</td><td class="img"><img src="{thumb(F['code'] + '-scale.png')}"></td>
          <td><b>Level scale.png</b><div class="sm">Multiple choice (the template's last question)</div></td>
          <td>Level 1 &nbsp;Level 2 &nbsp;Level 3 &nbsp;Level 4</td><td><span class="dim">no key</span></td><td>0</td></tr>""")
    locked = 'ON (no calculator)' if F['calc'] == 'no' else 'OFF (calculator allowed; Locked mode blocks the Chromebook calculator)'
    has_sa = any(Q['type'] == 'Short answer' for Q in F['questions'])
    sa_box = f"""<div class="box"><b>Short-answer validation</b> (already on the template's short-answer question; copy that question):
      Regular expression → Matches → <span class="copy mono">{esc(spec['regex'])}</span><br>Error text: <span class="copy">{esc(spec['regex_error'])}</span></div>""" if has_sa else ''
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
    <h1>{esc(F['id'])} · {esc({'chk': 'Weekly check', 're': 'Re-check', 'cmp': 'Comparison (review)'}[F['set']])} · {len(F['questions'])} questions</h1>
    <div class="sub">{esc(F['code'])} · {esc(F['name'])} · Unit {F['unit']} {esc(F['unit_title'])} · Given {esc(WHEN[F['set']])}</div>
    <div class="box"><b>Form title</b> <span class="copy">{esc(form_title(F))}</span><br>
      <b>Description</b> <span class="copy">{esc(description(F))}</span><br>
      <b>Locked mode</b> {locked}</div>
    {sa_box}
    <table><tr><th>#</th><th>Question image</th><th>File · type</th><th>Options to add</th><th>Answer key</th><th>Pts</th></tr>{''.join(rows)}</table>
    <div class="sm" style="margin-top:8px">Answers with worked solutions are in the Answers folder next to the question images (same file names).</div>
    </body></html>"""


START = """<!doctype html><html><head><meta charset="utf-8"><style>{css}</style></head><body>
<h1>DPP Weekly Checks in Google Forms</h1>
<div class="sub">7th grade on-level · all 34 benchmarks · {nforms} forms · {nq} questions · every question grades itself</div>

<h2>What is in this folder</h2>
<table>
<tr><th>Item</th><th>What it is</th></tr>
<tr><td><b>Unit folders</b></td><td>One folder per Math Nation unit. Inside, one folder per benchmark, in teaching order. Each benchmark has three forms:
<b>1 Check</b> (5 questions, Thursday), <b>2 Re-check</b> (3 questions, Wednesday after a reteach) and <b>3 Comparison</b> (2 questions, Wednesday, for a benchmark that was <i>not</i> retaught).</td></tr>
<tr><td><b>In each form folder</b></td><td><b>Build sheet.pdf</b> (title, description, every question's type, options and answer key), the question images <b>Q1.png, Q2.png …</b> to upload,
<b>Level scale.png</b> for checks, and an <b>Answers</b> folder with the answer and worked solution for each question.</td></tr>
<tr><td><b>01 Form build list.xlsx</b></td><td>Every form and question in one list, with columns to tick off what is built and paste each form's link.</td></tr>
</table>

<h2>One-time setup: the template form (about 15 minutes)</h2>
<ol>
<li>Upload this whole folder to your <b>school</b> Google Drive, so student responses stay in the school account.</li>
<li>Make a new blank form named <span class="copy">DPP template</span>. Settings → <b>Make this a quiz</b>: on. Release grades: <b>Immediately after each submission</b>.
Respondents can see: <b>Missed questions</b> and <b>Point values</b> on, <b>Correct answers</b> off.</li>
<li>Settings → Responses: <b>Collect email addresses: Verified</b>, <b>Limit to 1 response</b>: on.</li>
<li>Add these questions, all <b>Required</b>:
<ol type="a">
<li><b>Teacher</b>: Multiple choice, <span class="copy">Mr. C. Shaffer</span>, <span class="copy">Mr. J. Shaffer</span>. 0 points.</li>
<li><b>Period</b>: Dropdown, your period numbers. 0 points.</li>
<li><b>Choice question (copy me)</b>: Multiple choice with options <span class="copy">A</span> <span class="copy">B</span> <span class="copy">C</span> <span class="copy">D</span>. 1 point.</li>
<li><b>Typed question (copy me)</b>: Short answer. ⋮ → Response validation → <b>Regular expression</b> → <b>Matches</b> →
<span class="copy mono">{regex}</span> with the error text <span class="copy">{err}</span>. 1 point.</li>
<li><b>Level</b> (last): Multiple choice, <span class="copy">Which level are you at right now?</span> with options Level 1 to Level 4. 0 points.</li>
</ol></li>
</ol>

<h2>Building one form (about 5 minutes for a check)</h2>
<ol>
<li>In Drive, right-click <b>DPP template</b> → <b>Make a copy</b>. Rename it with the <b>Form title</b> from the build sheet, and paste the <b>Description</b>.</li>
<li>For each question on the build sheet: click the <b>copy me</b> question of the right type, click <b>Duplicate</b>, drag it into place, click the image icon and pick <b>Q1.png</b> (Google Drive tab → this folder).</li>
<li>Click <b>Answer key</b>: pick the letter, or for a typed question type every accepted answer from the build sheet and tick <b>Mark all other answers incorrect</b>.
Checkbox questions (a few) are built from a plain Checkboxes question with the options on the sheet.</li>
<li>Delete the two <b>copy me</b> questions. On a check, add <b>Level scale.png</b> to the Level question; on a re-check or comparison form, delete the Level question.</li>
<li>Turn <b>Locked mode</b> on for no-calculator forms (the build sheet says which). Locked mode works only on school-managed Chromebooks, and it also blocks the Chromebook calculator.</li>
<li>Click <b>Preview</b>, answer it once with the key to check the score is 5/5 (or 3/3, 2/2), then delete that test response.</li>
</ol>

<h2>The week with Forms</h2>
<div class="two"><div><ol>
<li><b>Before Thursday</b>: build or open the week's <b>Check</b>. Post its link in your Google Classroom and John's (as a co-teacher in his class, or send him the link to post).</li>
<li><b>Thursday</b>, last 8 minutes: students take the check. Forms scores it and shows each student their score; they choose their level at the end.</li>
<li><b>Friday or Monday</b>: open Responses → Summary. <b>Frequently missed questions</b> shows the item that gave the most trouble. That decides the reteach.</li>
</ol></div><div><ol start="4">
<li><b>Tuesday</b>: reteach, 8–10 minutes.</li>
<li><b>Wednesday</b>: students take two short forms: the <b>Re-check</b> for the retaught benchmark and the <b>Comparison</b> form for the most recent benchmark that was not retaught.</li>
<li><b>Data</b>: Responses → <b>Link to Sheets</b>, and link every form to one spreadsheet. The Teacher and Period columns split the two classes.</li>
</ol></div></div>

<div style="page-break-before:always"></div>
<h2>Good to know</h2>
<ul>
<li><b>Typed answers.</b> The validation only lets students submit a plain number, fraction or mixed number, so the accepted answers on each build sheet cover the ways a correct answer can be typed.
If a student types a correct answer the key missed, open Responses → Question, find it, and mark it correct; Forms re-scores everyone who typed the same thing.</li>
<li><b>π answers.</b> Students type only the number in front of π (for 7π they type 7). The question image says so.</li>
<li><b>Correct answers stay hidden</b> until both teachers have given the form, so one class cannot pass answers to the next. Turn them on afterward if you want students to review.</li>
<li><b>What changed from the paper bank.</b> Forms cannot grade a graph, an expression or a written explanation, so {nchanged} of the 340 problems now ask students to choose (the right graph, expression, inequality or full answer) or check boxes; 4 were redrawn from Cadence. The build sheet marks each one, and the list is on the next page. Every other problem is unchanged from edition 4.1.</li>
</ul>

<h2>Problems changed for Forms</h2>
<table><tr><th>Form</th><th>Q</th><th>What changed</th></tr>{changes}</table>
</body></html>"""


def main_html():
    os.makedirs(HTML_DIR, exist_ok=True)
    jobs = []
    for F in spec['forms']:
        folder = OUT + folder_of(F)
        hp = HTML_DIR + f"{F['id']}_{F['set']}.html"
        open(hp, 'w').write(build_sheet_html(F, folder))
        jobs.append({'html': hp, 'pdf': folder + 'Build sheet.pdf'})
    changes = []
    for F in spec['forms']:
        for Q in F['questions']:
            what = change_note(Q['slot'])
            if not what:
                continue
            p = patches[Q['slot']]
            why = p['why'].split(';')[0]
            changes.append(f"<tr><td>{esc(F['id'])} {esc({'chk': 'Check', 're': 'Re-check', 'cmp': 'Comparison'}[F['set']])}</td><td>{Q['n']}</td><td>{esc(what)} <span class='dim'>({esc(why)})</span></td></tr>")
    nq = sum(len(F['questions']) for F in spec['forms'])
    hp = HTML_DIR + 'start.html'
    open(hp, 'w').write(START.format(css=CSS, nforms=len(spec['forms']), nq=nq, regex=esc(spec['regex']), err=esc(spec['regex_error']),
                                     nchanged=len(changes) - sum(1 for c in changes if 'Redrawn' in c), changes=''.join(changes)))
    jobs.append({'html': hp, 'pdf': OUT + '00 Start here.pdf'})
    json.dump(jobs, open(HTML_DIR + 'jobs.json', 'w'), indent=1)
    print('html written:', len(jobs), 'changed rows:', len(changes))


def small(src, dst):
    """Palette PNG (64 colors, no dithering): the images are black text and a few grays, so this looks
    the same and is about a third of the size."""
    from PIL import Image
    Image.open(src).convert('RGB').quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(dst, optimize=True)


def finish():
    # images
    n = 0
    for F in spec['forms']:
        folder = OUT + folder_of(F)
        os.makedirs(folder + 'Answers', exist_ok=True)
        for Q in F['questions']:
            key = Q['slot'].replace('/', '_')
            small(PNG + f'{key}-q.png', folder + f"Q{Q['n']}.png")
            small(PNG + f'{key}-a.png', folder + f"Answers/Q{Q['n']}.png")
            n += 2
        if F['set'] == 'chk':
            small(PNG + f"{F['code']}-scale.png", folder + 'Level scale.png')
            n += 1
    print('images copied:', n)
    shutil.copyfile(F_DIR + 'cadence_notes.md', OUT + '02 Notes for the Cadence reviewer.md')
    build_xlsx()


def build_xlsx():
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.utils import get_column_letter
    wb = Workbook()
    hdr_fill = PatternFill('solid', fgColor='1F2A44')
    fill_in = PatternFill('solid', fgColor='EEF1F6')
    F_ = Font(name='Arial', size=10)
    H_ = Font(name='Arial', size=10, bold=True, color='FFFFFF')
    thin = Side(style='thin', color='DDDDDD')

    def sheet(ws, headers, rows, widths, legend=None, fill_cols=()):
        r0 = 1
        if legend:
            ws.cell(row=1, column=1, value=legend).font = Font(name='Arial', size=10, italic=True)
            r0 = 3
        for j, h in enumerate(headers, 1):
            c = ws.cell(row=r0, column=j, value=h)
            c.font, c.fill, c.alignment = H_, hdr_fill, Alignment(vertical='center', wrap_text=True)
        for i, row in enumerate(rows, r0 + 1):
            for j, v in enumerate(row, 1):
                c = ws.cell(row=i, column=j, value=v)
                c.font = F_
                c.alignment = Alignment(vertical='top', wrap_text=True)
                c.border = Border(bottom=thin)
                if headers[j - 1] in fill_cols:
                    c.fill = fill_in
        for j, w in enumerate(widths, 1):
            ws.column_dimensions[get_column_letter(j)].width = w
        ws.freeze_panes = ws.cell(row=r0 + 1, column=1)
        ws.auto_filter.ref = f'A{r0}:{get_column_letter(len(headers))}{r0 + len(rows)}'

    ws = wb.active
    ws.title = 'Forms'
    rows = []
    for F in spec['forms']:
        rows.append([F['unit'], F['code'], F['id'], {'chk': 'Check', 're': 'Re-check', 'cmp': 'Comparison'}[F['set']], form_title(F),
                     len(F['questions']), 'yes' if F['calc'] == 'yes' else 'no', 'off' if F['calc'] == 'yes' else 'on',
                     f"{OUT_NAME}/{folder_of(F)}", '', ''])
    sheet(ws, ['Unit', 'Benchmark', 'Check ID', 'Form', 'Form title', 'Questions', 'Calculator', 'Locked mode', 'Folder', 'Built (y)', 'Form link'],
          rows, [6, 14, 11, 12, 52, 10, 11, 12, 60, 10, 40],
          legend='Fill in the shaded columns as you go: Built (type y when the form is done) and Form link (paste the link from Send → link, for example https://forms.gle/AbC123xyz).',
          fill_cols=('Built (y)', 'Form link'))

    ws2 = wb.create_sheet('Questions')
    rows = []
    for F in spec['forms']:
        for Q in F['questions']:
            if Q['type'] == 'Short answer':
                opts, corr, acc, val = '', '', ', '.join(Q['accept']), 'Regular expression, Matches (see Settings)'
            elif Q.get('native'):
                opts, corr, acc, val = ', '.join(Q['options']), ', '.join(Q['correct']), '', ''
            else:
                opts, corr, acc, val = ' '.join(Q['options']), ', '.join(Q['correct']), '', ''
            rows.append([form_title(F), Q['n'], f"Q{Q['n']}.png", Q['type'], opts, corr, acc, val, 1, 'yes' if Q['hr'] else '', change_note(Q['slot'])])
    sheet(ws2, ['Form title', 'Q', 'Image', 'Type', 'Options to add', 'Correct', 'Accepted typed answers', 'Validation', 'Points', 'Rigor', 'Changed for Forms'],
          rows, [52, 5, 9, 15, 26, 14, 34, 30, 7, 7, 46])

    ws3 = wb.create_sheet('Settings')
    rows = [['Make this a quiz', 'On'], ['Release grades', 'Immediately after each submission'],
            ['Respondents can see', 'Missed questions and point values on; correct answers off until both teachers have given the form'],
            ['Collect email addresses', 'Verified'], ['Limit to 1 response', 'On'],
            ['Locked mode', 'On for no-calculator forms (school-managed Chromebooks only)'],
            ['Short-answer validation', 'Regular expression → Matches → ' + spec['regex']], ['Short-answer error text', spec['regex_error']],
            ['Short-answer key', 'Type every accepted answer from the build sheet; tick "Mark all other answers incorrect"'],
            ['Checkbox questions', 'One point only when exactly the correct boxes are checked (Forms does this by default)']]
    sheet(ws3, ['Setting', 'Value'], rows, [26, 110])
    wb.save(OUT + '01 Form build list.xlsx')
    print('xlsx written')


def zip_out():
    zp = ROOT + OUT_NAME + '.zip'
    files = []
    for dp, dn, fn in os.walk(OUT):
        for f in fn:
            files.append(os.path.join(dp, f))
    def sort_key(p):
        rel = os.path.relpath(p, OUT)
        parts = rel.split(os.sep)
        return [x.replace('Build sheet.pdf', '0 Build sheet.pdf') for x in parts]
    files.sort(key=sort_key)
    t0 = time.mktime((2026, 10, 11, 8, 0, 0, 0, 0, -1))
    with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
        for i, f in enumerate(files):
            rel = os.path.relpath(f, ROOT)
            zi = zipfile.ZipInfo(rel, date_time=time.localtime(t0 + i * 2)[:6])
            zi.compress_type = zipfile.ZIP_DEFLATED
            with open(f, 'rb') as fh:
                z.writestr(zi, fh.read())
    print('zip', zp, round(os.path.getsize(zp) / 1e6, 1), 'MB,', len(files), 'files')


if __name__ == '__main__':
    if '--finish' in sys.argv:
        finish()
        zip_out()
    else:
        if os.path.exists(OUT):
            shutil.rmtree(OUT)
        main_html()
