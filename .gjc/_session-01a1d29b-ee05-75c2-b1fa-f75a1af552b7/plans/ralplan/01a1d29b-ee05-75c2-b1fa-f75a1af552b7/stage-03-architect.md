# Architect review pass 3 (delta-only) - R1 firefly one-cell move

- stage: architect / stage_n 3
- target: stage-03-revision.md (sha256 [REDACTED])
- prior pass: stage-02-architect.md (WATCH / COMMENT, R2-01..R2-05)
- evidence: stage-03-revision.md sections 4-8 read in full, stage-02-architect.md, git ls-files (no product source files yet)

## Summary

Architectural Status: CLEAR
Decision: COMMENT

All five prior items are resolved or reduced to a non-blocking residual. The gate is one sentence (design-v1 commit, then R1a). The blocked-input lock default is explicit and flagged for human confirmation. Repeat-drive ownership sits with the R1b input loop, verified by V-9(6). The test filename is no longer an R1a gate. Two new findings are both non-blocking: a garbled-word defect in the normative lock-default text (MEDIUM) and an unstated multi-key caller rule (LOW). Neither worsens the verdict, so the status improves from WATCH to CLEAR under rule 3.

## Claims

- C1 R2-01 resolved: section 6 (c-1) states that a non-moving input leaves state including lockedUntil unchanged. Marked as a human-confirmation item in section 8-8.
- C2 R2-02 downgraded by Critic, now residual LOW: dir is one value per call; V-2 covers invalid dir only.
- C3 R2-03 resolved: section 10-2 and section 5 use the single gate sentence design-v1 commit then R1a.
- C4 R2-04 resolved by ownership: repeat-drive belongs to the R1b input loop; the only verification is V-9(6), a manual check that stays blocked until 5/6 are decided.
- C5 R2-05 resolved: section 10-3 says the test filename is set by the node --test test/ command; no R1a gate remains.
- C6 No new 2-section numeric values. 150 ms, 16x12, 32 px, 512x384, and the four keys trace to GAME_DESIGN 2장. No 60-second or strings.js reappears.

## Analysis

Stage 1 spec compliance (delta): values and timing semantics match the human decision. The lock default in (c-1) is not a 2장 number; it is labeled as a planner default pending confirmation, which is the correct handling.

Stage 2 architecture (delta): the logic boundary is unchanged from pass 2 and remains consistent with AGENTS.md section 5 copy rule. Map-as-argument with logic.js seeing only grid.blocked(x,y) keeps glyph rules in levels.js. State shape {x,y,lockedUntil} is the minimal form. Gate ordering now follows AGENTS.md: spec first, code second.

Antithesis: the default in (c-1) could be argued as an invented rule. Rejected as a blocker: it is the only reading that keeps a refused press from locking, which the human's immediate-move-plus-lock decision implies, and it is explicitly held for human confirmation.

Stage 3 synthesis: no scope added in this pass. Changes requested are wording and one caller line only.

## Root Cause

The pass-2 issues were a gap between recorded meaning and the places that consume it (gate order, lock on refused input, repeat owner). Each now has a single owner or sentence.

## Findings

| id | severity | location | issue | fix |
|----|----------|----------|-------|-----|
| R3-01 | MEDIUM (P2) | revision section 6 (c-1), section 7 note under V-3/V-4 | Garbled Korean in the normative default: 부변 (should be 불변, which reads oppositely as 부분 변경). Also 시길잣처, 트욘, 이울, 정하히, 만들다, 반얘, 함까 in the same revision. Novelty: first appears in stage-03; pass-2 text was clear. Non-blocking because the sentence intent is recoverable from context. | Replace with 불변 and correct words; re-read before R1a copies lines into tests |
| R3-02 | LOW (P3) | revision section 6 R1b | Multi-key caller rule not stated. Since dir is single-valued, R1b must choose which key to pass. Residual of R2-02. | Add one line in R1b: the input loop passes at most one dir per call, per a rule the human decides later |

Prior blockers: R2-01 resolved, R2-02 downgraded to R3-02 (LOW), R2-03 resolved, R2-04 resolved by ownership, R2-05 resolved. No CRITICAL or HIGH anywhere. No carryover blocker. No new blocker, so rule 2 novelty justification does not apply.

## Recommendations

1. Fix the garbled words in (c-1) and the V-3/V-4 note (R3-01) before R1a starts.
2. Add the one-line multi-key caller rule in R1b (R3-02).
3. Keep the human confirmation of section 8-8 as the gate for V-3/V-4 expected values.
4. design-v1 commit remains the only gate before R1a.

## Architectural Status

CLEAR

Reason: the boundary, gate order, and owners are coherent. Remaining items are wording and a caller note, not architecture.

## Code Review Recommendation

COMMENT. No blocker. R3-01 is recommended before R1a copies the text; R3-02 is optional.

## Tradeoffs

| tension | one side | other side | recommendation |
|---|---|---|---|
| lock default on refused input | no lock (explicit state unchanged) | lock on press (simpler to implement, contradicts the human's moved-then-lock meaning) | no lock; confirm in 8-8 |
| single dir per call | simple signature | undefined multi-key | caller owns the rule (R3-02) |
| gate strictness | design-v1 before R1a | R1a delay | keep the one-sentence gate |
