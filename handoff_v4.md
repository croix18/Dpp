# Cadence generator handoff v4 — round 4 (Oct 10)

Round 4 reviewed edition 4 (built from the third Cadence revision): three reviewers, every item, every key recomputed. Of the 34 edition-3 flags, 14 were resolved and 20 persist. Round 4 raised 69 new flags: 5 high, 29 medium, 35 low. There was one key error (DP.2.4 Part C accepted wrong answers). The reviewers ran on a different model this round and were stricter: they rendered pages and checked CPALMS clarifications. Part of the rise in medium and low flags comes from the reviewer, not the bank.

**The bank is now frozen at edition 4.1.** The high flags, the key error, and nine re-check or comparison items that reused a check item's numbers were fixed in the bank by editing or redrawing single slots. A new Cadence no longer reshuffles the 340 items, so fixes stop introducing new problems. The fixes are still generator bugs, though, and the next full edition (next year) will hit them again unless Cadence fixes them. Those flags are marked **[fixed in bank]**: fix the generator, nothing more is needed for this year. Flags marked [fixed in build] or [fixed in scales] were fixed on the bank side and need nothing in Cadence.

Open for Cadence: 35 flag lines. Already fixed on the bank side: 12.

## Priority order

1. **Generator bugs fixed in this year's bank** (so next year's edition doesn't reintroduce them): GR.1.2 composite figure drawn out of proportion; DP.2.2 rigor wording; NSO.2.2 sign-free fraction subtraction and the mixed-number multiplication in gen 6's solution; DP.2.4 Part C key and Part B wording; DP.1.5 display item with two defensible answers; AR.4.1 situations that don't name the two quantities; AR.2.1 two-step distractors.
2. **Small number pools** that made re-check and comparison items repeat check items: carriage rates (AR.4.5), cylinder dimensions (GR.2.2, GR.2.3, GR.2.1 h = 24), pump and suitcase (AR.3.3), beef table (AR.3.2), 7/11 (NSO.1.2), sunflower bins (DP.1.5).
3. **Rigor is not the level-4 skill** on: AR.2.1, GR.1.4, GR.1.2, GR.1.5, DP.2.1, DP.1.4, AR.3.2, AR.3.1, AR.4.4, DP.1.2, AR.4.1, NSO.2.1, AR.4.3.
4. **Benchmark verbs with no item:** DP.1.4 construct; DP.1.5 create; AR.2.1 real-world and graph-the-solution; GR.1.1 rhombus by diagonals; GR.1.5 area scales by k²; GR.2.3 compare two cylinders; DP.2.2 certain/impossible.
5. **Template repeats** across a benchmark's three sets. For future editions the build now caps a generator at two of the three sets, but generators with one context per template will still repeat contexts.
6. **Key and stem text:** mixed-number annotations inside expressions in keys (AR.1.1, AR.1.2, AR.3.2, AR.4.4); numerals starting sentences (AR.2.2); GR.2.1 naming of length and width; implausible contexts (DP.1.2 R2).

## Fixed on the bank side this round (no Cadence work needed)

