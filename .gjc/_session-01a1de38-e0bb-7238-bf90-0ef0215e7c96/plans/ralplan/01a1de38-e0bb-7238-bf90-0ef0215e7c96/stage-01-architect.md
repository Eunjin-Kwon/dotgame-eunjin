# Architect Review: R3 planner stage 1 (pass 1)

## Summary
The planner structure is sound: O1-A (pure world transitions with levelIndex/totalScore), O2-A (audio.js and storage.js outside logic.js), O3-A (LEVELS carries timeLimitS and TIME_LIMIT_S is removed), the goal-4/goal-5 split, and the design-v3 gate before goal-4. One gap blocks approval: the seven-row replacement table omits 9장 6/9/16/19/23 and the 3장 HUD "이슬 n/8", which still hard-code 8 dewdrops and 60 seconds. Fix that in the design-v3 change list and the plan is approvable.

Architectural Status: WATCH
Decision: REQUEST CHANGES

## Claims (checked against files)
- src/logic.js:7 `TIME_LIMIT_S = 60`; :81 `timeLeft: TIME_LIMIT_S`; :79-80 `collected`/`total` already dynamic. So O3-A and O1-A have clean extension points.
- src/render.js:61 HUD uses `STRINGS.hudDew(collected, total)`, so the HUD already supports per-level counts.
- test/goal3.test.js:12,30,71,84 reference TIME_LIMIT_S; :90 asserts clear -> title (수용 24 v2). The planner's goal3 rewrite covers this.
- GAME_DESIGN.md v2 9장 6, 9, 16, 19, 23 hard-code 8 dewdrops and/or 60 s. 3장 HUD row: "이슬 n/8".

## Analysis
### The three conflicts the planner flagged
1. 9장 수용 24. The replacement (levels 1-2 clear -> next level; level 3 clear -> final screen, cross-referenced to 27/29/32) matches 결정 B. Correct. Caveat: committing v3 before goal-4 leaves the level-3 clear screen in place (P2 finding).
2. 2장 60초 row. The replacement ("레벨별 60/50/45") matches 결정 A and is correct for that row. Not sufficient alone: 9장 16 ("60에서 1초씩") and 9장 23 ("이슬방울 8개, 시간 60") still say 60 and 8. Blocking (P1).
3. 3장 clear flow. The replacement matches 결정 B, including the title best-score line. Not sufficient alone: the 3장 HUD row "이슬 n/8" is not in the table and contradicts 9장 27 ("이슬 0/10") and 29 ("이슬 0/12"). Blocking (P1).

### Antithesis
Strongest case against O1-A: the world grows and goal3 tests break, which costs time under the 40-minute gate. Fair. O1-B moves the 수용 31/33 state transitions into main.js, where they can only be tested through wiring. The extra cost of O1-A is bounded to a few fields and one rewritten test file, so O1-A holds.

### Architecture checks
- Data model separation: LEVELS (levels.js: rows plus timeLimitS), world state (levelIndex, totalScore), read-only render. Clean.
- High-score boundary: storage.js owns the one key; main.js calls it; logic.js has no storage access. Clean.
- Failure isolation: try/catch in audio.js and storage.js sits at the external-environment boundary that 수용 37 names. This matches the narrow-fallback rule: primary and fallback paths are both tested. Do not switch these catches to console.error, since 수용 37 requires no console errors.
- Goal split: goal-4 does not depend on goal-5 code, except the interim level-3 clear screen (P2). Goal-5 depends on goal-4 world fields. The dependency is one-way.
- design-v3 gate: step 1 commits before goal-4. Correct.
- Sound and high-score triggers: phase diffs in main.js duplicate logic that logic.js already owns (P2 finding).

## Root Cause
The spec table was built from the conflict rows that were visible when the planner reviewed the spec. It was not built from a full scan of every number in 9장 and 3장, so the 8/60 hard-codes survived. Fix the scan, not only the listed rows.

## Findings
- P1 (blocking, conf 0.9): design-v3 change list misses 9장 6/9/16/19/23 and 3장 HUD "이슬 n/8". Fix: add rows and rewrite as level-scoped values, then grep 3장/9장 for bare 8 or 60.
- P2 (non-blocking, conf 0.7): goal-4 interim level-3 clear screen disagrees with v3 수용 24. Fix: state the interim in v3 or in the goal-4 commit.
- P2 (non-blocking, conf 0.6): sound and high-score triggers derived by main.js phase diffs. Fix: logic returns events; main consumes them.
- P3 (non-blocking, conf 0.5): step 0 lacks the exact origin/main command, and high-score write is not specified as edge-triggered. Fix: name the command and the edge trigger.

## Recommendations
1. Blocking: add the P1 rows to the design-v3 change list. Rewrite 9장 6/9/16/19/23 and 3장 HUD as level-scoped values. Self-check with a grep for bare 8 and 60 in 3장 and 9장.
2. Non-blocking: add the interim sentence for level-3 clear to v3 수용 24.
3. Non-blocking, before goal-5: make logic transitions emit events for sound and high-score triggers.
4. Non-blocking: name the step-0 command and make the high-score write edge-triggered.

## Tradeoffs
| Option | Pros | Cons | Verdict |
|---|---|---|---|
| O1-A pure world (planner) | Testable 27/29/31/33/36 without DOM | world grows, goal3 rewrite | Keep |
| O1-B state in main.js | Smaller logic.js | Tests only through wiring | Reject |
| Events from logic (recommended) | No phase diff in shell, sound testable | Small logic change | Adopt before goal-5 |

Architectural Status: WATCH
Decision: REQUEST CHANGES
