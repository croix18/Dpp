from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from datetime import date, timedelta
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
pdfmetrics.registerFont(TTFont('Lexend', '/home/claude/dpp/lexend0.ttf'))

W, H = letter
M = 0.4 * inch
OUT = "/home/claude/dpp/DPP_Paper_Kit_v1.pdf"
c = canvas.Canvas(OUT, pagesize=letter)
c.setTitle("DPP Paper Kit v1 - Tally Sheet, Progress Strip, Calendar")

def F(size=9, bold=False):
    c.setFont("Lexend", size + (0.5 if bold else 0))

def box(x, y, w, h, lw=0.75):
    c.setLineWidth(lw); c.rect(x, y, w, h)

import re as _re
def label(x, y, t, size=8, bold=False):
    F(size, bold)
    sz = size + (0.5 if bold else 0)
    cx = x
    for part in _re.split(r'(_+)', t):
        if not part:
            continue
        if part.startswith('_'):
            w = pdfmetrics.stringWidth(' ' * len(part), 'Lexend', sz) * 1.6
            c.setLineWidth(0.6); c.line(cx, y - 1.5, cx + w, y - 1.5); cx += w
        else:
            c.drawString(cx, y, part); cx += pdfmetrics.stringWidth(part, 'Lexend', sz)

def cutline(y):
    c.setDash(3, 3); c.setLineWidth(0.5); c.line(M, y, W - M, y); c.setDash()
    F(6); c.setFillGray(0.5); c.drawString(M, y + 2, "cut"); c.setFillGray(0)

# ---------- 2. Tally sheet half-sheet ----------
def tally(x0, y0, w, h):
    label(x0, y0 + h - 14, "Weekly Check  -  Class Tally Sheet", 11, True)
    label(x0 + w - 260, y0 + h - 14, "Check ID: ______   Teacher: ______   Period: ___", 8, True)
    # two columns of 13 rows
    cols = 2; rows = 13; cw = w / 2 - 4
    top = y0 + h - 22
    rh = 15
    for col in range(cols):
        cx = x0 + col * (cw + 8)
        # header
        F(7, True)
        c.drawString(cx + 2, top - 9, "Code"); c.drawString(cx + 44, top - 9, "Score /5"); c.drawString(cx + 90, top - 9, "Level"); c.drawString(cx + 122, top - 9, "Re-chk /3"); c.drawString(cx + 168, top - 9, "Comp /2")
        for r in range(rows):
            ry = top - 12 - (r + 1) * rh
            n = col * rows + r + 1
            if n > 25:
                break
            box(cx, ry, 40, rh); label(cx + 2, ry + 3, f"S{n:02d}", 7)
            box(cx + 40, ry, 44, rh); box(cx + 84, ry, 34, rh); box(cx + 118, ry, 46, rh); box(cx + 164, ry, cw - 164, rh)
    by = top - 12 - (rows + 1) * rh - 6
    # summary boxes
    label(x0, by - 2, "Count of 5s: ____   Count of 4s: ____   3 and under: ____   Absent: ____", 8, True)
    box(x0, by - 36, w, 28); label(x0 + 3, by - 16, "Item that gave the most trouble:", 7, True)
    box(x0, by - 72, w, 32); label(x0 + 3, by - 50, "Reteach decision:", 7, True)
    label(x0 + w - 180, by - 50, "Date: ______   In person / Paper", 7)
    label(x0, y0 + 4, "Absent = A, not 0.  File this sheet in the binder under this week's tab.", 7)

for k in range(2):
    y0 = M + k * (H / 2) + (6 if k == 1 else 0)
    tally(M, y0, W - 2 * M, H / 2 - M - 6)
cutline(H / 2)
label(M, 10, "Template 1 - Tally sheet (two per page). One per teacher per check. The Reteach decision line is the huddle record.", 7)
c.showPage()

# ---------- 3. Progress strip quarter-page ----------
def strip(x0, y0, w, h):
    label(x0, y0 + h - 12, "My Progress  -  7th Grade Math", 10, True)
    label(x0, y0 + h - 24, "Student code: ________     Quarter: ____     Teacher: ________", 8)
    hdr = ["Check ID", "Benchmark", "Score /5", "Level (1-4)", "Re-check /3", "Comp /2"]
    unit = (w - 0) / 100.0
    cws = [u * unit for u in (15, 31, 13, 14, 14, 13)]
    top = y0 + h - 30
    rh = 16
    x = x0
    F(6.5, True)
    for i, hd in enumerate(hdr):
        box(x, top - rh, cws[i], rh); c.drawString(x + 2, top - rh + 5, hd); x += cws[i]
    nrows = int((top - rh - (y0 + 14)) // rh)
    for r in range(nrows):
        ry = top - rh * (r + 2)
        x = x0
        for i in range(len(hdr)):
            box(x, ry, cws[i], rh); x += cws[i]
    label(x0, y0 + 3, "Fill in a row every Thursday and Wednesday. Keep this in your notebook.", 6.5)

qw = (W - 2 * M) / 2; qh = (H - 2 * M) / 2
for i in range(2):
    for j in range(2):
        strip(M + i * qw + (4 if i else 0), M + j * qh + (4 if j else 0), qw - 4, qh - 4)
cutline(H / 2)
c.setDash(3, 3); c.setLineWidth(0.5); c.line(W / 2, M, W / 2, H - M); c.setDash()
label(M, 10, "Template 2 - Student progress strip (four per page, one per student per quarter). This is the Example 3 artifact: students tracking their own progress on the scale.", 7)
c.showPage()

# ---------- 4. Calendar ----------
label(M, H - M - 6, "Check calendar  -  weeks of October 26, 2026 through May 24, 2027", 12, True)
label(M, H - M - 20, "Mark each week before the first check: Check = y/n, and why not. Count the y rows; that is the real denominator for the year.", 8)
cols = ["Week of (Mon)", "Check? y/n", "Check ID", "Backstop used?", "Why no check (unit test / break / short week / FAST / other)"]
cws = [80, 60, 60, 80, W - 2 * M - 280]
top = H - M - 32
rh = 15.5
x = M; F(7.5, True)
for i, hd in enumerate(cols):
    box(x, top - rh, cws[i], rh); c.drawString(x + 3, top - rh + 4.5, hd); x += cws[i]
d = date(2026, 10, 26)
r = 0
while d <= date(2027, 5, 24):
    ry = top - rh * (r + 2)
    x = M
    for i in range(len(cols)):
        box(x, ry, cws[i], rh)
        if i == 0:
            F(8); c.drawString(x + 3, ry + 4.5, d.strftime("%b %d"))
        x += cws[i]
    d += timedelta(weeks=1); r += 1
label(M, M - 2, f"{r} calendar weeks listed. Expect roughly 16-18 to be checkable; the internal target is 14 full cycles.", 7)
c.showPage()
c.save()
print(OUT)
