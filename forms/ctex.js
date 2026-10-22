// Extracted from forms/cadence_render.html by forms/u910/extract — do not edit here.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CTEX = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const A0 = '\uE000', A1 = '\uE001';                 // an atom: a TeX fragment already written, carried through the scanner
  const atom = t => A0 + t + A1;
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+', 'ˣ': 'x', 'ⁿ': 'n', '⁄': '/' };
  const SUB = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  const OPS = { '−': '-', '×': '\\times ', '÷': '\\div ', '≤': '\\le ', '≥': '\\ge ', '≠': '\\ne ', '≈': '\\approx ', '±': '\\pm ', '·': '\\cdot ', '∙': '\\cdot ', '→': '\\to ', '=': '=', '+': '+', '<': '<', '>': '>', ':': '{:}' };
  const UNITS = new Set(['cm', 'mm', 'km', 'm', 'in', 'in.', 'ft', 'yd', 'mi', 'L', 'mL', 'kg', 'g', 'mg', 'lb', 'oz', 'h', 'hr', 'min', 's', 'sec', 'mph', 'units', 'unit', 'sq']);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const texText = s => '\\text{' + s.replace(/[\\{}$%&#_^~]/g, c => c === '\\' ? '\\textbackslash ' : '\\' + c) + '}';
  const num = s => s.replace(/,/g, '{,}');          // 2,163.20 → no thin space after the comma

  /* ---------- 1. structure: HTML that is really math becomes atoms ---------- */
  // inner text of a root/fraction/exponent, written as TeX (recursively: a radicand can hold a power, an exponent a fraction)
  function inner(s, small) {   // small: an exponent — its fractions stay text-size (16^{3/2}), never display-size
    const segs = segments(s, { inner: true });
    return segs.map(g => g.math ? (small ? g.tex.replace(/\\frac\{/g, '\\tfrac{') : g.tex) : (/^[\d.,\s−-]*$/.test(g.text) ? g.text.replace(/−/g, '-') : /^[A-Za-z]{1,3}$/.test(g.text) || (/^[A-Za-z]{4}$/.test(g.text) && VARS(g.text)) ? g.text : texText(g.text))).join('');
  }
  // KaTeX draws a repeating bar 0.12em above its digits, which reads as touching at worksheet size.
  // An invisible strut under the bar (digits are 0.644em tall) roughly doubles the clearance.
  const BAR = '\\rule{0em}{0.76em}';
  function structure(s) {
    s = String(s);
    s = s.replace(/<span class="frac"><span class="frac-num">([\s\S]*?)<\/span><span class="frac-den">([\s\S]*?)<\/span><\/span>/g, (m, n, d) => atom('\\dfrac{' + inner(n) + '}{' + inner(d) + '}'));
    s = s.replace(/([√∛])<span class="rad">([\s\S]*?)<\/span>/g, (m, r, x) => atom((r === '∛' ? '\\sqrt[3]{' : '\\sqrt{') + inner(x) + '}'));
    s = s.replace(/(\d+(?:\.\d*)?|\.\d*)?<span class="rep">([^<]*)<\/span>/g, (m, pre, d) => atom((pre || '') + '\\overline{' + BAR + inner(d) + '}'));
    s = s.replace(/(\d)⁄(\d)/g, '$1/$2');
    s = s.replace(/<sup>([\s\S]*?)<\/sup>/g, (m, e) => atom('^{' + inner(e, true) + '}'));
    s = s.replace(/(\d+(?:\.\d*)?|\.\d*)?([^\s])\u0305/g, (m, pre, c) => atom((pre || '') + '\\overline{' + BAR + c + '}'));      // combining overline: 0.3̅, 0.41̅
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ˣⁿ⁄]+/g, m => atom('^{' + inner([...m].map(c => SUP[c]).join(''), true) + '}'));
    s = s.replace(/\bin\.(?=\uE000\^)/g, '\uE002');                                                           // "in.²": the unit in. (a marker the tokenizer turns back into a word)
    s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, m => atom('_{' + [...m].map(c => SUB[c]).join('') + '}'));
    s = s.replace(/½/g, atom('\\frac{1}{2}')).replace(/⅓/g, atom('\\frac{1}{3}')).replace(/¼/g, atom('\\frac{1}{4}')).replace(/¾/g, atom('\\frac{3}{4}'));
    // a bare root that was never wrapped: √5 → \sqrt{5}
    s = s.replace(/([√∛])(\(?[\d.]+\)?|[a-zA-Z])/g, (m, r, x) => atom((r === '∛' ? '\\sqrt[3]{' : '\\sqrt{') + x + '}'));
    return s;
  }

  /* ---------- 2. tokens ---------- */
  const T = { NUM: 1, VAR: 2, WORD: 3, OP: 4, OPEN: 5, CLOSE: 6, BAR: 7, SYM: 8, SP: 9, ATOM: 10, PUNCT: 11, OTHER: 12, FRAC: 13, DOLLAR: 14 };
  const NUMRE = /^(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?|\.\d+)/;
  function tokenize(s) {
    const out = []; let i = 0;
    while (i < s.length) {
      const c = s[i], rest = s.slice(i); let m;
      if (c === A0) { const j = s.indexOf(A1, i); out.push({ t: T.ATOM, v: s.slice(i + 1, j) }); i = j + 1; continue; }
      if (c === '\uE002') { out.push({ t: T.WORD, v: 'in.' }); i++; continue; }
      if ((m = rest.match(/^[A-Z]\d{1,2}(?!\d|\.\d)/)) && !(i > 0 && /[A-Za-z]/.test(s[i - 1]))) { out.push({ t: T.VAR, v: m[0][0], sub: m[0].slice(1) }); i += m[0].length; continue; }   // Q3, b1: a subscripted name
      if ((m = rest.match(NUMRE))) {
        // a fraction: 3/4, −3/4 is handled by the op before it; 2/3x is 2/3 then x
        const f = rest.slice(m[0].length).match(/^\/(−?\d+)(?![\d]|\.\d)/);
        if (f && !m[0].includes(',')) { out.push({ t: T.FRAC, n: m[0], d: f[1].replace('−', '-'), v: m[0] + '/' + f[1], dec: m[0].includes('.') }); i += m[0].length + f[0].length; continue; }
        const r = rest.slice(m[0].length).match(/^:(\d+)(?!\d)(?!\s?(?:[AaPp]\.?[Mm]\.?)\b)/);   // a ratio 16:12 — the colon is an operator between the numbers (7:00 AM is a time)
        if (r && !m[0].includes('.') && !(r[1].length === 2 && /^[0-5]\d$/.test(r[1]) && m[0].length <= 2 && /^(0|1[0-2]?|[2-9])$/.test(m[0]) && r[1][0] === '0')) { out.push({ t: T.NUM, v: m[0] }); out.push({ t: T.OP, v: ':' }); i += m[0].length + 1; continue; }
        out.push({ t: T.NUM, v: m[0] }); i += m[0].length; continue;
      }
      if ((m = rest.match(/^[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F]+′*/))) {
        if (m[0].length === 1 || /^[A-Za-z]′+$/.test(m[0])) out.push({ t: T.VAR, v: m[0] }); else out.push({ t: T.WORD, v: m[0] });
        i += m[0].length; continue;
      }
      if (OPS[c] !== undefined && c !== ':') { out.push({ t: T.OP, v: c }); i++; continue; }
      if (c === '(' || c === '[' || c === '{') { out.push({ t: T.OPEN, v: c }); i++; continue; }
      if (c === ')' || c === ']' || c === '}') { out.push({ t: T.CLOSE, v: c }); i++; continue; }
      if (c === '|') { out.push({ t: T.BAR, v: c }); i++; continue; }
      if (c === '$') { out.push({ t: T.DOLLAR, v: c }); i++; continue; }
      if ('π°%′∠…'.includes(c)) { out.push({ t: T.SYM, v: c }); i++; continue; }
      if (c === '_') { let j = i; while (s[j] === '_') j++; out.push({ t: T.SYM, v: s.slice(i, j), n: j - i, blank: true }); i = j; continue; }   // an answer blank
      if (c === '/') { out.push({ t: T.OP, v: '/' }); i++; continue; }
      if (c === ' ' || c === '\u00a0') { let j = i; while (s[j] === ' ' || s[j] === '\u00a0') j++; out.push({ t: T.SP, v: s.slice(i, j) }); i = j; continue; }
      if (',.;:?!'.includes(c)) { out.push({ t: T.PUNCT, v: c }); i++; continue; }
      out.push({ t: T.OTHER, v: c }); i++;
    }
    return out;
  }

  /* ---------- 3. runs ---------- */
  const ARTICLE = v => v === 'a' || v === 'A' || v === 'I';
  const ABBR = new Set(['GCF', 'LCM', 'IQR', 'MAD', 'HCF', 'GCD', 'LCD', 'SA', 'Q', 'mph', 'km', 'TV', 'CD', 'DVD', 'pH', 'Mr', 'Mrs', 'Dr', 'St', 'USD', 'PM', 'AM', 'ID', 'UV', 'DNA', 'GPA', 'MPH', 'LCF']);
  // short English words that are not products of variables even next to an operator
  const EN = new Set(('an as at be by do go he if in is it me my no of on or so to up us we am ok oh ox ad id ah the and for are but not you all any can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use per set sum far few lot off own run top yes yet via age air end key law low max min net odd pay tax tip bag box bus cup car cat dog fee gas ice jar jet map oil pan pen pot rod tub van web win zip hat hen leg log mix mop mud mug nut pad pet pig pin pit rag rat rib rim rug sad sap sip sit sun tab tag tan tap ten tie tin toe ton toy ate eat egg ear eye fan fat fig fin fit fix fly fog fun fur gap gum gut hug ink inn jam jaw job joy kid lab lap lid lip mat nap net nod oak oar odd ore owl paw pea pie pod pop pup ram raw ray red rib rip rob rot row rub sea sew sky sob son sow soy spa spy tar tea tug urn wax wet wig wok yak yam yes zoo lbs oz cm mm km mi ft yd kg mg lb hr sec min amt avg est max min qty tot').split(' '));
  const CONJ = new Set(['and', 'or', 'so', 'then', 'but', 'which', 'where', 'when', 'if', 'is', 'are', 'was', 'were', 'that', 'the', 'a', 'an', 'of', 'to', 'in', 'at', 'on', 'as', 'by', 'for', 'with', 'from', 'into', 'than', 'this', 'these', 'those', 'it', 'its', 'gives', 'means', 'equals', 'has', 'have', 'be', 'because', 'while', 'since', 'not', 'no', 'yes', 'also', 'only', 'each', 'every', 'both', 'all', 'any', 'some', 'more', 'less', 'about', 'over', 'under', 'per', 'now', 'here', 'there', 'where', 'how', 'what', 'why', 'who']);
  const STOPCAP = new Set(['If', 'Is', 'It', 'In', 'Of', 'On', 'Or', 'So', 'To', 'Up', 'Us', 'We', 'He', 'Me', 'My', 'No', 'Do', 'Go', 'Be', 'An', 'As', 'At', 'Am', 'Oh', 'Ok']);
  const PAIR = w => (/^[a-z]{2,3}$/.test(w) && !EN.has(w) && !STOPW.has(w) && !UNITS.has(w) && !ORD.has(w)) || (/^[A-Za-z]{2,4}$/.test(w) && /[A-Z]/.test(w.slice(1)) && !/^[A-Z]+$/.test(w) && !ABBR.has(w) && !STOPW.has(w)) || (/^[A-Z][a-z]$/.test(w) && !STOPCAP.has(w) && !ABBR.has(w)) || (/^[A-Z]{2,4}$/.test(w) && !ABBR.has(w) && !STOPW.has(w));   // ab, Ax, By, AB, JKLM: letters that are variables when they sit in math
  const STOPW = new Set(['by', 'my', 'why', 'try', 'dry', 'fly', 'shy', 'sky', 'cry', 'spy', 'gym', 'nth', 'vs', 'pm', 'am', 'PM', 'AM', 'TV', 'DVD', 'CD', 'HD', 'ON', 'NOT', 'AND', 'OR', 'THE', 'IS', 'OF', 'TO', 'IN', 'AT', 'BY', 'FOR', 'ALL', 'ANY', 'NO', 'YES', 'ONE', 'TWO', 'ALSO', 'ONLY', 'EACH', 'BOTH', 'SAME', 'MORE', 'LESS', 'NEW', 'OLD', 'EVERY']);   // vowel-less English words
  const VARS = w => w.length <= 4 && !/[aeiouAEIOU]/.test(w) && !UNITS.has(w) && !ABBR.has(w) && !STOPW.has(w) && !ORD.has(w);   // Prt, lwh, rt, mx: a product of variables, not a word
  const SINGLE_UNITS = new Set(['m', 'L', 'g', 's', 'h']);   // after a number: 16 m, 2 L
  let CAPS = new Set();   // capital letters that are variables somewhere in the string being converted (set by segments)
  const ORD = new Set(['st', 'nd', 'rd', 'th', 'sts', 'nds', 'rds', 'ths']);   // 6th, 21st, 5ths
  function isMathy(tk) { return [T.NUM, T.VAR, T.OP, T.OPEN, T.CLOSE, T.BAR, T.SYM, T.ATOM, T.FRAC, T.DOLLAR].includes(tk.t); }
  function nextNonSpace(toks, i) { let j = i + 1; while (j < toks.length && toks[j].t === T.SP) j++; return toks[j]; }
  function prevNonSpace(toks, i) { let j = i - 1; while (j >= 0 && toks[j].t === T.SP) j--; return toks[j]; }
  const BINDS = tk => tk && (tk.t === T.OP || tk.t === T.ATOM || tk.t === T.FRAC || tk.t === T.BAR || (tk.t === T.OPEN));
  // a bracket group that holds words and no math is prose: (the middle value in order), (dollars), (using the π key)
  function proseGroup(toks, i) {
    if (i > 0 && toks[i - 1].t === T.VAR) return false;   // P(red), f(x): a function applied to something
    if (toks[i].v === '{') return false;                     // {x | x is a real number}, {17, 18, 19}
    if (toks[i - 1] && toks[i - 1].t === T.SP && toks[i - 2] && (toks[i - 2].t === T.WORD || (toks[i - 2].t === T.VAR && toks[i - 2].sub)) && toks[i + 1] && toks[i + 1].t === T.NUM && toks[i + 2] && toks[i + 2].t === T.CLOSE && !(toks[i + 3] && (toks[i + 3].t === T.ATOM || toks[i + 3].t === T.OPEN)) && !BINDS(nextNonSpace(toks, i + 2))) return true;   // "Q1 (15)", "the median (48)"
    let d = 0, words = 0, math = 0, punct = 0;
    for (let j = i; j < toks.length; j++) { const tk = toks[j];
      if (tk.t === T.OPEN) d++; else if (tk.t === T.CLOSE) { d--; if (d === 0) return words > 0 && (math === 0 || words > math || (words >= 2 && punct > 0)); }
      else if (tk.t === T.PUNCT) punct++;
      else if (tk.t === T.BAR && barIsProse(toks, j)) return true;                                                                  // (2 | 4 5; 3 | 0 3)
      else if (tk.t === T.WORD && /^[a-z]{2,3}$/.test(tk.v) && !UNITS.has(tk.v) && !STOPW.has(tk.v) && !ORD.has(tk.v) && toks[j - 1] && toks[j - 1].t === T.NUM) math++;   // (2ab)
      else if (tk.t === T.WORD && (VARS(tk.v) || PAIR(tk.v))) math++;                                                              // (rt), (wh), (ab)
      else if (tk.t === T.VAR && d === 1 && toks[j - 1] === toks[i] && toks[j + 1] && toks[j + 1].t === T.CLOSE && (SINGLE_UNITS.has(tk.v) || tk.v === 's') && toks[i - 1] && (toks[i - 1].t === T.WORD || toks[i - 1].t === T.SP) && !(toks[i - 1].t === T.WORD && !/^[a-z]+$/.test(toks[i - 1].v))) words++;   // "solution(s)", "Time (s)", "sugar (g)" 
      else if (tk.t === T.VAR && SINGLE_UNITS.has(tk.v) && toks[j - 1] && toks[j - 1].t === T.SP && toks[j - 2] && toks[j - 2].t === T.NUM && !(toks[j + 1] && (toks[j + 1].t === T.ATOM || toks[j + 1].t === T.OPEN)) && !BINDS(nextNonSpace(toks, j))) words++;   // (side 11 m): a unit
      else if (tk.t === T.WORD || (tk.t === T.VAR && ARTICLE(tk.v) && toks[j + 1] && toks[j + 1].t === T.SP && toks[j - 1] && toks[j - 1].t !== T.NUM)) words++; else if (tk.t === T.OP || tk.t === T.ATOM || tk.t === T.FRAC || tk.t === T.BAR) math++;   // (2a) is math; (a dollar) is prose
      else if (tk.t === T.VAR) math++; }
    return false;
  }
  const afterApostrophe = (toks, i) => i > 0 && toks[i - 1].t === T.OTHER && /['’]/.test(toks[i - 1].v);
  // a bar that never closes ("Stem | Leaf"), or that separates a stem from spaced leaves ("2 | 4 5", "4 | 1"), is prose
  function barIsProse(toks, i) {
    let n = 0, before = 0; for (let k = 0; k < toks.length; k++) if (toks[k].t === T.BAR) { n++; if (k < i) before++; }
    if (n % 2 === 1) return true;            // an unpaired bar somewhere on the line: none of them is math
    if (before % 2 === 1) return false;      // a closing bar
    const a = toks[i + 1], b = toks[i + 2], c = toks[i + 3], d = toks[i + 4];
    return !!(toks[i - 1] && toks[i - 1].t === T.SP && a && a.t === T.SP && b && b.t === T.NUM && c && c.t === T.SP && d && d.t === T.NUM);
  }
  // "a" as a variable rather than an article: glued to a number or bracket (4a, (1/2)a, a(b)), before punctuation ("of a."),
  // or before a word an article can never precede ("a is", "a be", "a and", "Let a represent")
  const VARNEXT = new Set(['is', 'be', 'represent', 'represents', 'and', 'or', 'as', 'are', 'when', 'where', 'into', 'from', 'equals', 'means', 'in', 'to', 'by', 'has', 'must', 'can', 'cannot', 'does', 'was', 'stays', 'changes', 'increases', 'decreases', 'gives', 'so', 'then', 'if', 'but', 'which', 'with', 'for', 'times', 'opens', 'grows', 'shrinks', 'passes', 'crosses', 'starts', 'ends', 'reaches', 'takes', 'maps', 'lies', 'sits', 'measures', 'holds', 'stands', 'meets', 'intersects', 'bisects', 'divides', 'depends', 'varies']);
  const VARPREV = new Set(['of', 'for', 'where', 'Let', 'let', 'function', 'functions', 'variable', 'variables', 'value', 'values', 'domain', 'range', 'when', 'as', 'with', 'isolate', 'solve', 'Solve', 'solved', 'Solved', 'and', 'or', 'on', 'by', 'factor', 'coefficient', 'constant', 'parameter', 'exponent', 'base', 'intercept', 'number', 'letter', 'terms', 'term', 'both', 'in', 'represents', 'represent', 'equation', 'expression', 'formula', 'graph', 'notation', 'to', 'from', 'between', 'than', 'that', 'is', 'be', 'called', 'named', 'labeled', 'if', 'then', 'so', 'Subtract', 'subtract', 'Add', 'add', 'Multiply', 'multiply', 'Divide', 'divide', 'eliminate', 'Eliminate', 'substitute', 'Substitute', 'replace', 'Replace', 'onto', 'at', 'Points', 'points']);
  const LABELS = new Set(['tank', 'group', 'plan', 'account', 'plant', 'store', 'class', 'option', 'team', 'bus', 'route', 'car', 'company', 'machine', 'pool', 'box', 'bag', 'jar', 'spinner', 'player', 'student', 'runner', 'train', 'bike', 'truck', 'city', 'town', 'school', 'section', 'version', 'table', 'bin', 'cup', 'bottle', 'container', 'shop', 'brand', 'offer', 'deal', 'choice', 'set', 'sample', 'trial', 'game', 'round', 'level', 'grade', 'period', 'room', 'hall', 'wing', 'floor', 'lot', 'field', 'garden', 'farm', 'ride', 'tour', 'bank', 'card', 'phone', 'printer', 'faucet', 'hose', 'pump', 'pipe', 'valve', 'tap', 'lane', 'road', 'trail', 'path', 'track', 'list', 'column', 'row', 'die', 'coin', 'deck', 'quiz', 'test', 'exam', 'survey', 'poll', 'study', 'experiment', 'design', 'model', 'method', 'strategy', 'rule', 'batch', 'recipe', 'mix', 'mixture', 'solution', 'patch', 'lab', 'species', 'type', 'kind', 'variety', 'bidder', 'buyer', 'seller', 'vendor', 'job', 'task', 'scenario', 'case', 'situation', 'statement', 'claim', 'proposal', 'policy', 'service', 'package', 'tier', 'membership', 'subscription', 'rate', 'rates', 'fund', 'investment', 'loan', 'cd', 'savings', 'option']);
  const SHAPES = new Set(['point', 'points', 'line', 'lines', 'segment', 'segments', 'angle', 'angles', 'ray', 'vertex', 'vertices', 'triangle', 'triangles', 'quadrilateral', 'rectangle', 'square', 'circle', 'polygon', 'figure', 'side', 'sides', 'preimage', 'image', 'shape', 'trapezoid', 'parallelogram', 'rhombus', 'pentagon', 'hexagon', 'octagon', 'arc', 'chord', 'diameter', 'radius', 'Side', 'Line', 'Point', 'Triangle', 'Quadrilateral', 'Segment', 'Angle', 'Rectangle', 'Polygon', 'Figure', 'Circle', 'midpoint', 'Midpoint', 'length', 'measure']);
  const abbrev = (toks, i) => toks[i + 1] && toks[i + 1].t === T.PUNCT && toks[i + 1].v === '.' && toks[i + 2] && toks[i + 2].t === T.VAR && toks[i + 3] && toks[i + 3].t === T.PUNCT && toks[i + 3].v === '.';   // a.m., p.m.
  function isVarA(toks, i) {
    const p1 = toks[i - 1], n1 = toks[i + 1];
    if (abbrev(toks, i)) return false;
    if (n1 && n1.t === T.SP && BINDS(nextNonSpace(toks, i))) return true;                                 // "a = 3", "a + 2"
    if (p1 && (p1.t === T.NUM || p1.t === T.CLOSE || p1.t === T.ATOM)) return true;                          // 4a, (1/2)a
    if (n1 && (n1.t === T.OPEN || n1.t === T.ATOM)) return true;                                               // a(b), a²
    if (n1 && n1.t === T.PUNCT) return true;                                                                   // "of a.", "a, b and c"
    if (!n1 || n1.v === '\n') return true;
    if (n1 && n1.t === T.SP && toks[i + 2] && toks[i + 2].t === T.WORD && VARNEXT.has(toks[i + 2].v)) return true;   // "a is", "Let a be"
    return false;
  }
  // a capital letter in prose is a variable when the words around it say so: "where V is", "solved for C.", "function F"
  function isVarCap(toks, i) {
    const pw = prevNonSpace(toks, i), n1 = toks[i + 1], nw = nextNonSpace(toks, i);
    if (pw && pw.t === T.WORD && SHAPES.has(pw.v)) return true;                                        // "point A", "line L", "angle B"
    if (pw && pw.t === T.PUNCT && pw.v === ',' && nw && nw.t === T.PUNCT && nw.v === ',') return true;   // "a board, L, is"
    if (pw && pw.t === T.WORD && (pw.v === 'and' || pw.v === 'or')) { const pp = prevNonSpace(toks, toks.indexOf(pw)); if (pp && pp.t === T.VAR && /^[A-Z]$/.test(pp.v) && (CAPS.has(pp.v) || canStart(toks, toks.indexOf(pp)))) return true; }   // "P and Q"
    if (!pw || pw.v === '\n') return !!(n1 && n1.t === T.SP && nw && nw.t === T.WORD && VARNEXT.has(nw.v));   // "P opens downward"
    if (!(pw.t === T.WORD && VARPREV.has(pw.v))) return false;
    if (!nw || nw.t === T.PUNCT || nw.v === '\n') return true;
    if (n1 && n1.t === T.SP && nw.t === T.WORD && (VARNEXT.has(nw.v) || nw.v === 'the')) return true;
    return false;
  }
  // can this token start a run?
  function canStart(toks, i) {
    const tk = toks[i], nx = nextNonSpace(toks, i), pv = prevNonSpace(toks, i);
    if (tk.t === T.VAR) {
      if (afterApostrophe(toks, i)) return false;                                   // Marcus's, day's
      if (toks[i - 1] && toks[i - 1].t === T.OPEN && proseGroup(toks, i - 1)) return false;   // (g), (s): the first letter of a prose bracket
      if (tk.sub) return true;                                                      // Q1, Q3: a subscripted name is always set as math
      if (abbrev(toks, i) || (toks[i + 1] && toks[i + 1].t === T.PUNCT && toks[i + 1].v === '.' && toks[i - 1] && toks[i - 1].t === T.PUNCT && toks[i - 1].v === '.' && /^[a-z]$/.test(tk.v))) return false;   // a.m., p.m.
      if (ARTICLE(tk.v) && tk.v === 'a' && isVarA(toks, i)) return true;           // "the value of a.", "Let a be", "4a"
      if (tk.v === 'A' && pv && pv.t === T.WORD && SHAPES.has(pv.v)) return true;    // "Circle A", "point A"
      if (/^[A-Z]$/.test(tk.v) && pv && pv.t === T.WORD && toks[i - 1] && toks[i - 1].t === T.SP && (LABELS.has(pv.v) || (/^[A-Z][a-z]+$/.test(pv.v) && !SHAPES.has(pv.v) && !VARPREV.has(pv.v))) && !(nx && (nx.t === T.OP || nx.t === T.ATOM)) && !(toks[i + 1] && toks[i + 1].t === T.OPEN)) return false;   // "Plan A", "Account B", "tank C": a label
      if (/^[A-Z]$/.test(tk.v) && CAPS.has(tk.v) && !(tk.v === 'A' && nx && nx.t === T.WORD && /^[a-z]/.test(nx.v)) && !(toks[i + 1] && toks[i + 1].t === T.PUNCT && toks[i + 1].v === '.' && (i === 0 || toks[i - 1].t === T.SP))) return true;   // the same letter was a variable elsewhere in this string
      if (/^[A-Z]$/.test(tk.v) && isVarCap(toks, i)) return true;                   // "where V is", "solved for C."
      if (/^[A-Z]$/.test(tk.v) && nx && nx.t === T.SYM && nx.blank) return true;    // "L ____ 36"
      if (tk.v === 'A' && pv && pv.t === T.OP && pv.v === '→' && nx && nx.t === T.WORD) return false;   // "→ A right triangle" 
      if (SINGLE_UNITS.has(tk.v) && pv && pv.t === T.NUM && toks[i - 1] && toks[i - 1].t === T.SP && !BINDS(nx) && !(toks[i + 1] && (toks[i + 1].t === T.ATOM || toks[i + 1].t === T.OPEN))) return false;   // 16 m
      if (toks[i + 1] && toks[i + 1].t === T.OTHER && toks[i + 1].v === '-' && toks[i + 2] && toks[i + 2].t === T.WORD) return false;   // x-axis, y-intercept
      if (/^[A-Z]$/.test(tk.v) && !(BINDS(nx) || (toks[i + 1] && (toks[i + 1].t === T.OPEN || toks[i + 1].t === T.ATOM)))) return false;   // Tank E, Group A, Q1: a label, not a variable
      if (/^[A-Z]$/.test(tk.v) && nx && nx.t === T.OPEN && toks[i + 1] && toks[i + 1].t === T.SP && proseGroup(toks, toks.indexOf(nx))) return false;   // Group B (IQR 26 vs 20)
      if (/^[A-Z]$/.test(tk.v) && toks[i + 1] && toks[i + 1].t === T.NUM) return false;
      if (/^[A-Z]$/.test(tk.v) && toks[i + 1] && toks[i + 1].t === T.PUNCT && toks[i + 1].v === '.' && (i === 0 || toks[i - 1].t === T.SP || toks[i - 1].v === '\n')) return false;   // "A." option label
      if (ARTICLE(tk.v)) return !!(BINDS(nx) && (nx.t !== T.OPEN || tk.v === 'A' || (toks[i + 1] && toks[i + 1].t === T.OPEN)));   // "a = 5" yes; "a 8-sided" no; "A(1, 3)", "a(b)" yes
      return true;
    }
    if (tk.t === T.WORD) {
      const n1 = toks[i + 1];
      if (toks[i - 1] && toks[i - 1].t === T.OTHER && toks[i - 1].v === '-') return false;   // push-ups, x-intercept
      if (PAIR(tk.v) && n1 && (n1.t === T.OPEN || (n1.t === T.ATOM && /^[\^_]/.test(n1.v)))) return true;                 // kf(x), ab^x, AB′
      if (PAIR(tk.v) && ((nx && nx.t === T.OP && nx.v !== '→') || (pv && pv.t === T.OP && pv.v !== '→'))) return true;       // Ax + By, = ab
      if (ABBR.has(tk.v) && n1 && n1.t === T.OPEN) return true;                                                                // GCF(16, 12)
      if (/^[A-Z]{2,4}$/.test(tk.v) && !ABBR.has(tk.v) && !STOPW.has(tk.v) && pv && pv.t === T.WORD && SHAPES.has(pv.v)) return true;   // quadrilateral JKLM, side JK
      if ((UNITS.has(tk.v) || tk.v === 'in.') && n1 && n1.t === T.ATOM && /^\^/.test(n1.v)) return true;                     // per ft²
      return !!(nx && nx.t === T.OP && (nx.v === '=' || nx.v === '÷' || nx.v === '×') && n1 && n1.t === T.SP && (!pv || pv.t === T.PUNCT || pv.t === T.OTHER || (pv.t === T.WORD && CONJ.has(pv.v))) && (n2 => n2 && isMathy(n2) && (n2.t !== T.OP || (n2.v === '−' && nextNonSpace(toks, toks.indexOf(n2)))))(nextNonSpace(toks, i + 2)));   // "SA = 2πr²", "Slope = −2 ÷ 1", "Part ÷ (…)" at the start of a clause
    }
    if (tk.t === T.OPEN) return !proseGroup(toks, i);
    if (tk.t === T.BAR) return !barIsProse(toks, i);
    if (tk.t === T.NUM || tk.t === T.FRAC || tk.t === T.ATOM) return true;
    if (tk.t === T.PUNCT) return tk.v === '?' && !!(nx && nx.t === T.OP && nx.v !== '→');   // "? + 6 = 8.5": a placeholder
    if (tk.t === T.OP && tk.v === '=' && !pv && (!nx || (isMathy(nx) && nx.t !== T.OP) || (nx.t === T.OP && nx.v === '−'))) return true;   // a lone "=" choice; a line that continues "= 4x + 1"
    if (tk.t === T.OP) return (tk.v === '−' && nx && (nx.t === T.NUM || nx.t === T.VAR || nx.t === T.OPEN || nx.t === T.FRAC || nx.t === T.ATOM || nx.t === T.BAR || (nx.t === T.SYM && nx.v === 'π')))   // unary minus
      || '<>≤≥≠'.includes(tk.v)   // "the symbol is ≤", "A. ≤ −5": a comparison symbol on its own is set as math
      || ('×÷±≈'.includes(tk.v) && !(pv && pv.t === T.WORD && nx && nx.t === T.WORD));   // "image ÷ preimage" stays prose
    if (tk.t === T.DOLLAR) return nx && nx.t === T.NUM && (!toks[i + 1] || toks[i + 1].t === T.NUM);
    if (tk.t === T.SYM) return tk.v === 'π' || tk.v === '∠';
    return false;
  }
  function worth(run) {
    const core = run.filter(tk => tk.t !== T.SP);
    if (core.length === 2 && core[0].t === T.OP && core[0].v === '−' && core[1].t === T.NUM) return false;
    const hasOpen = run.some(tk => tk.t === T.OPEN), hasBody = run.some(tk => tk.t === T.NUM || tk.t === T.VAR || tk.t === T.ATOM || tk.t === T.FRAC || tk.vars || (tk.t === T.SYM && (tk.v === 'π' || tk.v === '?')));
    return run.some(tk => tk.t === T.OP || tk.t === T.ATOM || tk.t === T.FRAC || tk.t === T.BAR || tk.t === T.VAR || tk.vars || (tk.t === T.SYM && tk.v === 'π')) || (hasOpen && hasBody);
  }
  // split tokens into [{math:false,text}|{math:true,toks}]
  function runs(toks) {
    const out = []; let i = 0;
    const text = tks => { const last = out[out.length - 1]; const s = tks.map(t => t.t === T.ATOM ? A0 + t.v + A1 : t.v + (t.sub || '')).join(''); if (last && !last.math) last.text += s; else out.push({ math: false, text: s }); };
    while (i < toks.length) {
      if (!canStart(toks, i)) { text([toks[i]]); i++; continue; }
      let j = i, depth = 0, run = [], pendingSp = [], barOpen = false;
      const take = tk => { run.push(...pendingSp, tk); pendingSp = []; };
      while (j < toks.length) {
        const tk = toks[j];
        if (tk.t === T.SP) { if (run.length) pendingSp.push(tk); j++; continue; }
        if (tk.t === T.OP && tk.v === '→') break;
        if (tk.t === T.OP && tk.v === '·' && (n => n && n.t === T.DOLLAR)(nextNonSpace(toks, j))) break;   // "$94.20 · $94.25": alternatives, not a product
        if (tk.t === T.NUM && depth === 0 && pendingSp.length && run.length === 1 && run[0].t === T.VAR && run[0].sub) break;   // "Q1 16; Q3 45"
        if (tk.t === T.OPEN && depth === 0 && run.length && proseGroup(toks, j)) {
          let d = 0, m = j; for (; m < toks.length; m++) { if (toks[m].t === T.OPEN) d++; else if (toks[m].t === T.CLOSE && --d === 0) break; }
          const pv = prevNonSpace(toks, j), nt = nextNonSpace(toks, m);
          const glued = toks[j - 1] && toks[j - 1].t !== T.SP && (toks[j - 1].t === T.NUM || toks[j - 1].t === T.ATOM || toks[j - 1].t === T.CLOSE);
          if (m < toks.length && ((pv && pv.t === T.OP && pv.v !== '→') || (nt && nt.t === T.OP && nt.v !== '→') || glued)) {
            const lead = pendingSp.length ? ' ' : ''; pendingSp = []; run.push({ t: T.WORD, v: lead + toks.slice(j, m + 1).map(t => t.v + (t.sub || '')).join(''), text: true, group: toks.slice(j, m + 1), lead }); j = m + 1; continue; } }
        if (tk.t === T.OPEN) { if (depth === 0 && proseGroup(toks, j)) break; if (depth === 0 && pendingSp.length && run.length === 1 && run[0].t === T.VAR && run[0].sub) break; depth++; take(tk); j++; continue; }   // "Q1 (15)" is not a product
        if (tk.t === T.CLOSE) { if (depth === 0) break; depth--; take(tk); j++; continue; }
        if (tk.t === T.PUNCT && tk.v === '?' && (run.length || j === i) && !((toks[j - 1] && toks[j - 1].t === T.SP && toks[j - 1].v.length > 1) || (toks[j + 1] && toks[j + 1].t === T.SP && toks[j + 1].v.length > 1))) { const pv = prevNonSpace(toks, j), nx = nextNonSpace(toks, j);
          if (depth > 0 || (pv && pv.t === T.OP) || (nx && nx.t === T.OP && nx.v !== '→')) { take({ t: T.SYM, v: '?' }); j++; continue; } }   // 5 × ? = 6.25, {11, 26, ?}
        if (tk.t === T.BAR && depth === 0 && barIsProse(toks, j)) break;   // "2 | 4 5" (a stem-and-leaf row)
        if (tk.t === T.PUNCT) {
          if (depth > 0 && (tk.v === ',' || tk.v === ';' || tk.v === ':')) { take(tk); j++; continue; }
          if (tk.v === ',' && toks[j + 1] && toks[j + 1].t !== T.SP) { take(tk); j++; continue; }   // 2,3? (rare) keep going
          break;
        }
        if (tk.t === T.WORD) {
          const nx = toks[j + 1];
          const isVarWord = VARS(tk.v) || PAIR(tk.v);
          if (!run.length && j === i) { if (isVarWord && !(nx && nx.t === T.SP && nextNonSpace(toks, j) && nextNonSpace(toks, j).v === '=' && /^[A-Z]{2,}$/.test(tk.v) && ABBR.has(tk.v))) tk.vars = isVarWord; else tk.text = true; take(tk); j++; continue; }   // the word that started the run: "SA = …" (text), "kf(x)", "Ax + By" (variables)
          if (/^[a-z]{2,3}$/.test(tk.v) && !UNITS.has(tk.v) && !STOPW.has(tk.v) && !ORD.has(tk.v) && toks[j - 1] && (toks[j - 1].t === T.NUM || (toks[j - 1].t === T.SYM && toks[j - 1].v === 'π')) && run.length) { tk.vars = true; take(tk); j++; continue; }   // 6ab², 4an, 2πrh: glued to a number, a product of variables
          if (tk.v === 'of' && run.length && (pv => pv && pv.t === T.SYM && pv.v === '%')(prevNonSpace(toks, j)) && (nx2 => nx2 && (nx2.t === T.NUM || nx2.t === T.DOLLAR))(nextNonSpace(toks, j))) { take({ t: T.WORD, v: ' of ', text: true }); j++; continue; }   // 25% of 200 = 50
          if (UNITS.has(tk.v) && pendingSp.length && run.length && run[run.length - 1].t === T.NUM) {
            const dot = nx && nx.t === T.PUNCT && nx.v === '.' && toks[j + 2] && toks[j + 2].t === T.SP && toks[j + 3] && (toks[j + 3].t === T.OP || (toks[j + 3].t === T.WORD && /^[a-z]/.test(toks[j + 3].v)));   // "16 in. × 6 in. rectangle": the period is the abbreviation's
            const after = dot ? nextNonSpace(toks, j + 1) : nextNonSpace(toks, j);
            const english = tk.v === 'in' && !run.some(r => r.t === T.WORD && /^in\.?$/.test(r.v));   // "52 in all": in is a word unless the run already measures in inches
            if (!(english && after && after.t === T.WORD) && (run.some(r => r.t === T.OP) || (after && after.t === T.OP && after.v !== '→'))) { if (dot) { take({ t: T.WORD, v: tk.v + '.' }); j += 2; } else { take(tk); j++; } continue; } }   // 15 ft × 9 ft, 16 in. × 6 in. — but "52 in all" is prose
          if (depth > 0 && !isVarWord) { take(tk); j++; continue; }
          { const pv = prevNonSpace(toks, j); if (isVarWord && run.length && pv && (pv.t === T.OP || pv.t === T.FRAC || pv.t === T.BAR || pv.t === T.OPEN) && pv.v !== '→') { tk.vars = true; take(tk); j++; continue; } }   // = Prt, = mx + b (after a power or a bracket only when glued: x²yz, (4/5)xy)
          if (isVarWord && run.length && toks[j - 1] && (toks[j - 1].t === T.NUM || toks[j - 1].t === T.CLOSE || toks[j - 1].t === T.FRAC || toks[j - 1].t === T.ATOM)) { tk.vars = true; take(tk); j++; continue; }   // 27xy², (4/5)xy, x²yz
          if (isVarWord && nx && (nx.t === T.OPEN || (nx.t === T.ATOM && /^[\^_]/.test(nx.v))) && run.length) { tk.vars = true; take(tk); j++; continue; }   // = ab^x, = kf(x)
          if (depth > 0) { take(tk); j++; continue; }
          if (nx && nx.t === T.ATOM && /^\^/.test(nx.v) && run.length) { take(tk); j++; continue; }   // ft², cm³

          // words that sit between operators inside an equation become upright text: "= favorable ÷ total", "|estimation − actual|", "16 m × 10 m"
          if (run.length) { const pv = prevNonSpace(toks, j); let m = j, words = 0, str = '';
            while (m < toks.length && words < 5 && ((toks[m].t === T.WORD && !VARS(toks[m].v) && !PAIR(toks[m].v)) || (toks[m].t === T.VAR && ARTICLE(toks[m].v) && !isVarA(toks, m)) || toks[m].t === T.SP)) { if (toks[m].t !== T.SP) words++; str += toks[m].v; m++; }
            str = str.replace(/\s+$/, ''); const end = toks[m - 1] && toks[m - 1].t === T.SP ? m - 1 : m; const nt = toks[m]; const pvOp = pv && ((pv.t === T.OP && pv.v !== '→') || pv.t === T.BAR);
            const first = toks[j].v, body = barOpen || run.some(r => r.t === T.NUM || r.t === T.VAR || r.t === T.ATOM || r.t === T.FRAC || r.vars || r.text);
            const ok = body && !CONJ.has(first) && ((nt && ((nt.t === T.OP && nt.v !== '→' && (nt.v !== '−' || pvOp)) || (nt.t === T.BAR && barOpen) || (nt.t === T.CLOSE && depth > 0))) || ((!nt || nt.t === T.PUNCT || nt.v === '\n') && (pvOp || (run.some(r => r.text) && run.some(r => r.t === T.OP))) && words <= 3));
            if (ok && words) { const lead = pendingSp.length ? ' ' : ''; pendingSp = []; run.push({ t: T.WORD, v: lead + str, text: true }); j = end; continue; } }
          break;
        }
        if (tk.t === T.BAR) barOpen = !barOpen;
        if (tk.t === T.VAR && depth === 0 && j !== i && ARTICLE(tk.v) && !BINDS(prevNonSpace(toks, j)) && !BINDS(nextNonSpace(toks, j)) && !(tk.v === 'a' && isVarA(toks, j))) break;
        if (tk.t === T.VAR && (afterApostrophe(toks, j) || abbrev(toks, j))) break;
        if (tk.t === T.VAR && depth === 0 && SINGLE_UNITS.has(tk.v) && pendingSp.length && run.length && run[run.length - 1].t === T.NUM && !BINDS(nextNonSpace(toks, j)) && !(toks[j + 1] && (toks[j + 1].t === T.ATOM || toks[j + 1].t === T.OPEN)) && !run.some(r => r.t === T.OP)) break;   // 16 m, 2 L (but 19 m × 10 m stays whole)
        if (tk.t === T.VAR && depth === 0 && /^[A-Z]$/.test(tk.v) && pendingSp.length && !BINDS(prevNonSpace(toks, j)) && !BINDS(nextNonSpace(toks, j)) && !(toks[j + 1] && (toks[j + 1].t === T.OPEN || toks[j + 1].t === T.ATOM)) && !isVarCap(toks, j)) break;   // "… 5 feet. Tank E"
        if (tk.t === T.VAR && /^[A-Z]$/.test(tk.v) && toks[j + 1] && toks[j + 1].t === T.NUM) break;   // Q1
        if (tk.t === T.VAR && toks[j + 1] && toks[j + 1].t === T.OTHER && toks[j + 1].v === '-' && toks[j + 2] && toks[j + 2].t === T.WORD) break;   // "… the x-axis"
        if (tk.t === T.OTHER) { if (depth > 0 && tk.v !== '\n') { take(tk); j++; continue; } break; }
        if (tk.t === T.DOLLAR) { const nx = toks[j + 1]; if (nx && nx.t === T.NUM) { take(tk); j++; continue; } break; }
        if (tk.t === T.SYM && (tk.v === '…')) { take(tk); j++; continue; }
        if (isMathy(tk)) { take(tk); j++; continue; }
        break;
      }
      j -= pendingSp.length; pendingSp = [];
      // never end on an operator that is really prose punctuation, or on a dangling dollar
      while (run.length && (run[run.length - 1].t === T.SP || (run[run.length - 1].t === T.OP && run[run.length - 1].v !== '…' && !(run.length === 1)) || run[run.length - 1].t === T.DOLLAR)) { j -= 1; run.pop(); }
      // an unbalanced close inside? trim back to balance
      let d = 0, cut = run.length; run.forEach((tk, k) => { if (tk.t === T.OPEN) d++; if (tk.t === T.CLOSE) d--; if (d < 0 && cut === run.length) cut = k; });
      if (cut < run.length) { j -= run.length - cut; run = run.slice(0, cut); }
      if (run.length && worth(run)) { out.push({ math: true, toks: run }); i = Math.max(j, i + 1); }
      else { text(toks.slice(i, i + 1)); i++; }
    }
    return out;
  }

  /* ---------- 4. a run → TeX ---------- */
  function toTeX(run) {
    let s = '', depth = 0, barOpen = false; const stack = [], opens = [];
    for (let k = 0; k < run.length; k++) {
      const tk = run[k], nx = run[k + 1], pv = run[k - 1];
      switch (tk.t) {
        case T.SP: s += ' '; break;
        case T.NUM: s += num(tk.v); break;
        case T.FRAC: {
          const mixed = !tk.dec && pv && pv.t === T.SP && run[k - 2] && run[k - 2].t === T.NUM && !run[k - 2].v.includes('.') && !(run[k - 3] && run[k - 3].t === T.OP && run[k - 3].v === '/');
          let f = '\\frac{' + tk.n + '}{' + tk.d + '}';   // d may be negative: 1/−5
          if (tk.d[0] === '-' && pv && pv.t === T.OP && pv.v === '−' && s.endsWith('-') && !(run[k - 2] && (run[k - 2].t === T.NUM || run[k - 2].t === T.VAR || run[k - 2].t === T.CLOSE))) { s = s.slice(0, -1); f = '\\frac{-' + tk.n + '}{' + tk.d + '}'; }   // −2/−5: both signs stay visible
          if (mixed) { s = s.replace(/ $/, ''); s += f; } else s += f;
          break; }
        case T.VAR: {
          const v = tk.v.replace(/′/g, "'") + (tk.sub ? '_{' + tk.sub + '}' : '');
          const afterNum = pv && pv.t === T.SP && run[k - 2] && (run[k - 2].t === T.NUM || run[k - 2].t === T.FRAC);
          const unit = UNITS.has(tk.v) && afterNum && (!nx || nx.t === T.SP || nx.t === T.CLOSE || nx.t === T.PUNCT || (nx.t === T.ATOM && /^\^\{[23]\}$/.test(nx.v)) || (nx.t === T.OP && nx.v !== '/'))   // 16 m, 19 m × 10 m, 28 m²
            || (SINGLE_UNITS.has(tk.v) && pv && pv.t === T.OP && pv.v === '/' && nx && nx.t === T.ATOM && /^\^\{[23]\}$/.test(nx.v) && run.some(r => r.t === T.DOLLAR));   // $3.00/m²
          if (pv && pv.t === T.SYM && pv.v === '°' && (tk.v === 'F' || tk.v === 'C')) { s += texText(tk.v); break; }                                       // 7°F
          if (unit) { if (afterNum) { if (s.endsWith(' ')) s = s.slice(0, -1); s += '\\,'; } s += texText(v); } else s += v; break; }
        case T.WORD: {
          if (tk.text && tk.group) {   // "(change in y)": words upright, the variable letters italic
            if (tk.lead) s = s.replace(/ $/, '');
            let buf = tk.lead || '', outp = '';
            const flush = () => { if (buf) outp += texText(buf); buf = ''; };
            tk.group.forEach((g, gi) => { if (g.t === T.VAR && !ARTICLE(g.v) && !(tk.group[gi - 1] && tk.group[gi - 1].t === T.WORD && !tk.group[gi - 1].v) ) { flush(); outp += g.v.replace(/′/g, "'") + (g.sub ? '_{' + g.sub + '}' : ''); } else buf += g.v + (g.sub || ''); });
            flush(); s += outp; break; }
          if (tk.text) { if (/^ /.test(tk.v)) s = s.replace(/ $/, ''); s += texText(tk.v); break; }
          if (tk.vars || (depth > 0 && VARS(tk.v))) { s += tk.v; break; }
          const unit = nx && nx.t === T.ATOM && /^\^/.test(nx.v) || UNITS.has(tk.v);
          // inside brackets, a stretch of words (with spaces, and "a" between words) is one \text
          const wordish = m => run[m] && (run[m].t === T.WORD || (run[m].t === T.VAR && ARTICLE(run[m].v) && run[m + 1] && run[m + 1].t === T.SP && run[m + 2] && run[m + 2].t === T.WORD));
          if (!unit && depth > 0) { let w = tk.v, m = k + 1; while (wordish(m) || (run[m] && run[m].t === T.SP && wordish(m + 1))) { w += run[m].v; m++; }
            const lead = pv && pv.t === T.SP ? ' ' : '', trail = run[m] && run[m].t === T.SP ? ' ' : '';
            s = s.replace(/ $/, ''); s += texText(lead + w + trail); if (trail) m++; k = m - 1; break; }
          if (unit && /[\d})]$| $/.test(s)) s = s.replace(/ $/, '') + '\\,';
          s += texText(tk.v); break; }
        case T.OP: {
          if (tk.v === '/') { // a/b with single letters or parenthesised parts: \frac
            s += '/'; break; }
          s += OPS[tk.v]; break; }
        case T.OPEN: depth++; stack.push(s.length); opens.push(k); s += tk.v === '{' ? '\\{' : tk.v; break;
        case T.CLOSE: { depth = Math.max(0, depth - 1); const at = stack.pop(); const body = at != null ? s.slice(at) : ''; const ok = opens.pop();
          // a bracketed fraction used as a coefficient prints bare, as on FAST: (5/6)p → \frac{5}{6}p, = (−3/8)x → = -\frac{3}{8}x.
          // Kept when a number, letter or bracket comes right before it (2(5/2)x), and a negative one after + − × ÷.
          if (at != null && tk.v === ')' && ok != null && /^\((-)?\\frac\{\d+\}\{\d+\}$/.test(body)) {
            let j = k + 1; while (run[j] && run[j].t === T.SP) j++; const nxt = run[j];
            let i = ok - 1; while (i >= 0 && run[i].t === T.SP) i--; const prv = i >= 0 ? run[i] : null;
            const coef = nxt && (nxt.t === T.VAR || (nxt.t === T.OPEN && nxt.v === '('));
            const glued = prv && [T.NUM, T.VAR, T.CLOSE, T.FRAC, T.ATOM].includes(prv.t);
            const signClash = body[1] === '-' && prv && prv.t === T.OP && prv.v !== '=' && prv.v !== '<' && prv.v !== '>' && prv.v !== '≤' && prv.v !== '≥';
            if (coef && !glued && !signClash) { s = s.slice(0, at) + body.slice(1); break; }
          }
          if (at != null && tk.v === ')' && /\\d?frac|\\sqrt|[A-Za-z]\/[A-Za-z]/.test(body)) { s = s.slice(0, at) + '\\left(' + body.slice(1) + '\\right)'; }
          else if (at != null && tk.v === ']' && /\\d?frac|\\sqrt|\\left\(/.test(body)) { s = s.slice(0, at) + '\\left[' + body.slice(1) + '\\right]'; }
          else s += tk.v === '}' ? '\\}' : tk.v; break; }
        case T.BAR: { if (depth > 0 && stack.length && s[stack[stack.length - 1]] === '\\' ) { s += '\\mid '; break; }   // {y | y > 0}
          s += barOpen ? '\\rvert ' : '\\lvert '; barOpen = !barOpen; break; }
        case T.SYM: s += tk.blank ? '\\underline{\\phantom{' + '0'.repeat(Math.max(1, Math.round(tk.n / 2))) + '}}' : ({ 'π': '\\pi ', '°': '^\\circ ', '%': '\\%', '′': "'", '∠': '\\angle ', '…': '\\ldots ', '?': '{?}' })[tk.v]; break;
        case T.DOLLAR: s += '\\$'; break;
        case T.ATOM: s += tk.v; break;
        case T.PUNCT: s += tk.v === ',' ? ',\\,' : tk.v; break;
        default: s += tk.v;
      }
    }
    // slashes inside a run become \frac: f/g, r/n, 2A/(b₁ + b₂), x²/2, 3/a²b², (3x+1)/(x−2). A term is a coefficient,
    // π and letters with their powers/subscripts, a plain number (with a power), or a bracket group. A denominator that
    // starts with a digit is digits only, so 1/2x stays the coefficient 1/2 times x (Cadence's convention).
    const LET = '[A-Za-z](?:\\^\\{[^{}]*\\}|_\\{[^{}]*\\})*';
    const NUMT = '(?:\\d+(?:\\.\\d+)?)?(?:\\\\pi ?)?(?:' + LET + ')+|(?:\\d+(?:\\.\\d+)?)?\\\\pi ?|\\d+(?:\\.\\d+)?(?:\\^\\{[^{}]*\\})?';
    const DENT = '-?(?:(?:\\\\pi ?)?(?:' + LET + ')+|\\d+(?:\\.\\d+)?(?:\\^\\{[^{}]*\\})?)';
    const GRPS = '\\\\left\\((?:(?!\\\\right).)*\\\\right\\)|\\((?:[^()]|\\([^()]*\\))*\\)';
    s = s.replace(/(\)|[A-Za-z0-9}]) ?\/ ?(\(|-?[A-Za-z0-9\\])/g, '$1/$2');   // (a + b) / 2 → (a + b)/2
    const bare = g => g.replace(/^\\left\((.*)\\right\)$/, '$1').replace(/^\((.*)\)$/, '$1').trim();
    const FR = new RegExp('(?<![A-Za-z0-9}\\\\])(' + GRPS + '|' + NUMT + ')\\/(' + GRPS + '|' + DENT + ')(?![A-Za-z0-9])', 'g');
    const FRG = new RegExp('(?<![A-Za-z0-9}\\\\])(' + GRPS + ')\\/(-?\\d+(?:\\.\\d+)?(?:' + LET + ')+)(?![A-Za-z0-9])', 'g');   // (P − 2l)/2l
    s = s.replace(FRG, (m, a, b) => '\\frac{' + bare(a) + '}{' + b + '}');
    s = s.replace(/(?<![0-9}])(?<!\\,)(\\text\{[^{}]*\})\/(\\text\{[^{}]*\})/g, (m, a, b) => '\\frac{' + a.replace(/\{ /, '{') + '}{' + b.replace(/\{ /, '{') + '}');   // favorable/total
    s = s.replace(FR, (m, a, b) => /^[\d.]+$/.test(a) && /^[\d.]+$/.test(b) ? m : '\\frac{' + bare(a) + '}{' + bare(b) + '}');
    // plain parentheses that directly hold a fraction or root grow with it: (\frac{v_0+v}{2})t → \left(…\right)
    for (let k = 0; k < 3; k++) s = s.replace(/(?<!\\left)\(((?:[^()]|\\\{|\\\})*?(?:\\d?frac|\\sqrt)(?:[^()]|\\\{|\\\})*)\)/g, (m, b) => /\\left\(|\\right\)/.test(b) ? m : '\\left(' + b + '\\right)');
    return s.replace(/\s+/g, ' ').trim();
  }

  /* ---------- 5. whole strings ---------- */
  const TAG = /(<\/?[A-Za-z][^>]*>)/;
  const BR = /(\n|<br\s*\/?>)/i;
  function segments(text, opts) {
    opts = opts || {}; const out = [];
    const push = g => { const last = out[out.length - 1]; if (!g.math && last && !last.math) last.text += g.text; else out.push(g); };
    const s = structure(text);
    // line by line (a newline or a <br>), so a line that is one run can be display-style; inside a table, never
    const lines = s.split(BR); let inTable = 0;
    // a capital letter that is a variable anywhere in the string ("P(2) = 5", "where V is") is a variable everywhere in it
    const savedCaps = CAPS;
    if (!opts.inner) { CAPS = new Set(); const found = new Set();
      for (let li = 0; li < lines.length; li += 2) lines[li].split(TAG).forEach((part, p) => { if (p % 2 || !part) return; const toks = tokenize(part);
        toks.forEach((tk, i) => { if (tk.t === T.VAR && /^[A-Z]$/.test(tk.v) && !tk.sub && canStart(toks, i)) found.add(tk.v); }); });
      CAPS = found; }
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      if (li % 2 === 1) { push({ math: false, text: line }); continue; }
      if (!line) continue;
      const parts = line.split(TAG); const rs = [];
      for (let p = 0; p < parts.length; p++) { const part = parts[p]; if (!part) continue;
        if (p % 2 === 1) { if (/^<table\b/i.test(part)) inTable++; else if (/^<\/table/i.test(part)) inTable = Math.max(0, inTable - 1); rs.push({ tag: true, text: part }); continue; }
        rs.push(...runs(tokenize(part)).map(g => Object.assign(g, { table: inTable > 0 })));
      }
      const mathRuns = rs.filter(g => g.math);
      const only = mathRuns.length === 1 && !mathRuns[0].table && rs.every(g => g.math || g.tag || /^[\s.]*$/.test(g.text));
      const disp = !!(opts.display && only && !opts.inner);
      // fractions are full size everywhere a student reads them (as the old stacked spans were); small in tables and exponents
      const big = !opts.inner && opts.frac !== 'small';
      rs.forEach(g => {
        if (g.tag) push({ math: false, text: g.text });
        else if (!g.math) { const t = g.text.replace(new RegExp(A0 + '([^' + A1 + ']*)' + A1, 'g'), '$1'); if (disp && /^\s*\.\s*$/.test(t)) { const last = out[out.length - 1]; if (last && last.math) last.tex += '.'; } else push({ math: false, text: t }); }
        else { let tex = toTeX(g.toks); if (big && !g.table) tex = tex.replace(/\\frac\{/g, '\\dfrac{'); push({ math: true, tex, display: disp }); } });
    }
    CAPS = savedCaps;
    return out;
  }
  function render(text, opts) {
    opts = opts || {}; const K = opts.katex || (typeof katex !== 'undefined' ? katex : null);
    const segs = segments(text, opts), out = [];
    for (let i = 0; i < segs.length; i++) {
      const g = segs[i];
      if (!g.math) { out.push(g.text); continue; }
      const html = K ? K.renderToString(g.tex, { throwOnError: false, displayMode: !!g.display, output: 'html', strict: 'ignore' }) : '<span class="tex">' + esc(g.tex) + '</span>';
      // punctuation that closes a piece of math stays on its line: a rendered formula is a box, and a line may
      // break on either side of a box, which left "." and "," alone at the start of the next line (29.1)
      const nx = segs[i + 1], m = !g.display && nx && !nx.math && /^[.,;:?!)\]]+/.exec(nx.text);
      if (m) { out.push('<span style="white-space:nowrap">' + html + m[0] + '</span>'); segs[i + 1] = { math: false, text: nx.text.slice(m[0].length) }; }
      else out.push(html);
    }
    return out.join('');
  }
  // $…$ / $$…$$ for other tools; tags stay HTML
  function toTeXString(text, opts) {
    return segments(text, opts).map(g => g.math ? (g.display ? '$$' + g.tex + '$$' : '$' + g.tex + '$') : g.text.replace(/\$/g, '\\$')).join('');
  }
  return { segments, render, toTeX: toTeXString, structure, tokenize, _runs: runs, _toTeXRun: toTeX };
});
