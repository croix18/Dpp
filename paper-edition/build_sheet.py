import random
from datetime import date, timedelta
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, Reference
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.comments import Comment

random.seed(7)
MAXR = 2000  # bounded ranges for formulas

HDR_FILL = PatternFill("solid", fgColor="222222")
HDR_FONT = Font(name="Arial", bold=True, color="FFFFFF", size=10)
BODY = Font(name="Arial", size=10)
BOLD = Font(name="Arial", size=10, bold=True)
INPUT = Font(name="Arial", size=10, color="0000FF")
ALT = PatternFill("solid", fgColor="F2F2F2")
NOTE = Font(name="Arial", size=9, italic=True, color="555555")
thin = Side(style="thin", color="000000")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

wb = Workbook()

def header(ws, cols, row=1):
    for i, c in enumerate(cols, 1):
        cell = ws.cell(row=row, column=i, value=c)
        cell.fill = HDR_FILL; cell.font = HDR_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER
    ws.row_dimensions[row].height = 30

def widths(ws, ws_widths):
    for i, w in enumerate(ws_widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

def style_rows(ws, r0, r1, c1):
    for r in range(r0, r1 + 1):
        for c in range(1, c1 + 1):
            cell = ws.cell(row=r, column=c)
            if not (cell.font.color and cell.font.color.rgb == "000000FF"):
                cell.font = BODY
            cell.border = BORDER
            if (r - r0) % 2 == 1:
                cell.fill = ALT

# ---------------- README ----------------
ws = wb.active; ws.title = "README"
lines = [
    ("7th Grade Math Team - Weekly Check Tracker (DPP 2026-27)", BOLD),
    ("", BODY),
    ("Who touches what", BOLD),
    ("CHECKS, SCORES, RECHECKS, HUDDLE, UNITS: Croix enters. Blue text = you type it.", BODY),
    ("STUDENTS and CYCLES: formulas only. Do not type there. Screenshot CYCLES for the DPP.", BODY),
    ("", BODY),
    ("Rules", BOLD),
    ("Student codes only (S01-S25 per section). The name key lives on paper in the binder.", BODY),
    ("Absent = A (text). Formulas skip text, so an absent student is excluded, not zeroed.", BODY),
    ("Mastery = 4 or more out of 5 on a weekly check.", BODY),
    ("A cycle = a check with Retaught = y, plus RECHECKS rows for it. The re-check has 3 items on the retaught benchmark and 2 on the Comparison check's benchmark (a benchmark taught but not retaught).", BODY),
    ("Net gain = (re-check % - first-check %) on the retaught benchmark, minus the same change on the comparison items. Paired students only (both scores present).", BODY),
    ("", BODY),
    ("This copy holds SYNTHETIC data for six weeks so you can see the formulas work. Clear SCORES, RECHECKS, HUDDLE, UNITS and CHECKS rows 2+ before real use; keep row 1.", NOTE),
    ("Built for import into Google Sheets (school account). Formulas use only functions Sheets supports.", NOTE),
]
for i, (t, f) in enumerate(lines, 1):
    c = ws.cell(row=i, column=1, value=t); c.font = f
ws.column_dimensions["A"].width = 120

# ---------------- CHECKS ----------------
ws = wb.create_sheet("CHECKS")
header(ws, ["Check ID", "Date", "Benchmark", "Backstop (y/n)", "Retaught (y/n)", "Comparison check ID", "Notes"])
widths(ws, [10, 12, 16, 14, 14, 20, 40])
benchmarks = ["MA.7.NSO.2.1", "MA.7.AR.1.1", "MA.7.AR.1.2", "MA.7.AR.2.1", "MA.7.AR.3.1", "MA.7.AR.3.2", "MA.7.AR.4.1", "MA.7.AR.4.2"]
start = date(2026, 10, 29)
checks = []
for i in range(8):
    cid = f"W{i+1:02d}"
    d = start + timedelta(weeks=i)
    retaught = "y" if i < 6 else ""
    comp = f"W{i:02d}" if (i >= 1 and i < 6) else ("" if i >= 6 else "")
    checks.append((cid, d, benchmarks[i], "n", retaught, comp))
    row = [cid, d, benchmarks[i], "n", retaught, comp, "" if i < 6 else "entered, re-check not yet given"]
    for j, v in enumerate(row, 1):
        c = ws.cell(row=i + 2, column=j, value=v); c.font = INPUT if j <= 6 else NOTE
    ws.cell(row=i + 2, column=2).number_format = "mm/dd/yyyy"
style_rows(ws, 2, 9, 7)
for r in range(2, 10):
    for c in range(1, 7): ws.cell(row=r, column=c).font = INPUT
ws["A1"].comment = Comment("W01 has no comparison check (nothing taught before it under the plan); its re-check uses 5 retaught items and the comparison columns stay blank.", "Claude")
ws.freeze_panes = "A2"

# ---------------- SCORES ----------------
ws = wb.create_sheet("SCORES")
header(ws, ["Code", "Teacher", "Check ID", "Score (/5)", "Level (1-4)"])
widths(ws, [10, 10, 10, 12, 12])
codes = [(f"S{i:02d}", t) for t in ("C", "J") for i in range(1, 26)]
# latent ability per student
ability = {(c, t): random.gauss(0.6, 0.18) for c, t in codes}
scores = {}  # (code, teacher, cid) -> score or 'A'
r = 2
diff = [0.0, -0.08, 0.05, -0.12, 0.02, -0.05, -0.1, 0.0]
for k, (cid, d, bm, _, retaught, comp) in enumerate(checks):
    for c, t in codes:
        if random.random() < 0.06:
            s = "A"
        else:
            p = min(0.95, max(0.1, ability[(c, t)] + diff[k] + (0.03 if t == "C" else -0.02)))
            s = sum(1 for _ in range(5) if random.random() < p)
        scores[(c, t, cid)] = s
        lvl = "" if s == "A" else (4 if s == 5 else 3 if s == 4 else 2 if s >= 2 else 1)
        for j, v in enumerate([c, t, cid, s, lvl], 1):
            cell = ws.cell(row=r, column=j, value=v); cell.font = INPUT
        r += 1
last_scores = r - 1
style_rows(ws, 2, last_scores, 5)
for rr in range(2, last_scores + 1):
    for cc in range(1, 6): ws.cell(row=rr, column=cc).font = INPUT
ws.freeze_panes = "A2"

# ---------------- RECHECKS ----------------
ws = wb.create_sheet("RECHECKS")
header(ws, ["Code", "Teacher", "Check ID", "Retaught correct (/3)", "Comparison correct (/2)",
            "First score (/5)", "Paired", "Comparison check ID", "Comparison first score (/5)", "Comparison paired"])
widths(ws, [10, 10, 10, 16, 16, 14, 9, 16, 18, 14])
r = 2
for k, (cid, d, bm, _, retaught, comp) in enumerate(checks):
    if retaught != "y":
        continue
    for c, t in codes:
        if random.random() < 0.07:
            continue  # absent on re-check: no row
        p = min(0.97, ability[(c, t)] + diff[k] + 0.22)  # reteach effect
        rt = sum(1 for _ in range(3) if random.random() < p)
        if comp:
            pc = min(0.95, ability[(c, t)] + diff[k - 1] - 0.02)  # comparison: slight decay
            cp = sum(1 for _ in range(2) if random.random() < pc)
        else:
            cp = ""
        ws.cell(row=r, column=1, value=c).font = INPUT
        ws.cell(row=r, column=2, value=t).font = INPUT
        ws.cell(row=r, column=3, value=cid).font = INPUT
        ws.cell(row=r, column=4, value=rt).font = INPUT
        ws.cell(row=r, column=5, value=cp).font = INPUT
        # helpers
        ws.cell(row=r, column=6, value=f'=IF(COUNTIFS(SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$C$2:$C${MAXR},C{r},SCORES!$D$2:$D${MAXR},">=0")>0,SUMIFS(SCORES!$D$2:$D${MAXR},SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$C$2:$C${MAXR},C{r}),"")')
        ws.cell(row=r, column=7, value=f'=IF(AND(ISNUMBER(F{r}),ISNUMBER(D{r})),1,0)')
        ws.cell(row=r, column=8, value=f'=IFERROR(INDEX(CHECKS!$F$2:$F${MAXR},MATCH(C{r},CHECKS!$A$2:$A${MAXR},0))&"","")')
        ws.cell(row=r, column=9, value=f'=IF(H{r}="","",IF(COUNTIFS(SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$C$2:$C${MAXR},H{r},SCORES!$D$2:$D${MAXR},">=0")>0,SUMIFS(SCORES!$D$2:$D${MAXR},SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$C$2:$C${MAXR},H{r}),""))')
        ws.cell(row=r, column=10, value=f'=IF(AND(ISNUMBER(I{r}),ISNUMBER(E{r})),1,0)')
        r += 1
last_re = r - 1
style_rows(ws, 2, last_re, 10)
for rr in range(2, last_re + 1):
    for cc in range(1, 6): ws.cell(row=rr, column=cc).font = INPUT
ws["F1"].comment = Comment("Columns F-J are formulas. When you add rows, copy F:J down from the row above.", "Claude")
ws.freeze_panes = "A2"

# ---------------- HUDDLE ----------------
ws = wb.create_sheet("HUDDLE")
header(ws, ["Date", "Check ID", "Item that gave the most trouble", "Decision (what gets retaught)", "In person / Paper"])
widths(ws, [12, 10, 34, 44, 16])
decisions = ["Item 3: negative divisors - reteach sign rules with number line",
             "Item 5: setting up the proportion from a word problem",
             "Item 2: unit rate with fractions - reteach complex fraction division",
             "Item 4: identifying constant of proportionality from a table",
             "Item 1: percent change direction (increase vs decrease)",
             "Item 5: simple interest with time in months"]
for i in range(6):
    row = [checks[i][1] + timedelta(days=4), checks[i][0], decisions[i].split(":")[0], decisions[i].split(": ")[1], "In person" if i % 2 == 0 else "Paper"]
    for j, v in enumerate(row, 1):
        c = ws.cell(row=i + 2, column=j, value=v); c.font = INPUT
    ws.cell(row=i + 2, column=1).number_format = "mm/dd/yyyy"
style_rows(ws, 2, 7, 5)
for rr in range(2, 8):
    for cc in range(1, 6): ws.cell(row=rr, column=cc).font = INPUT
ws.freeze_panes = "A2"

# ---------------- UNITS ----------------
ws = wb.create_sheet("UNITS")
header(ws, ["Benchmark", "Unit test date", "Class % correct on this benchmark's items", "Class % correct, whole test", "Gap on unit test (pts)"])
widths(ws, [16, 14, 26, 24, 20])
units = [("MA.7.NSO.2.1", date(2026, 11, 20), 0.71, 0.74), ("MA.7.AR.1.1", date(2026, 11, 20), 0.66, 0.74),
         ("MA.7.AR.1.2", date(2026, 12, 18), 0.69, 0.72), ("MA.7.AR.2.1", date(2026, 12, 18), 0.62, 0.72)]
for i, (bm, d, a, b) in enumerate(units):
    r = i + 2
    ws.cell(row=r, column=1, value=bm).font = INPUT
    ws.cell(row=r, column=2, value=d).number_format = "mm/dd/yyyy"; ws.cell(row=r, column=2).font = INPUT
    ws.cell(row=r, column=3, value=a).number_format = "0%"; ws.cell(row=r, column=3).font = INPUT
    ws.cell(row=r, column=4, value=b).number_format = "0%"; ws.cell(row=r, column=4).font = INPUT
    ws.cell(row=r, column=5, value=f"=(C{r}-D{r})*100").number_format = "0.0"
style_rows(ws, 2, 5, 5)
for rr in range(2, 6):
    for cc in range(1, 5): ws.cell(row=rr, column=cc).font = INPUT
ws["C1"].comment = Comment("From Focus item analysis if it gives benchmark-level results; otherwise from the test blueprint (which items map to which benchmark).", "Claude")
ws.freeze_panes = "A2"

# ---------------- STUDENTS ----------------
ws = wb.create_sheet("STUDENTS")
header(ws, ["Code", "Teacher", "Checks taken", "Checks at mastery (4+)", "Mastery rate", "Flag (<50%)"])
widths(ws, [10, 10, 12, 18, 12, 12])
for i, (c, t) in enumerate(codes):
    r = i + 2
    ws.cell(row=r, column=1, value=c)
    ws.cell(row=r, column=2, value=t)
    ws.cell(row=r, column=3, value=f'=COUNTIFS(SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$D$2:$D${MAXR},">=0")')
    ws.cell(row=r, column=4, value=f'=COUNTIFS(SCORES!$A$2:$A${MAXR},A{r},SCORES!$B$2:$B${MAXR},B{r},SCORES!$D$2:$D${MAXR},">=4")')
    ws.cell(row=r, column=5, value=f'=IF(C{r}=0,"",D{r}/C{r})').number_format = "0%"
    ws.cell(row=r, column=6, value=f'=IF(C{r}=0,"",IF(E{r}<0.5,"FLAG",""))')
style_rows(ws, 2, len(codes) + 1, 6)
ws.freeze_panes = "A2"

# ---------------- CYCLES ----------------
ws = wb.create_sheet("CYCLES")
ws["A1"] = "Reteach cycles - the DPP exhibit"; ws["A1"].font = Font(name="Arial", bold=True, size=12)
ws["A2"] = "One row per check marked Retaught = y. Paired students only. Net gain = gain on the retaught benchmark minus the change on comparison items from a benchmark that was not retaught."; ws["A2"].font = NOTE
cols = ["Check ID", "Benchmark", "n paired", "First check % (retaught bm)", "Re-check % (3 items)", "Gain (pts)",
        "Comparison check", "n comp. paired", "Comparison first %", "Comparison re-check % (2 items)", "Comparison change (pts)",
        "Net gain (pts)", "Gap at first check (pts)", "Gap on unit test (pts)",
        "Mastery % - C", "Mastery % - J", "Gap C-J (pts)"]
header(ws, cols, row=4)
widths(ws, [10, 15, 9, 13, 12, 10, 12, 11, 13, 15, 13, 11, 13, 13, 11, 11, 11])
NC = 60  # rows for cycles
for i in range(NC):
    r = 5 + i
    k = i + 1  # index into CHECKS rows
    # Check ID: the i-th check with Retaught = y
    ws.cell(row=r, column=1, value=f'=IFERROR(INDEX(CHECKS!$A$2:$A${MAXR},SMALL(IF(CHECKS!$E$2:$E${MAXR}="y",ROW(CHECKS!$E$2:$E${MAXR})-1),{k})),"")')
    ws.cell(row=r, column=2, value=f'=IF(A{r}="","",INDEX(CHECKS!$C$2:$C${MAXR},MATCH(A{r},CHECKS!$A$2:$A${MAXR},0)))')
    ws.cell(row=r, column=3, value=f'=IF(A{r}="","",SUMIFS(RECHECKS!$G$2:$G${MAXR},RECHECKS!$C$2:$C${MAXR},A{r}))')
    ws.cell(row=r, column=4, value=f'=IF(OR(A{r}="",C{r}=0),"",SUMIFS(RECHECKS!$F$2:$F${MAXR},RECHECKS!$C$2:$C${MAXR},A{r},RECHECKS!$G$2:$G${MAXR},1)/(5*C{r}))')
    ws.cell(row=r, column=5, value=f'=IF(OR(A{r}="",C{r}=0),"",SUMIFS(RECHECKS!$D$2:$D${MAXR},RECHECKS!$C$2:$C${MAXR},A{r},RECHECKS!$G$2:$G${MAXR},1)/(3*C{r}))')
    ws.cell(row=r, column=6, value=f'=IF(D{r}="","",(E{r}-D{r})*100)')
    ws.cell(row=r, column=7, value=f'=IF(A{r}="","",INDEX(CHECKS!$F$2:$F${MAXR},MATCH(A{r},CHECKS!$A$2:$A${MAXR},0))&"")')
    ws.cell(row=r, column=8, value=f'=IF(OR(A{r}="",G{r}=""),"",SUMIFS(RECHECKS!$J$2:$J${MAXR},RECHECKS!$C$2:$C${MAXR},A{r}))')
    ws.cell(row=r, column=9, value=f'=IF(OR(H{r}="",H{r}=0),"",SUMIFS(RECHECKS!$I$2:$I${MAXR},RECHECKS!$C$2:$C${MAXR},A{r},RECHECKS!$J$2:$J${MAXR},1)/(5*H{r}))')
    ws.cell(row=r, column=10, value=f'=IF(OR(H{r}="",H{r}=0),"",SUMIFS(RECHECKS!$E$2:$E${MAXR},RECHECKS!$C$2:$C${MAXR},A{r},RECHECKS!$J$2:$J${MAXR},1)/(2*H{r}))')
    ws.cell(row=r, column=11, value=f'=IF(I{r}="","",(J{r}-I{r})*100)')
    ws.cell(row=r, column=12, value=f'=IF(F{r}="","",IF(K{r}="",F{r},F{r}-K{r}))')
    # gap at first check: this benchmark's class % on first check (all students) minus mean class % across all first checks so far? Use: first-check % minus average first-check % of all checks (class average on weekly checks).
    ws.cell(row=r, column=13, value=f'=IF(A{r}="","",(SUMIFS(SCORES!$D$2:$D${MAXR},SCORES!$C$2:$C${MAXR},A{r})/(5*COUNTIFS(SCORES!$C$2:$C${MAXR},A{r},SCORES!$D$2:$D${MAXR},">=0"))-SUMIFS(SCORES!$D$2:$D${MAXR},SCORES!$D$2:$D${MAXR},">=0")/(5*COUNTIFS(SCORES!$D$2:$D${MAXR},">=0")))*100)')
    ws.cell(row=r, column=14, value=f'=IF(B{r}="","",IFERROR(INDEX(UNITS!$E$2:$E${MAXR},MATCH(B{r},UNITS!$A$2:$A${MAXR},0)),""))')
    ws.cell(row=r, column=15, value=f'=IF(A{r}="","",IFERROR(COUNTIFS(SCORES!$C$2:$C${MAXR},A{r},SCORES!$B$2:$B${MAXR},"C",SCORES!$D$2:$D${MAXR},">=4")/COUNTIFS(SCORES!$C$2:$C${MAXR},A{r},SCORES!$B$2:$B${MAXR},"C",SCORES!$D$2:$D${MAXR},">=0"),""))')
    ws.cell(row=r, column=16, value=f'=IF(A{r}="","",IFERROR(COUNTIFS(SCORES!$C$2:$C${MAXR},A{r},SCORES!$B$2:$B${MAXR},"J",SCORES!$D$2:$D${MAXR},">=4")/COUNTIFS(SCORES!$C$2:$C${MAXR},A{r},SCORES!$B$2:$B${MAXR},"J",SCORES!$D$2:$D${MAXR},">=0"),""))')
    ws.cell(row=r, column=17, value=f'=IF(OR(O{r}="",P{r}=""),"",(O{r}-P{r})*100)')
    for c in (4, 5, 9, 10, 15, 16):
        ws.cell(row=r, column=c).number_format = "0%"
    for c in (6, 11, 12, 13, 14, 17):
        ws.cell(row=r, column=c).number_format = "0.0;-0.0;0.0"
style_rows(ws, 5, 4 + NC, 17)
# array formula flag for column A (SMALL(IF(...)))
from openpyxl.worksheet.formula import ArrayFormula
for i in range(NC):
    r = 5 + i
    f = ws.cell(row=r, column=1).value
    ws.cell(row=r, column=1).value = ArrayFormula(f"A{r}", f)

# summary
sr = 5 + NC + 1
ws.cell(row=sr, column=1, value="Summary").font = BOLD
labels = [("Cycles with data", f'=COUNT(F5:F{4+NC})'),
          ("Cycles with positive net gain", f'=COUNTIF(L5:L{4+NC},">0")'),
          ("Pooled gain (pts, mean)", f'=IFERROR(AVERAGE(F5:F{4+NC}),"")'),
          ("Pooled comparison change (pts, mean)", f'=IFERROR(AVERAGE(K5:K{4+NC}),"")'),
          ("Pooled net gain (pts, mean)", f'=IFERROR(AVERAGE(L5:L{4+NC}),"")'),
          ("Total paired student-cycles", f'=SUM(C5:C{4+NC})'),
          ("Cycles with n paired < 40 (treat with caution)", f'=COUNTIFS(C5:C{4+NC},"<40",C5:C{4+NC},">0")')]
for i, (lab, f) in enumerate(labels):
    ws.cell(row=sr + 1 + i, column=1, value=lab).font = BODY
    ws.merge_cells(start_row=sr + 1 + i, start_column=1, end_row=sr + 1 + i, end_column=3)
    c = ws.cell(row=sr + 1 + i, column=4, value=f); c.font = BOLD; c.number_format = "0.0;-0.0;0.0"
ws.cell(row=sr + 1, column=4).number_format = "0"; ws.cell(row=sr + 2, column=4).number_format = "0"; ws.cell(row=sr + 6, column=4).number_format = "0"; ws.cell(row=sr + 7, column=4).number_format = "0"

# chart: gain vs comparison change per cycle
ch = BarChart(); ch.type = "col"; ch.grouping = "clustered"
ch.title = "Reteach gain vs. comparison change, by cycle (points)"
ch.y_axis.title = "Change in % correct (pts)"; ch.x_axis.title = "Cycle"
data = Reference(ws, min_col=6, min_row=4, max_row=4 + 14)   # Gain
data2 = Reference(ws, min_col=11, min_row=4, max_row=4 + 14)  # Comparison change
cats = Reference(ws, min_col=1, min_row=5, max_row=4 + 14)
ch.add_data(data, titles_from_data=True); ch.add_data(data2, titles_from_data=True)
ch.set_categories(cats)
ch.height = 9; ch.width = 22
ch.series[0].graphicalProperties.solidFill = "222222"
ch.series[1].graphicalProperties.solidFill = "BBBBBB"
ws.add_chart(ch, f"F{sr}")
ws.freeze_panes = "A5"

wb.move_sheet("CYCLES", offset=-5)
wb.save("/home/claude/dpp/7th_Grade_Math_Weekly_Check_Tracker.xlsx")
print("saved")
