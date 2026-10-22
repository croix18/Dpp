# Forms edition patches: every item Google Forms cannot grade by itself gets a new response format.
# The problem (context, numbers, figure) stays Cadence's; only the way students answer changes.
# Output: forms_patches.json, read by stepA.js.
import json, re

P = []
LT = 'ABCDEFGH'
REP = lambda d: f'<span class="rep">{d}</span>'
SUP = lambda e: f'<sup>{e}</sup>'


def mc(slot, why, opts, key, s, q=None, edit=None, fig=None, keep_fig=True, extra=None):
    e = {'slot': slot, 'why': why, 'set': {'rt': 'mc', 'opts': opts, 'key': key, 'a': f'{LT[key]}. {opts[key]}', 's': s,
                                           'inst': None, 'rows': None, 'cols': None}}
    if q is not None:
        e['set']['q'] = q
    if edit:
        e['edit'] = [{'field': 'q', 'find': f, 'replace': r} for f, r in edit]
    if fig is not None:
        e['fig'] = fig
    elif not keep_fig:
        e['set']['fig'] = None
        e['set']['ft'] = None
    if extra:
        e['set'].update(extra)
    P.append(e)


def native_cb(slot, why, opts, correct, s, edit):
    P.append({'slot': slot, 'why': why,
              'edit': [{'field': 'q', 'find': f, 'replace': r} for f, r in edit],
              'set': {'rt': 'ms', 'opts': opts, 'key': [opts.index(c) for c in correct],
                      'a': '; '.join(correct), 's': s, 'inst': None},
              'forms': {'native': True}})


LIST_TO_SELECT = [('List the sample space for this experiment.', 'Select all the outcomes in the sample space for this experiment.')]
N19 = [str(i) for i in range(1, 10)]

# ---------------- MA.7.DP.2.1: list the sample space -> select the outcomes (checkboxes, typed options) ----------------
native_cb('MA.7.DP.2.1/chk/1', 'list answer; Forms cannot grade a typed set',
          ['red circle', 'red star', 'red triangle', 'yellow circle', 'yellow star', 'yellow triangle'],
          ['red circle', 'yellow star', 'yellow triangle'],
          'Each colored shape that can be drawn is one outcome: red circle, yellow star and yellow triangle. A shape that is on more than one card is still only one outcome, so the sample space is {red circle, yellow star, yellow triangle}.\nRed star, red triangle and yellow circle are not on any card, so they cannot be drawn.',
          LIST_TO_SELECT)
native_cb('MA.7.DP.2.1/chk/3', 'list answer', N19, ['1', '5', '8', '9'],
          'The faces show only the numbers 1, 5, 8 and 9. A number on more than one face is still one outcome, so the sample space is {1, 5, 8, 9}.\nThe die has 8 faces, but 2, 3, 4, 6 and 7 are not on any face, so they cannot be rolled.',
          LIST_TO_SELECT)
native_cb('MA.7.DP.2.1/re/2', 'list answer', N19, ['1', '2', '8'],
          'The tiles show only the numbers 1, 2 and 8. A number on more than one tile is still one outcome, so the sample space is {1, 2, 8}.\nNo tile shows 3, 4, 5, 6, 7 or 9, so those numbers cannot be drawn.',
          LIST_TO_SELECT)
native_cb('MA.7.DP.2.1/cmp/1', 'list answer', N19, ['1', '6', '9'],
          'The faces show only the numbers 1, 6 and 9. A number on more than one face is still one outcome, so the sample space is {1, 6, 9}.\nThe die has 6 faces, but 2, 3, 4, 5, 7 and 8 are not on any face, so they cannot be rolled.',
          LIST_TO_SELECT)

# ---------------- MA.7.NSO.1.2 ----------------
mc('MA.7.NSO.1.2/chk/1', 'a repeating bar cannot be typed',
   ['0.39', f'0.{REP("39")}', f'0.3{REP("9")}', f'0.{REP("3")}'], 1,
   f'13 ÷ 33 = 0.393939…, so the two digits 39 repeat forever and the bar goes over both: 0.{REP("39")}.\n0.39 stops after two digits, so it equals 39/100. A bar over only the 9 means 0.3999…, which equals 0.4, and 0.{REP("3")} equals 1/3.',
   q='Which decimal is equal to the fraction?\n\n13/33')
mc('MA.7.NSO.1.2/chk/4', 'explanation plus a repeating decimal',
   ['Yes. The calculator shows every digit of 190/33, so 190/33 = 5.757575758.',
    f'No. The calculator rounded a repeating decimal; the exact value is 5.7{REP("5")}.',
    f'No. The calculator rounded a repeating decimal; the exact value is 5.{REP("75")}.',
    'No. The calculator added extra digits; the exact value is 5.75.'], 2,
   f'190 ÷ 33 = 5.757575757…, and the digits 75 repeat forever, so the exact value is 5.{REP("75")}.\nThe calculator keeps nine decimal places. The next digit is 5, so the ninth digit, 7, rounds up to 8. The display is rounded, not exact, so Maya is not correct.\n5.7{REP("5")} means 5.7555…, and 5.75 stops after two decimal places; neither equals 190/33.',
   edit=[('Is Maya correct? Explain, and write the exact value of 190/33 as a repeating decimal.', 'Is Maya correct? Choose the statement that is true.')])
P.append({'slot': 'MA.7.NSO.1.2/chk/3', 'why': 'exact percent typed as a mixed number',
          'set': {'a': '63 7/11%&nbsp;(or 63.<span class="rep">63</span>%)'},
          'forms': {'type': 'sa', 'accept': ['63 7/11', '700/11', '63 63/99'], 'note': 'Type the percent without the % sign, as a whole number, a fraction or a mixed number. Example: for 12 1/2%, type 12 1/2'}})
P.append({'slot': 'MA.7.NSO.1.2/re/1', 'why': 'answer explanation reordered so a repeating bar is not read as part of the fraction above it',
          'set': {'s': '8 ÷ 99 = 8/99 = 0.<span class="rep">08</span> (the block 08 repeats forever).\n8/99 = 16/198, so 16/198 also names the quotient.\n0.0808 stops after 4 decimal places; it is not the repeating decimal.\n0.<span class="rep">8</span> repeats only the digit 8, not 08.\n99/8 is 99 ÷ 8, not 8 ÷ 99.'}})
P.append({'slot': 'MA.7.GR.1.5/chk/2', 'why': 'the stem allows a fraction, so equivalent fractions count',
          'forms': {'type': 'sa', 'accept': ['6', '6/1', '12/2']}})
P.append({'slot': 'MA.7.GR.1.5/re/2', 'why': 'the stem allows a fraction, so equivalent fractions count',
          'forms': {'type': 'sa', 'accept': ['4', '4/1', '12/3']}})
P.append({'slot': 'MA.7.NSO.1.2/re/2', 'why': 'exact percent typed as a mixed number',
          'set': {'a': '77 7/9%&nbsp;(or 77.<span class="rep">7</span>%)'},
          'forms': {'type': 'sa', 'accept': ['77 7/9', '700/9'], 'note': 'Type the percent without the % sign, as a whole number, a fraction or a mixed number. Example: for 12 1/2%, type 12 1/2'}})

