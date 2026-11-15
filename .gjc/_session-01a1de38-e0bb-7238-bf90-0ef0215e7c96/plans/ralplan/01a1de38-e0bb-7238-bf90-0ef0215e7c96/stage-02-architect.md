# Architect Review Pass 2 (delta-only): R3 stage-02 revision

## Summary
B2 (3장 HUD "이슬 n/8", 3장 타이틀 bullet) is resolved (conflict rows 7, 8). B1 is resolved for 9장 6, 16, 19, 23, 24 and 1장 (rows 9-13), but not for 9장 수용 9 ("이슬방울 8개", HUD "이슬 0/8"), which is not in the table. That leaves one residual blocker. Fix: add one scoped row for 수용 9 and the plan is approvable. Non-blocking editorial issues (garbled Korean tokens) do not change the verdict.

Architectural Status: WATCH
Decision: REQUEST CHANGES

## Delta checked
- B1 (pass-1 P1): rows 9-13 cover 수용 6, 16, 19, 23 and 1장 콘셉. Verified by reading the table. The 검사 룰 (1·2·3·4·9장 맨 8·60 = 0) is stated. Residual: 수용 9 is not listed. Its text has an unscoped "8개" and "이슬 0/8", the same class as 수용 6, which the revision did scope. The revision's own 1단계 gate would fail on it as written. Carryover HIGH stays blocking until scoped (rule 4).
- B2 (pass-1 P2 HUD and title): rows 7 (HUD "이슬 n/8" -> n/방울 총수, 가운데 레벨 k/3) and 8 (타이틀 최고 점수) resolve it.
- N1-N10 and the logic-events suggestion: applied as claimed in the revision. The events design (단계 3) is not re-reviewed here (rule 1). The architect-pass-1 P2 on phase-diff triggers is adopted.
- New in revision: N6 `enter(world, nowMs, levels)` and `createTitle(levels)` keep logic.js free of levels.js imports. This is consistent with Principle 2 and is not a new blocker. N9 reads K.1 as per-goal origin alignment (3 times), not once. Result: origin sync is run more than 결정 K.1 states. This is a process reading, not a 9장/AGENTS/숫자 rule, so it is non-blocking. Record it in the goal-4 commit or REPORT.

## Findings
- P1 (blocking, residual of B1, conf 0.85): 9장 수용 9 unscoped 8. Fix: add a conflict row scoping it to level 1 (레벨 2·3은 27·29 참조), and list it in the 검사 결과 report.
- P3 (non-blocking, conf 0.9): garbled Korean tokens ("예상를", "븛넣는다", "마혀", "여다", "목시", "아지 없어", "끄보는", "촜셋트", "맥러리", "대슴", "금니처", "위지", "증 단계 0", "이울의"). Fix when copying into GAME_DESIGN.md.

## Root Cause
The revision scoped 9장 items found by number-scan of 6/16/19/23, but missed 9. The gate is written, but its scan list was not regenerated from the full scan. Re-run the 맨 8/60 scan over 1·2·3·4·9장 after the edit and attach its hit list.

## Recommendations
1. Blocking: add a conflict row for 9장 수용 9 scoping it to level 1, then rerun the 맨 8·맨 60 scan over 1·2·3·4·9장 and report the hits.
2. Non-blocking: fix the garbled tokens before the text is copied into v3.
3. Non-blocking: record the N9 origin-sync reading in the goal-4 commit or REPORT.

## Tradeoffs
No new option. Keep the logic-events and N6 design from the revision.

Architectural Status: WATCH
Decision: REQUEST CHANGES
