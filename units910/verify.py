# Recomputes every answer in content.py with sympy, straight from the display text.
# Run: python3 units910/verify.py   (exit code 1 on any mismatch)
import re, sys
sys.path.insert(0, '/home/claude/dpp/units910')
import sympy as sp
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, rationalize, convert_xor
import content as C

T = standard_transformations + (implicit_multiplication_application, rationalize, convert_xor)
X = sp.Symbol('x')


def to_sym(text):
    """Cadence notation -> sympy expression (or relation)."""
    s = text.replace('−', '-').replace('×', '*').replace('÷', '/').replace('·', '*').replace('$', '')
    s = re.sub(r'(\d+) (\d+)/(\d+)', r'(\1+\2/\3)', s)          # mixed numbers: 2 1/4 -> (2+1/4)
    s = s.replace('≤', '<=').replace('≥', '>=')
    for op in ['<=', '>=', '<', '>', '=']:
        if op in s:
            a, b = s.split(op, 1)
            A, B = parse_expr(a, transformations=T), parse_expr(b, transformations=T)
            return {'<=': sp.Le, '>=': sp.Ge, '<': sp.Lt, '>': sp.Gt, '=': sp.Eq}[op](A, B, evaluate=False)
    return parse_expr(s, transformations=T)


def sol_set(rel):
    v = list(rel.free_symbols)[0]
    return sp.solveset(rel, v, sp.S.Reals), v


problems = []


def check(c, where):
    kind = c[0]
    if kind == 'expr':
        q, a = to_sym(c[1]), to_sym(c[2])
        ok = sp.simplify(q - a) == 0
        # the answer should be the simplified form (no leftover parentheses / like terms)
        ok2 = sp.expand(a) == a
        if not ok: problems.append(f'{where}: {c[1]} simplifies to {sp.expand(q)}, not {c[2]}')
        if not ok2: problems.append(f'{where}: answer {c[2]} is not fully simplified')
    elif kind == 'blank':
        A, op, B, ans = to_sym(c[1]), c[2], to_sym(c[3]), to_sym(c[4])
        want = A - B if op == '−' else B - A
        if sp.simplify(want - ans) != 0: problems.append(f'{where}: blank should be {sp.expand(want)}, not {c[4]}')
    elif kind == 'equiv':
        a, b, same = to_sym(c[1]), to_sym(c[2]), c[3]
        if (sp.simplify(a - b) == 0) != same: problems.append(f'{where}: equivalence of {c[1]} and {c[2]} is not {same}')
    elif kind == 'eq':
        rel, v, val = to_sym(c[1]), sp.Symbol(c[2]), to_sym(c[3])
        sols = sp.solve(rel, v)
        if sols != [val]: problems.append(f'{where}: {c[1]} gives {sols}, not {c[3]}')
    elif kind == 'ineq':
        rel, ans = to_sym(c[1]), to_sym(c[2])
        s1, v = sol_set(rel)
        s2, _ = sol_set(ans)
        if s1 != s2: problems.append(f'{where}: {c[1]} gives {s1}, not {c[2]} ({s2})')
    elif kind == 'graph':
        pass  # checked against the figure in check_fig
    elif kind == 'match':
        target, choices, idx = to_sym(c[1]), [to_sym(t) for t in c[2]], c[3]
        tset, v = sol_set(target)
        hits = [i for i, ch in enumerate(choices) if sol_set(ch)[0] == tset]
        if hits != [idx]: problems.append(f'{where}: choices matching {c[1]} are {hits}, expected [{idx}]')
    elif kind == 'compare':
        eq, v, n, other_rate, paid, diff = c[1:]
        sols = sp.solve(to_sym(eq), sp.Symbol(v))
        if sols != [to_sym(n)]: problems.append(f'{where}: {eq} gives {sols}, not {n}')
        other = to_sym(other_rate) * to_sym(n)
        if sp.nsimplify(other - to_sym(paid)) != to_sym(diff): problems.append(f'{where}: difference is {other - to_sym(paid)}, not {diff}')
    else:
        problems.append(f'{where}: unknown check {kind}')


def fig_rel(f, var='x'):
    v = sp.Symbol(var)
    op = {('right', True): sp.Ge, ('right', False): sp.Gt, ('left', True): sp.Le, ('left', False): sp.Lt}[(f['dir'], f['closed'])]
    return op(v, sp.nsimplify(f['at']))


def check_fig(p, where):
    f, c = p.get('fig'), p.get('check')
    if not f or not c: return
    if not (f['lo'] < f['at'] < f['hi']): problems.append(f'{where}: number line {f} does not show its point')
    if c[0] in ('graph', 'match', 'ineq'):
        target = to_sym(c[1]) if c[0] != 'ineq' else to_sym(c[2])
        tset, v = sol_set(target)
        fset = sp.solveset(fig_rel(f, str(v)), v, sp.S.Reals)
        if tset != fset: problems.append(f'{where}: the figure shows {fset}, the answer is {tset}')


n = 0
for les in C.L:
    parts = [('example', les['example']), ('turn', les['turn'])] + [(f'practice {i + 1}', p) for i, p in enumerate(les['practice'])]
    for name, p in parts:
        where = f"{les['id']} {name}"
        if not p.get('check'): problems.append(f'{where}: no check'); continue
        check(p['check'], where); check_fig(p, where); n += 1
for c in C.POSTER_CHECKS:
    check(c, 'poster'); n += 1
for b, P in C.POSTERS.items():
    for lvl, f in P.get('figs', {}).items():
        txt = dict((l, e) for l, _, e in P['levels'])[lvl]
        m = re.search(r'([a-z]) ?([<>≤≥]) ?(−?[\d.]+)', txt.replace('→ ', ''))
        rel = re.findall(r'[a-z] [<>≤≥] −?[\d.]+', txt)[-1]
        fset = sp.solveset(fig_rel(f), X, sp.S.Reals); tset = sol_set(to_sym(rel))[0]
        if fset != tset: problems.append(f'poster {b} level {lvl}: figure {fset} vs text {tset}')
        n += 1
for slot, ans, expr in C.TYPED_CHECKS:
    got = sp.nsimplify(parse_expr(expr, transformations=T))
    if got != to_sym(ans): problems.append(f'{slot}: the error path gives {got}, not {ans}')
    listed = [a for a, _ in C.NOTES[slot]['typed']]
    if not any(ans.replace('−', '-') in a.replace('−', '-') for a in listed): problems.append(f'{slot}: {ans} is not listed')
    n += 1
# every check item has a lesson, and lesson numbers exist
for slot, note in C.NOTES.items():
    b = 'C-' + slot.split('/')[0][5:]
    if not any(l['bench'] == b and l['q'] == note['lesson'] for l in C.L): problems.append(f'{slot}: lesson {note["lesson"]} missing')
print(f'{n} checks, {len(problems)} problems')
for p in problems: print('  ', p)
sys.exit(1 if problems else 0)