# ---------------- MA.7.DP.2.2: matching grids -> one choice for all three events ----------------
mc('MA.7.DP.2.2/chk/3', 'matching grid; Forms grid scoring is per row, not one point for all rows',
   ['unlikely, likely, likely', 'unlikely, neither likely nor unlikely, likely',
    'likely, neither likely nor unlikely, unlikely', 'unlikely, neither likely nor unlikely, unlikely'], 1,
   '2% is close to 0, so Event 1 is unlikely.\n1/2 is exactly halfway between 0 and 1, so Event 2 is neither likely nor unlikely.\n0.6 is greater than 1/2, so Event 3 is likely.',
   q='A probability is given for each event.\n\nEvent 1: The probability that it snows in Orlando, Florida, this winter is 2%.\nEvent 2: The probability that a spinner with two equal sections, one red and one blue, lands on red is 1/2.\nEvent 3: The probability that a hurricane passes within 100 miles of the city in the next two days is 0.6.\n\nWhich choice describes Events 1, 2 and 3, in that order?')
mc('MA.7.DP.2.2/re/2', 'matching grid',
   ['likely, likely, unlikely', 'unlikely, neither likely nor unlikely, likely',
    'likely, neither likely nor unlikely, likely', 'likely, neither likely nor unlikely, unlikely'], 3,
   '0.65 is greater than 1/2, so Event 1 is likely.\n50% is exactly 1/2, so Event 2 is neither likely nor unlikely.\n3/10 = 0.3 is less than 1/2, so Event 3 is unlikely.',
   q='A probability is given for each event.\n\nEvent 1: The probability that a hurricane passes within 100 miles of the city in the next two days is 0.65.\nEvent 2: The probability that a spinner with two equal sections, one red and one blue, lands on red is 50%.\nEvent 3: The probability that a thunderstorm is within 5 miles of your house tomorrow is 3/10.\n\nWhich choice describes Events 1, 2 and 3, in that order?')
mc('MA.7.DP.2.2/chk/4', 'event, both probabilities and the difference',
   ['The die: P(greater than 3) = 3/10 = 0.3, which is 0.1 more than 0.2.',
    'Rain: 0.2 = 20%, and 20% is more than 7/10 because 20 is greater than 7.',
    'The die: P(greater than 3) = 7/10 = 0.7, which is 0.5 more than 0.2.',
    'The die: P(greater than 3) = 8/10 = 0.8, which is 0.6 more than 0.2.'], 2,
   'The numbers greater than 3 are 4, 5, 6, 7, 8, 9 and 10: 7 of the 10 equally likely faces, so P(greater than 3) = 7/10 = 0.7.\nIn the same form, 0.7 > 0.2, so the die showing a number greater than 3 is more likely, by 0.7 − 0.2 = 0.5.\n3/10 counts 1, 2 and 3 instead; 8/10 also counts the 3; 20% cannot be compared with 7/10 by comparing 20 with 7.',
   edit=[('Which is more likely: that the die shows a number greater than 3, or that it rains tomorrow? Write both probabilities in the same form to justify your answer, and find the difference between the two probabilities.',
          'Which is more likely: that the die shows a number greater than 3, or that it rains tomorrow? Choose the answer that compares the two probabilities correctly.')])

# ---------------- MA.7.DP.2.4 ----------------
mc('MA.7.DP.2.4/chk/0', 'three-part answer',
   ['experimental 2/25, theoretical 1/12; the experimental probability is greater',
    'experimental 2/25, theoretical 1/12; the experimental probability is less',
    'experimental 1/12, theoretical 2/25; the experimental probability is greater',
    'experimental 2/23, theoretical 1/12; the experimental probability is greater'], 1,
   'Experimental: 24 of the 300 rolls landed on 9, so 24/300 = 2/25.\nTheoretical: 1 of the 12 equally likely faces is a 9, so 1/12.\n2/25 = 0.08 and 1/12 ≈ 0.083, so the experimental probability is slightly less than the theoretical probability.\n2/23 divides by the 276 rolls that were not a 9 instead of by all 300 rolls.',
   q='A fair 12-sided die is rolled 300 times. It lands on a 9 exactly 24 times.\n\nFind the experimental probability of rolling a 9 and the theoretical probability of rolling a 9, each as a fraction in simplest form. Then compare them.\n\nWhich choice is correct?')
mc('MA.7.DP.2.4/cmp/1', 'three-part answer',
   ['experimental 23/200, theoretical 1/10; the experimental probability is less',
    'experimental 1/10, theoretical 23/200; the experimental probability is less',
    'experimental 23/200, theoretical 1/10; the experimental probability is greater',
    'experimental 23/177, theoretical 1/10; the experimental probability is greater'], 2,
   'Experimental: 23 of the 200 rolls landed on 3, so 23/200.\nTheoretical: 1 of the 10 equally likely faces is a 3, so 1/10.\n23/200 = 0.115 and 1/10 = 0.1, so the experimental probability is slightly greater than the theoretical probability.\n23/177 divides by the 177 rolls that were not a 3 instead of by all 200 rolls.',
   q='A fair 10-sided die is rolled 200 times. It lands on a 3 exactly 23 times.\n\nFind the experimental probability of rolling a 3 and the theoretical probability of rolling a 3, each as a fraction in simplest form. Then compare them.\n\nWhich choice is correct?')
mc('MA.7.DP.2.4/chk/4', 'three-part answer',
   ['Part A: 0.215; Part B: about 430 times; Part C: about 4 purple marbles',
    'Part A: 0.43; Part B: about 860 times; Part C: about 4 purple marbles',
    'Part A: 0.215; Part B: about 43 times; Part C: about 2 purple marbles',
    'Part A: 0.215; Part B: about 430 times; Part C: about 2 purple marbles'], 3,
   'Part A: 43 of the 200 draws were purple, so the experimental probability is 43 ÷ 200 = 0.215.\nPart B: 0.215 × 2,000 = 430, so about 430 purple draws.\nPart C: 0.215 × 10 = 2.15, so about 2 of the 10 marbles are purple.\n0.43 divides by 100 instead of 200; 43 times uses 200 draws instead of 2,000; 4 marbles divides the 43 purple draws by 10 instead of multiplying the probability by 10.',
   edit=[('Part C. About how many of the 10 marbles in the bag are purple?', 'Part C. About how many of the 10 marbles in the bag are purple?\n\nWhich choice gives correct answers to all three parts?'),
         ('Part A. What is the experimental probability of drawing a purple marble? Write it as a decimal.', 'Part A. What is the experimental probability of drawing a purple marble, as a decimal?')])

# ---------------- MA.7.NSO.2.2 ----------------
mc('MA.7.NSO.2.2/chk/4', 'step plus value',
   ['Step 2; the correct value is −16/27', 'Step 2; the correct value is 11/27',
    'Step 1; the correct value is −16/27', 'Step 1; the correct value is 16/27'], 2,
   'Step 1 is the first error: −1/6 × 5/9 = −5/54, because a negative times a positive is negative. The student wrote 5/54.\nCorrect work: −1/6 ÷ 1 4/5 = −1/6 ÷ 9/5 = −1/6 × 5/9 = −5/54. Then −5/54 − 1/2 = −5/54 − 27/54 = −32/54 = −16/27.\n11/27 keeps the student\'s 5/54 and subtracts in the wrong order in Step 2. −16/27 is the right value, but the first error is in Step 1.',
   edit=[('In which step did the student make the first error? What is the correct value of the expression?', 'In which step did the student make the first error, and what is the correct value of the expression?')])