- [fixed in build] select-all and matching keys printed no scoring rule → *key now prints "1 point only if every box is correct"*
- [fixed in build] re-check and comparison figures printed at about a third of size (labels 2–4 pt); select-all letters wrapped under the box; write-in items had no room on some strips and one check → *figures full size; letters before the box; write-in items keep 0.6 in on checks and 0.44 in on strips (a strip that can't goes one per page)*


## MA.7.DP.2.1 — Sample space of a simple experiment  (Unit 2: Probability)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): There are 3 purple, 6 white and 10 yellow marbles in a bag. One marble is chosen at random and its color is re ¦ There are 12 red, 11 purple, 7 black and 5 blue marbles in a jar. One marble is chosen at random and its color ¦ There are 11 black, 10 white, 8 purple and 3 blue marbles in a box. One marble is chosen at random and its col
- `reg[1]` (sa): The tiles in a box are numbered 3, 5, 5, 9, 9, 1, 9, 6, 5. One tile is drawn at random and its number is recor ¦ A set of cards shows these colored shapes, one on each card: red square, yellow heart, green star, green star, ¦ A set of cards shows these colored shapes, one on each card: red triangle, red triangle, blue triangle, yellow
- `reg[2]` (sa): A fair 6-sided die has these shapes on its faces: square, circle, square, triangle, star, star. The die is rol ¦ A fair 6-sided die has these numbers on its faces: 4, 2, 8, 7, 4, 7. The die is rolled once and the number on  ¦ A fair 8-sided die has these shapes on its faces: star, square, circle, star, square, square, circle, triangle
- `reg[3]` (mc): Experiment 1: A spinner has 6 equal sections colored blue, green, green, green, green and yellow. It is spun o ¦ Experiment 1: A spinner has 5 equal sections colored orange, purple, orange, green and green. It is spun once  ¦ Experiment 1: A spinner has 5 equal sections colored red, green, red, green and yellow. It is spun once and th
- `reg[4]` (etc): A spinner has 6 equal sections: 1 is red, 2 are yellow, 2 are orange and 1 is green. The spinner is spun once  ¦ A spinner has 6 equal sections: 1 is yellow, 3 are red, 1 is purple and 1 is green. The spinner is spun once a ¦ A spinner has 6 equal sections: 1 is green, 2 are red and 3 are purple. The spinner is spun once and the color
- `reg[5]` (mc): Each letter of the word FUNCTION is written on its own card, one card for each letter, and the cards are place ¦ Each letter of the word AVERAGE is written on its own card, one card for each letter, and the cards are placed ¦ Each letter of the word SCALENE is written on its own card, one card for each letter, and the cards are placed
- `hr[0]` (ms): A spinner has equal sections. It is spun once and the color it lands on is recorded. The sample space for this ¦ A bag holds only marbles. One marble is drawn at random and its color is recorded. The sample space for this e
- `hr[1]` (ms): In each experiment below, the color is recorded. Select all the experiments whose sample space is {yellow, blu ¦ In each experiment below, the color is recorded. Select all the experiments whose sample space is {orange, yel ¦ In each experiment below, the color is recorded. Select all the experiments whose sample space is {blue, orang
- `hr[2]` (match): There are 7 cards, and each card shows one colored shape: red square, blue triangle, blue square, red square,  ¦ There are 7 cards, and each card shows one colored shape: green square, red square, green star, red square, re ¦ There are 7 cards, and each card shows one colored shape: red star, red triangle, green star, red square, red 

Items in edition 4.1:
- check 1 ← `reg[5]` mc: Each letter of the word DIFFERENCE is written on its own card, one card for each letter, and the cards are placed in a jar. One card is draw  → **B. 7**
- check 2 ← `reg[1]` sa: A set of cards shows these colored shapes, one on each card: red circle, yellow star, yellow triangle, yellow triangle, yellow star, yellow   → **{red circle, yellow star, yellow triangle}**
- check 3 ← `reg[3]` mc: Experiment 1: A spinner has 5 equal sections colored red, green, orange, purple and red. It is spun once and the color it lands on is record  → **A. The sample space for the spinner has one outcome that the**
- check 4 ← `reg[2]` sa: A fair 8-sided die has these numbers on its faces: 5, 5, 1, 8, 9, 8, 9, 5. The die is rolled once and the number on the top face is recorded  → **{1, 5, 8, 9}**
- check 5 (rigor) ← `hr[1]` ms: In each experiment below, the color is recorded.  Select  all  the experiments whose sample space is {purple, green, blue}.  → **B. Spinning a spinner whose 6 equal sections are green, blue**
- re-check 1 ← `reg[5]` mc: Each letter of the word DEGREE is written on its own card, one card for each letter, and the cards are placed in a hat. One card is drawn at  → **B. 4**
- re-check 2 ← `reg[4]` etc: A spinner has 6 equal sections: 1 is blue, 1 is red, 1 is purple and 3 are green. The spinner is spun once and the color it lands on is reco  → **A. {blue, red, purple, green}**
- re-check 3 ← `reg[1]` sa: The tiles in a bag are numbered 8, 1, 1, 8, 2, 8, 2. One tile is drawn at random and its number is recorded.  List the sample space for this  → **{1, 2, 8}**
- comparison 1 ← `reg[5]` mc: Each letter of the word ADDITION is written on its own card, one card for each letter, and the cards are placed in a jar. One card is drawn   → **B. 6**
- comparison 2 ← `reg[2]` sa: A fair 6-sided die has these numbers on its faces: 6, 9, 9, 9, 9, 1. The die is rolled once and the number on the top face is recorded.  Lis  → **{1, 6, 9}**

Flags:
- check item 3, 5: regular 3 already is the L4 task; rigor is longer, not harder; letter-card count in all three sets → *make 3 a list item; rigor: judge a written claim about two sample spaces*
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.NSO.1.2 — Rewrite rational numbers in equivalent forms  (Unit 2: Probability)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (sa): Write the fraction as a repeating decimal. 65/99 ¦ Write the fraction as a repeating decimal. 5/33 ¦ Write the fraction as a repeating decimal. 7/9
- `reg[1]` (sa): Write the repeating decimal as a fraction in simplest form. 0.6̅ ¦ Write the repeating decimal as a fraction in simplest form. 0.1̅ ¦ Write the repeating decimal as a fraction in simplest form. 0.6̅0̅
- `reg[2]` (mc): Which fraction is equivalent to 0.8̅1̅? ¦ Which fraction is equivalent to 0.6̅5̅? ¦ Which fraction is equivalent to 0.1̅8̅?
- `reg[3]` (sa): Write the fraction as an exact percent. 13/15 ¦ Write the fraction as an exact percent. 3/11 ¦ Write the fraction as an exact percent. 14/15
- `reg[4]` (ms): Select all the values that are equivalent to 5 ÷ 9. ¦ Select all the values that name the same number as 1 ÷ 9. ¦ Select all the values that are equal to the quotient 8 ÷ 9.
- `reg[5]` (etc): Two identical bottles of sports drink are partly full. The first bottle is 14/99 full and the second bottle is ¦ Two identical bottles of sports drink are partly full. The first bottle is 7/11 full and the second bottle is  ¦ Two identical bottles of sports drink are partly full. The first bottle is 5/18 full and the second bottle is 
- `hr[0]` (sa): Justin uses a calculator to find 289/44. The calculator shows 6.568181818. Justin says that 289/44 = 6.5681818 ¦ Priya uses a calculator to find 137/44. The calculator shows 3.113636364. Priya says that 137/44 = 3.113636364 ¦ Priya uses a calculator to find 85/66. The calculator shows 1.287878788. Priya says that 85/66 = 1.287878788. 
- `hr[1]` (sa): Kai and Rosa each started with a full glue stick. Kai has used 1/6 of the glue stick, and Rosa has used 25% of ¦ Kai and Rosa each started with a full glue stick. Kai has used 8/9 of the glue stick, and Rosa has used 75% of ¦ Kai and Rosa each started with a full glue stick. Kai has used 2/9 of the glue stick, and Rosa has used 15% of
- `hr[2]` (sa): Write 3 14/15 in three equivalent forms: as a fraction, as a repeating decimal and as a percent. ¦ Write 5 5/6 in three equivalent forms: as a fraction, as a repeating decimal and as a percent. ¦ Write 7 5/11 in three equivalent forms: as a fraction, as a repeating decimal and as a percent.
- `hr[3]` (mc): Four numbers are shown. 16.3% 0.16 0.1̅6̅ 1/6 Which list shows the numbers in order from least to greatest? ¦ Four numbers are shown. 0.9̅4̅ 0.94 94.4% 17/18 Which list shows the numbers in order from least to greatest? ¦ Four numbers are shown. 0.93 0.9̅3̅ 14/15 93.3% Which list shows the numbers in order from least to greatest?

Items in edition 4.1:
- check 1 ← `reg[1]` sa: Write the repeating decimal as a fraction in simplest form.  0. 46  → **46/99**
- check 2 ← `reg[0]` sa: Write the fraction as a repeating decimal.  13/33  → **0. 39**
- check 3 ← `reg[5]` etc: Two identical bottles of sports drink are partly full. The first bottle is 10/11 full and the second bottle is 95% full.  The first bottle h  → **D. less than**
- check 4 ← `reg[3]` sa: Write the fraction as an exact percent.  7/11  → **63 7/11% (or 63. 63 %)**
- check 5 (rigor) ← `hr[0]` sa: Maya uses a calculator to find 190/33. The calculator shows 5.757575758. Maya says that 190/33 = 5.757575758.  Is Maya correct? Explain, and  → **No. The calculator rounded a repeating decimal, so 5.7575757**
- re-check 1 ← `reg[5]` etc: Two identical bottles of sports drink are partly full. The first bottle is 4/11 full and the second bottle is 30% full.  The first bottle ho  → **B. more than**
- re-check 2 ← `reg[4]` ms: Select  all  the values that are equal to the quotient 8 ÷ 99.  → **A. 0. 08 ; C. 16/198**
- re-check 3 ← `reg[3]` sa: Write the fraction as an exact percent.  7/9  → **77 7/9% (or 77. 7 %)**
- comparison 1 ← `reg[5]` etc: Two identical bottles of sports drink are partly full. The first bottle is 2/15 full and the second bottle is 15% full.  The first bottle ho  → **A. less than**
- comparison 2 ← `reg[4]` ms: Select  all  the values that are equivalent to 1 ÷ 33.  → **B. 3/99; C. 0. 03**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check item 2–5: denominators all in the 11/33/99 family (edition 4.1 R3 now uses 7/9) → *vary the fraction pool*

## MA.7.DP.2.2 — Interpret and compare probabilities  (Unit 2: Probability)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (mc): The probability that the bus is late tomorrow is 30%. A spinner is spun. The probability that it lands on gree ¦ The probability that the Tigers win their next game is 85%. The probability that the seed sprouts this week is ¦ The probability that the Tigers win their next game is 3/8. A card is drawn from a set of letter cards. The pr
- `reg[1]` (mc): The probability that Mia makes her next free throw is 3/8. The probability that Jon makes his next free throw  ¦ The probability that the Tigers win their next game is 1/3. The probability that the Lions win their next game ¦ The probability that Mia makes her next free throw is 5/8. The probability that Jon makes his next free throw 
- `reg[2]` (mc): The probability of a bus arriving on time is reported as 65%. Is this event likely or unlikely? Explain using  ¦ The probability of a delayed flight is reported as 10%. Is this event likely or unlikely? Explain using the pr ¦ The probability of a delayed flight is reported as 30%. Is this event likely or unlikely? Explain using the pr
- `reg[3]` (mc): Which value cannot be the probability of an event?
- `reg[4]` (match): A probability is given for each event. Describe each event as likely, unlikely or neither.
- `hr[0]` (ms): A weather forecast gives P(rain on Saturday) = 0.7 and P(rain on Sunday) = 60%. Select all the true statements ¦ A weather forecast gives P(rain on Saturday) = 0.3 and P(rain on Sunday) = 1/5. Select all the true statements ¦ A weather forecast gives P(rain on Saturday) = 0.65 and P(rain on Sunday) = 45%. Select all the true statement
- `hr[1]` (sa): Four events and their probabilities are given. Event A: The school bus is late. P(A) = 0.6. Event B: It rains  ¦ Four events and their probabilities are given. Event A: A marble drawn from a bag is red. P(A) = 0.5. Event B: ¦ Four events and their probabilities are given. Event A: A spinner lands on green. P(A) = 65%. Event B: The Tig
- `hr[2]` (sa): A fair 12-sided die has faces numbered 1 through 12. The probability that it rains tomorrow is 55%. Which is m ¦ A bag holds 3 green, 9 blue and 8 yellow marbles. The probability that the school bus is late tomorrow is 40%. ¦ A spinner has 16 equal sections, and 4 of them are red. The probability that it rains tomorrow is 0.6. Which i
- `hr[3]` (ms): Three events and their probabilities are given. P(Mia makes her next free throw) = 0.75 P(a card drawn from a  ¦ Three events and their probabilities are given. P(a card drawn from a set of letter cards shows a vowel) = 0.8 ¦ Three events and their probabilities are given. P(the bus is late tomorrow) = 3/10 P(a marble drawn from a bag

Items in edition 4.1:
- check 1 ← `reg[2]` mc: The probability of rain tomorrow is reported as 75%.  Is this event likely or unlikely? Explain using the probability.  → **A. Likely, because 75% is greater than 50% and closer to 1 t**
- check 2 ← `reg[3]` mc: Which value  cannot  be the probability of an event?  → **B. 110%**
- check 3 ← `reg[1]` mc: The probability that Mia makes her next free throw is 5/8. The probability that Jon makes his next free throw is 1/4.  Which event is more l  → **B. Mia makes her next free throw**
- check 4 ← `reg[4]` match: A probability is given for each event.  Describe each event as likely, unlikely or neither.  → **The probability that it snows in Orlando, Florida, this wint**
- check 5 (rigor) ← `hr[2]` sa: A fair 10-sided die has faces numbered 1 through 10. The probability that it rains tomorrow is 0.2.  Which is more likely: that the die show  → **The die shows a number greater than 3; 7/10 = 0.7 and 0.2, s**
- re-check 1 ← `reg[3]` mc: Which value  cannot  be the probability of an event?  → **A. 140%**
- re-check 2 ← `reg[0]` mc: The probability that the seed sprouts this week is 0.875. The probability that the Tigers win their next game is 7/10.  Which event is more   → **B. The seed sprouts this week**
- re-check 3 ← `reg[4]` match: A probability is given for each event.  Describe each event as likely, unlikely or neither.  → **The probability that a hurricane passes within 100 miles of **
- comparison 1 ← `reg[3]` mc: Which value  cannot  be the probability of an event?  → **D. 6/5**
- comparison 2 ← `reg[2]` mc: The probability of a bus arriving on time is reported as 85%.  Is this event likely or unlikely? Explain using the probability.  → **B. Likely, because 85% is greater than 50% and closer to 1 t**

Flags:
- check item 5: [fixed in bank] "find how much more likely it is" reads as a difference (0.5) or a ratio (3.5x); key credited only the difference → *stem: "find the difference between the two probabilities"; key accepts 1/2 or 50%*
- check/R/X item 2, R1, X1: "cannot be a probability" MC in all three sets, every one above 1, none negative; certain (1) and impossible (0) never keyed → *cap; include a negative value; key 0 and 1 somewhere*

## MA.7.DP.2.3 — Find theoretical probability of an event  (Unit 2: Probability)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (mc): A bag holds 30 marbles, and 6 of them are red. One marble is drawn at random. What is the probability of drawi ¦ A bag holds 24 marbles, and 19 of them are red. One marble is drawn at random. What is the probability of draw ¦ A bag holds 18 marbles, and 14 of them are red. One marble is drawn at random. What is the probability of draw
- `reg[1]` (sa): A fair 20-sided die has faces numbered 1 through 20. The die is rolled once. What is the probability of rollin ¦ A fair 10-sided die has faces numbered 1 through 10. The die is rolled once. What is the probability of rollin ¦ A fair 8-sided die has faces numbered 1 through 8. The die is rolled once. What is the probability of rolling 
- `reg[2]` (sa): Letter cards for the word COEFFICIENT are placed in a bag, one card for each letter. One card is drawn at rand ¦ Letter cards for the word STATISTICS are placed in a bag, one card for each letter. One card is drawn at rando ¦ Letter cards for the word EXPONENT are placed in a bag, one card for each letter. One card is drawn at random.
- `reg[3]` (sa): A bag has 6 red, 6 blue and 3 green marbles. One marble is drawn at random. What is the probability of drawing ¦ A bag has 7 red, 5 blue and 6 green marbles. One marble is drawn at random. What is the probability of drawing ¦ A bag has 3 red, 7 blue and 2 green marbles. One marble is drawn at random. What is the probability of drawing
- `reg[4]` (sa): A standard deck has 52 cards: 13 cards (ace, 2 through 10, jack, queen and king) in each of four suits — heart
- `reg[5]` (sa): A fair spinner has 5 equal sections. 2 sections are red. The spinner is spun once. What is the probability tha ¦ A fair spinner has 25 equal sections. 19 sections are yellow. The spinner is spun once. What is the probabilit ¦ A fair spinner has 20 equal sections. 3 sections are purple. The spinner is spun once. What is the probability
- `hr[0]` (sa): A fair 20-sided die has faces numbered 1 through 20. The die is rolled once. What is the probability of rollin ¦ A fair 10-sided die has faces numbered 1 through 10. The die is rolled once. What is the probability of rollin ¦ A fair 12-sided die has faces numbered 1 through 12. The die is rolled once. What is the probability of rollin
- `hr[1]` (sa): A bag holds 20 marbles. Each marble is red, blue or green. One marble is drawn at random. P(red) = 3/10 and P( ¦ A bag holds 80 marbles. Each marble is red, blue or green. One marble is drawn at random. P(red) = 2/5 and P(b ¦ A bag holds 50 marbles. Each marble is red, blue or green. One marble is drawn at random. P(red) = 3/10 and P(
- `hr[2]` (sa): A spinner has 10 equal sections numbered 1 through 10. Sections 1 to 4 are blue, sections 5 and 6 are green, a ¦ A spinner has 10 equal sections numbered 1 through 10. Sections 1 to 6 are blue, sections 7 and 8 are green, a ¦ A spinner has 8 equal sections numbered 1 through 8. Sections 1 to 3 are blue, sections 4 and 5 are green, and
- `hr[3]` (sa): A standard deck has 52 cards: 13 cards (ace, 2 through 10, jack, queen and king) in each of four suits — heart

Items in edition 4.1:
- check 1 ← `reg[1]` sa: A fair 20-sided die has faces numbered 1 through 20. The die is rolled once.  What is the probability of rolling a number greater than 15? W  → **1/4**
- check 2 ← `reg[5]` sa: A fair spinner has 25 equal sections. 6 sections are green. The spinner is spun once.  What is the probability that the spinner lands on gre  → **0.24**
- check 3 ← `reg[0]` mc: A bag holds 12 marbles, and 3 of them are red. One marble is drawn at random.  What is the probability of drawing a red marble?  → **B. 1/4**
- check 4 ← `reg[2]` sa: Letter cards for the word MEASUREMENT are placed in a bag, one card for each letter. One card is drawn at random.  What is the probability t  → **2/11**
- check 5 (rigor) ← `hr[3]` sa: A standard deck has 52 cards: 13 cards (ace, 2 through 10, jack, queen and king) in each of four suits — hearts and diamonds, which are red,  → **25/26**
- re-check 1 ← `reg[5]` sa: A fair spinner has 4 equal sections. 3 sections are yellow. The spinner is spun once.  What is the probability that the spinner lands on yel  → **75%**
- re-check 2 ← `reg[1]` sa: A fair 8-sided die has faces numbered 1 through 8. The die is rolled once.  What is the probability of rolling a number greater than 5? Writ  → **3/8**
- re-check 3 ← `reg[0]` mc: A bag holds 18 marbles, and 4 of them are red. One marble is drawn at random.  What is the probability of drawing a red marble?  → **B. 2/9**
- comparison 1 ← `reg[0]` mc: A bag holds 12 marbles, and 2 of them are red. One marble is drawn at random.  What is the probability of drawing a red marble?  → **B. 1/6**
- comparison 2 ← `reg[5]` sa: A fair spinner has 8 equal sections. 6 sections are orange. The spinner is spun once.  What is the probability that the spinner lands on ora  → **0.75**

Flags:
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.DP.2.4 — Experimental vs theoretical probability  (Unit 2: Probability)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): A fair coin is tossed 600 times and lands on heads 318 times. What is the experimental probability of landing  ¦ A fair coin is tossed 600 times and lands on heads 288 times. What is the experimental probability of landing  ¦ A fair coin is tossed 200 times and lands on heads 98 times. What is the experimental probability of landing o
- `reg[1]` (sa): A fair 12-sided die is rolled 200 times. It lands on a 9 exactly 18 times. Part A. What is the experimental pr ¦ A fair 6-sided die is rolled 600 times. It lands on a 6 exactly 103 times. Part A. What is the experimental pr ¦ A fair 12-sided die is rolled 200 times. It lands on a 12 exactly 15 times. Part A. What is the experimental p
- `reg[2]` (mc): A spinner has 10 equal sections, and 5 of them are red. In a simulation the spinner is spun 200 times and land ¦ A spinner has 4 equal sections, and 2 of them are red. In a simulation the spinner is spun 200 times and lands ¦ A spinner has 5 equal sections, and 2 of them are red. In a simulation the spinner is spun 200 times and lands
- `reg[3]` (mc): Two students each simulate rolling a fair die. One runs 130 trials and the other runs 1,500 trials. Whose expe ¦ Two students each simulate rolling a fair die. One runs 290 trials and the other runs 2,300 trials. Whose expe ¦ Two students each simulate spinning a fair spinner. One runs 7,500 trials and the other runs 160 trials. Whose
- `reg[4]` (sa): A bag contains only blue marbles and green marbles. When one marble is drawn at random, the probability that i ¦ A bag contains only purple marbles and blue marbles. When one marble is drawn at random, the probability that  ¦ A bag contains only green marbles and purple marbles. When one marble is drawn at random, the probability that
- `hr[0]` (mc): Three bags each hold 20 marbles. Bag A has 6 red marbles, Bag B has 7 red marbles and Bag C has 8 red marbles; ¦ Three bags each hold 40 marbles. Bag A has 8 red marbles, Bag B has 10 red marbles and Bag C has 12 red marble ¦ Three bags each hold 20 marbles. Bag A has 7 red marbles, Bag B has 8 red marbles and Bag C has 9 red marbles;
- `hr[1]` (sa): A bag holds 25 marbles. Each marble is blue, green or yellow, but the number of each color is not known. A stu ¦ A bag holds 25 marbles. Each marble is yellow, green or blue, but the number of each color is not known. A stu ¦ A bag holds 40 marbles. Each marble is red, blue or yellow, but the number of each color is not known. A stude
- `hr[2]` (ms): A student rolls a fair 6-sided die 240 times and records how often it lands on 4. It lands on 4 a total of 34  ¦ A student rolls a fair 10-sided die 120 times and records how often it lands on 6. It lands on 6 a total of 8  ¦ A student rolls a fair 8-sided die 160 times and records how often it lands on 2. It lands on 2 a total of 14 
- `hr[3]` (sa): The first group tosses a fair coin 100 times and gets heads a total of 42 times. The second group tosses a fai ¦ The first group tosses a fair coin 100 times and gets heads a total of 57 times. The second group tosses a fai ¦ The first group spins a fair spinner with 5 equal sections, one of them blue, 100 times and gets blue a total 

Items in edition 4.1:
- check 1 ← `reg[1]` sa: A fair 12-sided die is rolled 300 times. It lands on a 9 exactly 24 times.  Part A. What is the experimental probability of rolling a 9? Wri  → **Experimental: 2/25; theoretical: 1/12. The experimental prob**
- check 2 ← `reg[0]` sa: A fair coin is tossed 400 times and lands on heads 204 times.  What is the experimental probability of landing on heads? Write your answer a  → **0.51**
- check 3 ← `reg[3]` mc: Two students each simulate rolling a fair die. One runs 5,900 trials and the other runs 370 trials.  Whose experimental probability is expec  → **A. The 5,900-trial student, because more trials usually brin**
- check 4 ← `reg[2]` mc: A spinner has 10 equal sections, and 8 of them are red. In a simulation the spinner is spun 400 times and lands on red 311 times.  Which sta  → **A. The experimental probability, 311/400, is a little less t**
- check 5 (rigor) ← `hr[1]` sa: A bag holds 10 marbles. Each marble is green, purple or blue, but the number of each color is not known. A student draws a marble at random,  → **Part A: 0.215. Part B: about 430 times. Part C: about 2 purp**
- re-check 1 ← `reg[3]` mc: Two students each simulate spinning a fair spinner. One runs 210 trials and the other runs 8,000 trials.  Whose experimental probability is   → **B. The 8,000-trial student, because more trials usually brin**
- re-check 2 ← `reg[0]` sa: A fair coin is tossed 800 times and lands on heads 376 times.  What is the experimental probability of landing on heads? Write your answer a  → **0.47**
- re-check 3 ← `reg[4]` sa: A bag contains only purple marbles and blue marbles. When one marble is drawn at random, the probability that it is purple is 0.25. A studen  → **about 100 times**
- comparison 1 ← `reg[3]` mc: Two students each simulate rolling a fair die. One runs 170 trials and the other runs 4,700 trials.  Whose experimental probability is expec  → **C. The 4,700-trial student, because more trials usually brin**
- comparison 2 ← `reg[1]` sa: A fair 10-sided die is rolled 200 times. It lands on a 3 exactly 23 times.  Part A. What is the experimental probability of rolling a 3? Wri  → **Experimental: 23/200; theoretical: 1/10. The experimental pr**

Flags:
- check item 5: [fixed in bank] Part C key accepted 1 or 3 purple marbles (data give 2.15); Part B allowed 400 once Part C was answered → *accept 2 only; Part B "Use your answer to Part A"*
- check/R/X item 3, R1, X1: law-of-large-numbers MC appears in all three sets → *cap at one per benchmark*

## MA.7.NSO.2.2 — Four operations with rational numbers  (Unit 3: Operations with Rational Numbers)

Regular generators: 7 · Rigor generators: 3

- `reg[0]` (sa): Evaluate. Write your answer in simplest form. −4/5 − 1/2 ¦ Evaluate. Write your answer in simplest form. 7/8 − 1/2 ¦ Evaluate. Write your answer in simplest form. 2/3 − 7/8
- `reg[1]` (sa): Evaluate the expression. Write your answer in simplest form. −1/2 × (−1.7) ¦ Evaluate the expression. Write your answer in simplest form. −2/3 × (−1.2) ¦ Evaluate the expression. Write your answer in simplest form. −1/2 × 2.3
- `reg[2]` (mc): What is the value of the expression? 1/5 ÷ (−4/5) ¦ What is the value of the expression? −1 1/5 ÷ (−3/5) ¦ What is the value of the expression? 1 1/3 ÷ (−2/3)
- `reg[3]` (sa): Subtract. Write your answer in simplest form. −2/5 − (−1/8) ¦ Subtract. Write your answer in simplest form. −5/6 − 1/2 ¦ Subtract. Write your answer in simplest form. 2/3 − (−3/8)
- `reg[4]` (sa): What is the value of the expression? 5.7 − 8.74 − 30.1 ¦ What is the value of the expression? 9.14 − 7.68 − 38.7 ¦ What is the value of the expression? 7.79 − 8.72 − 24.2
- `reg[5]` (sa): What number makes the equation true? 3 1/5 + ____ = 4.27 ¦ What number makes the equation true? −2 1/2 + ____ = 1.43 ¦ What number makes the equation true? 3 1/5 + ____ = −0.7
- `reg[6]` (sa): What is the value of the expression? Write your answer in simplest form. 0.8 ÷ (−2/5) ¦ What is the value of the expression? Write your answer in simplest form. 1.2 ÷ (−3/4) ¦ What is the value of the expression? Write your answer in simplest form. 2.25 ÷ 3/8
- `hr[0]` (sa): What number makes the equation true? −1 2/5 × ____ + 0.19 = 4.11 ¦ What number makes the equation true? 2 1/5 × ____ + 0.61 = −4.23 ¦ What number makes the equation true? −2 1/5 × ____ − 0.57 = −1.45
- `hr[1]` (sa): A student evaluated the expression −5/6 ÷ (−1/5) − 3/8 as shown. Step 1: −6/5 × (−1/5) = 6/25 Step 2: 6/25 − 3 ¦ A student evaluated the expression −1/5 ÷ 3/4 − 1/4 as shown. Step 1: −1/5 × 3/4 = −3/20 Step 2: −3/20 − 1/4 = ¦ A student evaluated the expression −1/6 ÷ (−1 1/4) − 1/3 as shown. Step 1: −1/6 × (−5/4) = 5/24 Step 2: 5/24 −
- `hr[2]` (sa): What is the value of the expression? Write your answer in simplest form. (−3/5 + 0.75) ÷ (2 3/4 − 4) ¦ What is the value of the expression? Write your answer in simplest form. (−4/5 + 0.6) ÷ (1 3/4 − 2) ¦ What is the value of the expression? Write your answer in simplest form. (−3/5 + 1.5) ÷ (3 1/2 − 5)

Items in edition 4.1:
- check 1 ← `reg[4]` sa: What is the value of the expression?  4.13 − 2.91 − 17.5  → **−16.28**
- check 2 ← `reg[6]` sa: What is the value of the expression? Write your answer in simplest form.  −0.64 ÷ (−4/5)  → **4/5 (or 0.8)**
- check 3 ← `reg[5]` sa: What number makes the equation true?  −2 2/5 + ____ = −3.61  → **−1 21/100 (or −1.21)**
- check 4 ← `reg[1]` sa: Evaluate the expression. Write your answer in simplest form.  2 1/2 × (−0.1)  → **−1/4 (or −0.25)**
- check 5 (rigor) ← `hr[1]` sa: A student evaluated the expression −1/6 ÷ 1 4/5 − 1/2 as shown.  Step 1: −1/6 × 5/9 = 5/54 Step 2: 5/54 − 1/2 = −11/27  In which step did th  → **Step 1; the correct value is −16/27. Score: 1 point for the **
- re-check 1 ← `reg[4]` sa: What is the value of the expression?  6.49 − 2.34 − 49.9  → **−45.75**
- re-check 2 ← `reg[6]` sa: What is the value of the expression? Write your answer in simplest form.  −1.5 ÷ 1/4  → **−6**
- re-check 3 ← `reg[3]` sa: Subtract. Write your answer in simplest form.  2/3 − (−1/6)  → **5/6**
- comparison 1 ← `reg[0]` sa: Evaluate. Write your answer in simplest form.  −1/2 − 1/4  → **−3/4**
- comparison 2 ← `reg[1]` sa: Evaluate the expression. Write your answer in simplest form.  1/3 × (−1.6)  → **−8/15 (or −0.5 3 )**

Flags:
- recheck item 2: [fixed in bank] generator emitted 4/5 - 1/3: no negative, no x or ÷ (grade-5 skill) → *require at least one negative operand*
- key item gen 6: [fixed in bank] worked solution multiplies a mixed number directly (-1 1/2 x 4/1) → *convert to an improper fraction first (-3/2 x 4/1 = -12/2 = -6)*

## MA.7.NSO.2.3 — Real-world problems with rational numbers  (Unit 3: Operations with Rational Numbers)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): A water trough contains 25 3/4 gallons of water. The horses drink at a rate of 2.25 gallons per hour for 8 hou ¦ A tank contains 43 1/2 gallons of water. Water leaks out at 1.75 gallons per hour for 2 hours, and then 7 1/4  ¦ A water trough contains 73 3/4 gallons of water. The horses drink at a rate of 0.4 gallons per hour for 5 hour
- `reg[1]` (sa): At 6 a.m. the temperature at a weather station was −6.1°C. The temperature then fell 3.5°C each hour for 6 hou ¦ At 6 a.m. the temperature at a weather station was −11.4°C. The temperature then fell 3.5°C each hour for 4 ho ¦ At 6 a.m. the temperature at a weather station was −6.6°C. The temperature then fell 1.5°C each hour for 4 hou
- `reg[2]` (sa): A group of 5 friends owes $104.00 for a group gift. They split the amount owed equally, and each friend's shar ¦ A group of 6 friends owes $53.52 for a canoe rental. They split the amount owed equally, and each friend's sha ¦ A group of 4 friends owes $67.68 for a rented party tent. They split the amount owed equally, and each friend'
- `reg[3]` (sa): The price of one share of a company's stock changed by these amounts over 5 days. −$0.35, −$2.50, +$1.10, −$2. ¦ The price of one share of a company's stock changed by these amounts over 5 days. +$0.20, −$2.10, +$1.05, −$2. ¦ The price of one share of a company's stock changed by these amounts over 5 days. +$1.55, −$0.40, +$1.00, +$1.
- `reg[4]` (sa): A bank account has a balance of −$25.88. The owner deposits 1/2 of a $600.00 paycheck, then pays a bill of $86 ¦ A bank account has a balance of −$4.04. The owner deposits 3/4 of a $280.00 paycheck, then pays a bill of $29. ¦ A bank account has a balance of −$5.06. The owner deposits 2/5 of a $610.00 paycheck, then pays a bill of $57.
- `hr[0]` (sa): A student's lunch account was charged a $3.75 fee, and then the student bought 5 lunches for $3.51 each. After ¦ A student's lunch account was charged a $3.75 fee, and then the student bought 7 lunches for $2.64 each. After ¦ A student's lunch account was charged a $1.50 fee, and then the student bought 3 lunches for $2.50 each. After
- `hr[1]` (sa): Diver A starts at −16 3/4 feet and rises 1.25 feet each second for 8 seconds. Diver B starts at −15.5 feet and ¦ Diver A starts at −18 feet and rises 2.5 feet each second for 2 seconds. Diver B starts at −8.5 feet and desce ¦ Diver A starts at −16 1/2 feet and rises 0.5 feet each second for 4 seconds. Diver B starts at −15.5 feet and 
- `hr[2]` (sa): The temperature in a garage on a winter night is 6.8°F. The temperature drops 1 3/4°F each hour. After how man ¦ The air temperature at a mountain weather station is 7.5°F. The temperature drops 3 1/2°F each hour. After how ¦ The air temperature at a mountain weather station is 12.5°F. The temperature drops 1 1/4°F each hour. After ho
- `hr[3]` (sa): At 11 a.m. the temperature was 2 3/4°F. At 5 p.m. it was −18 1/4°F. The temperature changed by the same amount ¦ At 9 a.m. the temperature was −2 3/4°F. At 2 p.m. it was −14°F. The temperature changed by the same amount eac ¦ At 6 a.m. the temperature was 1°F. At 11 a.m. it was −15 1/4°F. The temperature changed by the same amount eac

Items in edition 4.1:
- check 1 ← `reg[0]` sa: A tank contains 76 3/4 gallons of water. Water leaks out at 0.25 gallons per hour for 5 hours, and then 14 1/2 gallons are added.  How much   → **90 gallons**
- check 2 ← `reg[2]` sa: A group of 5 friends owes $83.60 for a canoe rental. They split the amount owed equally, and each friend's share is recorded as a negative b  → **−$10.45**
- check 3 ← `reg[1]` sa: At 6 a.m. the temperature at a weather station was −5.2°C. The temperature then fell 3.5°C each hour for 6 hours. Later in the day it rose 4  → **−22.1°C**
- check 4 ← `reg[3]` sa: The price of one share of a company's stock changed by these amounts over 4 days.  +$1.85, −$1.30, −$0.65, −$2.30  What was the mean (averag  → **−$0.60**
- check 5 (rigor) ← `hr[2]` sa: The temperature outside a cabin in January is 9.3°F. The temperature drops 3 1/2°F each hour.  After how many whole hours will the temperatu  → **4 hours**
- re-check 1 ← `reg[1]` sa: At 6 a.m. the temperature at a weather station was −8.7°C. The temperature then fell 3.5°C each hour for 5 hours. Later in the day it rose 5  → **−20.8°C**
- re-check 2 ← `reg[3]` sa: The price of one share of a company's stock changed by these amounts over 5 days.  −$0.25, +$1.55, −$0.70, −$2.20, −$0.05  What was the mean  → **−$0.33**
- re-check 3 ← `reg[2]` sa: A group of 6 friends owes $141.00 for a rented party tent. They split the amount owed equally, and each friend's share is recorded as a nega  → **−$4.70**
- comparison 1 ← `reg[3]` sa: The price of one share of a company's stock changed by these amounts over 5 days.  +$0.85, −$2.55, −$1.55, −$0.70, −$1.10  What was the mean  → **−$1.01**
- comparison 2 ← `reg[2]` sa: A group of 4 friends owes $136.80 for a rented party tent. They split the amount owed equally, and each friend's share is recorded as a nega  → **−$5.70**

Flags:
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.GR.1.1 — Area of trapezoids, parallelograms, and rhombi  (Unit 4: Area)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): A trapezoid has bases of 7 cm and 5 cm and a vertical height of 4 cm. What is its area, in square centimeters? ¦ A trapezoid has bases of 11 cm and 4 cm and a vertical height of 3 cm. What is its area, in square centimeters ¦ A trapezoid has bases of 10 cm and 6 cm and a vertical height of 9 cm. What is its area, in square centimeters
- `reg[1]` (sa): The parallelogram shown has a base of 7 inches and a vertical height of 3 inches. What is its area, in square  ¦ The parallelogram shown has a base of 7 inches and a vertical height of 11 inches. What is its area, in square ¦ The parallelogram shown has a base of 13 inches and a vertical height of 10 inches. What is its area, in squar
- `reg[2]` (sa): The rhombus shown has a base of 10 meters and a vertical height of 7 meters. What is its area, in square meter ¦ The rhombus shown has a base of 6 meters and a vertical height of 5 meters. What is its area, in square meters ¦ The rhombus shown has a base of 20 meters and a vertical height of 17 meters. What is its area, in square mete
- `reg[3]` (mc): A rhombus has a base of 13 inches and a vertical height of 10 inches. What is its area, in square inches? ¦ A rhombus has a base of 12 inches and a vertical height of 5 inches. What is its area, in square inches? ¦ A rhombus has a base of 9 inches and a vertical height of 6 inches. What is its area, in square inches?
- `reg[4]` (sa): A trapezoid has bases of 13.5 centimeters and 13 centimeters and a vertical height of 6 centimeters. What is i ¦ A rhombus has a base of 9 centimeters and a vertical height of 8.5 centimeters. What is its area, in square ce ¦ A parallelogram has a base of 6.5 centimeters and a vertical height of 5 centimeters. What is its area, in squ
- `hr[0]` (sa): The trapezoid shown has a base of 4 centimeters and a vertical height of 8 centimeters. Its area is equal to t ¦ The trapezoid shown has a base of 17 centimeters and a vertical height of 8 centimeters. Its area is equal to  ¦ The trapezoid shown has a base of 7 centimeters and a vertical height of 8 centimeters. Its area is equal to t
- `hr[1]` (sa): The trapezoid shown has an area of 126 square centimeters and a vertical height of 12 centimeters. The longer  ¦ The trapezoid shown has an area of 84 square centimeters and a vertical height of 12 centimeters. The longer b ¦ The trapezoid shown has an area of 72 square centimeters and a vertical height of 9 centimeters. The longer ba
- `hr[2]` (sa): The parallelogram shown has a vertical height of 3 centimeters. Its area is equal to the area of a trapezoid w ¦ The parallelogram shown has a vertical height of 5 centimeters. Its area is equal to the area of a trapezoid w ¦ The parallelogram shown has a vertical height of 14 centimeters. Its area is equal to the area of a trapezoid 

Items in edition 4.1:
- check 1 ← `reg[1]` sa: The parallelogram shown has a base of 18 inches and a vertical height of 7 inches.  What is its area, in square inches?  → **126 in.²**
- check 2 ← `reg[2]` sa: The rhombus shown has a base of 15 meters and a vertical height of 7 meters.  What is its area, in square meters?  → **105 m²**
- check 3 ← `reg[4]` sa: A trapezoid has bases of 8.5 centimeters and 4.5 centimeters and a vertical height of 5.5 centimeters.  What is its area, in square centimet  → **35.75 cm²**
- check 4 ← `reg[0]` sa: A trapezoid has bases of 14 cm and 11 cm and a vertical height of 7 cm.  What is its area, in square centimeters?  → **87.5 cm²**
- check 5 (rigor) ← `hr[0]` sa: The trapezoid shown has a base of 17 centimeters and a vertical height of 12 centimeters. Its area is equal to the area of a parallelogram w  → **8 cm**
- re-check 1 ← `reg[1]` sa: The parallelogram shown has a base of 17 inches and a vertical height of 9 inches.  What is its area, in square inches?  → **153 in.²**
- re-check 2 ← `reg[3]` mc: A rhombus has a base of 18 inches and a vertical height of 10 inches.  What is its area, in square inches?  → **C. 180 in.²**
- re-check 3 ← `reg[0]` sa: A trapezoid has bases of 14 cm and 8 cm and a vertical height of 9 cm.  What is its area, in square centimeters?  → **99 cm²**
- comparison 1 ← `reg[2]` sa: The rhombus shown has a base of 7 meters and a vertical height of 5 meters.  What is its area, in square meters?  → **35 m²**
- comparison 2 ← `reg[1]` sa: The parallelogram shown has a base of 6 inches and a vertical height of 11 inches.  What is its area, in square inches?  → **66 in.²**

Flags:
- all item —: rhombi all b x h, the ½d1d2 form never appears; every figure labels exactly b and h (no slanted side to ignore); three trapezoids on the check → *one rhombus-by-diagonals item; label a slanted side on one figure per set*

## MA.7.GR.1.2 — Area of polygons and composite figures  (Unit 4: Area)

Regular generators: 6 · Rigor generators: 5

- `reg[0]` (sa): A stained-glass panel is shaped like the figure shown: a trapezoid with bases of 11 in. and 7 in. and a vertic ¦ The front of a tent is shaped like the figure shown: a trapezoid with bases of 10 ft and 8 ft and a vertical h ¦ A birdhouse front is shaped like the figure shown: a trapezoid with bases of 10 in. and 5 in. and a vertical h
- `reg[1]` (mc): A wall mural is shaped like the figure shown: a rectangle 8 ft wide and 3 ft tall, with a parallelogram on top ¦ A sign is shaped like the figure shown: a rectangle 10 ft wide and 5 ft tall, with a parallelogram on top. The ¦ A sign is shaped like the figure shown: a rectangle 17 ft wide and 4 ft tall, with a parallelogram on top. The
- `reg[2]` (sa): A garden is shaped like the figure shown: a rectangle 14 m wide and 10 m tall, with a trapezoid on top. The tr ¦ A wooden sign is shaped like the figure shown: a rectangle 24 in. wide and 20 in. tall, with a trapezoid on to ¦ A wooden sign is shaped like the figure shown: a rectangle 40 in. wide and 12 in. tall, with a trapezoid on to
- `reg[3]` (sa): A hexagonal tabletop is shaped like the hexagon shown. It is made of two congruent trapezoids that share the 4 ¦ A hexagonal garden bed is shaped like the hexagon shown. It is made of two congruent trapezoids that share the ¦ A hexagonal tabletop is shaped like the hexagon shown. It is made of two congruent trapezoids that share the 3
- `reg[4]` (sa): A stage floor is shaped like the figure shown: a 15 ft × 11 ft rectangle with a triangle attached to one end.  ¦ A garden bed is shaped like the figure shown: a 16 ft × 6 ft rectangle with a triangle attached to one end. Th ¦ A banner is shaped like the figure shown: a 13 in. × 8 in. rectangle with a triangle attached to one end. The 
- `reg[5]` (sa): A garden is shaped like the figure shown: a 9 m by 6 m rectangle with a 5 m by 2 m rectangular corner removed. ¦ A garden is shaped like the figure shown: a 15 m by 9 m rectangle with an 8 m by 4 m rectangular corner remove ¦ A garden is shaped like the figure shown: a 16 m by 7 m rectangle with a 5 m by 3 m rectangular notch removed 
- `hr[0]` (sa): The end wall of a garage is shaped like the figure shown: a rectangle 23 ft wide and 8 ft tall, with a triangl ¦ The end wall of a shed is shaped like the figure shown: a rectangle 16 ft wide and 11 ft tall, with a triangle ¦ The end wall of a cabin is shaped like the figure shown: a rectangle 24 ft wide and 10 ft tall, with a triangl
- `hr[1]` (sa): A sign is shaped like the figure shown: a trapezoid on top of a rectangle, with a triangular notch cut from th ¦ A banner is shaped like the figure shown: a trapezoid on top of a rectangle, with a triangular notch cut from  ¦ A patio is shaped like the figure shown: a trapezoid on top of a rectangle, with a triangular notch cut from t
- `hr[2]` (sa): A stage is shaped like the figure shown: a rectangle 29 ft long and 12 ft deep, with a trapezoid-shaped wing o ¦ A stage is shaped like the figure shown: a rectangle 18 ft long and 13 ft deep, with a trapezoid-shaped wing o ¦ A stage is shaped like the figure shown: a rectangle 24 ft long and 16 ft deep, with a trapezoid-shaped wing o
- `hr[3]` (sa): A park is shaped like the figure shown: a rectangle 41 m by 25 m with a parallelogram-shaped section along its ¦ A park is shaped like the figure shown: a rectangle 62 m by 25 m with a parallelogram-shaped section along its ¦ A park is shaped like the figure shown: a rectangle 42 m by 25 m with a parallelogram-shaped section along its
- `hr[4]` (sa): Two garden plots are shown. Plot A is a trapezoid with bases of 15 m and 11 m and a vertical height of 3 m, jo ¦ Two garden plots are shown. Plot A is a trapezoid with bases of 11 m and 6 m and a vertical height of 7 m, joi ¦ Two garden plots are shown. Plot A is a trapezoid with bases of 12 m and 5 m and a vertical height of 6 m, joi

Items in edition 4.1:
- check 1 ← `reg[5]` sa: A garden is shaped like the figure shown: an 11 m by 10 m rectangle with a 3 m by 5 m rectangular corner removed. The dashed lines show the   → **95 m²**
- check 2 ← `reg[0]` sa: The front of a tent is shaped like the figure shown: a trapezoid with bases of 13 ft and 5 ft and a vertical height of 7 ft, with a triangle  → **78 ft²**
- check 3 ← `reg[4]` sa: A tabletop is shaped like the figure shown: an 18 in. × 10 in. rectangle with a triangle attached to one end. The triangle's base is the 10   → **205 in.²**
- check 4 ← `reg[2]` sa: The end wall of a barn is shaped like the figure shown: a rectangle 32 ft wide and 10 ft tall, with a trapezoid on top. The trapezoid's base  → **477.5 ft²**
- check 5 (rigor) ← `hr[4]` sa: Two garden plots are shown. Plot A is a trapezoid with bases of 17 m and 10 m and a vertical height of 3 m, joined along its longer base to   → **Plot A, by 9.5 m². Score: 1 point — the plot and the differe**
- re-check 1 ← `reg[5]` sa: A kitchen floor is shaped like the figure shown: a 12 ft by 11 ft rectangle with a 6 ft by 4 ft rectangular notch removed from the middle of  → **108 ft²**
- re-check 2 ← `reg[0]` sa: A stained-glass panel is shaped like the figure shown: a trapezoid with bases of 10 in. and 8 in. and a vertical height of 6 in., with a tri  → **70 in.²**
- re-check 3 ← `reg[4]` sa: A garden bed is shaped like the figure shown: an 18 ft × 6 ft rectangle with a triangle attached to one end. The triangle's base is the 6 ft  → **117 ft²**
- comparison 1 ← `reg[5]` sa: A kitchen floor is shaped like the figure shown: a 15 ft by 13 ft rectangle with a 5 ft by 6 ft rectangular corner removed. The dashed lines  → **165 ft²**
- comparison 2 ← `reg[3]` sa: A hexagonal tabletop is shaped like the hexagon shown. It is made of two congruent trapezoids that share the 32 in. base drawn as a dashed l  → **850 in.²**

Flags:
- check item 2: [fixed in bank] tent figure drew the triangle at half height, so the outline read as one 13 x 13 triangle (84.5 vs keyed 78) → *generator should draw composite figures with each part's height in proportion so the bend shows*
- check item 5: rigor is two additive composites (regulars done twice); region removed only on regular 1 → *rigor: a lawn minus a bed, then cost per square foot*
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.GR.1.3 — Circumference of a circle  (Unit 4: Area)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): A circle has a radius of 6 meters. What is the circumference of the circle? Write your answer in terms of π. ¦ A circle has a radius of 36 centimeters. What is the circumference of the circle? Write your answer in terms o ¦ A circle has a radius of 31 centimeters. What is the circumference of the circle? Write your answer in terms o
- `reg[1]` (sa): The circumference of a circle is 70π meters. What is the radius of the circle? ¦ The circumference of a circle is 108π inches. What is the radius of the circle? ¦ The circumference of a circle is 40π meters. What is the radius of the circle?
- `reg[2]` (sa): A circular merry-go-round has a radius of 9 feet. What is the circumference of the merry-go-round? Round your  ¦ A circular skating rink has a radius of 36 feet. What is the circumference of the skating rink? Round your ans ¦ A circular pond has a radius of 6 feet. What is the circumference of the pond? Round your answer to the neares
- `reg[3]` (sa): The circumference of a round tabletop is 251.20 inches. What is the diameter of the round tabletop? Round your ¦ The circumference of a circular running track is 157.00 meters. What is the diameter of the circular running t ¦ The circumference of a round pool is 125.60 feet. What is the diameter of the round pool? Round your answer to
- `reg[4]` (sa): A round window has a circumference of 150.72 inches, as shown. What is the radius of the round window? Round y ¦ A round plate has a circumference of 56.55 centimeters, as shown. What is the radius of the round plate? Round ¦ A round pizza pan has a circumference of 43.96 inches, as shown. What is the radius of the round pizza pan? Ro
- `reg[5]` (sa): A student measured the diameter and the circumference of three paper cups, in centimeters. The results are sho ¦ A student measured the diameter and the circumference of three circular lids, in centimeters. The results are  ¦ A student measured the diameter and the circumference of three round clock faces, in centimeters. The results 
- `hr[0]` (sa): A running track is made of two straight sides and two semicircular ends, as shown. Each straight side is 61 me ¦ A running track is made of two straight sides and two semicircular ends, as shown. Each straight side is 71 me ¦ A running track is made of two straight sides and two semicircular ends, as shown. Each straight side is 105 m
- `hr[1]` (sa): A wheelbarrow wheel has a diameter of 14 inches. The wheel rolls in a straight line for 90 feet. How many comp ¦ A wheelbarrow wheel has a diameter of 18 inches. The wheel rolls in a straight line for 120 feet. How many com ¦ A scooter wheel has a diameter of 8 inches. The wheel rolls in a straight line for 200 feet. How many complete
- `hr[2]` (sa): A bicycle wheel makes 40 complete turns while the bicycle rolls 126 feet in a straight line. What is the diame ¦ A bicycle wheel makes 45 complete turns while the bicycle rolls 306 feet in a straight line. What is the diame ¦ A bicycle wheel makes 50 complete turns while the bicycle rolls 209 feet in a straight line. What is the diame

Items in edition 4.1:
- check 1 ← `reg[0]` sa: A circle has a radius of 11 centimeters.  What is the circumference of the circle? Write your answer in terms of π.  → **22π centimeters**
- check 2 ← `reg[3]` sa: The circumference of a round pool is 106.81 feet.  What is the diameter of the round pool? Round your answer to the nearest hundredth. Use t  → **34 feet (34.00 also accepted)**
- check 3 ← `reg[4]` sa: A circular clock face has a circumference of 62.80 centimeters, as shown.  What is the radius of the circular clock face? Round your answer   → **10 centimeters (10.00 also accepted)**
- check 4 ← `reg[2]` sa: A circular tabletop has a radius of 2 feet.  What is the circumference of the tabletop? Round your answer to the nearest hundredth. Use the   → **12.57 feet**
- check 5 (rigor) ← `hr[1]` sa: A scooter wheel has a diameter of 12 inches. The wheel rolls in a straight line for 200 feet.  How many complete turns does the wheel make?   → **63 complete turns**
- re-check 1 ← `reg[4]` sa: A round plate has a circumference of 81.68 centimeters, as shown.  What is the radius of the round plate? Round your answer to the nearest h  → **13 centimeters (13.00 also accepted)**
- re-check 2 ← `reg[5]` sa: A student measured the diameter and the circumference of three paper cups, in centimeters. The results are shown in the table.     Diameter   → **3.14, which is an approximation of π**
- re-check 3 ← `reg[1]` sa: The circumference of a circle is 60π feet.  What is the radius of the circle?  → **30 feet**
- comparison 1 ← `reg[0]` sa: A circle has a radius of 18 inches.  What is the circumference of the circle? Write your answer in terms of π.  → **36π inches**
- comparison 2 ← `reg[4]` sa: A circular clock face has a circumference of 50.24 centimeters, as shown.  What is the radius of the circular clock face? Round your answer   → **8 centimeters (8.00 also accepted)**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.GR.1.4 — Area of a circle  (Unit 4: Area)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): A circular clock face has a radius of 5 inches. What is the area of the circular clock face? Round your answer ¦ A circular trampoline has a diameter of 12 feet. What is the area of the circular trampoline? Round your answe ¦ A circular skating rink has a radius of 22 meters. What is the area of the circular skating rink? Round your a
- `reg[1]` (sa): A circle has a diameter of 16 inches. What is the area of the circle? Write your answer in terms of π. ¦ A circle has a diameter of 24 centimeters. What is the area of the circle? Write your answer in terms of π. ¦ A circle has a diameter of 24 inches. What is the area of the circle? Write your answer in terms of π.
- `reg[2]` (sa): A half circle has a radius of 34 feet. What is the area of the half circle? Write your answer in terms of π. ¦ A circle has a radius of 3 feet. What is the area of one-third of the circle? Write your answer in terms of π. ¦ A quarter circle has a radius of 8 feet. What is the area of the quarter circle? Write your answer in terms of
- `reg[3]` (mc): A circle has a radius of 26 inches. What is the area of the circle, in square inches? ¦ A circle has a radius of 38 inches. What is the area of the circle, in square inches? ¦ A circle has a radius of 36 inches. What is the area of the circle, in square inches?
- `reg[4]` (sa): A 30-inch pizza is cut into 3 equal slices. (The size of a pizza is its diameter.) A student eats 1 slice. How ¦ A 24-inch pizza is cut into 3 equal slices. (The size of a pizza is its diameter.) A student eats 1 slice. How ¦ A 24-inch pizza is cut into 3 equal slices. (The size of a pizza is its diameter.) A student eats 2 slices. Ho
- `hr[0]` (sa): A rug is shaped like the half circle shown. Its flat edge is a diameter of 8 feet. Fringe runs along its curve ¦ A garden bed is shaped like the half circle shown. Its flat edge is a diameter of 12 feet. A brick border runs ¦ A rug is shaped like the half circle shown. Its flat edge is a diameter of 6 feet. Fringe runs along its curve
- `hr[1]` (sa): A pizza's size is its diameter. Mia can buy one 20-inch pizza or two 14-inch pizzas. Which choice has more piz ¦ A pizza's size is its diameter. Mia can buy one 20-inch pizza or two 10-inch pizzas. Which choice has more piz ¦ A pizza's size is its diameter. Rosa can buy one 12-inch pizza or two 8-inch pizzas. Which choice has more piz
- `hr[2]` (mc): A circular fountain has a diameter of 8 feet. A walkway 8 feet wide surrounds the fountain, as shown. What is  ¦ A circular fountain has a diameter of 18 feet. A walkway 5 feet wide surrounds the fountain, as shown. What is ¦ A circular fountain has a diameter of 8 feet. A walkway 4 feet wide surrounds the fountain, as shown. What is 

Items in edition 4.1:
- check 1 ← `reg[1]` sa: A circle has a diameter of 12 meters.  What is the area of the circle? Write your answer in terms of π.  → **36π square meters**
- check 2 ← `reg[0]` sa: A circular garden has a diameter of 14 feet.  What is the area of the circular garden? Round your answer to the nearest hundredth. Use 3.14   → **153.86 square feet**
- check 3 ← `reg[4]` sa: A 24-inch pizza is cut into 9 equal slices. (The size of a pizza is its diameter.) A student eats 5 slices.  How many square inches of pizza  → **80π square inches**
- check 4 ← `reg[0]` sa: A circular skating rink has a radius of 21 meters.  What is the area of the circular skating rink? Round your answer to the nearest hundredt  → **1384.74 square meters**
- check 5 (rigor) ← `hr[2]` mc: A circular fountain has a diameter of 6 feet. A walkway 6 feet wide surrounds the fountain, as shown.  What is the area of the walkway, in s  → **A. 72π**
- re-check 1 ← `reg[1]` sa: A circle has a diameter of 28 inches.  What is the area of the circle? Write your answer in terms of π.  → **196π square inches**
- re-check 2 ← `reg[0]` sa: A round tabletop has a radius of 16 inches.  What is the area of the round tabletop? Round your answer to the nearest hundredth. Use 3.14 fo  → **803.84 square inches**
- re-check 3 ← `reg[4]` sa: A 30-inch pizza is cut into 3 equal slices. (The size of a pizza is its diameter.) A student eats 1 slice.  How many square inches of pizza   → **75π square inches**
- comparison 1 ← `reg[3]` mc: A circle has a radius of 22 feet.  What is the area of the circle, in square feet?  → **B. 484π**
- comparison 2 ← `reg[0]` sa: A circular skating rink has a radius of 27 meters.  What is the area of the circular skating rink? Round your answer to the nearest hundredt  → **2289.06 square meters**

Flags:
- check item 5: rigor (walkway ring) is area only; L4 (circumference and area together, semicircles) never assessed; items 1, 2, 4 bare area → *rigor: semicircle area plus curved edge; one fraction-of-a-circle regular*

## MA.7.DP.1.3 — Predictions from a random sample  (Unit 5: Scaling With Proportional Relationships)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): A store has 2600 shoppers. Based on a random sample of 100 shoppers, it is predicted that about 390 of the 260 ¦ A store has 3000 shoppers. Based on a random sample of 150 shoppers, it is predicted that about 1200 of the 30 ¦ A gym has 1500 members. Based on a random sample of 400 members, it is predicted that about 975 of the 1500 me
- `reg[1]` (mc): In a random sample of 150 households, 30 own a pet. Based on this sample, about how many of the 2000 household ¦ In a random sample of 300 passengers, 75 check a bag. Based on this sample, about how many of the 1000 passeng ¦ In a random sample of 300 households, 60 own a pet. Based on this sample, about how many of the 800 households
- `reg[2]` (sa): A factory checks a random sample of 500 marbles and finds that 100 of them are red. Based on this sample, abou ¦ A factory checks a random sample of 400 marbles and finds that 200 of them are red. Based on this sample, abou ¦ A factory checks a random sample of 500 seeds and finds that 100 of them sprouted. Based on this sample, about
- `reg[3]` (mc): To predict how many of the 900 students in the school want a later start time, Lena asked the 35 members of th ¦ To predict how many of the 1000 students in the school would join an after-school club, Mateo asked the 37 stu ¦ To predict how many of the 3900 residents in the town would use a new bike lane, Omar asked the 38 people at t
- `reg[4]` (sa): A random sample of 250 students at a school were asked which kind of milk they prefer. The results are shown i ¦ A random sample of 100 students at a school were asked which kind of milk they prefer. The results are shown i ¦ A random sample of 200 students at a school were asked which way of getting to school they prefer. The results
- `hr[0]` (sa): A random sample of 280 students at a school were asked which sport they like best. The results are shown in th ¦ A random sample of 120 students at a school were asked which sport they like best. The results are shown in th ¦ A random sample of 160 students at a school were asked which sport they like best. The results are shown in th
- `hr[1]` (sa): To estimate how many bass live in a reservoir, biologists caught 36 bass, tagged them and released them. Later ¦ To estimate how many trout live in a stretch of river, biologists caught 45 trout, tagged them and released th ¦ To estimate how many trout live in a stretch of river, biologists caught 50 trout, tagged them and released th
- `hr[2]` (sa): The mayor wants to predict how many of the 5000 residents in the town would use a new bike lane. Two random sa ¦ The mayor wants to predict how many of the 2200 residents in the town would use a new bike lane. Two random sa ¦ The manager wants to predict how many of the 2600 customers in the store want the store to open earlier. Two r
- `hr[3]` (mc): A school has 1200 students. To predict how many of them want more art classes, Lena asked a random sample of 2 ¦ A school has 2400 students. To predict how many of them want more art classes, Lena asked a random sample of 2 ¦ A school has 1500 students. To predict how many of them want more art classes, Lena asked a random sample of 1

Items in edition 4.1:
- check 1 ← `reg[1]` mc: In a random sample of 100 passengers, 35 check a bag.  Based on this sample, about how many of the 800 passengers in the population check a   → **D. 280**
- check 2 ← `reg[3]` mc: To predict how many of the 4000 residents in the town support building a new park, Priya asked the 24 people at the skate park on Saturday,   → **D. The people at the skate park on Saturday are not a random**
- check 3 ← `reg[0]` sa: A library has 1200 readers. Based on a random sample of 240 readers, it is predicted that about 480 of the 1200 readers borrow e-books.  How  → **96 readers**
- check 4 ← `reg[2]` sa: A factory checks a random sample of 400 marbles and finds that 100 of them are red.  Based on this sample, about how many of 1000 marbles wo  → **about 250**
- check 5 (rigor) ← `hr[2]` sa: The principal wants to predict how many of the 2100 students in the school would buy a school T-shirt. Two random samples of students were s  → **Sample A, about 735 students, because it is the larger rando**
- re-check 1 ← `reg[0]` sa: A school has 1900 students. Based on a random sample of 400 students, it is predicted that about 1140 of the 1900 students ride the bus to s  → **60%**
- re-check 2 ← `reg[4]` sa: A random sample of 250 students at a school were asked which kind of milk they prefer. The results are shown in the table.     Cow's milk  S  → **about 800 students**
- re-check 3 ← `reg[2]` sa: A factory checks a random sample of 400 seeds and finds that 80 of them sprouted.  Based on this sample, about how many of 2500 seeds would   → **about 500**
- comparison 1 ← `reg[3]` mc: To predict how many of the 1200 students in the school would buy a yearbook, Lena asked the 29 members of the drama club, and 22 said yes. S  → **D. The members of the drama club are not a random sample of **
- comparison 2 ← `reg[0]` sa: A town has 3400 voters. Based on a random sample of 400 voters, it is predicted that about 2550 of the 3400 voters support the new park.  Wh  → **75%**

Flags:
- X item 1–2: comparison strip has no forward prediction; the reverse frame is in all three sets → *make X2 a forward prediction*

## MA.7.GR.1.5 — Scale drawings and scale factor  (Unit 5: Scaling With Proportional Relationships)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (sa): A drawing is enlarged by a scale factor of 2.5. A side that measures 10 centimeters in the drawing is scaled u ¦ A drawing is enlarged by a scale factor of 3.5. A side that measures 8 centimeters in the drawing is scaled up ¦ A drawing is enlarged by a scale factor of 2.5. A side that measures 19 centimeters in the drawing is scaled u
- `reg[1]` (sa): A photo is reduced by a scale factor of 1/5. A side that measures 50 inches in the original is scaled down. Wh ¦ A photo is reduced by a scale factor of 1/4. A side that measures 48 inches in the original is scaled down. Wh ¦ A photo is reduced by a scale factor of 1/4. A side that measures 56 inches in the original is scaled down. Wh
- `reg[2]` (sa): A rectangle measures 5 units by 10 units. It is enlarged by a scale factor of 6. What is the area of the enlar ¦ A rectangle measures 7 units by 7 units. It is enlarged by a scale factor of 4. What is the area of the enlarg ¦ A rectangle measures 4 units by 10 units. It is enlarged by a scale factor of 2. What is the area of the enlar
- `reg[3]` (mc): A parallelogram has a perimeter of 60 centimeters. It is enlarged by a scale factor of 6. What is the perimete ¦ A hexagon has a perimeter of 20 centimeters. It is reduced by a scale factor of 1/2. What is the perimeter of  ¦ A triangle has a perimeter of 16 centimeters. It is enlarged by a scale factor of 2. What is the perimeter of 
- `reg[4]` (sa): A map of a park uses the scale 1 inch : 40 feet. On the map, a fence is 2.5 inches long. How long is the actua ¦ A model of a building uses the scale 1 centimeter : 4 meters. On the model, a hallway is 4 centimeters long. H ¦ A floor plan uses the scale 1 inch : 10 feet. The actual kitchen counter is 40 feet long. How long is the kitc
- `reg[5]` (sa): Figure 2 is a scale drawing of Figure 1. A side that measures 9 centimeters in Figure 1 measures 54 centimeter ¦ Figure 2 is a scale drawing of Figure 1. A side that measures 9 centimeters in Figure 1 measures 27 centimeter ¦ Figure 2 is a scale drawing of Figure 1. A side that measures 8 centimeters in Figure 1 measures 40 centimeter
- `hr[0]` (mc): Figure 2 is a scale drawing of Figure 1. A side that measures 36 centimeters in Figure 1 measures 45 centimete ¦ Figure 2 is a scale drawing of Figure 1. A side that measures 8 centimeters in Figure 1 measures 6 centimeters ¦ Figure 2 is a scale drawing of Figure 1. A side that measures 10 centimeters in Figure 1 measures 25 centimete
- `hr[1]` (sa): A scale drawing of a park uses the scale 1 inch = 30 feet. On the drawing, the park has an area of 18 square i ¦ A scale drawing of an apartment uses the scale 1 inch = 12 feet. On the drawing, the apartment has an area of  ¦ A scale drawing of an apartment uses the scale 1 inch = 8 feet. On the drawing, the apartment has an area of 1
- `hr[2]` (sa): A rectangular room measures 35 feet by 30 feet. On a floor plan, the 35-foot wall is drawn 3.5 inches long. Wh ¦ A rectangular room measures 35 feet by 20 feet. On a floor plan, the 35-foot wall is drawn 3.5 inches long. Wh ¦ A rectangular room measures 10 feet by 6 feet. On a floor plan, the 10-foot wall is drawn 2.5 inches long. Wha
- `hr[3]` (sa): On a blueprint, the rectangular front wall of a gymnasium measures 2.5 inches long and 3 inches tall. The actu ¦ On a blueprint, the rectangular front wall of a gymnasium measures 3.5 inches long and 4.5 inches tall. The ac ¦ On a blueprint, the rectangular front wall of a gymnasium measures 1.5 inches long and 4.5 inches tall. The ac

Items in edition 4.1:
- check 1 ← `reg[2]` sa: A rectangle measures 7 units by 10 units. It is enlarged by a scale factor of 2.  What is the area of the enlarged rectangle, in square unit  → **280 square units**
- check 2 ← `reg[1]` sa: A photo is reduced by a scale factor of 1/8. A side that measures 72 inches in the original is scaled down.  What is the length of the corre  → **9 inches**
- check 3 ← `reg[5]` sa: Figure 2 is a scale drawing of Figure 1. A side that measures 2 centimeters in Figure 1 measures 12 centimeters in the corresponding positio  → **6**
- check 4 ← `reg[4]` sa: A model of a building uses the scale 1 centimeter : 5 meters. On the model, a doorway is 1.5 centimeters long.  How long is the actual doorw  → **7.5 meters**
- check 5 (rigor) ← `hr[3]` sa: On a blueprint, the rectangular front wall of a gymnasium measures 4.5 inches long and 5 inches tall. The actual wall is 22.5 feet long.  Wh  → **562.5 square feet**
- re-check 1 ← `reg[0]` sa: A drawing is enlarged by a scale factor of 3.5. A side that measures 4 centimeters in the drawing is scaled up.  What is the length of the c  → **14 centimeters**
- re-check 2 ← `reg[3]` mc: A rhombus has a perimeter of 16 centimeters. It is enlarged by a scale factor of 4.  What is the perimeter of the enlarged rhombus, in centi  → **B. 64**
- re-check 3 ← `reg[5]` sa: Figure 2 is a scale drawing of Figure 1. A side that measures 3 centimeters in Figure 1 measures 12 centimeters in the corresponding positio  → **4**
- comparison 1 ← `reg[3]` mc: A trapezoid has a perimeter of 42 centimeters. It is enlarged by a scale factor of 6.  What is the perimeter of the enlarged trapezoid, in c  → **C. 252**
- comparison 2 ← `reg[0]` sa: A drawing is enlarged by a scale factor of 4. A side that measures 8 centimeters in the drawing is scaled up.  What is the length of the cor  → **32 centimeters**

Flags:
- R/X item R1, X2: one-multiplication items; scale-with-units only on check 4; no item uses area scaling by k² → *add scale-with-units to the regular bank; rigor on k²*
- check/R/X item —: a template appears in all three sets (stock mean, split the bill, letter cards, rectangle-minus-corner, spinner sections, bag-red MC, round object find r, side x scale factor) → *the build's fresh-draw now caps a generator at two of the three sets; generators with one context per template would still repeat contexts*

## MA.7.AR.3.3 — Unit conversions across measurement systems  (Unit 6: Multi-Step Problems With Proportional Relationships)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (sa): 1 inch = 2.54 centimeters. How many centimeters are in 40 inches? ¦ 1 inch = 2.54 centimeters. How many centimeters are in 62 inches? ¦ 1 inch = 2.54 centimeters. How many centimeters are in 32 inches?
- `reg[1]` (sa): 1 kilogram ≈ 2.2 pounds. How many pounds is 18 kilograms? ¦ 1 kilogram ≈ 2.2 pounds. How many pounds is 15 kilograms? ¦ 1 kilogram ≈ 2.2 pounds. How many pounds is 45 kilograms?
- `reg[2]` (sa): 1 hour = 60 minutes, and 1 mile ≈ 1.609 kilometers. A car travels at 52 miles per hour for 195 minutes. How ma ¦ 1 hour = 60 minutes, and 1 mile ≈ 1.609 kilometers. A train travels at 80 kilometers per hour for 135 minutes. ¦ 1 hour = 60 minutes, and 1 mile ≈ 1.609 kilometers. A car travels at 52 miles per hour for 165 minutes. How ma
- `reg[3]` (sa): On one day, 1 U.S. dollar could be exchanged for 0.95 euros. Elif exchanged $80.00 for euros and then spent 22 ¦ On one day, 1 U.S. dollar could be exchanged for 0.8 Swiss francs. Jonah exchanged $150.00 for Swiss francs an ¦ On one day, 1 U.S. dollar could be exchanged for 0.82 euros. A watch is priced at 65.60 euros. Maya has $90.00
- `reg[4]` (sa): 1 gallon ≈ 3.785 liters. A rain barrel holds 121 liters. How many gallons is that? Round to the nearest tenth. ¦ 1 inch = 2.54 centimeters. A poster is 81 centimeters wide. How many inches wide is the poster? Round to the n ¦ 1 inch = 2.54 centimeters. A poster is 183 centimeters wide. How many inches wide is the poster? Round to the 
- `reg[5]` (mc): 1 kilogram ≈ 2.2 pounds. A suitcase weighs 18 pounds. What is its mass in kilograms, to the nearest tenth? ¦ 1 kilogram ≈ 2.2 pounds. A suitcase weighs 57 pounds. What is its mass in kilograms, to the nearest tenth? ¦ 1 kilogram ≈ 2.2 pounds. A suitcase weighs 32 pounds. What is its mass in kilograms, to the nearest tenth?
- `hr[0]` (mc): A market sells almonds for $25.08 per kilogram. 1 kilogram ≈ 2.2 pounds. At that price, what is the cost of 0. ¦ A market sells almonds for $14.96 per kilogram. 1 kilogram ≈ 2.2 pounds. At that price, what is the cost of 1. ¦ A market sells walnuts for $20.68 per kilogram. 1 kilogram ≈ 2.2 pounds. At that price, what is the cost of 5.
- `hr[1]` (sa): Store A sells almonds for $10.51 per pound. Store B sells almonds for $23.76 per kilogram. 1 kilogram ≈ 2.2 po ¦ Store A sells cheddar cheese for $7.32 per pound. Store B sells cheddar cheese for $15.40 per kilogram. 1 kilo ¦ Store A sells almonds for $9.08 per pound. Store B sells almonds for $18.92 per kilogram. 1 kilogram ≈ 2.2 pou
- `hr[2]` (sa): A sprinter moves at 7 meters per second. 1 kilometer = 1000 meters, and 1 mile ≈ 1.609 kilometers. What is the ¦ A cyclist moves at 6.8 meters per second. 1 kilometer = 1000 meters, and 1 mile ≈ 1.609 kilometers. What is th ¦ A skateboarder moves at 5.9 meters per second. 1 kilometer = 1000 meters, and 1 mile ≈ 1.609 kilometers. What 
- `hr[3]` (sa): A gardener needs 66 feet of string lights to go around a patio. The lights are sold only in packs that are 12  ¦ A gardener needs 133 feet of string lights to go around a patio. The lights are sold only in packs that are 12 ¦ A gardener needs 146 feet of string lights to go around a patio. The lights are sold only in packs that are 10

Items in edition 4.1:
- check 1 ← `reg[5]` mc: 1 kilogram ≈ 2.2 pounds.  A suitcase weighs 40 pounds. What is its mass in kilograms, to the nearest tenth?  → **C. 18.2 kilograms**
- check 2 ← `reg[3]` sa: On one day, 1 U.S. dollar could be exchanged for 0.9 Swiss francs.  Maya exchanged $100.00 for Swiss francs and then spent 31.25 Swiss franc  → **58.75 Swiss francs**
- check 3 ← `reg[4]` sa: 1 mile ≈ 1.609 kilometers.  A race course is 36 kilometers long. How many miles is that? Round to the nearest tenth.  → **22.4 miles**
- check 4 ← `reg[2]` sa: 1 hour = 60 minutes, and 1 gallon ≈ 3.785 liters.  A pump moves 20 liters of water each minute. It runs for 3 hours 15 minutes. How many gal  → **1030.4 gallons**
- check 5 (rigor) ← `hr[1]` sa: Store A sells cheddar cheese for $7.29 per pound. Store B sells cheddar cheese for $17.05 per kilogram. 1 kilogram ≈ 2.2 pounds.  Which stor  → **Store A, by $0.46 per pound. Score: 1 point for the store an**
- re-check 1 ← `reg[5]` mc: 1 kilogram ≈ 2.2 pounds.  A suitcase weighs 58 pounds. What is its mass in kilograms, to the nearest tenth?  → **D. 26.4 kilograms**
- re-check 2 ← `reg[3]` sa: On one day, 1 U.S. dollar could be exchanged for 0.88 euros.  Maya exchanged $100.00 for euros and then spent 18.25 euros on a meal. How man  → **69.75 euros**
- re-check 3 ← `reg[4]` sa: 1 gallon ≈ 3.785 liters.  A water heater holds 116 liters. How many gallons is that? Round to the nearest tenth.  → **30.6 gallons**
- comparison 1 ← `reg[5]` mc: 1 kilogram ≈ 2.2 pounds.  A suitcase weighs 28 pounds. What is its mass in kilograms, to the nearest tenth?  → **B. 12.7 kilograms**
- comparison 2 ← `reg[2]` sa: 1 hour = 60 minutes, and 1 mile ≈ 1.609 kilometers.  A car travels at 48 miles per hour for 75 minutes. How many kilometers does it travel?   → **96.5 kilometers (96.6 also accepted if the factor was rounde**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check item 1–5: most regulars divide; L4 "check the result" never asked; suitcase lb -> kg in all three sets (edition 4.1 X2 now multiplies) → *one multiply-direction regular; add "convert back to check"*
- scale item L3: [fixed in scales] AR.4.1 and AR.4.2 L3 promised "equation" (not in either benchmark); AR.3.3 L3 listed time and omitted area → *L3 now says table, graph, or written description; AR.3.3 lists length, area, weight or mass, volume, money*

## MA.7.AR.3.2 — Solve problems involving proportions  (Unit 6: Multi-Step Problems With Proportional Relationships)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): A recipe uses 2/3 cup of oil for every 3 dozen muffins. The amounts are proportional. How much oil is needed f ¦ A recipe uses 1 1/4 cups of oil for every 4 dozen muffins. The amounts are proportional. How much oil is neede ¦ A recipe uses 3/4 cup of oil for every 3 dozen muffins. The amounts are proportional. How much oil is needed f
- `reg[1]` (mc): On a map, 4 cm represents 17 km. How many kilometers does 5 cm represent? ¦ On a map, 4 cm represents 19 km. How many kilometers does 11 cm represent? ¦ On a map, 8 cm represents 12 km. How many kilometers does 13 cm represent?
- `reg[2]` (sa): A market charges $2.40 for every 6 pounds of peaches. How much does the market charge for 11.5 pounds of peach ¦ A market charges $3.60 for every 6 pounds of peaches. How much does the market charge for 10 pounds of peaches ¦ A drip line uses 5.25 gallons of water every 3 hours. How many gallons of water does the drip line use in 10 h
- `reg[3]` (mc): A 5-foot person casts a 10-foot shadow. At the same time a tree casts a 15-foot shadow. How tall is the tree,  ¦ A 5.5-foot person casts a 6-foot shadow. At the same time a tree casts a 21-foot shadow. How tall is the tree, ¦ A 6-foot person casts an 8-foot shadow. At the same time a tree casts a 28-foot shadow. How tall is the tree, 
- `reg[4]` (sa): The table shows what different amounts of ground beef cost at one store. The cost is proportional to the numbe
- `reg[5]` (sa): On a team, the ratio of wins to losses is 30:35. This season the team has 28 losses. Write a proportion that c ¦ In a recipe, the ratio of flour to sugar is 12:8. A baker uses 6 cups of flour. Write a proportion that can be ¦ On a team, the ratio of wins to losses is 18:8. This season the team has 27 wins. Write a proportion that can 
- `hr[0]` (sa): A recipe uses 3 cups of flour for 12 servings. A banquet needs 50 servings. Flour comes in 2-cup bags. How man ¦ A recipe uses 4 cups of flour for 8 servings. A banquet needs 27 servings. Flour comes in 2-cup bags. How many ¦ A recipe uses 4.5 cups of flour for 6 servings. A banquet needs 25 servings. Flour comes in 2-cup bags. How ma
- `hr[1]` (sa): Kendra usually runs 5-kilometer races, and 5 kilometers is about 3.1 miles. Kendra is training for a long trai ¦ Devin usually runs 5-kilometer races, and 5 kilometers is about 3.1 miles. Devin is training for a trail race, ¦ Jamal usually runs 10-kilometer races, and 10 kilometers is about 6.2 miles. Jamal is training for a relay leg
- `hr[2]` (sa): A student writes 10 place cards in 18 minutes, working at a constant rate. The student needs 75 place cards an ¦ A student writes 4 place cards in 18 minutes, working at a constant rate. The student needs 50 place cards and ¦ A student writes 4 place cards in 10 minutes, working at a constant rate. The student needs 42 place cards and

Items in edition 4.1:
- check 1 ← `reg[5]` sa: In a trail mix, the ratio of peanuts to raisins is 28:16. A hiker uses 20 ounces of raisins.  Write a proportion that can be used to find p,  → **28/16 = p/20 (or an equivalent proportion); p = 35. Score: 1**
- check 2 ← `reg[2]` sa: A drip line uses 3.6 gallons of water every 4 hours.  How many gallons of water does the drip line use in 9 hours?  → **8.1 gallons**
- check 3 ← `reg[4]` sa: The table shows what different amounts of ground beef cost at one store. The cost is proportional to the number of pounds.     Pounds of gro  → **$26.64**
- check 4 ← `reg[0]` sa: A recipe uses 1/2 cup of oil for every 2 dozen muffins. The amounts are proportional.  How much oil is needed for 5 dozen muffins? Write you  → **1 1/4 cups**
- check 5 (rigor) ← `hr[1]` sa: Tomás usually runs 10-kilometer races, and 10 kilometers is about 6.2 miles. Tomás is training for a trail race, which is 15 miles. Tomás ru  → **about 24.2 kilometers; about 145 minutes (2 hours 25 minutes**
- re-check 1 ← `reg[3]` mc: A 4.5-foot person casts an 8-foot shadow. At the same time a tree casts a 20-foot shadow.  How tall is the tree, in feet?  → **B. 11.25 ft**
- re-check 2 ← `reg[1]` mc: On a map, 4 cm represents 15 km.  How many kilometers does 10 cm represent?  → **B. 37.50 km**
- re-check 3 ← `reg[2]` sa: A drip line uses 5.25 gallons of water every 3 hours.  How many gallons of water does the drip line use in 10 hours?  → **17.5 gallons**
- comparison 1 ← `reg[0]` sa: A recipe uses 1/3 cup of oil for every 4 dozen muffins. The amounts are proportional.  How much oil is needed for 9 dozen muffins? Write you  → **3/4 cup**
- comparison 2 ← `reg[1]` mc: On a map, 5 cm represents 8 km.  How many kilometers does 6 cm represent?  → **C. 9.60 km**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check item 5: rigor is a cross-system conversion (AR.3.3 content); no item on equivalent ratios (L2) or explaining a setup (L4); R/X use shadow and map-scale MC templates the check does not → *rigor: multi-step proportion with "explain your setup"; R and X from the check's templates*
- key item several: key text writes "= mixed number" inside expressions ("(5/3 = 1 2/3)p + 2") so keyed options no longer match the printed option → *drop the annotation inside expressions*

## MA.7.AR.4.5 — Real-world proportional problems  (Unit 6: Multi-Step Problems With Proportional Relationships)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): A horse-drawn carriage travels at a constant rate. It travels 1/4 mile in 4 minutes. At this rate, how many mi ¦ A horse-drawn carriage travels at a constant rate. It travels 3/4 mile in 6 minutes. At this rate, how many mi ¦ A horse-drawn carriage travels at a constant rate. It travels 2/3 mile in 6 minutes. At this rate, how many mi
- `reg[1]` (sa): A garden hose puts 1/3 gallon of water into a tub every 2/3 minute, at a constant rate. How many gallons of wa ¦ A garden hose puts 3/4 gallon of water into a tub every 1/2 minute, at a constant rate. How many gallons of wa ¦ A 3-D printer uses 2/5 ounce of plastic every 2/3 hour, at a constant rate. How many ounces of plastic does th
- `reg[2]` (sa): A carriage travels at a constant rate. After 5 minutes, it has traveled 1/2 mile. The relationship between min ¦ A carriage travels at a constant rate. After 8 minutes, it has traveled 1/2 mile. The relationship between min ¦ A carriage travels at a constant rate. After 15 minutes, it has traveled 3/4 mile. The relationship between mi
- `reg[3]` (mc): A car uses gas at a constant rate. It travels 187 miles on 5.5 gallons of gas. How many gallons of gas are nee ¦ A car uses gas at a constant rate. It travels 153 miles on 4.5 gallons of gas. How many gallons of gas are nee ¦ A car uses gas at a constant rate. It travels 165 miles on 5.5 gallons of gas. How many gallons of gas are nee
- `reg[4]` (sa): A store sells ribbon at a constant price. 4 1/4 meters of ribbon cost $6.80. At that rate, what is the cost of ¦ A store sells ribbon at a constant price. 3 3/4 meters of ribbon cost $21.00. At that rate, what is the cost o ¦ A store sells ribbon at a constant price. 4 1/4 meters of ribbon cost $11.90. At that rate, what is the cost o
- `hr[0]` (sa): Store A sells 4 pounds of apples for $9.88. Store B sells 6 pounds of the same apples for $13.62. At each stor ¦ Store A sells 4 pounds of pears for $6.92. Store B sells 5 pounds of the same pears for $9.40. At each store,  ¦ Store A sells 4 pounds of bananas for $11.16. Store B sells 6 pounds of the same bananas for $17.82. At each s
- `hr[1]` (sa): Store A sells chain for $3.15 for 1 3/4 feet. Store B sells the same chain for $5.64 for 3 feet. At each store ¦ Store A sells fabric for $5.40 for 2 1/4 yards. Store B sells the same fabric for $13.20 for 6 yards. At each  ¦ Store A sells chain for $6.00 for 1 1/2 feet. Store B sells the same chain for $30.40 for 8 feet. At each stor
- `hr[2]` (sa): A driver is taking a trip of 1550 miles. The car travels 28.8 miles for each gallon of gas, and its gas tank h ¦ A driver is taking a trip of 950 miles. The car travels 19 miles for each gallon of gas, and its gas tank hold ¦ A driver is taking a trip of 1650 miles. The car travels 32.3 miles for each gallon of gas, and its gas tank h

Items in edition 4.1:
- check 1 ← `reg[0]` sa: A horse-drawn carriage travels at a constant rate. It travels 1/2 mile in 10 minutes.  At this rate, how many minutes will it take the carri  → **55 minutes**
- check 2 ← `reg[1]` sa: A 3-D printer uses 3/5 ounce of plastic every 1/3 hour, at a constant rate.  How many ounces of plastic does the printer use in 12 hours? Wr  → **21 3/5 ounces**
- check 3 ← `reg[4]` sa: A store sells ribbon at a constant price. 4 1/4 meters of ribbon cost $15.30.  At that rate, what is the cost of 7 1/2 meters of ribbon?  → **$27.00**
- check 4 ← `reg[2]` sa: A carriage travels at a constant rate. After 5 minutes, it has traveled 1/2 mile. The relationship between minutes and miles is proportional  → **A straight line through (0, 0) and (5, 0.5); the 4-mile ride**
- check 5 (rigor) ← `hr[1]` sa: Store A sells rope for $6.30 for 2 1/4 meters. Store B sells the same rope for $13.75 for 5 meters. At each store, the cost is proportional   → **Store B; its price per meter is lower, $2.75 compared with $**
- re-check 1 ← `reg[2]` sa: A carriage travels at a constant rate. After 12 minutes, it has traveled 3/4 mile. The relationship between minutes and miles is proportiona  → **A straight line through (0, 0) and (12, 0.75); the 2-mile ri**
- re-check 2 ← `reg[0]` sa: A horse-drawn carriage travels at a constant rate. It travels 2/3 mile in 8 minutes.  At this rate, how many minutes will it take the carria  → **24 minutes**
- re-check 3 ← `reg[1]` sa: A hiker walks 1/2 mile every 1/6 hour, at a constant rate.  How many miles does the hiker walk in 3 hours?  → **9 miles**
- comparison 1 ← `reg[3]` mc: A car uses gas at a constant rate. It travels 85 miles on 2.5 gallons of gas.  How many gallons of gas are needed to travel 357 miles?  → **D. 10.5 gallons**
- comparison 2 ← `reg[4]` sa: A store sells ribbon at a constant price. 3 3/4 meters of ribbon cost $9.00.  At that rate, what is the cost of 6 3/4 meters of ribbon?  → **$16.20**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- all item —: carriage context on 4 of 10 items; items 3 and 5 both price per meter → *one carriage item per set*

## MA.7.DP.1.4 — Circle graphs  (Unit 7: Percentage Problems With Proportional Relationships)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): The circle graph shows how 280 students answered a survey. How many students chose Walk? ¦ The circle graph shows how 720 students answered a survey. How many students chose Car? ¦ The circle graph shows how 620 students answered a survey. How many students chose Salad?
- `reg[1]` (sa): The circle graph shows how 360 people answered a survey. How many more people chose Spring than Winter? ¦ The circle graph shows how 760 people answered a survey. How many more people chose Yellow than Red? ¦ The circle graph shows how 340 people answered a survey. How many more people chose Science than Fiction?
- `reg[2]` (sa): A circle graph of survey results has four sections: Cats, Dogs, Birds and Fish. The Cats section is 2/5 of the ¦ A circle graph of survey results has four sections: Cats, Dogs, Birds and Fish. The Cats section is 3/10 of th ¦ A circle graph of survey results has four sections: Basketball, Soccer, Baseball and Tennis. The Basketball se
- `reg[3]` (mc): 740 students were asked which lunch they like best. In a circle graph of the results, the Pasta section has a  ¦ 140 people were asked which sport they like best. In a circle graph of the results, the Swimming section has a ¦ 680 students were asked how they get to school. In a circle graph of the results, the Bus section has a centra
- `reg[4]` (sa): A survey asked 140 students which class is their favorite. The results are shown in the table. Science: 28 | M ¦ A survey asked 220 students how they get to school. The results are shown in the table. Walk: 66 | Bicycle: 66 ¦ A survey asked 280 people which pet they would most like to have. The results are shown in the table. Dogs: 28
- `hr[0]` (sa): Every seventh grader at a school was asked what they like to do after school. The circle graph shows the resul ¦ Every seventh grader at a school was asked which sport they like best. The circle graph shows the results. 22  ¦ Every seventh grader at a school was asked which lunch they like best. The circle graph shows the results. 42 
- `hr[1]` (sa): A survey asked 520 people which pet they would most like to have. The results are shown in the table. Dogs: 15 ¦ A survey asked 120 people which pet they would most like to have. The results are shown in the table. Dogs: 30 ¦ A survey asked 560 students how they get to school. The results are shown in the table. Walk: 56 | Bicycle: 16
- `hr[2]` (sa): A survey asked 120 students which color they like best. The results are shown in the table. Red: 30 | Blue: 12 ¦ A survey asked 120 students which lunch they like best. The results are shown in the table. Pizza: 42 | Tacos: ¦ A survey asked 340 students which sport they like best. The results are shown in the table. Soccer: 68 | Tenni
- `hr[3]` (ms): 540 students were asked which lunch they like best. The circle graph shows the results. Select all the stateme ¦ 640 students were asked which lunch they like best. The circle graph shows the results. Select all the stateme ¦ 420 students were asked how they get to school. The circle graph shows the results. Select all the statements 

Items in edition 4.1:
- check 1 ← `reg[1]` sa: The circle graph shows how 540 people answered a survey.  How many more people chose Fiction than Science?  → **135 more people**
- check 2 ← `reg[4]` sa: A survey asked 320 people which pet they would most like to have. The results are shown in the table.     Dogs  Cats  Fish  Birds    128  11  → **10%**
- check 3 ← `reg[3]` mc: 420 people were asked which color they like best. In a circle graph of the results, the Purple section has a central angle of 54°.  How many  → **C. 63**
- check 4 ← `reg[0]` sa: The circle graph shows how 740 students answered a survey.  How many students chose Bus?  → **185 students**
- check 5 (rigor) ← `hr[3]` ms: 360 students were asked how they get to school. The circle graph shows the results.  Select  all  the statements that the circle graph suppo  → **C. 18 more students chose Car than Walk.; E. 54 of the 360 s**
- re-check 1 ← `reg[4]` sa: A survey asked 220 students how they get to school. The results are shown in the table.     Walk  Bicycle  Car  Bus    44  110  44  22     I  → **36°**
- re-check 2 ← `reg[3]` mc: 240 students were asked which lunch they like best. In a circle graph of the results, the Pizza section has a central angle of 90°.  How man  → **D. 60**
- re-check 3 ← `reg[1]` sa: The circle graph shows how 460 people answered a survey.  How many more people chose Summer than Spring?  → **23 more people**
- comparison 1 ← `reg[2]` sa: A circle graph of survey results has four sections: Cats, Dogs, Birds and Fish. The Cats section is 3/20 of the graph, the Dogs section is 3  → **15%**
- comparison 2 ← `reg[3]` mc: 160 students were asked what they like to do after school. In a circle graph of the results, the Music section has a central angle of 36°.    → **C. 16**

Flags:
- set item —: no item asks students to construct a circle graph (the benchmark verb); rigor uses 360 students so every count equals its angle; items 1 and 4 same template; no check item computes a sector angle though R1 does → *rigor: construct from 3 categories (±5°); keep totals off 360; replace item 4 with data -> central angle*

## MA.7.AR.3.1 — Multi-step real-world percent problems  (Unit 7: Percentage Problems With Proportional Relationships)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (sa): A jacket costs $30.33 and is on sale for 22% off. What is the sale price, to the nearest cent? ¦ A pair of shoes costs $52.93 and is on sale for 12% off. What is the sale price, to the nearest cent? ¦ A video game costs $33.12 and is on sale for 12% off. What is the sale price, to the nearest cent?
- `reg[1]` (sa): A skateboard costs $44.64. The sales tax rate is 7%. What is the total cost, including tax, to the nearest cen ¦ A tent costs $48.99. The sales tax rate is 8.25%. What is the total cost, including tax, to the nearest cent? ¦ A pair of headphones costs $79.27. The sales tax rate is 7.5%. What is the total cost, including tax, to the n
- `reg[2]` (sa): Maya deposits $2400.00 in an account that pays 4.25% simple interest each year. Maya leaves the money in the a ¦ Devon deposits $2400.00 in an account that pays 1.8% simple interest each year. Devon leaves the money in the  ¦ Nora deposits $2400.00 in an account that pays 4.25% simple interest each year. Nora leaves the money in the a
- `reg[3]` (sa): The number of members of a running club changed from 750 to 543. What is the percent decrease? ¦ The number of members of a running club changed from 625 to 565. What is the percent decrease? ¦ The population of a small town changed from 2400 to 2292. What is the percent decrease?
- `reg[4]` (sa): The ratio of fiction books to nonfiction books among the books on a shelf is 3:2. Every book on the shelf is f ¦ The ratio of fiction books to nonfiction books among the books on a shelf is 3:5. Every book on the shelf is f ¦ The ratio of boys to girls among the students in a class is 2:3. Every student in the class is a boy or a girl
- `reg[5]` (sa): A student estimated the number of steps on a trail to be 574. The actual number was 656 steps. What is the per ¦ A student estimated the number of seats in an auditorium to be 399. The actual number was 380 seats. What is t ¦ A student estimated the number of people at a concert to be 840. The actual number was 875 people. What is the
- `hr[0]` (mc): A store takes 36% off the original price of $112.50, then takes another 45% off the reduced price. What is the ¦ A store takes 36% off the original price of $87.50, then takes another 8% off the reduced price. What is the f ¦ A store takes 12% off the original price of $162.50, then takes another 8% off the reduced price. What is the 
- `hr[1]` (sa): A school club has 80 members, and 75% of them are seventh graders. After 30 new members join, 70% of the club' ¦ A school club has 40 members, and 55% of them are seventh graders. After 40 new members join, 70% of the club' ¦ A school club has 20 members, and 75% of them are seventh graders. After 25 new members join, 60% of the club'
- `hr[2]` (sa): A store buys a product for $87.50, marks it up 36%, then puts it on sale for 35% off. What is the sale price? ¦ A store buys a product for $18.75, marks it up 76%, then puts it on sale for 35% off. What is the sale price? ¦ A store buys a product for $81.25, marks it up 76%, then puts it on sale for 15% off. What is the sale price?
- `hr[3]` (sa): A store marked up the price of a backpack by 40% of the price it paid for the backpack. The marked-up price is ¦ A store marked up the price of a jacket by 75% of the price it paid for the jacket. The marked-up price is $66 ¦ A store marked up the price of a pair of boots by 75% of the price it paid for the pair of boots. The marked-u

Items in edition 4.1:
- check 1 ← `reg[0]` sa: A video game costs $76.98 and is on sale for 12% off.  What is the sale price, to the nearest cent?  → **$67.74**
- check 2 ← `reg[2]` sa: Devon deposits $3150.00 in an account that pays 3.5% simple interest each year. Devon leaves the money in the account for 3 years, then with  → **$3480.75**
- check 3 ← `reg[4]` sa: The ratio of dogs to cats among the pets at a shelter is 11:9. Every pet at the shelter is a dog or a cat.  What percent of the pets at the   → **55%; 99 dogs. Score: 1 point for the percent and the count; **
- check 4 ← `reg[3]` sa: The number of visitors to a museum each month changed from 320 to 344.  What is the percent increase?  → **7.5%**
- check 5 (rigor) ← `hr[0]` mc: A store takes 28% off the original price of $162.50, then takes another 32% off the reduced price.  What is the final price?  → **D. $79.56**
- re-check 1 ← `reg[3]` sa: The number of visitors to a museum each month changed from 240 to 162.  What is the percent decrease?  → **32.5%**
- re-check 2 ← `reg[1]` sa: A bike helmet costs $86.46. The sales tax rate is 7%.  What is the total cost, including tax, to the nearest cent?  → **$92.51**
- re-check 3 ← `reg[5]` sa: A student estimated the number of steps on a trail to be 285. The actual number was 304 steps.  What is the percent error of the estimate?  → **6.25%**
- comparison 1 ← `reg[2]` sa: Andre deposits $2400.00 in an account that pays 4.25% simple interest each year. Andre leaves the money in the account for 3 years, then wit  → **$2706.00**
- comparison 2 ← `reg[1]` sa: A tent costs $54.78. The sales tax rate is 7.5%.  What is the total cost, including tax, to the nearest cent?  → **$58.89**

Flags:
- check item 5: rigor is a 4-option MC on two discounts; L4 (percent change or error, explain) not asked; tax and percent error appear on R/X but not the check → *rigor: "$40 up 25% then down 25%: is it $40? Explain"; put percent error on the check*

## MA.7.NSO.1.1 — Laws of exponents (whole-number exponents)  (Unit 8: Evaluating Numeric Expressions)

Regular generators: 6 · Rigor generators: 4

- `reg[0]` (mc): Which expression is equivalent to 10^3 × 10^4? ¦ Which expression is equivalent to 3^4 × 3^2? ¦ Which expression is equivalent to 2^2 × 2^3?
- `reg[1]` (sa): Evaluate the expression. 8^8 ÷ 8^6 ¦ Evaluate the expression. 10^8 ÷ 10^6 ¦ Evaluate the expression. 4^6 ÷ 4^3
- `reg[2]` (sa): Write the expression as a single power. (3^5)^3 ¦ Write the expression as a single power. (5^3)^4 ¦ Write the expression as a single power. (2^5)^3
- `reg[3]` (sa): Evaluate the expression. 4^4 × 4^0 ¦ Evaluate the expression. 2^3 × 2^4 ¦ Evaluate the expression. 2^2 × 2^3
- `reg[4]` (sa): The equation shown is true. (9^4)^n = 9^8 What is the value of n? ¦ The equation shown is true. (4^2)^n = 4^6 What is the value of n? ¦ The equation shown is true. (7^3)^n = 7^6 What is the value of n?
- `reg[5]` (sa): Evaluate the expression. (−10)^5 ÷ (−10)^3 ¦ Evaluate the expression. (−2)^5 ÷ (−2)^2 ¦ Write the expression as a single power. (−10)^8 ÷ (−10)^3
- `hr[0]` (sa): Evaluate the expression. Write your answer as a fraction in simplest form. ((−1/2)^5 × (−1/2)^4) ÷ (−1/2)^7 ¦ Evaluate the expression. Write your answer as a fraction in simplest form. ((1/3)^4 × (1/3)^4) ÷ (1/3)^5 ¦ Evaluate the expression. Write your answer as a fraction in simplest form. ((−3/4)^2 × (−3/4)^6) ÷ (−3/4)^5
- `hr[1]` (sa): Evaluate the expression. Write your answer as a fraction in simplest form. ((−1/3)^3)^3 ÷ (−1/3)^3 ¦ Evaluate the expression. Write your answer as a fraction in simplest form. ((5/2)^3)^2 ÷ (5/2)^3 ¦ Evaluate the expression. Write your answer as a fraction in simplest form. (1/3)^2 × ((1/3)^2)^2
- `hr[2]` (sa): A student wrote (5^2 × 5^4)^2 as a single power. Step 1: (5^6)^2 Step 2: 5^8 In which step did the student mak ¦ A student wrote (3^3)^2 ÷ 3^2 as a single power. Step 1: 3^5 ÷ 3^2 Step 2: 3^3 In which step did the student m ¦ A student wrote ((1/2)^5 × (1/2)^4)^3 as a single power. Step 1: ((1/2)^9)^3 Step 2: (1/2)^12 In which step di
- `hr[3]` (sa): The equation shown is true. ((2/3)^n)^2 ÷ (2/3)^2 = (2/3)^6 What is the value of n? ¦ The equation shown is true. (5^n)^2 ÷ 5^2 = 5^4 What is the value of n? ¦ The equation shown is true. (3^n)^3 × 3^2 = 3^14 What is the value of n?

Items in edition 4.1:
- check 1 ← `reg[3]` sa: Evaluate the expression. Write your answer as a fraction in simplest form.  (−2/3) 3  × (−2/3) 3  → **64/729**
- check 2 ← `reg[0]` mc: Which expression is equivalent to 4 5  × 4 2 ?  → **A. 4 7**
- check 3 ← `reg[5]` sa: Evaluate the expression.  (−10) 6  ÷ (−10) 4  → **100**
- check 4 ← `reg[4]` sa: The equation shown is true.  (6 4 ) n  = 6 16   What is the value of n?  → **4**
- check 5 (rigor) ← `hr[2]` sa: A student wrote ((1/2) 5 ) 3  ÷ (1/2) 4  as a single power.  Step 1: (1/2) 8  ÷ (1/2) 4  Step 2: (1/2) 4   In which step did the student mak  → **Step 1; (1/2) 11 . Score: 1 point for the step and the corre**
- re-check 1 ← `reg[3]` sa: Evaluate the expression.  3 3  × 3 2  → **243**
- re-check 2 ← `reg[2]` sa: Write the expression as a single power.  (9 4 ) 2  → **9 8**
- re-check 3 ← `reg[1]` sa: Evaluate the expression.  10 7  ÷ 10 4  → **1000**
- comparison 1 ← `reg[4]` sa: The equation shown is true.  2 n  ÷ 2 2  = 8  What is the value of n?  → **5**
- comparison 2 ← `reg[1]` sa: Evaluate the expression.  5 7  ÷ 5 3  → **625**

Flags:
- check/X item 3, X1, X2: item 3 "Evaluate (-10)^6 ÷ (-10)^4" can skip the quotient rule; both X items are quotient rule; L4 "explain each step" not asked → *"Write as a single power"; X1 a power rule*

## MA.7.NSO.2.1 — Order of operations with rational numbers  (Unit 8: Evaluating Numeric Expressions)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): Evaluate the expression. Write your answer as a decimal. (2.1 − |2.3 − 5.9|)³ ÷ 0.25 ¦ Evaluate the expression. Write your answer as a decimal. (4.5 − |3.7 − 7.7|)³ ÷ 5 ¦ Evaluate the expression. Write your answer as a decimal. (4.3 − |2.5 − 5.3|)³ ÷ 0.25
- `reg[1]` (sa): Evaluate the expression. [(−1 1/2 − 2)² − 0.75] ÷ 2 ¦ Evaluate the expression. [(−1/2 − 3)² − 1.25] ÷ 0.5 ¦ Evaluate the expression. [(−1/2 − 3)² − 2.75] ÷ 0.5
- `reg[2]` (sa): What is the value of the expression? Write your answer as a fraction in simplest form. [(3 3/4 − 4)² + |5/8 −  ¦ What is the value of the expression? Write your answer as a fraction in simplest form. [(5 3/5 − 6)² + |2/3 −  ¦ What is the value of the expression? Write your answer as a fraction in simplest form. [(4 3/5 − 5)² + |4/5 − 
- `reg[3]` (mc): What is the value of the expression? 2.8 − [0.75 + (1 − 2.5)²] ÷ 0.5 ¦ What is the value of the expression? −0.3 − [1.25 + (0 − 0.5)²] ÷ 2 ¦ What is the value of the expression? 2.9 − [2.5 + (−1 − 1.5)²] ÷ 2
- `reg[4]` (sa): Evaluate the expression. 4 × (|3.64 − 5.02| − 0.3²) ¦ Evaluate the expression. 3 × (|3.89 − 7.23| − 0.6²) ¦ Evaluate the expression. 2 × (|1.91 − 3.41| − 0.3²)
- `reg[5]` (sa): Evaluate the expression. Write your answer as a fraction in simplest form. 9 − 3[(1/2 − 2)² + 1/2 ÷ 3] ¦ Evaluate the expression. 10 − 4[(1/2 − 2)² + 3/4 ÷ 3] ¦ Evaluate the expression. Write your answer as a fraction in simplest form. 12 − 3[(2/3 − 2)² + 1/6 ÷ 3]
- `hr[0]` (sa): A student evaluated the expression −1.7 − (2 − |3 − 7|)² ÷ 2 × 3 as shown. Step 1: −1.7 − (2 − 4)² ÷ 2 × 3 Ste ¦ A student evaluated the expression 2.9 − (5 − |6 − 8|)² ÷ 4 × 2 as shown. Step 1: 2.9 − (5 − 2)² ÷ 4 × 2 Step  ¦ A student evaluated the expression −2.6 − (5 − |7 − 14|)² ÷ 2 × 3 as shown. Step 1: −2.6 − (5 − (−7))² ÷ 2 × 3
- `hr[1]` (mc): Where should one pair of parentheses be placed so that the expression has a value of 3.75? −4.5 + 3 × 5 − 1.5² ¦ Where should one pair of parentheses be placed so that the expression has a value of −38.75? −8.5 + 2 × 5 − 2. ¦ Where should one pair of parentheses be placed so that the expression has a value of −14.25? −7.5 + 3 × 4 − 2.
- `hr[2]` (sa): Evaluate the expression. Write your answer as a fraction in simplest form. [|(2 3/4 − 0.5)² − 1 1/2| − 0.5] ÷  ¦ Evaluate the expression. Write your answer as a fraction in simplest form. [3.5 − |(1 3/4 − 0.5)³ − 2 1/2|] ÷  ¦ Evaluate the expression. Write your answer as a fraction in simplest form. [2.5 − |(3/4 − 1.5)² − 5 1/2|] ÷ 3/

Items in edition 4.1:
- check 1 ← `reg[4]` sa: Evaluate the expression.  4 × (|4.57 − 8.3| − 0.8²)  → **12.36**
- check 2 ← `reg[3]` mc: What is the value of the expression?  7.3 − [0.75 + (−0.5 − 2)²] ÷ 0.5  → **B. −6.70**
- check 3 ← `reg[5]` sa: Evaluate the expression. Write your answer as a fraction in simplest form.  9 − 2[(1 1/2 − 2)² + 1/2 ÷ 6]  → **8 1/3**
- check 4 ← `reg[2]` sa: What is the value of the expression? Write your answer as a fraction in simplest form.  [(2 1/2 − 3)² + |3/8 − 4|] × 3  → **11 5/8**
- check 5 (rigor) ← `hr[1]` mc: Where should one pair of parentheses be placed so that the expression has a value of 147.75?  −8.5 + 3 × 5 − 2.5²  → **C. −8.5 + (3 × 5 − 2.5)²**
- re-check 1 ← `reg[5]` sa: Evaluate the expression. Write your answer as a fraction in simplest form.  6 − 2[(1 1/4 − 2)² + 1/4 ÷ 2]  → **4 5/8**
- re-check 2 ← `reg[3]` mc: What is the value of the expression?  −4.3 − [3.75 + (1.5 − 3)²] ÷ 0.5  → **B. −16.30**
- re-check 3 ← `reg[1]` sa: Evaluate the expression.  [(−2 1/2 − 1)² − 1.75] ÷ 4  → **2 5/8 (or 2.625)**
- comparison 1 ← `reg[0]` sa: Evaluate the expression. Write your answer as a decimal.  (5.7 − |4.6 − 7.8|)³ ÷ 0.5  → **31.25**
- comparison 2 ← `reg[1]` sa: Evaluate the expression.  [(−1 1/2 − 1)² − 1.75] ÷ 2  → **2 1/4 (or 2.25)**

Flags:
- check item 5: L4 error analysis has no item; items 3 and 4 both turn on (n½ - (n+1))² = ¼ → *add an error-analysis generator; vary the inner difference*

## MA.7.AR.1.1 — Simplify linear expressions  (Unit 9: Algebraic Expressions)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): Write the expression using the fewest possible terms. ((4/3)x + 9) − ((8/3)x + 4) ¦ Write the expression using the fewest possible terms. ((7/4)x − 9) − ((1/4)x − 2) ¦ Write the expression using the fewest possible terms. ((5/2)x + 2) − ((3/2)x + 4)
- `reg[1]` (sa): What expression makes the equation true? ((1/6)x − 4) + (____) = (3/4)x + 2 ¦ What expression makes the equation true? ((−1/2)x − 6) − (____) = (−5/4)x + 6 ¦ What expression makes the equation true? ((−1/3)x + 9) + (____) = (3/4)x + 1
- `reg[2]` (mc): Which expression is equivalent to the expression shown? (1.2x + 3) + (0.6x − 3.5) ¦ Which expression is equivalent to the expression shown? (0.8x + 3) + (0.5x − 7) ¦ Which expression is equivalent to the expression shown? (1.2x + 3) + (1.6x − 3.5)
- `reg[3]` (sa): Write the expression using the fewest possible terms. (3 + (2/3)m) + ((3/4)m − 9) ¦ Write the expression using the fewest possible terms. (3 + (1/2)p) + ((3/4)p − 9) ¦ Write the expression using the fewest possible terms. (1 + (2/3)p) + ((11/12)p − 4)
- `reg[4]` (sa): Write the expression using the fewest possible terms. (5x − 7) − (3 − (1/3)x) ¦ Write the expression using the fewest possible terms. (5x − 3) − (8 − (1/3)x) ¦ Write the expression using the fewest possible terms. (9x − 6) − (7 − (1/2)x)
- `reg[5]` (sa): Write the expression using the fewest possible terms. (8x − 5) − (0.02x − 8 + 0.55x) ¦ Write the expression using the fewest possible terms. (7x − 1) − (0.21x − 2 + 0.17x) ¦ Write the expression using the fewest possible terms. (3x − 6) − (0.07x − 4 + 0.49x)
- `hr[0]` (sa): A student simplified the expression as shown. ((5/2)x − 4) − (7 − (7/4)x) Step 1: (5/2)x − 4 − 7 − (7/4)x Step ¦ A student simplified the expression as shown. ((7/2)x − 6) − (5 − (5/6)x) Step 1: (7/2)x − 6 − 5 − (5/6)x Step ¦ A student simplified the expression as shown. ((7/4)x − 5) − (8 − (1/5)x) Step 1: (7/4)x − 5 − 8 + (1/5)x Step
- `hr[1]` (sa): A rectangle has a length of (5x + 1) feet and a width of ((1/2)x − 0.5) feet. Write an expression for the peri ¦ A family buys 3 adult tickets and 5 student tickets for a museum. An adult ticket costs (x + 6) dollars, and a ¦ A family buys 3 adult tickets and 5 student tickets for a play. An adult ticket costs (x + 4) dollars, and a s
- `hr[2]` (sa): Write the expression using the fewest possible terms. (0.75x − 0.75) − (−(1/8)x + 1.25) − ((1/6)x − 0.5) ¦ Write the expression using the fewest possible terms. (0.5x − 0.75) − ((1/3)x + 1.75) − (−(1/4)x − 0.5) ¦ Write the expression using the fewest possible terms. (1.5x − 1.5) − ((7/6)x + 2.75) − ((11/8)x − 0.5)

Items in edition 4.1:
- check 1 ← `reg[3]` sa: Write the expression using the fewest possible terms.  (3 + (5/6)p) + ((5/6)p − 1)  → **(5/3)p + 2**
- check 2 ← `reg[2]` mc: Which expression is equivalent to the expression shown?  (0.4x + 2) + (1.6x − 2.5)  → **A. 2x − 0.5**
- check 3 ← `reg[1]` sa: What expression makes the equation true?  ((2/3)x + 6) − (____) = (−3/8)x − 2  → **(25/24)x + 8**
- check 4 ← `reg[0]` sa: Write the expression using the fewest possible terms.  ((4/3)x − 8) − ((7/3)x + 4)  → **−x − 12**
- check 5 (rigor) ← `hr[1]` sa: A rectangle has a length of ((5/2)x + 0.5) meters and a width of (x − 2) meters.  Write an expression for the perimeter of the rectangle, in  → **2((5/2)x + 0.5) + 2(x − 2) (or ((5/2)x + 0.5) + (x − 2) + ((**
- re-check 1 ← `reg[5]` sa: Write the expression using the fewest possible terms.  (6x − 6) − (0.49x − 5 + 0.58x)  → **4.93x − 1**
- re-check 2 ← `reg[2]` mc: Which expression is equivalent to the expression shown?  (3.2x + 2) + (4.5x − 0.5)  → **D. 7.7x + 1.5**
- re-check 3 ← `reg[1]` sa: What expression makes the equation true?  ((3/2)x + 8) − (____) = (−5/3)x − 1  → **(19/6)x + 9**
- comparison 1 ← `reg[5]` sa: Write the expression using the fewest possible terms.  (2x − 4) − (0.59x − 1 + 0.44x)  → **0.97x − 3**
- comparison 2 ← `reg[1]` sa: What expression makes the equation true?  ((5/3)x − 7) + (____) = (7/4)x − 2  → **(1/12)x + 5**

Flags:
- all item 3, R3, X2: missing-expression template in all three sets → *cap at two sets*
- key item several: key text writes "= mixed number" inside expressions ("(5/3 = 1 2/3)p + 2") so keyed options no longer match the printed option → *drop the annotation inside expressions*

## MA.7.AR.1.2 — Determine if two expressions are equivalent  (Unit 9: Algebraic Expressions)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (ms): Select all the expressions that are equivalent to (5/3)(3x + 15). ¦ Select all the expressions that are equivalent to (5/3)(3x + 12). ¦ Select all the expressions that are equivalent to (1/2)(6x + 10).
- `reg[1]` (mc): Which expression is equivalent to −0.5(6x − 4)? ¦ Which expression is equivalent to 2.5(8x − 2)? ¦ Which expression is equivalent to −1.5(10x − 2)?
- `reg[2]` (etc): A student rewrote (1/2)(2x + 2) as 2x. The correct equivalent expression is ____. ¦ A student rewrote (7/4)(8x + 12) as 35x. The correct equivalent expression is ____. ¦ A student rewrote (1/3)(9x + 6) as 5x. The correct equivalent expression is ____.
- `reg[3]` (mc): Which expression is equivalent to 1.5x + 0.5? ¦ Which expression is equivalent to 3.5x + 1? ¦ Which expression is equivalent to 4x + 8?
- `reg[4]` (mc): Are the two expressions equivalent? 1.5(4x − 2) + 5x + 5 and 11x + 2 ¦ Are the two expressions equivalent? 2.5(4x − 4) + 5x + 6 and 15x − 3 ¦ Are the two expressions equivalent? 2.5(4x − 4) + 5x + 4 and 15x − 7
- `reg[5]` (match): Match each expression to an equivalent expression.
- `hr[0]` (sa): Three expressions are shown. Expression 1: 0.25(8 − 8x) − (2/3)x Expression 2: (2/3)(3 − x) − 2x Expression 3: ¦ Three expressions are shown. Expression 1: 2 − (8/3)x Expression 2: 0.5(4 − 4x) − (2/3)x Expression 3: (2/3)(3 ¦ Three expressions are shown. Expression 1: (2/3)(3 − x) − x Expression 2: 0.25(8 − 4x) − (2/3)x Expression 3: 
- `hr[1]` (match): Match each expression to an equivalent expression.
- `hr[2]` (sa): Two expressions are shown. −(1/2)(6x − 4) + (3/2)x and (3/2)x − (1/2)(6x − 4) Are the two expressions equivale ¦ Two expressions are shown. −(1/2)(2x − 4) − (2/3)x and (10/3)x − (5/4)(4x − 4) Are the two expressions equival ¦ Two expressions are shown. −(2/3)(6x − 6) + (1/2)x and −(5/2)x − (1/4)(4x − 16) Are the two expressions equiva

Items in edition 4.1:
- check 1 ← `reg[0]` ms: Select  all  the expressions that are equivalent to (5/4)(12x + 20).  → **A. (5/4)(12x) + (5/4)(20); C. 15x + 25**
- check 2 ← `reg[5]` match: Match each expression to an equivalent expression.  → **2.5(8x + 6) → 20x + 15; (1/2)(10x − 8) → 5x − 4; (2.5x + 6) **
- check 3 ← `reg[1]` mc: Which expression is equivalent to 1.5(6x − 2)?  → **B. 9x − 3**
- check 4 ← `reg[4]` mc: Are the two expressions equivalent?  2.5(8x − 2) + 4x + 8     and     24x + 3.5  → **D. No, because the first simplifies to 24x + 3, not 24x + 3.**
- check 5 (rigor) ← `hr[2]` sa: Two expressions are shown.  −(3/4)(4x − 4) + (3/2)x     and     (11/2)x − (3/4)(8x − 4)  Are the two expressions equivalent? Write each expr  → **No; the first expression simplifies to −(3/2)x + 3 and the s**
- re-check 1 ← `reg[4]` mc: Are the two expressions equivalent?  1.5(4x − 6) + x + 8     and     7x − 2  → **D. No, because the first simplifies to 7x − 1, not 7x − 2.**
- re-check 2 ← `reg[3]` mc: Which expression is equivalent to 6x + 7.5?  → **A. 1.5(4x + 5)**
- re-check 3 ← `reg[0]` ms: Select  all  the expressions that are equivalent to (3/2)(6x + 2).  → **A. (3/2)(6x) + (3/2)(2); E. 9x + 3**
- comparison 1 ← `reg[3]` mc: Which expression is equivalent to 8x + 6?  → **B. (2/5)(20x + 15)**
- comparison 2 ← `reg[5]` match: Match each expression to an equivalent expression.  → **1.5(2x + 2) → 3x + 3; (1/4)(16x − 8) → 4x − 2; (2.5x + 7) + **

Flags:
- check item —: factoring (named in L4) appears only on R2 and X1, not the check → *replace item 3 with a factoring item*
- key item several: key text writes "= mixed number" inside expressions ("(5/3 = 1 2/3)p + 2") so keyed options no longer match the printed option → *drop the annotation inside expressions*

## MA.7.AR.2.1 — Solve one-step inequalities  (Unit 10: Equations and Inequalities)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): Solve the inequality. Then graph the solution on the number line. k + 0.5 > −4.5 ¦ Solve the inequality. Then graph the solution on the number line. x/(−2) < 0.5 ¦ Solve the inequality. Then graph the solution on the number line. w + 4.5 < 5.5
- `reg[1]` (sa): Solve the inequality. −7.8 ≥ 2.5 − z ¦ Solve the inequality. 4.1 ≥ 7 − k ¦ Solve the inequality. −2.7 + h ≤ 8.1
- `reg[2]` (sa): The product of a number x and −0.5 is greater than 5.5. What are the possible values of x? ¦ The product of a number x and −2.5 is greater than 25. What are the possible values of x? ¦ The product of a number x and −2.5 is less than 25. What are the possible values of x?
- `reg[3]` (mc): Solve the inequality. −0.2t < 1.6 Which number line shows the solution? ¦ Solve the inequality. −0.125n > −0.625 Which number line shows the solution? ¦ Solve the inequality. −1.5d > 9 Which number line shows the solution?
- `reg[4]` (mc): The graph shows the solution of an inequality. Which inequality has this solution?
- `reg[5]` (sa): Solve the inequality. k/(−5) < 0.6 ¦ Solve the inequality. −4.1 > w/(−5) ¦ Solve the inequality. z/(−4) < −3.7
- `hr[0]` (sa): An underwater robot starts at the surface of a lake and is lowered at a steady rate of 2.5 feet per second. Fo ¦ An underwater robot starts at the surface of a lake and is lowered at a steady rate of 3.2 feet per second. Fo ¦ A scuba diver starts at the surface and descends at a steady rate of 6 meters per minute. For safety, the dive
- `hr[1]` (mc): The number line shows the solution of one of the inequalities below. Which inequality has this solution?
- `hr[2]` (sa): A shelf can hold at most 34.25 pounds. Each box placed on the shelf weighs 1.25 pounds. Write and solve an ine ¦ A shelf can hold at most 71.5 pounds. Each box placed on the shelf weighs 2.5 pounds. Write and solve an inequ ¦ A player needs at least 72 points to reach the next level. Each round of a game earns 2.5 points. Write and so

Items in edition 4.1:
- check 1 ← `reg[4]` mc: The graph shows the solution of an inequality.  Which inequality has this solution?  → **D. 2.5x < 20**
- check 2 ← `reg[1]` sa: Solve the inequality.  −3 + t ≥ −6.9  → **t ≥ −3.9**
- check 3 ← `reg[3]` mc: Solve the inequality.  −0.5n > 0.5  Which number line shows the solution?  → **A. Open circle at −1, shaded left**
- check 4 ← `reg[2]` sa: The product of a number x and −0.5 is less than −5.  What are the possible values of x?  → **x > 10**
- check 5 (rigor) ← `hr[1]` mc: The number line shows the solution of one of the inequalities below.  Which inequality has this solution?  → **D. −1.5x < 3**
- re-check 1 ← `reg[2]` sa: The product of a number x and −1.5 is less than −12.  What are the possible values of x?  → **x > 8**
- re-check 2 ← `reg[3]` mc: Solve the inequality.  −1.5c ≤ 4.5  Which number line shows the solution?  → **A. Closed circle at −3, shaded right**
- re-check 3 ← `reg[0]` sa: Solve the inequality. Then graph the solution on the number line.  n/(−4) ≥ 1.25  → **n ≤ −5; graph: closed circle at −5, shaded to the left. Scor**
- comparison 1 ← `reg[2]` sa: The product of a number x and −2.5 is at least −20.  What are the possible values of x?  → **x ≤ 8**
- comparison 2 ← `reg[0]` sa: Solve the inequality. Then graph the solution on the number line.  0.5w ≤ 2.5  → **w ≤ 5; graph: closed circle at 5, shaded to the left. Score:**

Flags:
- check item 5: [fixed in bank] choice C (4.5 - x < 8.5) is two-step with a negated variable → *generator: one-step distractors only*
- all item —: no real-world item in check, R or X; rigor is graph-to-inequality MC (same format as item 1, no harder); "the product of a number x and -k" template in all three sets → *rigor: real-world negative-coefficient write-and-solve; cap the template at two sets*
- check item 1–5: students never draw a graph on the check (R3 and X2 do) → *item 2: solve and graph on a printed number line*

## MA.7.AR.2.2 — Two-step equations with rational numbers  (Unit 10: Equations and Inequalities)

Regular generators: 6 · Rigor generators: 3

- `reg[0]` (sa): Solve the equation for x. −12 = 2x − 14 ¦ Solve the equation for x. −11 = 5x + 9 ¦ Solve the equation for x. 1 = −2x + 5
- `reg[1]` (sa): What is the exact value of t in the equation shown? −3/5 = (4/3)t − 7 ¦ What is the exact value of k in the equation shown? −4 5/12 = (5/6)k − 9 ¦ What is the exact value of k in the equation shown? −5 9/10 = (3/4)k − 8
- `reg[2]` (sa): 5 friends each bought a ticket to a concert for the same price, t dollars, plus a $4.75 service fee on each ti ¦ 6 friends each bought a ticket to a concert for the same price, t dollars, plus a $2.50 service fee on each ti ¦ 6 friends each bought a ticket to a concert for the same price, t dollars, plus a $3.50 service fee on each ti
- `reg[3]` (sa): A park charges a $35.00 entry fee plus $7.50 for each game. A visitor paid $95.00 in all. Write an equation th ¦ A park charges a $8.00 entry fee plus $8.75 for each hour of skate rental. A visitor paid $51.75 in all. Write ¦ A park charges a $20.00 entry fee plus $12.50 for each ride. A visitor paid $107.50 in all. Write an equation 
- `reg[4]` (mc): A number, x, is decreased by 4. That result is then multiplied by 4, giving 8. Which equation represents this  ¦ A number, x, is decreased by 8. That result is then multiplied by 5, giving 5. Which equation represents this  ¦ A number, x, is decreased by 6. That result is then multiplied by 6, giving −12. Which equation represents thi
- `reg[5]` (sa): Solve the equation for k. 2.5(k + 1.6) = 21.5 ¦ Solve the equation for z. 1.5(z + 1.9) = 13.35 ¦ Solve the equation for w. 2.5(w + 3) = 20
- `hr[0]` (sa): At noon the temperature was 8.8°F. The temperature changed by the same amount each hour. After 3.5 hours, the  ¦ At noon the temperature was 15.3°F. The temperature changed by the same amount each hour. After 6 hours, the t ¦ A scuba diver is at an elevation of −5.7 meters. The diver's elevation changes by the same amount each minute,
- `hr[1]` (sa): A student solved the equation shown, but made an error. −2.4(x − 3.4) = 11.52 Step 1: x − 3.4 = −4.8 Step 2: x ¦ A student solved the equation shown, but made an error. −0.6(x − 3.3) = 0.9 Step 1: −0.6x − 3.3 = 0.9 Step 2:  ¦ A student solved the equation shown, but made an error. −2.4(x + 0.6) = −8.16 Step 1: −2.4x − 1.44 = −8.16 Ste
- `hr[2]` (sa): An electrician charges $56.00 for each hour, and bills the travel to the job as half an hour at the same rate. ¦ Gym A charges $17.50 each month. Priya used a coupon worth $35.00 off the total and paid Gym A $140.00 in all. ¦ An electrician charges $80.00 for each hour, and bills the travel to the job as half an hour at the same rate.

Items in edition 4.1:
- check 1 ← `reg[3]` sa: A park charges a $25.00 entry fee plus $12.50 for each hour of skate rental. A visitor paid $62.50 in all.  Write an equation that can be us  → **12.5h + 25 = 62.5; h = 3. Score: 1 point for the equation (o**
- check 2 ← `reg[5]` sa: Solve the equation for h.  1.5(h + 1.6) = −0.6  → **h = −2**
- check 3 ← `reg[2]` sa: 3 students each saved the same amount, s dollars, and then each earned $5.00 more. Together they now have $105.00.  Write an equation that c  → **3(s + 5) = 105 (or an equivalent equation); s = 30. Score: 1**
- check 4 ← `reg[1]` sa: What is the exact value of g in the equation shown?  −1 7/9 = (2/3)g − 4  → **g = 3 1/3**
- check 5 (rigor) ← `hr[2]` sa: Gym A charges $24.50 each month. Jordan used a coupon worth $35.00 off the total and paid Gym A $185.50 in all.  Write and solve an equation  → **24.5n − 35 = 185.5; n = 9; Gym A, by $53.00. Score: 1 point **
- re-check 1 ← `reg[0]` sa: Solve the equation for x.  40 = −4x + 4  → **x = −9**
- re-check 2 ← `reg[2]` sa: 6 identical boxes each weigh b pounds with the packaging. After 1.25 pounds of packaging is removed from each box, the 6 boxes weigh 40.5 po  → **6(b − 1.25) = 40.5 (or an equivalent equation); b = 8. Score**
- re-check 3 ← `reg[4]` mc: A number, x, is decreased by 8. That result is then multiplied by 3, giving 3.  Which equation represents this situation?  → **A. 3(x − 8) = 3**
- comparison 1 ← `reg[3]` sa: A park charges a $18.00 entry fee plus $3.75 for each game. A visitor paid $44.25 in all.  Write an equation that can be used to find g, the  → **3.75g + 18 = 44.25; g = 7. Score: 1 point for the equation (**
- comparison 2 ← `reg[1]` sa: What is the exact value of t in the equation shown?  −5 8/9 = (4/3)t − 9  → **t = 2 1/3**

Flags:
- check/R/X item 3, R2, X1: sentences start with numerals; "a $18.00" → *"Three students"; "an $18.00"*

## MA.7.AR.4.3 — Graph proportional relationships  (Unit 11: Representing Proportional Relationships)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): The equation y = 12x represents a proportional relationship. Graph the relationship on the grid for x-values f ¦ The equation y = 10x represents a proportional relationship. Graph the relationship on the grid for x-values f ¦ A proportional relationship is given by the equation y = 22x. Graph the relationship on the grid for x-values 
- `reg[1]` (sa): The table shows a proportional relationship between x and y. x: 2, 5, 6 | y: 36, 90, 108 Graph the relationshi ¦ The table shows a proportional relationship between x and y. x: 1, 3, 4 | y: 4, 12, 16 Graph the relationship  ¦ The table shows a proportional relationship between x and y. x: 2, 4, 5 | y: 30, 60, 75 Graph the relationship
- `reg[2]` (sa): The relationship between pounds of apples (x) and cost ($) (y) is proportional, with a constant of proportiona ¦ The relationship between minutes (x) and pages printed (y) is proportional, with a constant of proportionality ¦ The relationship between tickets (x) and cost ($) (y) is proportional, with a constant of proportionality of 5
- `reg[3]` (mc): A proportional relationship between x and y has a constant of proportionality of 3. Which graph represents thi ¦ Which graph shows the proportional relationship between x and y with a constant of proportionality of 3/2? ¦ A proportional relationship between x and y has a constant of proportionality of 2. Which graph represents thi
- `reg[4]` (mc): The table shows a proportional relationship between x and y. x: 2, 4, 6 | y: 3, 6, 9 Which graph represents th ¦ The table shows a proportional relationship between x and y. x: 1, 2, 3 | y: 4, 8, 12 Which graph represents t ¦ The table shows a proportional relationship between x and y. x: 2, 3, 4 | y: 4, 6, 8 Which graph represents th
- `hr[0]` (sa): The relationship between minutes (x) and gallons pumped (y) is proportional. minutes: 2, 4, 6 | gallons pumped ¦ The relationship between minutes (x) and gallons pumped (y) is proportional. minutes: 4, 8, 16 | gallons pumpe ¦ The relationship between days (x) and inches grown (y) is proportional. days: 7, 14, 21 | inches grown: 2, 4, 
- `hr[1]` (sa): The constant of proportionality for a proportional relationship between x and y is 3/8. Graph the relationship ¦ A proportional relationship between x and y has a constant of proportionality of 2/5. Graph the relationship o ¦ A proportional relationship between x and y has a constant of proportionality of 4/5. Graph the relationship o
- `hr[2]` (sa): The table shows a proportional relationship between x and y. x: 7, 14, 21 | y: 9, 18, 27 A student graphed the ¦ The table shows a proportional relationship between x and y. x: 9, 18, 27 | y: 11, 22, 33 A student graphed th ¦ The table shows a proportional relationship between x and y. x: 7, 14, 21 | y: 12, 24, 36 A student graphed th

Items in edition 4.1:
- check 1 ← `reg[3]` mc: A proportional relationship between x and y has a constant of proportionality of 1/3.  Which graph represents this relationship?  → **Graph B**
- check 2 ← `reg[1]` sa: The table shows a proportional relationship between x and y.     x  y    4  20    5  25    6  30     Graph the relationship on the grid.  → **The points (4, 20), (5, 25), (6, 30) and a straight line thr**
- check 3 ← `reg[2]` sa: The relationship between hours (x) and miles biked (y) is proportional, with a constant of proportionality of 12.  Graph the relationship on  → **A straight line from the origin to (6, 72), through (1, 12),**
- check 4 ← `reg[0]` sa: A proportional relationship is given by the equation y = 14x.  Graph the relationship on the grid for x-values from 0 to 10.  → **A straight line from (0, 0) to (10, 140), through points suc**
- check 5 (rigor) ← `hr[1]` sa: The constant of proportionality for a proportional relationship between x and y is 8/5.  Graph the relationship on the grid for x-values fro  → **A straight line through the origin and (5, 8), (10, 16), (15**
- re-check 1 ← `reg[1]` sa: The table shows a proportional relationship between x and y.     x  y    2  32    4  64    5  80     Graph the relationship on the grid.  → **The points (2, 32), (4, 64), (5, 80) and a straight line thr**
- re-check 2 ← `reg[2]` sa: The relationship between boxes (x) and books packed (y) is proportional, with a constant of proportionality of 15.  Graph the relationship o  → **A straight line from the origin to (6, 90), through (1, 15),**
- re-check 3 ← `reg[0]` sa: A proportional relationship is given by the equation y = 23x.  Graph the relationship on the grid for x-values from 0 to 6.  → **A straight line from (0, 0) to (6, 138), through points such**
- comparison 1 ← `reg[4]` mc: The table shows a proportional relationship between x and y.     x  y    3  1    9  3    12  4     Which graph represents this relationship?  → **Graph C**
- comparison 2 ← `reg[3]` mc: A proportional relationship between x and y has a constant of proportionality of 2.  Which graph represents this relationship?  → **Graph A**

Flags:
- comparison item 1, 2: both X items are MC graph-picks while the check requires plotting: the comparison benchmark gets the easier format (biases the DPP comparison toward smaller net gain) → *make X1 a plot-from-table item*
- check item 1, 5: k = 1/3 on check 1 and X1; L3 "(1, r)" and L4 "find k from a graph" not measured; rigor asks if (40, 64) is on a line graphed only to 25 → *label (1, r) in item 3; "if the line were extended"*

## MA.7.AR.4.2 — Constant of proportionality  (Unit 11: Representing Proportional Relationships)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): The table shows a proportional relationship between x and y. x: 5, 6, 8, 9 | y: 25, 30, 40, 45 What is the con ¦ The table shows a proportional relationship between x and y. x: 18, 27, 36, 45 | y: 34, 51, 68, 85 What is the ¦ The table shows a proportional relationship between x and y. x: 10, 30, 50, 60 | y: 17, 51, 85, 102 What is th
- `reg[1]` (sa): The graph shows a proportional relationship between x and y. What is the constant of proportionality? Write yo
- `reg[2]` (sa): The graph shows the proportional relationship between pounds of apples and cost (dollars). What is the constan ¦ The graph shows the proportional relationship between minutes and gallons of water. What is the constant of pr ¦ The graph shows the proportional relationship between batches and cups of flour. What is the constant of propo
- `reg[3]` (mc): In a proportional relationship, 19.2 liters of paint are needed to cover 12 walls. What is the constant of pro ¦ In a proportional relationship, 16.2 inches of snow fall in 12 hours. What is the constant of proportionality, ¦ In a proportional relationship, 20.7 liters of paint are needed to cover 9 walls. What is the constant of prop
- `reg[4]` (sa): The daily fee for docking a boat at a marina is proportional to the length of the boat. The table shows the fe
- `hr[0]` (sa): The table shows the amount of gas a car uses to travel different distances. The relationship is proportional. 
- `hr[1]` (sa): Each batch of lemonade is made with 3 cups of lemonade mix and 24 cups of water. The relationship between cups ¦ Each pitcher of iced tea is made with 3 tea bags and 24 cups of water. The relationship between tea bags and c ¦ Each pitcher of iced tea is made with 3 tea bags and 18 cups of water. The relationship between tea bags and c
- `hr[2]` (sa): Two pumps each fill a tank at a constant rate. For each pump, the relationship between minutes and gallons pum

Items in edition 4.1:
- check 1 ← `reg[3]` mc: In a proportional relationship, 64.05 cups of water are used in 7 minutes.  What is the constant of proportionality, in cups of water per mi  → **A. 9.15**
- check 2 ← `reg[4]` sa: The daily fee for docking a boat at a marina is proportional to the length of the boat. The table shows the fee for four different boat leng  → **3.1**
- check 3 ← `reg[2]` sa: The graph shows the proportional relationship between minutes and pages printed.  What is the constant of proportionality, in pages per minu  → **1.8 pages per minute**
- check 4 ← `reg[1]` sa: The graph shows a proportional relationship between x and y.  What is the constant of proportionality? Write your answer as a fraction in si  → **2/5**
- check 5 (rigor) ← `hr[1]` sa: Each batch of paint is made with 2 cups of blue paint and 12 cups of white paint. The relationship between cups of blue paint and cups of wh  → **k = 1/6; each cup of white paint is used with 1/6 cup of blu**
- re-check 1 ← `reg[2]` sa: The graph shows the proportional relationship between batches and cups of flour.  What is the constant of proportionality, in cups of flour   → **0.9 cups of flour per batch**
- re-check 2 ← `reg[4]` sa: The daily fee for docking a boat at a marina is proportional to the length of the boat. The table shows the fee for four different boat leng  → **3.95**
- re-check 3 ← `reg[3]` mc: In a proportional relationship, 12.6 liters of paint are needed to cover 4 walls.  What is the constant of proportionality, in liters of pai  → **D. 3.15**
- comparison 1 ← `reg[1]` sa: The graph shows a proportional relationship between x and y.  What is the constant of proportionality? Write your answer as a fraction in si  → **9/7**
- comparison 2 ← `reg[0]` sa: The table shows a proportional relationship between x and y.     x  y    11  8    22  16    55  40    66  48     What is the constant of pro  → **8/11**

Flags:
- scale item L3: [fixed in scales] AR.4.1 and AR.4.2 L3 promised "equation" (not in either benchmark); AR.3.3 L3 listed time and omitted area → *L3 now says table, graph, or written description; AR.3.3 lists length, area, weight or mass, volume, money*

## MA.7.AR.4.1 — Is it proportional? (table, graph, description)  (Unit 11: Representing Proportional Relationships)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (mc): Does the table show a proportional relationship between x and y? x: 1, 2, 3, 4 | y: 8, 16, 29, 32 ¦ Does the table show a proportional relationship between x and y? x: 2, 3, 4, 5 | y: 6, 9, 14, 15 ¦ Does the table show a proportional relationship between x and y? x: 1, 2, 3, 4 | y: 5, 10, 20, 20
- `reg[1]` (mc): A shop charges 5 dollars plus 8 dollars for each hour of rental. Is the relationship between the hours of rent ¦ A machine takes 4 minutes for each box packed. Is the relationship between the boxes packed and the total minu ¦ A shop charges 12 dollars for each hour of rental. Is the relationship between the hours of rental and the tot
- `reg[2]` (mc): Does the graph show a proportional relationship between x and y?
- `reg[3]` (ms): Select all the situations that describe a proportional relationship.
- `reg[4]` (sa): The table does not show a proportional relationship. x: 1, 2, 4, 5 | y: 6, 12, 24, 33 Which value of y would h ¦ The table does not show a proportional relationship. x: 3, 6, 9, 12 | y: 12, 27, 36, 48 Which value of y would ¦ The table does not show a proportional relationship. x: 1, 2, 4, 5 | y: 3, 6, 14, 15 Which value of y would ha
- `hr[0]` (mc): Jordan kept a record of three training runs. Distance (miles): 5, 10, 15 | Time: 40 minutes, 1 hour 20 minutes ¦ Angela kept a record of three training runs. Distance (miles): 5, 7, 11 | Time: 1 hour, 1 hour 24 minutes, 2 h ¦ Owen kept a record of three training runs. Distance (miles): 5, 8, 16 | Time: 40 minutes, 1 hour 4 minutes, 2 
- `hr[1]` (sa): The table shows values of x and y. x: 2.5, 4, 6, 7.5 | y: 4.5, 7.2, 11.2, 13.5 Eli says the relationship canno ¦ The table shows values of x and y. x: 0.5, 3, 6, 7.5 | y: 1.8, 10.8, 21.6, 27 Marcus says the relationship can ¦ The table shows values of x and y. x: 1.5, 2, 2.5, 6 | y: 3.75, 5, 6.05, 15 Caleb says the relationship cannot
- `hr[2]` (mc): Relationship A: the table shows ticket costs at Theater A for different numbers of tickets. Number of tickets:

Items in edition 4.1:
- check 1 ← `reg[3]` ms: Select  all  the situations that describe a proportional relationship.  → **A. A printer prints 30 pages every minute.; E. A store sells**
- check 2 ← `reg[0]` mc: Does the table show a proportional relationship between x and y?     x  y    1  5    2  10    4  23    5  25  → **C. No, because y ÷ x is not the same for every pair of value**
- check 3 ← `reg[2]` mc: Does the graph show a proportional relationship between x and y?  → **A. Yes, because the line is straight and passes through the **
- check 4 ← `reg[1]` mc: A machine takes 15 minutes plus 10 minutes for each box packed.  Is the relationship between the boxes packed and the total minutes proporti  → **C. No, because there is a setup time of 15 minutes before th**
- check 5 (rigor) ← `hr[1]` sa: The table shows values of x and y.     x  y    1.5  1.8    2  2.4    2.5  3    5  6     Noor says the relationship cannot be proportional be  → **Noor's reason is not correct; the relationship is proportion**
- re-check 1 ← `reg[3]` ms: Select  all  the situations that describe a proportional relationship.  → **B. A store sells grapes at $1.85 per pound.; C. A recipe use**
- re-check 2 ← `reg[0]` mc: Does the table show a proportional relationship between x and y?     x  y    1  3    3  9    4  12    5  15  → **D. Yes, because y ÷ x is the same for every pair of values.**
- re-check 3 ← `reg[1]` mc: A stand charges 15 dollars plus 12 dollars for each pound of apples.  Is the relationship between the pounds of apples and the total dollars  → **C. No, because there is a charge of 15 dollars before the fi**
- comparison 1 ← `reg[3]` ms: Select  all  the situations that describe a proportional relationship.  → **A. An empty tank fills with 4 liters of water each minute.; **
- comparison 2 ← `reg[4]` sa: The table does  not  show a proportional relationship.     x  y    2  22    4  44    6  66    8  86     Which value of y would have to chang  → **86**

Flags:
- check/R/X item 1, R1, X1: [fixed in bank] "burns down 1 inch each hour" / "grows 1 inch each week" are proportional if read as amount burned/grown; key assumes height → *name the pair in every option ("its height compared with the hours burned")*
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check item 5: L4 (explain why NOT proportional, two representations) not reached; rigor table is proportional → *non-proportional table, two reasons*
- scale item L3: [fixed in scales] AR.4.1 and AR.4.2 L3 promised "equation" (not in either benchmark); AR.3.3 L3 listed time and omitted area → *L3 now says table, graph, or written description; AR.3.3 lists length, area, weight or mass, volume, money*

## MA.7.AR.4.4 — Translate between representations  (Unit 11: Representing Proportional Relationships)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): The table shows a proportional relationship between x and y. x: 3, 5, 7 | y: 24, 40, 56 Write an equation for  ¦ The table shows a proportional relationship between x and y. x: 2, 3, 4 | y: 16, 24, 32 Write an equation for  ¦ The table shows a proportional relationship between x and y. x: 3, 5, 7 | y: 9, 15, 21 Write an equation for t
- `reg[1]` (mc): A hiker walks 3.5 miles each hour. The relationship is proportional. Let x be the number of hours and let y be ¦ Apples cost $2.50 per pound. The relationship is proportional. Let x be the number of pounds of apples and let ¦ A hiker walks 4.5 miles each hour. The relationship is proportional. Let x be the number of hours and let y be
- `reg[2]` (sa): The graph shows a proportional relationship between batches made (x) and cups of flour used (y). Write an equa ¦ The graph shows a proportional relationship between minutes (x) and gallons of water used (y). Write an equati ¦ The graph shows a proportional relationship between minutes (x) and pages read (y). Write an equation for this
- `reg[3]` (mc): A printer prints at a constant rate. The proportional relationship is represented by y = 18x, where x is the n ¦ Grapes are sold by the pound. The proportional relationship is represented by y = 4x, where x is the number of ¦ A runner runs at a constant speed. The proportional relationship is represented by y = 8x, where x is the numb
- `reg[4]` (sa): A machine produces 2.5 labels each second that it runs, on average. The relationship between the number of sec ¦ A machine packs 3.5 boxes each minute that it runs, on average. The relationship between the number of minutes ¦ A machine fills 4.5 bottles each minute that it runs, on average. The relationship between the number of minut
- `hr[0]` (sa): The table shows a proportional relationship between x and y. x: 2.5, 4.5, 5, 12 | y: 2, 3.6, 4, 9.6 Write an e ¦ The table shows a proportional relationship between x and y. x: 1.5, 3, 5, 7.5 | y: 3.6, 7.2, 12, 18 Write an  ¦ The table shows a proportional relationship between x and y. x: 1.5, 4.5, 6, 7.5 | y: 3.75, 11.25, 15, 18.75 W
- `hr[1]` (sa): Sam earns $76.00 for 8 hours of work. The relationship between the number of hours worked, h, and the money ea ¦ Sam earns $47.50 for 5 hours of work. The relationship between the number of hours worked, h, and the money ea ¦ Sam earns $51.25 for 5 hours of work. The relationship between the number of hours worked, h, and the money ea
- `hr[2]` (mc): Luis earns $13 per hour mowing lawns. The relationship between the money earned, e, and the hours worked, h, i ¦ Diego earns $19 per hour babysitting. The relationship between the money earned, e, and the hours worked, h, i ¦ Hana earns $15 per hour babysitting. The relationship between the money earned, e, and the hours worked, h, is

Items in edition 4.1:
- check 1 ← `reg[2]` sa: The graph shows a proportional relationship between batches made (x) and cups of flour used (y).  Write an equation for this relationship.  → **y = 1.25x**
- check 2 ← `reg[1]` mc: A recipe uses 5/4 cup of sugar for each batch of muffins. The relationship is proportional. Let x be the number of batches and let y be the   → **A. y = (5/4)x**
- check 3 ← `reg[0]` sa: The table shows a proportional relationship between x and y.     x  y    2  6    5  15    7  21     Write an equation for this relationship.  → **y = 3x**
- check 4 ← `reg[4]` sa: A machine fills 4.5 bottles each minute that it runs, on average. The relationship between the number of minutes and the number of bottles i  → **27, 36, 45. Score: 1 point for all three values; two values **
- check 5 (rigor) ← `hr[2]` mc: Diego earns $11 per hour walking dogs. The relationship between the money earned, e, and the hours worked, h, is proportional.  Which equati  → **D. h = (1/11)e**
- re-check 1 ← `reg[2]` sa: The graph shows a proportional relationship between hours (x) and miles walked (y).  Write an equation for this relationship.  → **y = 3.75x**
- re-check 2 ← `reg[3]` mc: A printer prints at a constant rate. The proportional relationship is represented by y = 18x, where x is the number of minutes of printing a  → **A. The printer prints 18 pages each minute.**
- re-check 3 ← `reg[1]` mc: A gardener uses 1/2 bag of soil for each planter. The relationship is proportional. Let x be the number of planters and let y be the number   → **C. y = (1/2)x**
- comparison 1 ← `reg[2]` sa: The graph shows a proportional relationship between minutes (x) and pages read (y).  Write an equation for this relationship.  → **y = 2.5x**
- comparison 2 ← `reg[1]` mc: A recipe uses 3/2 cup of sugar for each batch of muffins. The relationship is proportional. Let x be the number of batches and let y be the   → **A. y = (3/2)x**

Flags:
- check item 5: rigor MC between h = 11e and h = (1/11)e is a coin flip; no item produces a written description → *constructed rigor: write h, say what 1/11 means, compute*
- check/X item 2, X2: stems say "5/4 cup"; key prints "y = (5/4 = 1 1/4)x" → *"1 1/4 cups"; key "y = (5/4)x"*

## MA.7.GR.2.1 — Surface area of a cylinder from its net  (Unit 12: Surface Area and Volume)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): The net of a right circular cylinder is shown. Each circle has a diameter of 12 centimeters, and the rectangle ¦ The net of a right circular cylinder is shown. Each circle has a diameter of 18 centimeters, and the rectangle ¦ The net of a right circular cylinder is shown. Each circle has a diameter of 8 centimeters, and the rectangle 
- `reg[1]` (sa): The net of a right circular cylinder is shown. The circles have a radius of 4 inches and the rectangle is 8 in ¦ The net of a right circular cylinder is shown. The circles have a radius of 9 inches and the rectangle is 20 i ¦ The net of a right circular cylinder is shown. The circles have a radius of 3 inches and the rectangle is 17 i
- `reg[2]` (sa): The net of a right circular cylinder is shown. The radius is 3 centimeters and the height is 12 centimeters. W ¦ The net of a right circular cylinder is shown. The radius is 4 centimeters and the height is 8 centimeters. Wh ¦ The net of a right circular cylinder is shown. The radius is 5 centimeters and the height is 22 centimeters. W
- `reg[3]` (mc): The right circular cylinder shown has a radius of 5 centimeters and a height of 14 centimeters. Which net, wit ¦ The right circular cylinder shown has a radius of 6 centimeters and a height of 3 centimeters. Which net, with ¦ The right circular cylinder shown has a radius of 4 centimeters and a height of 3 centimeters. Which net, with
- `reg[4]` (sa): The right circular cylinder shown has a radius of 7 centimeters and a height of 20 centimeters. The net of thi ¦ The right circular cylinder shown has a radius of 8 centimeters and a height of 24 centimeters. The net of thi ¦ The right circular cylinder shown has a radius of 6 centimeters and a height of 16 centimeters. The net of thi
- `hr[0]` (sa): The net of a right circular cylinder is shown. The rectangle is 30π centimeters long and 6 centimeters tall. W ¦ The net of a right circular cylinder is shown. The rectangle is 20π centimeters long and 15 centimeters tall.  ¦ The net of a right circular cylinder is shown. The rectangle is 32π centimeters long and 10 centimeters tall. 
- `hr[1]` (sa): The right circular cylinder shown has a radius of 10 centimeters and a height of 5 centimeters. Maya drew its  ¦ The right circular cylinder shown has a radius of 11 centimeters and a height of 16 centimeters. Marcus drew i ¦ The right circular cylinder shown has a radius of 15 centimeters and a height of 16 centimeters. Luis drew its
- `hr[2]` (mc): The net of a right circular cylinder is shown. Each circle has a radius of 17 centimeters, and the rectangle i ¦ The net of a right circular cylinder is shown. Each circle has a radius of 10 centimeters, and the rectangle i ¦ The net of a right circular cylinder is shown. Each circle has a radius of 14 centimeters, and the rectangle i
- `hr[3]` (mc): The right circular cylinder shown has a radius of 13 centimeters and a height of 19 centimeters. Which net, wi ¦ The right circular cylinder shown has a radius of 17 centimeters and a height of 19 centimeters. Which net, wi ¦ The right circular cylinder shown has a radius of 15 centimeters and a height of 9 centimeters. Which net, wit

Items in edition 4.1:
- check 1 ← `reg[2]` sa: The net of a right circular cylinder is shown. The radius is 4 centimeters and the height is 24 centimeters.  What is the surface area of th  → **224π square centimeters**
- check 2 ← `reg[0]` sa: The net of a right circular cylinder is shown. Each circle has a diameter of 4 centimeters, and the rectangle is 24 centimeters tall.  What   → **104π square centimeters**
- check 3 ← `reg[3]` mc: The right circular cylinder shown has a radius of 3 centimeters and a height of 24 centimeters.  Which net, with its dimensions, matches the  → **C. Two circles of radius 3 cm and a 6π cm by 24 cm rectangle**
- check 4 ← `reg[1]` sa: The net of a right circular cylinder is shown. The circles have a radius of 9 inches and the rectangle is 24 inches tall.  What is the area   → **432π square inches**
- check 5 (rigor) ← `hr[0]` sa: The net of a right circular cylinder is shown. The rectangle is 22π centimeters long and 19 centimeters tall.  What is the surface area of t  → **660π square centimeters**
- re-check 1 ← `reg[2]` sa: The net of a right circular cylinder is shown. The radius is 6 centimeters and the height is 8 centimeters.  What is the surface area of the  → **168π square centimeters**
- re-check 2 ← `reg[0]` sa: The net of a right circular cylinder is shown. Each circle has a diameter of 8 centimeters, and the rectangle is 16 centimeters tall.  What   → **160π square centimeters**
- re-check 3 ← `reg[1]` sa: The net of a right circular cylinder is shown. The circles have a radius of 2 inches and the rectangle is 21 inches tall.  What is the area   → **84π square inches**
- comparison 1 ← `reg[1]` sa: The net of a right circular cylinder is shown. The circles have a radius of 7 inches and the rectangle is 13 inches tall.  What is the area   → **182π square inches**
- comparison 2 ← `reg[0]` sa: The net of a right circular cylinder is shown. Each circle has a diameter of 18 centimeters, and the rectangle is 14 centimeters tall.  What  → **414π square centimeters**

Flags:
- check item 1–5: h = 24 on items 1–4; L4 "explain how the net gives the formula" not asked; key calls the height the rectangle's width in one item and the circumference the width in others → *vary h; one explain part; consistent naming*

## MA.7.GR.2.2 — Real-world cylinder surface area  (Unit 12: Surface Area and Volume)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tank has a radius of 11 feet a ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tank has a radius of 7 feet an ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tank has a radius of 3 feet an
- `reg[1]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical can has a radius of 13 centimeters a ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical can has a radius of 5 centimeters an ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical can has a radius of 11 centimeters a
- `reg[2]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical container is made of plastic. It has
- `reg[3]` (mc): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical gift tin with a lid has a radius of 
- `reg[4]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tower has a radius of 11 feet  ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical oatmeal container has a radius of 5  ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tank is open at the top. It ha
- `hr[0]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A company makes a closed cylindrical can with a ra
- `hr[1]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical grain silo has a radius of 7 feet an ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical grain silo has a radius of 9 feet an ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical grain silo has a radius of 5 feet an
- `hr[2]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A cylindrical water tank stands on the ground. It 
- `hr[3]` (sa): Surface area of a right circular cylinder: SA = 2πr² + 2πrh A company packages salt in cylindrical containers. ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A company packages paint primer in cylindrical con ¦ Surface area of a right circular cylinder: SA = 2πr² + 2πrh A company packages popcorn in cylindrical containe

Items in edition 4.1:
- check 1 ← `reg[0]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical water tank has a radius of 9 feet and a height of 17 feet. Its wh  → **468π square feet**
- check 2 ← `reg[2]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical container is made of plastic. It has a radius of 3 inches and a h  → **93π square inches**
- check 3 ← `reg[3]` mc: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical gift tin with a lid has a radius of 3 inches and a height of 4 in  → **A. 42π**
- check 4 ← `reg[4]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical oatmeal container has a radius of 5 inches and a height of 11 inc  → **345.58 square inches**
- check 5 (rigor) ← `hr[2]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical water tank stands on the ground. It has a radius of 7 feet and a   → **3 gallons**
- re-check 1 ← `reg[4]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical planter has no top. It has a radius of 5 inches and a height of 1  → **455.53 square inches**
- re-check 2 ← `reg[1]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical can has a radius of 7 centimeters and a height of 8 centimeters.   → **112π square centimeters**
- re-check 3 ← `reg[0]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical water tank has a radius of 11 feet and a height of 10 feet. Its w  → **462π square feet**
- comparison 1 ← `reg[2]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical container is made of plastic. It has a radius of 11 inches and a   → **407π square inches**
- comparison 2 ← `reg[4]` sa: Surface area of a right circular cylinder: SA = 2πr² + 2πrh  A cylindrical oatmeal container has a radius of 3 inches and a height of 10 inc  → **188.40 square inches**

Flags:
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- check item 1, 5: two cylindrical water tanks, both h = 17 → *vary context and height*

## MA.7.GR.2.3 — Volume of a cylinder  (Unit 12: Surface Area and Volume)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (sa): A cylindrical swimming pool has a diameter of 20 feet and a height of 3 feet. What is the volume of the pool?  ¦ A cylindrical paint can has a diameter of 8 inches and a height of 9 inches. What is the volume of the can? Ro ¦ A cylindrical water tank has a diameter of 28 feet and a height of 11 feet. What is the volume of the tank? Ro
- `reg[1]` (sa): A cylindrical container has a diameter of 16 inches and a height of 4 inches. What is the volume of the contai ¦ A cylindrical container has a diameter of 12 inches and a height of 4 inches. What is the volume of the contai ¦ A cylindrical container has a diameter of 8 inches and a height of 20 inches. What is the volume of the contai
- `reg[2]` (sa): A cylindrical tank has a radius of 10 feet and a height of 14 feet. What is the volume of the tank? Round your ¦ A cylindrical tank has a radius of 2 feet and a height of 7 feet. What is the volume of the tank? Round your a ¦ A cylindrical tank has a radius of 10 feet and a height of 15 feet. What is the volume of the tank? Round your
- `reg[3]` (mc): A right circular cylinder has a radius of 10 units and a height of 8 units. What is the volume of the cylinder ¦ A right circular cylinder has a radius of 4 units and a height of 14 units. What is the volume of the cylinder ¦ A right circular cylinder has a radius of 6 units and a height of 5 units. What is the volume of the cylinder,
- `reg[4]` (sa): A storage tin is shaped like the right circular cylinder shown. Its radius is 3.5 inches and its height is 4 i ¦ A candle is shaped like the right circular cylinder shown. Its radius is 4.5 inches and its height is 6 inches ¦ A storage tin is shaped like the right circular cylinder shown. Its radius is 3.5 inches and its height is 7 i
- `hr[0]` (sa): A cylindrical storage tank has a volume of 540 cubic feet and a radius of 3.4 feet. What is the height of the  ¦ A cylindrical water tank has a volume of 512 cubic meters and a radius of 3.2 meters. What is the height of th ¦ A cylindrical water tank has a volume of 280 cubic meters and a radius of 3.2 meters. What is the height of th
- `hr[1]` (sa): A cylindrical container with a radius of 2 centimeters holds water 10 centimeters deep. All of the water is po ¦ A cylindrical container with a radius of 4 centimeters holds water 3 centimeters deep. All of the water is pou ¦ A cylindrical container with a radius of 4 centimeters holds water 34 centimeters deep. All of the water is po
- `hr[2]` (mc): Cylinder A has a radius of 2 centimeters and a height of 10 centimeters. Cylinder B has a radius of 6 centimet ¦ Cylinder A has a radius of 4 centimeters and a height of 10 centimeters. Cylinder B has a radius of 8 centimet ¦ Cylinder A has a radius of 2 centimeters and a height of 8 centimeters. Cylinder B has a radius of 6 centimete

Items in edition 4.1:
- check 1 ← `reg[2]` sa: A cylindrical tank has a radius of 8 feet and a height of 12 feet.  What is the volume of the tank? Round your answer to the nearest hundred  → **2411.52 cubic feet**
- check 2 ← `reg[1]` sa: A cylindrical container has a diameter of 16 inches and a height of 24 inches.  What is the volume of the container? Write your answer in te  → **1536π cubic inches**
- check 3 ← `reg[3]` mc: A right circular cylinder has a radius of 6 units and a height of 16 units.  What is the volume of the cylinder, in cubic units?  → **C. 576π**
- check 4 ← `reg[0]` sa: A cylindrical trash can has a diameter of 20 inches and a height of 26 inches.  What is the volume of the trash can? Round your answer to th  → **8164 cubic inches (8164.00 also accepted)**
- check 5 (rigor) ← `hr[0]` sa: A cylindrical storage tank has a volume of 478 cubic feet and a radius of 3.2 feet.  What is the height of the storage tank? Round your answ  → **14.86 feet**
- re-check 1 ← `reg[3]` mc: A right circular cylinder has a radius of 8 units and a height of 4 units.  What is the volume of the cylinder, in cubic units?  → **C. 256π**
- re-check 2 ← `reg[0]` sa: A cylindrical swimming pool has a diameter of 12 feet and a height of 3 feet.  What is the volume of the pool? Round your answer to the near  → **339.29 cubic feet**
- re-check 3 ← `reg[1]` sa: A cylindrical container has a diameter of 8 inches and a height of 24 inches.  What is the volume of the container? Write your answer in ter  → **384π cubic inches**
- comparison 1 ← `reg[2]` sa: A cylindrical tank has a radius of 8 feet and a height of 5 feet.  What is the volume of the tank? Round your answer to the nearest hundredt  → **1005.31 cubic feet**
- comparison 2 ← `reg[1]` sa: A cylindrical container has a diameter of 4 inches and a height of 16 inches.  What is the volume of the container? Write your answer in ter  → **64π cubic inches**

Flags:
- check item 1, 4: L4 "compare two cylinders" in no set; r = 8 on four items → *add a two-cylinder comparison*

## MA.7.DP.1.1 — Choose a measure of center or variation  (Unit 13: Numerical and Categorical Data)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (mc): The prices of the board games in a store, in dollars, are 21, 29, 36, 47, 49, 245. Which measure of center bes ¦ The yearly salaries at a small shop, in thousands of dollars, are 21, 30, 36, 41, 52, 182. Which measure of ce ¦ The prices of the jackets in a store, in dollars, are 25, 31, 35, 41, 52, 265. Which measure of center best de
- `reg[1]` (mc): The numbers of customers at a food truck on six days are 30, 39, 50, 53, 60, 63. Which measure of variation be ¦ The numbers of pages a student read on six days are 31, 38, 50, 53, 61, 231. Which measure of variation better ¦ The numbers of pages a student read on six days are 31, 37, 46, 54, 61, 231. Which measure of variation better
- `reg[2]` (mc): The box plot shows the ages of the members of a hiking club. Which measure of variation better describes the s ¦ The box plot shows the minutes of practice for the members of a band. Which measure of variation better descri ¦ The box plot shows the points scored per game by a basketball team. Which measure of variation better describe
- `reg[3]` (mc): The histogram shows the numbers of minutes 25 students spent on homework last night. Which measure of center b ¦ The histogram shows the commute times, in minutes, of 25 workers at an office. Which measure of center best de ¦ The histogram shows the ages of the 25 people at a family picnic. Which measure of center best describes a typ
- `reg[4]` (mc): The line plot shows the number of minutes each bus arrived after its scheduled time. Which measure of center b ¦ The line plot shows the number of pets in each household surveyed. Which measure of center best describes a ty ¦ The line plot shows the number of books read last month by each student. Which measure of center best describe
- `hr[0]` (mc): The stem-and-leaf plot shows the ages of the people in a pottery class. Key: 4 | 5 means 45. Stem: 4, 5, 6 | L ¦ The stem-and-leaf plot shows the ages of the people in a pottery class. Key: 2 | 2 means 22. Stem: 2, 3, 4 | L ¦ The stem-and-leaf plot shows the scores on a science quiz. Key: 5 | 2 means 52. Stem: 0, 1, 2, 3, 4, 5, 6, 7 |
- `hr[1]` (ms): The prices, in dollars, of eight used bikes at a yard sale are 19, 23, 17, 23, 22, 53, 23, 23. One value in th ¦ The prices, in dollars, of eight used bikes at a yard sale are 35, 45, 44, 33, 40, 33, 14, 36. One value in th ¦ The numbers of minutes eight students spent on homework last night are 32, 82, 32, 23, 29, 21, 31, 23. One val
- `hr[2]` (mc): The household incomes of nine families in a neighborhood, in thousands of dollars, are 37, 40, 55, 39, 39, 43, ¦ The prices, in dollars, of nine T-shirts at a store are 14, 28, 26, 19, 23, 25, 14, 13, 18. The store adds a d ¦ The prices, in dollars, of nine T-shirts at a store are 24, 24, 20, 25, 16, 21, 12, 15, 23. The store adds a d
- `hr[3]` (mc): The yearly salaries, in thousands of dollars, of the seven people at a small company are 47, 48, 42, 236, 41,  ¦ The prices, in dollars, of seven used bikes for sale are 72, 481, 81, 75, 65, 86, 92. Ben says a typical value ¦ The yearly salaries, in thousands of dollars, of the seven people at a small company are 34, 46, 32, 47, 202, 

Items in edition 4.1:
- check 1 ← `reg[4]` mc: The line plot shows the number of pets in each household surveyed.  Which measure of center best describes a typical value in this data set,  → **A. the median, because one value is far from the rest and pu**
- check 2 ← `reg[1]` mc: The numbers of minutes a student practiced piano on six days are 32, 41, 50, 57, 64, 186.  Which measure of variation better describes the s  → **C. the interquartile range, because an outlier stretches the**
- check 3 ← `reg[0]` mc: The prices of the cars in a lot, in thousands of dollars, are 25, 29, 39, 42, 53, 243.  Which measure of center best describes a typical val  → **D. the median, because an outlier pulls the mean away from t**
- check 4 ← `reg[3]` mc: The histogram shows the numbers of minutes 25 students spent on homework last night.  Which measure of center best describes a typical value  → **C. the median, because one value is far from the rest of the**
- check 5 (rigor) ← `hr[1]` ms: The prices, in dollars, of eight used bikes at a yard sale are 90, 30, 34, 26, 28, 22, 32, 30.  One value in this data set is an outlier. Se  → **A. Removing 90 from the data set would change the mean more **
- re-check 1 ← `reg[0]` mc: The yearly salaries at a small shop, in thousands of dollars, are 26, 28, 34, 46, 52, 210.  Which measure of center best describes a typical  → **B. the median, because an outlier pulls the mean away from t**
- re-check 2 ← `reg[3]` mc: The histogram shows the ages of the 25 people at a family picnic.  Which measure of center best describes a typical value in this data set,   → **D. the mean, because no value is far from the rest of the da**
- re-check 3 ← `reg[2]` mc: The box plot shows the minutes of practice for the members of a band.  Which measure of variation better describes the spread of the data, a  → **A. the interquartile range, because one long whisker stretch**
- comparison 1 ← `reg[1]` mc: The numbers of customers at a food truck on six days are 33, 43, 50, 55, 59, 153.  Which measure of variation better describes the spread of  → **A. the interquartile range, because an outlier stretches the**
- comparison 2 ← `reg[3]` mc: The histogram shows the commute times, in minutes, of 25 workers at an office.  Which measure of center best describes a typical value in th  → **B. the median, because one value is far from the rest of the**

Flags:
- check item 1–4: every regular keys the outlier-resistant measure (median or IQR), so always picking median/IQR scores 4 of 4 → *one no-outlier, symmetric set keyed to the mean*

## MA.7.DP.1.2 — Compare two data sets  (Unit 13: Numerical and Categorical Data)

Regular generators: 5 · Rigor generators: 4

- `reg[0]` (mc): Route A: 35, 39, 32, 38, 36 Route B: 26, 31, 34, 35, 29 The lists show the times, in minutes, of five trips on ¦ Team A: 56, 60, 56, 61, 57 Team B: 51, 53, 49, 57, 55 The lists show the points scored in five games by each o ¦ Class 1: 10, 8, 14, 16, 12 Class 2: 14, 20, 15, 15, 11 The lists show the numbers of books read last month by 
- `reg[1]` (mc): Field A: 34, 36, 37, 38, 40 Field B: 26, 35, 37, 39, 48 The values are kilograms per plot. Which data set is m ¦ Field A: 22, 24, 25, 26, 28 Field B: 18, 23, 25, 27, 32 The values are kilograms per plot. Which data set is m ¦ Field A: 31, 32, 33, 34, 35 Field B: 23, 31, 33, 35, 43 The values are kilograms per plot. Which data set is m
- `reg[2]` (mc): The line plots show the numbers of pages read last night by the 9 students in each of two reading groups. Whic ¦ The line plots show the numbers of minutes of exercise per day for the 9 members of each of two groups. Which  ¦ The line plots show the numbers of push-ups done in one minute by the 9 students in each of two classes. Which
- `reg[3]` (mc): The box plots show the quiz scores of the students in two classes. Which conclusion about the two classes is s ¦ The box plots show the wait times, in minutes, at two clinics. Which conclusion about the two clinics is suppo ¦ The box plots show the times, in minutes, of trips on two bus routes. Which conclusion about the two routes is
- `reg[4]` (mc): The box plots show the times, in seconds, that the swimmers on two teams took to swim one lap. The two teams h ¦ The box plots show the heights, in centimeters, of the sunflowers grown in two gardens. The two gardens have t ¦ The box plots show the numbers of books read over the summer by the students in two classes. The two classes h
- `hr[0]` (mc): The line plots show the numbers of goals two soccer teams scored in their games. Use the mean and the range of ¦ The line plots show the numbers of hours of sleep the students in two clubs got last night. Use the mean and t ¦ The line plots show the numbers of books the students in two reading groups read last month. Use the mean and 
- `hr[1]` (mc): Ava: 23, 23, 19, 26, 27, 19, 25, 159, 21, 19 Sam: 22, 25, 30, 29, 26, 22, 27, 25, 30, 24 The lists show the nu ¦ Truck A: 36, 37, 156, 32, 37, 30, 35, 37, 35, 32 Truck B: 39, 33, 35, 34, 39, 33, 38, 39, 41, 37 The lists sho ¦ Maya: 14, 13, 14, 12, 10, 40, 12, 10, 9, 8 Leo: 17, 10, 15, 17, 13, 10, 12, 16, 10, 17 The lists show the numb
- `hr[2]` (mc): The histograms show the heights, in inches, of 20 plants of each of two kinds. Which data set has more variabi ¦ The histograms show the scores of 20 players in each of two bowling leagues. Which data set has more variabili
- `hr[3]` (mc): The two-sided stem-and-leaf plot shows the quiz scores for 9 students in each of two classes. Read the leaves  ¦ The two-sided stem-and-leaf plot shows the customers served each hour for 9 hours at each of two stores. Read  ¦ The two-sided stem-and-leaf plot shows the minutes spent on homework each night for 9 juniors and 9 seniors. R

Items in edition 4.1:
- check 1 ← `reg[0]` mc: Route A: 30, 28, 26, 30, 26 Route B: 21, 20, 24, 20, 25  The lists show the times, in minutes, of five trips on each of two bus routes. Whic  → **A. Trips on Route A typically took about 6 more minutes than**
- check 2 ← `reg[4]` mc: The box plots show the heights, in centimeters, of the sunflowers grown in two gardens. The two gardens have the same number of sunflowers.   → **A. Garden A, because 132 is in the middle half for Garden A **
- check 3 ← `reg[2]` mc: The line plots show the numbers of pages read last night by the 9 students in each of two reading groups.  Which conclusion do the medians o  → **D. Students in Group B typically read about 4 more pages tha**
- check 4 ← `reg[3]` mc: The box plots show the times, in minutes, of trips on two bus routes.  Which conclusion about the two routes is supported by the box plots?  → **A. Trips on Route A typically took longer, and the trip time**
- check 5 (rigor) ← `hr[0]` mc: The line plots show the numbers of goals two soccer teams scored in their games.  Use the mean and the range of each data set. Which conclus  → **D. The Hawks typically scored more goals, and the Hawks' num**
- re-check 1 ← `reg[0]` mc: Team A: 48, 52, 55, 48, 47 Team B: 49, 43, 45, 45, 43  The lists show the points scored in five games by each of two basketball teams. Which  → **C. Team A typically scored about 5 more points per game than**
- re-check 2 ← `reg[4]` mc: The box plots show the numbers of books read over the summer by the students in two classes. The two classes have the same number of student  → **A. Class A, because 42 is in the middle half for Class A but**
- re-check 3 ← `reg[3]` mc: The box plots show the quiz scores of the students in two classes.  Which conclusion about the two classes is supported by the box plots?  → **D. Students in the two classes typically scored the same, an**
- comparison 1 ← `reg[2]` mc: The line plots show the numbers of push-ups done in one minute by the 9 students in each of two classes.  Which conclusion do the medians of  → **A. Students in Class B typically did about 6 more push-ups t**
- comparison 2 ← `reg[4]` mc: The box plots show the heights, in centimeters, of the sunflowers grown in two gardens. The two gardens have the same number of sunflowers.   → **C. Garden B, because 139 is in the middle half for Garden B **

Flags:
- check item 2–5: rigor reuses item 4's answer frame and names the measures to use; item 3's mean gap rounds to the same "about 4" as the median gap → *rigor: choose and compute center and spread, write a claim*
- R/X item R2, X1: middle half of a class read 35–50 books in one summer; X1 says "classes" then "groups" → *rescale; consistent noun*

## MA.7.DP.1.5 — Choose an appropriate graph  (Unit 13: Numerical and Categorical Data)

Regular generators: 5 · Rigor generators: 3

- `reg[0]` (mc): A class surveyed 300 students about the sport they like best. Soccer: 60 Basketball: 45 Track: 45 Swimming: 30 ¦ A class surveyed 140 students about the way they get to school. Bus: 28 Car: 21 Walk: 14 Bike: 49 Train: 28 Th ¦ A class surveyed 360 students about the sport they like best. Soccer: 54 Basketball: 36 Track: 54 Swimming: 14
- `reg[1]` (mc): A coach recorded the times, in seconds, of 15 runners: 89, 62, 83, 78, 64, 86, 63, 47, 59, 45, 62, 43, 63, 51, ¦ A student recorded the number of pets in 12 homes: 0, 4, 1, 2, 3, 1, 4, 0, 1, 1, 2, 1 The student wants a disp ¦ A nurse recorded the ages of 15 patients: 24, 47, 47, 40, 52, 43, 33, 41, 42, 45, 26, 64, 46, 55, 43 The nurse
- `reg[2]` (mc): A farmer recorded the weights of 150 apples, measured to the nearest gram. Almost every value is different. Th ¦ A gardener recorded the heights of 120 sunflowers, measured to the nearest centimeter. Almost every value is d ¦ A race official recorded the finishing times of 250 runners in a race, to the nearest minute. Almost every val
- `reg[3]` (sa): The data shows the books read last month for 12 students: 4, 1, 6, 1, 6, 0, 6, 1, 0, 5, 2, 3 Choose the displa ¦ The data shows the books read last month for 16 students: 5, 1, 4, 4, 7, 5, 6, 6, 3, 7, 3, 1, 5, 2, 2, 4 Choos ¦ The data shows the number of pets for 10 students: 4, 3, 2, 1, 0, 0, 1, 2, 2, 0 Choose the display that shows 
- `reg[4]` (mc): A student recorded the 580 kilograms of material collected at a recycling drive. Paper: 232 | Plastic: 174 | G ¦ A student recorded how a family divides its monthly income of $5,700. Rent: $1,995 | Food: $1,710 | Transporta ¦ A student recorded how a family divides its monthly income of $5,400. Rent: $2,160 | Food: $1,620 | Transporta
- `hr[0]` (sa): The two displays show the same data: the scores of 20 students on a math test. Which display can be used to fi ¦ The two displays show the same data: the numbers of minutes 20 students spent reading over the weekend. Which 
- `hr[1]` (sa): A teacher recorded the numbers of minutes 20 students spent reading on Sunday: 37, 17, 42, 52, 67, 62, 16, 43, ¦ A teacher recorded the ages of 20 people in a fitness class: 43, 48, 61, 54, 51, 59, 24, 38, 55, 43, 33, 25, 6 ¦ A teacher recorded the numbers of minutes 20 students spent reading on Sunday: 45, 42, 28, 23, 53, 52, 57, 55,
- `hr[2]` (ms): A researcher recorded the test scores of 15 students: 25, 42, 43, 22, 53, 50, 27, 39, 54, 52, 65, 32, 42, 31,  ¦ A researcher recorded the numbers of minutes 15 students spent on a project: 46, 68, 68, 56, 26, 61, 65, 33, 6 ¦ A researcher recorded the numbers of minutes 15 students spent on a project: 48, 64, 60, 36, 31, 52, 34, 51, 2

Items in edition 4.1:
- check 1 ← `reg[4]` mc: A student recorded the 280 kilograms of material collected at a recycling drive.     Paper  Plastic  Glass  Metal    126  70  56  28     The  → **D. a circle graph**
- check 2 ← `reg[0]` mc: A class surveyed 140 students about the lunch they like best. Pizza: 21 Tacos: 35 Salad: 63 Pasta: 21  The class wants a display that answer  → **C. a circle graph**
- check 3 ← `reg[2]` mc: A gardener recorded the heights of 120 sunflowers, measured to the nearest centimeter. Almost every value is different. The table summarizes  → **B. a histogram**
- check 4 ← `reg[3]` sa: The data shows the number of pets for 16 students: 1, 0, 3, 1, 1, 2, 1, 0, 1, 2, 0, 1, 0, 0, 1, 2  Choose the display that shows every value  → **A line plot, because the data are numbers with only a few di**
- check 5 (rigor) ← `hr[0]` sa: The two displays show the same data: the numbers of minutes 20 students spent reading over the weekend.  Which display can be used to find t  → **Display A, the box plot, because it marks the median and the**
- re-check 1 ← `reg[0]` mc: A class surveyed 260 students about the way they get to school. Bus: 52 Car: 39 Walk: 104 Bike: 26 Train: 39  The class wants a display that  → **D. a bar chart**
- re-check 2 ← `reg[3]` sa: The data shows the number of pets for 13 students: 0, 4, 0, 2, 2, 1, 1, 3, 1, 0, 3, 2, 0  Choose the display that shows every value and how   → **A line plot, because the data are numbers with only a few di**
- re-check 3 ← `reg[1]` mc: A teacher recorded the test scores of 15 students: 97, 97, 79, 95, 97, 90, 79, 87, 89, 72, 72, 72, 91, 85, 98  The teacher wants a display t  → **A. a stem-and-leaf plot**
- comparison 1 ← `reg[0]` mc: A class surveyed 200 students about the way they get to school. Bus: 60 Car: 20 Walk: 40 Bike: 50 Train: 30  The class wants a display that   → **B. a bar chart**
- comparison 2 ← `reg[4]` mc: A student recorded how a family divides its monthly income of $4,800.     Rent  Food  Transportation  Savings    $2,160  $1,200  $960  $480   → **A. a circle graph**

Flags:
- recheck item 3: [fixed in bank] a line plot also "keeps every value and shows the shape" for 15 scores; solution said "few repeats" (72 and 97 appear three times) → *distractor -> box plot; fix the solution text*
- recheck/comparison item several: [fixed in bank] re-check or comparison items reused a check item's numbers or setup (GR.1.3 R2 = check 2 backwards; NSO.1.2 R3 = 7/11 again; AR.4.5 X2 and AR.3.3 X2 = check 4 with one number changed; AR.3.2 R3 = check 3's table; GR.2.2 R3 = check 5's cylinder; DP.1.5 R1 = check 3; AR.4.1 R1 = a check option word for word; AR.4.5 R1 = check 1's rate) → *the build now scores redraws for reuse of givens and answers; generators with small number pools (carriage rates, cylinder dimensions, suitcase weights) would help most*
- all item —: no item has students make a display (benchmark: choose and create); check 1 and 2 same "part of the whole -> circle graph" → *change check 4 and R2 to "draw the line plot"*