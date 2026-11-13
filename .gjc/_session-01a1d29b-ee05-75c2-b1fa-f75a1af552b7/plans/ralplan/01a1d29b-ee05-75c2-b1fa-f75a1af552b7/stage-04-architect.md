# Architect 리뷰 pass 4 (delta-only) — R1 반딧불이 한 칸 이동

- stage: architect / stage_n 4
- 대상: stage-04-revision.md (sha256 [REDACTED])
- 직전 pass: stage-03-architect.md (CLEAR / COMMENT, R3-01·R3-02)
- 입력 리뷰: stage-03-critic.md (ITERATE, CR3-01·CR3-02)
- 근거: stage-04-revision.md §4–§14 실독, stage-03-architect.md, stage-03-critic.md, 저장소 상태(소스 파일 없음)

## Summary

Architectural Status: CLEAR
Decision: APPROVE

R3-01(규범 문장의 깨진 단어)은 의미 변경 없이 교정되었다. 본문 검색 결과 깨진 단어(부변, 이울, 트욘, 정하히, 시길잣처, 반얘, 함까, 만들다)는 교정 기록표(CR3-01 행) 안에서만 인용되며 규범 문장에는 남지 않았다. R3-02(호출당 dir 하나, 동시 입력 선택은 사람 결정)는 §6 R1b, §8-9, §9, §10-4, 게이트 7에 기록되었다. 신규 blocker는 없다. 남은 항목은 사람 결정(§8-8 미확정 기본값, §8-9 동시 입력, design-v1 커밋)이며 리뷰 결함이 아니다.

## Claims

- C1 CR3-01 해소: §6 (b) "그 밖의 값", (c-1) "state 전체가 불변", V-2 "좌표가 불변", V-5 "1칸 이동을 만든다", V-9(6) "정확히 1칸", §5 "트윈"으로 교정 확인.
- C2 CR3-02 기록: §6 R1b "입력 루프 규칙" 한 줄, §8-9, 게이트 7, §10-4 에 존재 확인.
- C3 의미 보존: 2장 값 7개, 150 ms 쿨다운, (c-1) 기본값, design-v1 게이트 문장 하나가 stage-03 과 동일.
- C4 §11 에 V-1..V-6 과 §6 (a)~(d) 1:1 대응 표기가 추가되었다. 이는 CR3-01 수정의 검증 절차이며 새 규칙이 아니다.
- C5 발명 값 없음: 60초, strings.js, 맵 문자, 색 hex 재등장 없음.

## Analysis

Stage 1 (스펙): 값과 타이밍은 사람 확정과 일치한다. (c-1) 은 2장 숫자가 아니라 §8-8 에 사람 확인 항목으로 표기된 계획 기본값이다. 이 상태는 기준에 맞다.

Stage 2 (구조): logic.js 경계 `requestMove(state, dir, nowMs, grid)`, `grid.blocked(x,y)`, 상태 `{x,y,lockedUntil}`은 stage-03 과 동일하다. 맵 문자 해석은 levels.js 에만 있다. 반복 구동과 다중 키는 호출자(R1b 입력 루프) 소유로 명시되었다.

Antithesis: "교정 기록표에 깨진 단어가 그대로 남아 있으니 다시 틀릴 수 있다." 기각. 해당 단어들은 표에서 인용 목적으로만 쓰이며, 규범 문장에서 검색되지 않는다. 실행자가 표를 기대값으로 읽을 가능성은 낮다.

Stage 3: 이 pass 에서 범위를 넓히지 않는다. 새 옵션을 추가하지 않는다.

## Root Cause

stage-03 의 결함은 규범 문장 편집 오류 하나였다. 의미 결정은 이미 확정되어 있었다. 이번 개정은 그 편집 오류만 고쳤다.

## Findings

| id | 심각도 | 위치 | 문제 | 상태 |
|----|--------|------|------|------|
| R3-01 | MEDIUM (P2) | stage-04 §6 (b)(c-1), §7 V-2..V-9, §5, §8-8 | 규범 문장 깨진 단어 | 해소. 검색으로 규범 문장에서 제거 확인 |
| R3-02 | LOW (P3) | stage-04 §6 R1b | 다중 키 호출자 규칙 부재 | 해소(기록). 사람 결정 §8-9 로 위임 |

직전 blocker: 없음. CRITICAL/HIGH: 없음. 신규 blocker: 없음. rule 2 적용 대상 없음. rule 3(monotonicity): CLEAR 유지, 악화 없음.

## Recommendations

1. R1a 착수 전 design-v1 커밋(§10-2 게이트)을 먼저 수행한다.
2. 착수 전 §8-8(미확정 기본값)과 §8-9(동시 입력 규칙)에 대한 사람 확인을 받는다. 이는 review 항목이 아니라 gate 항목이다.
3. R1a 완료 보고는 "V-1..V-6 통과, R1 goal 열림, 브라우저 확인 미완, 9장 공백"을 함께 쓴다(§11).

## Architectural Status

CLEAR

## Code Review Recommendation

APPROVE. 이 계획에 대한 review 차원의 남은 결함은 없다. 사람 결정 항목은 §8 에 있고 게이트로 관리된다.

## Tradeoffs

| 긴장 | 한쪽 | 다른 쪽 | 현재 선택 |
|------|------|---------|-----------|
| 미확정 기본값 | 막힌 입력은 잠금 없음 | 누름 즉시 잠금(단순 구현) | 잠금 없음, §8-8 사람 확인 |
| 단일 dir 시그니처 | 단순 | 다중 키 표현 불가 | 호출자 규칙, §8-9 사람 결정 |
| 게이트 엄격성 | design-v1 선행 | R1a 지연 | 게이트 유지 |