# ---------------- MA.7.GR.1.2 ----------------
mc('MA.7.GR.1.2/chk/4', 'plot plus difference',
   ['Plot A, by 50 m²', 'Plot A, by 9.5 m²', 'Plot B, by 1 m²', 'Plot A, by 54.5 m²'], 1,
   'Plot A: trapezoid ½(17 + 10)(3) = 40.5 m², rectangle 17 × 7 = 119 m², so 159.5 m².\nPlot B: parallelogram 15 × 6 = 90 m², rectangle 15 × 4 = 60 m², so 150 m².\n159.5 − 150 = 9.5, so Plot A is greater by 9.5 m².\n50 m² leaves out the ½ in the trapezoid formula; 54.5 m² takes half of the parallelogram; 1 m² uses only the 10 m base for the trapezoid, which makes Plot A 149 m².')

# ---------------- MA.7.GR.1.3 ----------------
P.append({'slot': 'MA.7.GR.1.3/re/1', 'why': 'answer text has a comment after the number',
          'forms': {'type': 'sa', 'accept': ['3.14']}})

# ---------------- MA.7.DP.1.3 ----------------
mc('MA.7.DP.1.3/chk/4', 'choice, prediction and reason',
   ['Sample B, which predicts about 945 students, because a larger share of its students said yes.',
    "Sample A, which predicts about 735 students, because a larger random sample usually gives a proportion closer to the whole school's.",
    "Sample A, which predicts about 1365 students, because a larger random sample usually gives a proportion closer to the whole school's.",
    'Neither; the principal should use about 840 students, halfway between the two predictions, because the samples disagree.'], 1,
   "Sample A: 210/600 = 35%, and 35% of 2100 is 735. Sample B: 54/120 = 45%, and 45% of 2100 is 945.\nBoth samples are random, so the larger one, Sample A with 600 students, is more likely to have a proportion close to the whole school's. Trust Sample A: about 735 students.\n1365 uses the 390 students in Sample A who said no (65% of 2100), and averaging gives the smaller sample as much weight as the larger one.",
   edit=[("Which sample's prediction should the principal trust more, and about how many of the 2100 students does it predict? Explain your choice.",
          "Which sample's prediction should the principal trust more, about how many of the 2100 students does it predict, and why?")])

# ---------------- MA.7.AR.3.3 ----------------
mc('MA.7.AR.3.3/chk/4', 'store plus amount',
   ['Store A, by $9.76 per pound', 'Store A, by $30.22 per pound', 'Store A, by $1.01 per pound', 'Store A, by $0.46 per pound'], 3,
   'Store B charges $17.05 for 1 kilogram, which is about 2.2 pounds, so its price per pound is 17.05 ÷ 2.2 = $7.75.\nStore A charges $7.29 per pound, so Store A charges less: $7.75 − $7.29 = $0.46 less per pound.\n$9.76 subtracts $7.29 from the price of a kilogram without converting; $30.22 multiplies by 2.2 instead of dividing; $1.01 compares the prices per kilogram ($16.04 and $17.05), not per pound.')

# ---------------- MA.7.AR.3.2 ----------------
mc('MA.7.AR.3.2/chk/0', 'proportion plus solution',
   ['28/20 = p/16; p = 22.4', '28/20 = p/16; p = 35', '28/16 = p/20; p = 32', '28/16 = p/20; p = 35'], 3,
   'Peanuts to raisins is 28 to 16, so keep peanuts on top and raisins on the bottom on both sides: 28/16 = p/20.\nCross-multiply: 16p = 28 × 20 = 560, so p = 560 ÷ 16 = 35 ounces.\n28/20 = p/16 pairs the mix\'s peanuts with the hiker\'s raisins, so it does not keep the ratio (it gives p = 22.4). p = 32 adds 4 to 28 because 20 is 4 more than 16; a ratio is kept by multiplying, not adding.',
   edit=[('Write a proportion that can be used to find p, the number of ounces of peanuts that keeps the same ratio. Then solve the proportion.',
          'Which choice shows a proportion that can be used to find p, the number of ounces of peanuts that keeps the same ratio, and the correct value of p?')])
mc('MA.7.AR.3.2/chk/4', 'distance plus time',
   ['about 9.3 kilometers; about 56 minutes', 'about 24.2 kilometers; about 145 minutes',
    'about 24.2 kilometers; about 90 minutes', 'about 93 kilometers; about 558 minutes'], 1,
   '10 kilometers ≈ 6.2 miles, so the race is 15 × 10 ÷ 6.2 ≈ 24.19, or about 24.2 kilometers.\nAt 6 minutes per kilometer: 24.2 × 6 ≈ 145 minutes (2 hours 25 minutes).\n9.3 and 93 kilometers use the conversion the wrong way; 90 minutes uses 6 minutes per mile instead of per kilometer.')

# ---------------- MA.7.AR.4.5 ----------------
P.append({'slot': 'MA.7.AR.4.5/chk/3', 'why': 'graph answer; redraw from a Forms-gradable generator',
          'redraw': {'excludeGen': [0, 1, 2, 4], 'gradable': True},
          'after': {'s': 'Unit rate: 154 ÷ 5.5 = 28 miles per gallon. Then 210 ÷ 28 = 7.5 gallons.\n4.0 gallons (5.5 × 154 ÷ 210) turns the ratio upside down; 38.2 gallons (210 ÷ 5.5) treats 5.5 as miles per gallon; 6.9 gallons (5.5 + 210 ÷ 154) adds the scale factor instead of multiplying by it.'},
          'expect': {'q': 'It travels 154 miles on 5.5 gallons of gas.', 'a': 'D. 7.5 gallons'}})
P.append({'slot': 'MA.7.AR.4.5/re/0', 'why': 'graph answer; redraw from a Forms-gradable generator',
          'redraw': {'excludeGen': [0, 1, 2], 'gradable': True}})
mc('MA.7.AR.4.5/chk/4', 'store plus explanation plus amount',
   ['Store A, because $6.30 is less than $13.75.',
    "Store B, because its price is $2.75 per meter, which is $0.05 less than Store A's $2.80 per meter.",
    "Store B, because its price is $2.75 per meter, which is $0.40 less than Store A's $3.15 per meter.",
    "Store A, because its price is about $2.63 per meter, which is less than Store B's $2.75 per meter."], 1,
   'Store A: $6.30 ÷ 2 1/4 meters = $6.30 ÷ 2.25 = $2.80 per meter. Store B: $13.75 ÷ 5 meters = $2.75 per meter.\nStore B charges less for each meter, so it is the better buy, by $2.80 − $2.75 = $0.05 per meter.\nThe totals cannot be compared because the lengths are different. $3.15 divides $6.30 by 2 and ignores the 1/4 meter; about $2.63 uses 2.4 for 2 1/4 instead of 2.25.',
   edit=[('Which store is the better buy? Explain, and tell how much lower its price is per meter.', 'Which store is the better buy, and why?')])

