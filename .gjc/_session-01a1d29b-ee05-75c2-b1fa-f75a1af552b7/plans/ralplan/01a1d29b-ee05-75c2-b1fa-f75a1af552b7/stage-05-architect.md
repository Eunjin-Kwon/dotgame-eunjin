# Architect review pass 5 (delta-only) - R1 firefly one-cell move

- stage: architect / stage_n 5
- target: stage-05-revision.md (sha256 [REDACTED])
- prior pass: stage-04-architect.md (CLEAR / APPROVE)
- evidence: stage-05-revision.md sections 0, 1, 3-6, 7 (V-11), 8, 10-14 inspected by read and text search. No product source files exist (git ls-files: AGENTS.md, GAME_DESIGN.md, .gjc/** only).

## Summary

Architectural Status: CLEAR
Decision: APPROVE

The revision keeps one goal (goal-1) and one gate (design-v1 commit, then R1a). Both human decisions are recorded as settled: blocked input does not start the 150 ms lock (section 1-5, 6 (c-1), V-3, V-4), and simultaneous keys pass only the most recently pressed direction, chosen by the R1b input loop (section 1-6, 6 R1b, gate 7). No active section still says the multi-key rule is left to the human. The only remaining occurrence of that phrase is the change-log row describing its deletion. The split into R1a and R1b is kept as goal-1 stages, not separate goals (section 0, gate 8). One new LOW caveat is non-blocking.

## Claims

- C1 Goal is single: section 0 states goal-1 once. R1a and R1b are stages. Gate 8 forbids goal-2. Verified by search.
- C2 Multi-key rule is settled and owned: section 1-6 (last pressed only), section 6 R1b (one dir per call, last pressed key), gate 7, section 10-5, V-11 in section 7. Verified by search for 사람이 정한다; no active hit.
- C3 Blocked input is settled: section 1-5 (no lock, state unchanged), section 6 (c-1), V-3/V-4. The 8-8 open item is gone.
- C4 Gate is one sentence (design-v1 commit, then R1a), consistent across section 1-4, 5, 10-2, 12 gate 1. design-v1 is recorded as not yet performed.
- C5 No new 2장 numeric values. 150 ms, 16x12, 32 px, 512x384 trace to GAME_DESIGN 2장. No 60-second timer, no strings.js in R1, no map glyphs or hex values.
- C6 Section 1-7 lists remaining agent-proposed names (dir identifiers, state/function names, fixture start, test filename) as (에이전트 제안) for design-v1 review. These are naming, not numbers, and do not change behavior contracts.

## Analysis

Stage 1 (spec): the two new human decisions are rules not present in GAME_DESIGN 2장 yet. They are correctly held for design-v1 and not treated as spec until that commit, consistent with AGENTS.md (spec first, then code).

Stage 2 (architecture): the boundary is unchanged since pass 2: requestMove(state, dir, nowMs, grid), state {x, y, lockedUntil}, grid {width, height, blocked(x, y)}. logic.js sees only boolean passability. Glyph rules stay in levels.js. The multi-key decision keeps the pure function single-dir and moves key-order state into the input loop, which is the right owner because it already owns repeat (CR2-03). The lock decision removes the only ambiguous branch in requestMove.

Antithesis: putting last-pressed tracking into requestMove would make it stateful over key events and break purity. Rejected. The current split is better.

Stage 3: no scope added in this pass. The revision only settles two decisions and lists agent-proposed names.

## Root Cause

The previous open items were decisions the human had already made but the plan had not yet recorded in active sections. This revision moves them into the normative text and removes the open markers.

## Findings

| id | severity | location | issue | status |
|----|----------|----------|-------|--------|
| R5-01 | LOW (P3) | stage-05 section 1-6, V-11 (section 7) | Last-pressed rule covers press order only. V-11 describes what happens on release (remaining key resumes), which the spec does not state. Novelty: the release case is new in stage-05 because the rule itself is new; stage-04 only said the choice was open. Non-blocking: V-11 is a manual check blocked until 4/5/6장, and the release clause can be added to the 2장 row at design-v1 time. | Add one release clause to the 2장 동시 입력 확정 행 in design-v1 |

Prior blockers: none open. CRITICAL/HIGH: none. No carryover blocker. Rule 2 does not apply because R5-01 arises from a rule introduced in this pass, not from previously approved ground. Rule 3 (monotonicity): CLEAR and APPROVE are kept, no worsening.

## Recommendations

1. Proceed with design-v1 (2장 표기, 막힌 입력 확정 행, 동시 입력 확정 행 including the release clause from R5-01). Gate is unchanged.
2. R1a may start after design-v1 commit. R1a does not implement multi-key or repeat.
3. R1b keeps the input loop as owner of key order and repeat; V-9 (6) and V-11 remain the browser checks.
4. Keep goal-1 as the only goal until section 0 browser sentence is confirmed by a human.

## Architectural Status

CLEAR

Reason: boundary, owners, gate, and goal count are consistent. The only open item is a LOW spec clause at design-v1 time.

## Code Review Recommendation

APPROVE. No blocking finding. R5-01 is a non-blocking caveat to be closed in the design-v1 commit.

## Tradeoffs

| tension | one side | other side | current choice |
|---|---|---|---|
| stateful key order in requestMove | purity broken, simpler caller | pure function, caller tracks key order | caller tracks key order (R1b) |
| last-pressed rule vs release rule | press-only rule, short text | release clause needed for V-11 | add release clause at design-v1 (R5-01) |
| one goal vs goal split | single goal-1 with stages | smaller goal commits | single goal-1 (gate 8) |