# ---------------- MA.7.AR.3.1 ----------------
mc('MA.7.AR.3.1/chk/2', 'percent plus count',
   ['45%; 81 dogs', '55%; 99 dogs', 'about 122%; 220 dogs', '55%; 81 dogs'], 1,
   'For every 11 dogs there are 9 cats, so dogs are 11 of every 11 + 9 = 20 pets: 11/20 = 55%.\n55% of 180 = 0.55 × 180 = 99 dogs.\n45% is the percent of cats; 122% compares dogs with cats instead of with all the pets.')

# ---------------- MA.7.NSO.1.1 ----------------
mc('MA.7.NSO.1.1/chk/4', 'step plus single power',
   [f'Step 2; (1/2){SUP(2)}', f'Step 1; (1/2){SUP(11)}', f'Step 1; (1/2){SUP(19)}', f'Step 1; (1/2){SUP(60)}'], 1,
   f'Step 1 is the first error. A power of a power multiplies the exponents: ((1/2){SUP(5)}){SUP(3)} = (1/2){SUP(15)}, not (1/2){SUP(8)}.\nThen divide by subtracting exponents: (1/2){SUP(15)} ÷ (1/2){SUP(4)} = (1/2){SUP(11)}.\n(1/2){SUP(19)} adds the exponents when dividing, and (1/2){SUP(60)} multiplies all three exponents.',
   edit=[('In which step did the student make the first error? Write the expression correctly as a single power.', 'In which step did the student make the first error, and what is the correct single power?')])
mc('MA.7.NSO.1.1/re/1', 'a typed exponent cannot be matched reliably',
   [f'9{SUP(6)}', f'9{SUP(8)}', f'9{SUP(16)}', f'18{SUP(4)}'], 1,
   f'A power of a power multiplies the exponents: (9{SUP(4)}){SUP(2)} = 9{SUP("4 × 2")} = 9{SUP(8)}.\n9{SUP(6)} adds the exponents, 9{SUP(16)} raises 4 to the second power, and 18{SUP(4)} doubles the base instead of the exponent.',
   q=f'Which single power is equal to the expression?\n\n(9{SUP(4)}){SUP(2)}')

# ---------------- MA.7.AR.1.1: expressions -> choose the expression ----------------
FEW = ('Write the expression using the fewest possible terms.', 'Which expression is equivalent to the expression shown, written with the fewest possible terms?')
WHAT = ('What expression makes the equation true?', 'Which expression makes the equation true?')
mc('MA.7.AR.1.1/chk/0', 'a typed expression cannot be matched reliably',
   ['(5/6)p + 2', '(5/3)p + 4', '(5/3)p + 2', '(11/3)p'], 2,
   'Group like terms: (5/6)p + (5/6)p = (10/6)p = (5/3)p, and 3 + (−1) = 2. The expression is (5/3)p + 2.\n(5/6)p + 2 counts only one of the p-terms, (5/3)p + 4 treats −1 as +1, and (11/3)p adds the constant into the p-term, but unlike terms cannot be combined.',
   edit=[FEW])
mc('MA.7.AR.1.1/chk/2', 'typed expression',
   ['(−25/24)x − 8', '(25/24)x + 8', '(7/24)x + 8', '(25/24)x + 4'], 1,
   'The blank is ((2/3)x + 6) − ((−3/8)x − 2).\nx-terms: 2/3 − (−3/8) = 16/24 + 9/24 = 25/24. Constants: 6 − (−2) = 8. The expression is (25/24)x + 8.\nCheck: ((2/3)x + 6) − ((25/24)x + 8) = (−9/24)x − 2 = (−3/8)x − 2.\n(7/24)x + 8 subtracts 3/8 instead of −3/8, and (25/24)x + 4 subtracts 2 instead of −2.',
   edit=[WHAT])
mc('MA.7.AR.1.1/chk/3', 'typed expression',
   ['−x − 4', 'x − 12', '(11/3)x − 4', '−x − 12'], 3,
   'Subtracting the second group subtracts both of its terms: (4/3)x − 8 − (7/3)x − 4.\nx-terms: 4/3 − 7/3 = −3/3 = −1, so −x. Constants: −8 − 4 = −12. The expression is −x − 12.\n−x − 4 subtracts only the x-term of the second group; (11/3)x − 4 adds the groups instead of subtracting; x − 12 subtracts 4/3 from 7/3.',
   edit=[FEW])
mc('MA.7.AR.1.1/chk/4', 'expression plus simplified form',
   ['(7/2)x − 1.5', '7x + 5', '7x − 3', '7x − 1.5'], 2,
   'Perimeter = 2(length) + 2(width) = 2((5/2)x + 0.5) + 2(x − 2).\nDistribute: 5x + 1 + 2x − 4. Combine like terms: 7x − 3.\n(7/2)x − 1.5 adds the length and the width only once; 7x + 5 adds 4 instead of subtracting it; 7x − 1.5 doubles the x-terms but not the constants.',
   edit=[('Write an expression for the perimeter of the rectangle, in meters. Then write it using the fewest possible terms.',
          'Which expression gives the perimeter of the rectangle, in meters, written with the fewest possible terms?')])
mc('MA.7.AR.1.1/re/0', 'typed expression',
   ['4.93x − 11', '6.09x − 11', '7.07x − 1', '4.93x − 1'], 3,
   'Subtracting the group subtracts every term in it: 6x − 6 − 0.49x + 5 − 0.58x.\nx-terms: 6 − 0.49 − 0.58 = 4.93. Constants: −6 + 5 = −1. The expression is 4.93x − 1.\n4.93x − 11 does not change the sign of −5; 6.09x − 11 changes the sign of only the first term; 7.07x − 1 adds the x-terms instead of subtracting them.',
   edit=[FEW])
mc('MA.7.AR.1.1/re/2', 'typed expression',
   ['(−1/6)x + 9', '(19/6)x + 9', '(−19/6)x − 9', '(19/6)x + 7'], 1,
   'The blank is ((3/2)x + 8) − ((−5/3)x − 1).\nx-terms: 3/2 − (−5/3) = 9/6 + 10/6 = 19/6. Constants: 8 − (−1) = 9. The expression is (19/6)x + 9.\nCheck: ((3/2)x + 8) − ((19/6)x + 9) = (−10/6)x − 1 = (−5/3)x − 1.',
   edit=[WHAT])
mc('MA.7.AR.1.1/cmp/0', 'typed expression',
   ['0.97x − 5', '1.85x − 5', '0.97x − 3', '3.03x − 3'], 2,
   'Subtract every term in the group: 2x − 4 − 0.59x + 1 − 0.44x.\nx-terms: 2 − 0.59 − 0.44 = 0.97. Constants: −4 + 1 = −3. The expression is 0.97x − 3.',
   edit=[FEW])
mc('MA.7.AR.1.1/cmp/1', 'typed expression',
   ['(41/12)x − 9', '(1/12)x − 9', '(−1/12)x − 5', '(1/12)x + 5'], 3,
   'The blank is ((7/4)x − 2) − ((5/3)x − 7).\nx-terms: 7/4 − 5/3 = 21/12 − 20/12 = 1/12. Constants: −2 − (−7) = 5. The expression is (1/12)x + 5.\nCheck: ((5/3)x − 7) + ((1/12)x + 5) = (21/12)x − 2 = (7/4)x − 2.',
   edit=[WHAT])

# ---------------- MA.7.AR.1.2 ----------------
P.append({'slot': 'MA.7.AR.1.2/chk/1', 'why': 'matching grid; redraw from an unused Forms-gradable generator, with a non-unit fraction so it matches the comparison item in difficulty',
          'redraw': {'excludeGen': [0, 1, 3, 4, 5], 'gradable': True, 'require': [r'\((?:[2-9]|\d\d)/\d+\)\(']},
          'after': {'q': 'A student rewrote (4/3)(12x + 12) as 28x.\n\nThe correct equivalent expression is ____.',
                    'opts': ['16x + 12', '28x', '(40/3)x + 40/3', '16x + 16'], 'key': 3, 'a': 'D. 16x + 16',
                    's': 'The student multiplied only 12x by 4/3, which gives 16x + 12, and then added 16x and 12 as if they were like terms.\nBoth terms must be multiplied by 4/3, and an x-term and a constant cannot be combined: (4/3)(12x + 12) = 16x + 16.'}})
P.append({'slot': 'MA.7.AR.1.2/cmp/1', 'why': 'matching grid; redraw from a Forms-gradable generator, with a non-unit fraction like the check item',
          'redraw': {'excludeGen': [0, 1, 3, 4, 5], 'gradable': True, 'require': [r'\((?:[2-9]|\d\d)/\d+\)\(']},
          'after': {'q': 'A student rewrote (7/4)(12x + 4) as 25x.\n\nThe correct equivalent expression is ____.',
                    'opts': ['21x + 7', '(55/4)x + 23/4', '21x + 4', '25x'], 'key': 0, 'a': 'A. 21x + 7',
                    's': 'The student multiplied only 12x by 7/4, which gives 21x + 4, and then added 21x and 4 as if they were like terms.\nBoth terms must be multiplied by 7/4, and an x-term and a constant cannot be combined: (7/4)(12x + 4) = 21x + 7.'}})
mc('MA.7.AR.1.2/chk/4', 'yes/no plus both simplified forms',
   ['Yes; both simplify to −(3/2)x + 3.', 'No; the first simplifies to −(3/2)x − 3 and the second to −(1/2)x + 3.',
    'Yes; both have a constant term of 3.', 'No; the first simplifies to −(3/2)x + 3 and the second to −(1/2)x + 3.'], 3,
   'First: −(3/4)(4x − 4) + (3/2)x = −3x + 3 + (3/2)x = −(3/2)x + 3.\nSecond: (11/2)x − (3/4)(8x − 4) = (11/2)x − 6x + 3 = −(1/2)x + 3.\nThe x-terms are different, so the expressions are not equivalent. Having the same constant term is not enough, and −(3/4) × (−4) is +3, not −3.',
   edit=[('Are the two expressions equivalent? Write each expression using the fewest possible terms, and use those forms to explain your answer.',
          'Are the two expressions equivalent? Choose the answer with the correct reason.')])

# ---------------- MA.7.AR.2.1: inequalities -> choose the solution ----------------
mc('MA.7.AR.2.1/chk/1', 'a typed inequality cannot be matched reliably',
   ['t ≤ −3.9', 't ≥ −9.9', 't ≥ −3.9', 't ≥ 3.9'], 2,
   'Add 3 to both sides: t ≥ −6.9 + 3, so t ≥ −3.9.\nAdding the same number to both sides does not reverse the inequality symbol.\nt ≥ −9.9 subtracts 3 instead of adding it.',
   q='Solve the inequality.\n\n−3 + t ≥ −6.9\n\nWhat is the solution?')
mc('MA.7.AR.2.1/chk/3', 'typed inequality',
   ['x < 10', 'x > 10', 'x > 2.5', 'x < −10'], 1,
   'The product of x and −0.5 is less than −5: −0.5x < −5.\nDivide both sides by −0.5. Dividing by a negative number reverses the inequality symbol: x > 10.\nCheck: x = 12 gives −0.5 × 12 = −6, which is less than −5.\nx < 10 forgets to reverse the symbol; x > 2.5 multiplies −5 by −0.5 instead of dividing.')
mc('MA.7.AR.2.1/re/0', 'typed inequality',
   ['x > 18', 'x < −8', 'x < 8', 'x > 8'], 3,
   'The product of x and −1.5 is less than −12: −1.5x < −12.\nDivide both sides by −1.5 and reverse the symbol: x > 8.\nCheck: x = 10 gives −1.5 × 10 = −15, which is less than −12.\nx < 8 forgets to reverse the symbol; x > 18 multiplies instead of dividing.')
mc('MA.7.AR.2.1/cmp/0', 'typed inequality',
   ['x ≥ 8', 'x ≤ 8', 'x < 8', 'x ≤ 50'], 1,
   '"At least −20" means greater than or equal to −20: −2.5x ≥ −20.\nDivide both sides by −2.5 and reverse the symbol: x ≤ 8.\nCheck: x = 8 gives −20, which is at least −20, and x = 4 gives −10, which is also at least −20.')
NL = ['Number line A', 'Number line B', 'Number line C', 'Number line D']
mc('MA.7.AR.2.1/re/2', 'solution plus graph',
   NL, 3,
   'Multiply both sides by −4. Multiplying by a negative number reverses the inequality symbol: n ≤ 1.25 × (−4), so n ≤ −5.\n−5 is included (≤), so the circle at −5 is closed, and the solutions less than −5 are shaded to the left: number line D.',
   q='Solve the inequality.\n\nn/(−4) ≥ 1.25\n\nWhich number line shows the solution?',
   fig={'builder': 'numline4', 'min': -8, 'max': 8,
        'lines': [{'x': -5, 'open': False, 'dir': 'right'}, {'x': -5, 'open': True, 'dir': 'left'},
                  {'x': 5, 'open': False, 'dir': 'left'}, {'x': -5, 'open': False, 'dir': 'left'}]})
mc('MA.7.AR.2.1/cmp/1', 'solution plus graph',
   NL, 2,
   'Divide both sides by 0.5: w ≤ 2.5 ÷ 0.5, so w ≤ 5. Dividing by a positive number does not reverse the symbol.\n5 is included (≤), so the circle at 5 is closed, and the solutions less than 5 are shaded to the left: number line C.\nThe closed circle at 2 comes from subtracting 0.5 instead of dividing by it.',
   q='Solve the inequality.\n\n0.5w ≤ 2.5\n\nWhich number line shows the solution?',
   fig={'builder': 'numline4', 'min': -2, 'max': 8,
        'lines': [{'x': 2, 'open': False, 'dir': 'left'}, {'x': 5, 'open': False, 'dir': 'right'},
                  {'x': 5, 'open': False, 'dir': 'left'}, {'x': 5, 'open': True, 'dir': 'left'}]})

# ---------------- MA.7.AR.2.2: write and solve -> choose equation and solution ----------------
mc('MA.7.AR.2.2/chk/0', 'equation plus solution',
   ['25h + 12.5 = 62.5; h = 2', '12.5h + 25 = 62.5; h = 7', '12.5h + 25 = 62.5; h = 3', '12.5h − 25 = 62.5; h = 7'], 2,
   'Total = entry fee + $12.50 for each hour: 12.5h + 25 = 62.5.\nSubtract 25: 12.5h = 37.5. Divide by 12.5: h = 3.\nCheck: 12.5 × 3 + 25 = 62.5.\nh = 7 adds 25 instead of subtracting it; 25h + 12.5 swaps the hourly rate and the entry fee.',
   edit=[('Write an equation that can be used to find h, the number of hours of skate rental the visitor paid for. Then solve the equation.',
          'Which choice shows an equation that can be used to find h, the number of hours of skate rental the visitor paid for, and its solution?')])
mc('MA.7.AR.2.2/chk/2', 'equation plus solution',
   ['3(s − 5) = 105; s = 40', '3(s + 5) = 105; s = 30', '3s + 5 = 105; s = 33 1/3', '3(s + 5) = 105; s = 35'], 1,
   'Each student now has s + 5 dollars, and 3 students together have $105: 3(s + 5) = 105.\nDivide by 3: s + 5 = 35. Subtract 5: s = 30.\nCheck: 3 × (30 + 5) = 105.\n3s + 5 adds the $5.00 once instead of for each student; s = 35 stops before subtracting 5.',
   edit=[('3 students each saved', 'Three students each saved'),
         ('Write an equation that can be used to find s. Then solve the equation.', 'Which choice shows an equation that can be used to find s, and its solution?')])
mc('MA.7.AR.2.2/chk/4', 'equation, solution, gym and amount',
   ['n = 9; Gym A, by $18.00', 'n = 8; Gym A, by $26.50', 'n = 6; Gym B, by $26.50', 'n = 9; Gym A, by $53.00'], 3,
   'The months cost 24.50 × n, and the coupon takes off $35.00: 24.5n − 35 = 185.5.\nAdd 35: 24.5n = 220.5. Divide by 24.5: n = 9.\nGym B for 9 months: 26.50 × 9 = $238.50, with no coupon. Jordan paid Gym A $185.50, so Gym A cost less, by 238.50 − 185.50 = $53.00.\n$18.00 leaves out the coupon; n = 8 divides 185.50 by 24.50 and rounds; n = 6 adds the coupon instead of subtracting it (24.5n + 35 = 185.5 gives about 6.1).',
   edit=[('Write and solve an equation to find n, the number of months Jordan paid for.', 'Let n be the number of months Jordan paid for.'),
         ('For the same number of months, which gym would have cost less, and by how much?', 'Which choice gives n, the gym that would have cost less for the same number of months, and how much less?')])
mc('MA.7.AR.2.2/re/1', 'equation plus solution',
   ['6(b + 1.25) = 40.5; b = 5.5', '6(b − 1.25) = 40.5; b = 8', 'b − 1.25 = 40.5; b = 41.75', '6(b − 1.25) = 40.5; b = 6.75'], 1,
   'Each box weighs b − 1.25 pounds after the packaging is removed, and 6 boxes weigh 40.5 pounds: 6(b − 1.25) = 40.5.\nDivide by 6: b − 1.25 = 6.75. Add 1.25: b = 8.\nCheck: 6 × (8 − 1.25) = 6 × 6.75 = 40.5.',
   edit=[('6 identical boxes each weigh', 'Six identical boxes each weigh'),
         ('Write an equation that can be used to find b. Then solve the equation.', 'Which choice shows an equation that can be used to find b, and its solution?')])
mc('MA.7.AR.2.2/cmp/0', 'equation plus solution',
   ['15g + 3.75 = 33.75; g = 2', '3.75g + 15 = 33.75; g = 13', '3.75g − 15 = 33.75; g = 13', '3.75g + 15 = 33.75; g = 5'], 3,
   'Total = entry fee + $3.75 for each game: 3.75g + 15 = 33.75.\nSubtract 15: 3.75g = 18.75. Divide by 3.75: g = 5.\nCheck: 3.75 × 5 + 15 = 33.75.\ng = 13 adds the 15 instead of subtracting it; 15g + 3.75 swaps the price per game and the entry fee.',
   edit=[('A park charges a $18.00 entry fee plus $3.75 for each game. A visitor paid $44.25 in all.', 'A park charges a $15.00 entry fee plus $3.75 for each game. A visitor paid $33.75 in all.'),
         ('Write an equation that can be used to find g, the number of games the visitor paid for. Then solve the equation.',
          'Which choice shows an equation that can be used to find g, the number of games the visitor paid for, and its solution?')])

# ---------------- MA.7.AR.4.3: graph it -> choose the graph ----------------
# The y-axis runs to 1.5 times the correct line's end value, so no line can be spotted by running corner to
# corner, and the distractor families vary so the correct line is not always the middle slope.
GR = ['Graph A', 'Graph B', 'Graph C', 'Graph D']


def lines_for(k, order):
    L = {'right': {'m': k, 'b': 0}, 'shift': {'m': k, 'b': k}, 'half': {'m': k / 2, 'b': 0}, 'halfshift': {'m': k / 2, 'b': k},
         'double': {'m': 2 * k, 'b': 0}, 'doubleshift': {'m': 2 * k, 'b': k}, 'halfshift2': {'m': k / 2, 'b': 2 * k}}
    return [L[o] for o in order]


def which_graph(slot, q, grid, k, order, key, s):
    mc(slot, 'a drawn graph cannot be graded; choose the graph instead', GR, key, s, q=q,
       fig={'builder': 'grid4', 'grid': grid, 'lines': lines_for(k, order)})


TAB = lambda rows: '<table class="ftab"><tr><th>x</th><th>y</th></tr>' + ''.join(f'<tr><td>{x}</td><td>{y}</td></tr>' for x, y in rows) + '</table>'
G = lambda xmax, ymax, ystep, xl='x', yl='y', xstep=1: {'xmin': 0, 'xmax': xmax, 'ymin': 0, 'ymax': ymax, 'xstep': xstep, 'ystep': ystep, 'xlabel': xl, 'ylabel': yl}


def why_graph(k, pts, letter, extra=''):
    p = ', '.join(f'({x}, {y})' for x, y in pts)
    return (f'A proportional relationship is a straight line through the origin. Here every point has y = {k} × x, so the line passes through (0, 0) and {p}.\n'
            f'Graph {letter} is the only line that does. The other lines either start above the origin or rise at the wrong rate, so they miss these points.{extra}')


which_graph('MA.7.AR.4.3/chk/1', f'The table shows a proportional relationship between x and y.\n\n{TAB([(4, 20), (5, 25), (6, 30)])}\n\nWhich graph represents this relationship?',
            G(6, 45, 5), 5, ['half', 'right', 'halfshift', 'shift'], 1, why_graph(5, [(4, 20), (5, 25), (6, 30)], 'B'))
which_graph('MA.7.AR.4.3/chk/3', 'A proportional relationship is given by the equation y = 14x.\n\nWhich graph represents this relationship for x-values from 0 to 10?',
            G(10, 168, 14), 14, ['right', 'double', 'shift', 'doubleshift'], 0, why_graph(14, [(1, 14), (5, 70), (10, 140)], 'A'))
which_graph('MA.7.AR.4.3/re/0', f'The table shows a proportional relationship between x and y.\n\n{TAB([(2, 32), (4, 64), (5, 80)])}\n\nWhich graph represents this relationship?',
            G(6, 160, 16), 16, ['double', 'shift', 'right', 'doubleshift'], 2, why_graph(16, [(2, 32), (4, 64), (5, 80)], 'C'))
which_graph('MA.7.AR.4.3/re/2', 'A proportional relationship is given by the equation y = 23x.\n\nWhich graph represents this relationship for x-values from 0 to 6?',
            G(6, 207, 23), 23, ['shift', 'half', 'halfshift2', 'right'], 3, why_graph(23, [(1, 23), (2, 46), (6, 138)], 'D'))

# graph plus the meaning of the constant: the graphs are numbered so they cannot be confused with the option letters
mc('MA.7.AR.4.3/chk/2', 'graph plus the meaning of the constant',
   ['Graph 4; each hour, 12 more miles are biked.', 'Graph 4; it takes 12 hours to bike 1 mile.',
    'Graph 1; it takes 12 hours to bike 1 mile.', 'Graph 3; each hour, 6 more miles are biked.'], 0,
   'The constant of proportionality 12 means y = 12x: each hour, 12 more miles are biked. The graph is a straight line through the origin that passes through (1, 12), (2, 24) and (6, 72): Graph 4.\nGraph 1 starts at (0, 12) instead of the origin, Graph 2 rises twice as fast and Graph 3 half as fast. “12 hours to bike 1 mile” switches the two quantities.',
   q='The relationship between hours (x) and miles biked (y) is proportional, with a constant of proportionality of 12.\n\nWhich graph represents this relationship for 0 to 6 hours, and what does the constant of proportionality mean in this situation?',
   fig={'builder': 'grid4', 'grid': G(6, 96, 12, 'hours', 'miles biked'), 'labels': ['Graph 1', 'Graph 2', 'Graph 3', 'Graph 4'],
        'lines': lines_for(12, ['shift', 'double', 'half', 'right'])})
mc('MA.7.AR.4.3/re/1', 'graph plus the meaning of the constant',
   ['Graph 2; it takes 15 boxes to hold 1 book.', 'Graph 3; it takes 15 boxes to hold 1 book.',
    'Graph 2; each box holds 15 books.', 'Graph 4; each box holds 30 books.'], 2,
   'The constant of proportionality 15 means y = 15x: each box holds 15 books. The graph is a straight line through the origin that passes through (1, 15), (2, 30) and (6, 90): Graph 2.\nGraph 3 starts at (0, 15) instead of the origin, Graph 4 rises twice as fast and Graph 1 half as fast. “15 boxes to hold 1 book” switches the two quantities.',
   q='The relationship between boxes (x) and books packed (y) is proportional, with a constant of proportionality of 15.\n\nWhich graph represents this relationship for 0 to 6 boxes, and what does the constant of proportionality mean in this situation?',
   fig={'builder': 'grid4', 'grid': G(6, 120, 15, 'boxes', 'books packed'), 'labels': ['Graph 1', 'Graph 2', 'Graph 3', 'Graph 4'],
        'lines': lines_for(15, ['half', 'right', 'shift', 'double'])})
# rigor: choose the graph from the constant, then extend past the grid
mc('MA.7.AR.4.3/chk/4', 'graph plus explanation',
   ['Graph 1; yes, because 8/5 × 40 = 64.', 'Graph 1; no, because 64 ÷ 40 = 1.6, not 8/5.',
    'Graph 3; no, because 64 − 40 = 24, not 8 − 5 = 3.', 'Graph 2; no, because 5/8 × 40 = 25, not 64.'], 0,
   'A constant of proportionality of 8/5 means y = (8/5)x, a straight line through the origin that passes through (5, 8) and (25, 40): Graph 1. Graph 2 has the reciprocal constant 5/8, and Graph 3 passes through (5, 8) but not through the origin.\nFor x = 40, y = 8/5 × 40 = 64, so (40, 64) is on the line, even though it is past the edge of the grid. The ratio test agrees: 64 ÷ 40 = 1.6, and 1.6 = 8/5.',
   q='The constant of proportionality for a proportional relationship between x and y is 8/5.\n\nWhich graph shows the relationship, and is the point (40, 64) on its line? The grids stop at x = 25.',
   fig={'builder': 'grid4', 'grid': G(25, 48, 8, 'x', 'y', 5), 'labels': ['Graph 1', 'Graph 2', 'Graph 3'],
        'lines': [{'m': 1.6, 'b': 0}, {'m': 0.625, 'b': 0}, {'m': 1, 'b': 3}]})

# ---------------- MA.7.AR.4.4 ----------------
EQ = ('Write an equation for this relationship.', 'Which equation represents this relationship?')
mc('MA.7.AR.4.4/chk/0', 'a typed equation cannot be matched reliably',
   ['y = 0.8x', 'y = x + 1', 'y = 5x', 'y = 1.25x'], 3,
   'Use the labeled point (4, 5): the constant of proportionality is 5 ÷ 4 = 1.25, so y = 1.25x.\ny = 0.8x divides 4 by 5 instead; y = 5x uses the y-value of one point; y = x + 1 fits (4, 5) but not (8, 10), and its graph would not pass through the origin.',
   edit=[EQ])
mc('MA.7.AR.4.4/chk/2', 'typed equation',
   ['y = (1/3)x', 'y = 3x', 'y = x + 4', 'y = 6x'], 1,
   'Each y-value is 3 times its x-value: 6 ÷ 2 = 3, 15 ÷ 5 = 3, 21 ÷ 7 = 3. The equation is y = 3x.\ny = x + 4 works only for the first row (2 + 4 = 6), not for 5 and 15; y = 6x uses the first y-value.',
   edit=[EQ])
mc('MA.7.AR.4.4/re/0', 'typed equation',
   ['y = 3.75x', 'y = (4/15)x', 'y = 15x', 'y = x + 11'], 0,
   'Use the labeled point (4, 15): the constant of proportionality is 15 ÷ 4 = 3.75, so y = 3.75x.\ny = (4/15)x divides 4 by 15 instead, y = 15x uses the y-value of one point, and y = x + 11 fits (4, 15) but not (8, 30).',
   edit=[EQ])
mc('MA.7.AR.4.4/cmp/0', 'typed equation',
   ['y = x + 6', 'y = 10x', 'y = 2.5x', 'y = 0.4x'], 2,
   'Use the labeled point (4, 10): the constant of proportionality is 10 ÷ 4 = 2.5, so y = 2.5x.\ny = x + 6 fits (4, 10) but not (8, 20); y = 0.4x divides 4 by 10; y = 10x uses the y-value of one point.',
   edit=[EQ])
mc('MA.7.AR.4.4/chk/3', 'three values',
   ['24, 32, 40', '27, 36, 45', '27, 31.5, 36', '54, 72, 90'], 1,
   'The constant of proportionality is 4.5 bottles per minute, so bottles = 4.5 × minutes.\n4.5 × 6 = 27, 4.5 × 8 = 36, 4.5 × 10 = 45.\n24, 32 and 40 use 4 bottles per minute and drop the 0.5; 54, 72 and 90 use 9, the change from one row to the next, as the rate per minute; 27, 31.5, 36 adds 4.5 for each row, but the rows are 2 minutes apart.',
   edit=[('What are the three missing values in the table?', 'Which choice gives the three missing values, in order?')])

# ---------------- MA.7.AR.4.2 / MA.7.AR.4.1 ----------------
mc('MA.7.AR.4.2/chk/4', 'constant plus meaning',
   ['6; each cup of blue paint is used with 6 cups of white paint.', '1/6; each cup of blue paint is used with 1/6 cup of white paint.',
    '1/6; each cup of white paint is used with 1/6 cup of blue paint.', '2; each batch uses 2 cups of blue paint.'], 2,
   'y is cups of blue paint and x is cups of white paint, so the constant of proportionality is y ÷ x = 2 ÷ 12 = 1/6.\nIt means each cup of white paint is used with 1/6 cup of blue paint.\n6 is x ÷ y, the reciprocal, which would be the constant if x and y were switched.',
   edit=[('What is the constant of proportionality? What does it mean in this situation?', 'What is the constant of proportionality, and what does it mean in this situation?')])
mc('MA.7.AR.4.1/chk/4', 'three-part judgment',
   ["Noor's reason is correct; a proportional table must include x = 0, so the relationship is not proportional.",
    "Noor's reason is not correct, but the relationship is not proportional, because the x-values do not increase by the same amount.",
    "Noor's reason is not correct; the relationship is proportional, with constant of proportionality 0.6.",
    "Noor's reason is not correct; the relationship is proportional, with constant of proportionality 1.2."], 3,
   'y ÷ x is the same for every pair: 1.8 ÷ 1.5 = 1.2, 2.4 ÷ 2 = 1.2, 3 ÷ 2.5 = 1.2, 6 ÷ 5 = 1.2. So the relationship is proportional, with constant of proportionality 1.2.\nA table does not need to show x = 0 to be proportional, and the x-values do not need to increase by the same amount.\n0.6 is how much y increases when x goes from 1.5 to 2, not y ÷ x.',
   edit=[("Is Noor's reason correct? Is the relationship proportional? If it is, give the constant of proportionality; if it is not, name a pair whose ratio is different.",
          "Is Noor's reason correct? Is the relationship proportional, and if it is, what is the constant of proportionality?")])

# ---------------- MA.7.DP.1.5 ----------------
DISP = ('Choose the display that shows every value and how often it occurs. Explain why it fits these data, and describe what it would look like.',
        'Which display shows every value and how often it occurs, and fits these data?')
mc('MA.7.DP.1.5/chk/3', 'display, reason and description',
   ['A line plot with 7 Xs above 0, 5 above 1, 3 above 2 and 1 above 3, because there are only a few different values.',
    'A histogram with one bar for 0–1 and one bar for 2–3, because it groups the values into intervals.',
    'A line plot with 5 Xs above 0, 7 above 1, 3 above 2 and 1 above 3, because there are only a few different values.',
    'A box plot, because it shows the median and the spread of the values.'], 2,
   'The data are numbers with only a few different values (0, 1, 2 and 3), so a line plot can show every value, with an X for each time it occurs.\nCount: 0 appears 5 times, 1 appears 7 times, 2 appears 3 times and 3 appears 1 time (16 values in all).\nA histogram groups values into intervals and a box plot shows only five summary values, so neither shows every value.',
   edit=[DISP])
mc('MA.7.DP.1.5/re/1', 'display, reason and description',
   ['A line plot with 4 Xs above 0, 3 above 1, 3 above 2, 2 above 3 and 1 above 4, because there are only a few different values.',
    'A line plot with 4 Xs above 0, 3 above 1, 2 above 2, 3 above 3 and 1 above 4, because there are only a few different values.',
    'A histogram with one bar for 0–1, one bar for 2–3 and one bar for 4–5, because it groups the values into intervals.',
    'A box plot, because it shows the median and the spread of the values.'], 0,
   'The data are numbers with only a few different values (0 to 4), so a line plot can show every value, with an X for each time it occurs.\nCount: 0 appears 4 times, 1 appears 3 times, 2 appears 3 times, 3 appears 2 times and 4 appears 1 time (13 values in all).',
   edit=[DISP])
mc('MA.7.DP.1.5/chk/4', 'display, reason and value',
   ['Display B, the histogram, because it shows how many values are in each interval; the interquartile range is 10 minutes.',
    'Display A, the box plot, because it marks the quartiles; the interquartile range is 45 minutes.',
    'Display B, the histogram, because it shows every interval; the interquartile range is 8 minutes.',
    'Display A, the box plot, because it marks the quartiles; the interquartile range is 10 minutes.'], 3,
   'A box plot marks Q1 and Q3, so the interquartile range is Q3 − Q1 = 45 − 35 = 10 minutes.\nA histogram groups the values into intervals, so it shows only that Q1 is in 30–39 and Q3 is in 40–49, not their exact values.\n45 minutes is the range (65 − 20), not the interquartile range, and 8 is the height of the tallest bar.',
   edit=[('Which display can be used to find the interquartile range of the data? Explain why the other display cannot, and then use the display to find the interquartile range of the data.',
          'Which display can be used to find the interquartile range of the data, and why? What is the interquartile range?')])

# Balance the answer letters of the hand-converted choices: the correct option lands on A, B, C or D equally
# often (seeded shuffle of targets), by rotating the options. Items whose options are figure letters are left alone.
import random
FIGLET = re.compile(r'^(Graph|Number line) [A-D]$')
elig = [e for e in P if e.get('set', {}).get('rt') == 'mc' and not all(FIGLET.match(o) for o in e['set']['opts'])]
targets = (list(range(4)) * (len(elig) // 4 + 1))[:len(elig)]
random.Random(20261026).shuffle(targets)
for e, t in zip(elig, targets):
    o, k = e['set']['opts'], e['set']['key']
    n = len(o); sh = (t - k) % n
    no = [None] * n
    for i, v in enumerate(o):
        no[(i + sh) % n] = v
    e['set']['opts'], e['set']['key'] = no, t
    e['set']['a'] = f'{LT[t]}. {no[t]}'
from collections import Counter
print('keys of hand conversions:', dict(Counter(LT[e['set']['key']] for e in P if e.get('set', {}).get('rt') == 'mc')))
json.dump(P, open('/home/claude/dpp/forms/forms_patches.json', 'w'), indent=1, ensure_ascii=False)
print(len(P), 'patches;', sum(1 for p in P if 'redraw' in p), 'redraws;', sum(1 for p in P if p.get('set', {}).get('rt') == 'mc'), 'to multiple choice')
