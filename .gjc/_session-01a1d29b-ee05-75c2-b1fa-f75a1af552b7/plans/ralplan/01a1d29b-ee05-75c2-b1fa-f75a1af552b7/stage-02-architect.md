# Architect 리뷰 pass 2 (delta-only) — R1 반딧불이 한 칸 이동

- stage: architect / stage_n 2
- 대상: stage-02-revision.md (sha256 [REDACTED])
- 직전 pass: stage-01-architect.md (WATCH / REQUEST CHANGES, F-01..F-06)
- 근거: stage-02-revision.md, stage-01-architect.md, GAME_DESIGN.md 2장, AGENTS.md, git ls-files(소스 0개)

## Summary

Architectural Status: **WATCH**
Decision: **COMMENT**

pass 1 의 blocking 항목 F-01(60초 발명), F-02(logic 경계), F-04(완료 근거), F-05(strings.js)는 해소됐다. F-03(150 ms 의미)은 사람 결정으로 해소됐으나 실행 순서에 남은 틈이 있다. 새 항목 5건은 모두 MEDIUM 이하이며 CRITICAL/HIGH 는 없다. 따라서 직전 REQUEST CHANGES 는 COMMENT 로 내려가고, 상태는 직전과 같은 WATCH 를 유지한다(monotonicity 준수, 악화 없음). R1a 착수 전 아래 MEDIUM 2건(순서, 누름 반복 소유자)은 계획에서 정리하는 것을 권장한다.

## Claims

- C1: F-01 해소. 60초 삭제, §8-6 에 "기획서 미정의" 표기. 확인됨.
- C2: F-02 대부분 해소. `requestMove(state, dir, nowMs, grid)`, state `{x,y,lockedUntil}`, grid `{width,height,blocked}` 확정. 벽 문자 없음. 확인됨. 잔여: 이동 불가 시 잠금 처리(R2-01), 대각선/동시 입력 표현(R2-02).
- C3: F-03 사람 결정 반영. 입력 시 즉시 이동 + 150 ms 잠금이 §1, §5 에 있다. 확인됨. 잔여: 2장 표기 반영이 R1a 선행 조건이 아님(R2-03).
- C4: F-04 해소. R1a 는 V-1..V-6 만 닫고 goal 1 은 열림. §7 머리말과 게이트 5 에 명시. 확인됨.
- C5: F-05 해소. §6 R1 표에서 strings.js 제거, §9 에 제외 명시. 확인됨.
- C6: F-06 부분 해소. 커밋 규칙은 사람 선택으로 열림(§10-4). 파일 경로 게이트는 과잉(R2-05).
- C7: AGENTS.md 명명 파일 목록(src/logic.js, src/levels.js, src/sprites.js, src/strings.js, index.html, `node --test test/`)과 revision 의 경로 주장은 일치. 확인됨.

## Analysis

### Stage 1 — 스펙 준수 (delta)
- 2장 7개 값은 사람 확정 후 그대로 쓰였다. 60초 같은 신규 숫자는 없다. 값 발명 없음.
- 완료 기준은 9장으로 되돌아갔다. 계획이 임시 AC 를 완료 근거로 쓰지 않는다.

### Stage 2 — 아키텍처 (delta)
- 로직/데이터 경계는 AGENTS 5장 복사 규칙과 맞는다. 문자→통행 가능 변환은 levels.js 한 곳, logic.js 는 `blocked(x,y)` boolean 질의만 받는다. 맵은 인자로 들어가며 문자 규칙은 logic.js 에 노출되지 않는다. 이 점에서 pass 1 의 질문 "맵-as-argument 가 5장 복사 규칙과 일관한가"에 대한 답은 예다.
- 상태 모델 `{x,y,lockedUntil}` 은 pass 1 Stage 3 권고의 최소 형태와 같다. 확정 의미에 맞다.
- 잔여 틈 1: 이동 불가 입력이 잠금을 시작하는지 불명확. 테스트 작성자에게 결정이 넘어간다 (R2-01).
- 잔여 틈 2: `dir` 단일 값과 V-2 의 "대각선 의도 입력" 표현이 맞지 않는다. 2장에 동시 입력 규칙도 없다 (R2-02).
- 잔여 틈 3: 실행 순서. AGENTS "기획서가 애매하면 기획서를 먼저 고친다" 에 비추어 R1a 는 design-v1 커밋 뒤에 시작해야 하는데 §10-4 게이트에 빠져 있다 (R2-03).
- 잔여 틈 4: 2장의 "계속 누르면 150 ms마다 한 칸" 은 R1a 의 V-1..V-6 어디에도 없다. 반복 구동자(caller)의 소유가 없다 (R2-04).

### Antithesis
- 반론: "R2-02, R2-04 는 이미 2장 값에서 자명하므로 계획에 적을 필요 없다."
- 평가: 기각. 동시 입력과 반복 구동은 구현자마다 다르게 고르는 결정이다. 한 줄 명시 비용이 재작업 비용보다 낮다.

### Stage 3 — 건설적 종합 (pass 2, 최소)
- 이 pass 에서는 범위를 늘리지 않는다. 위 4건을 각 한 문장으로 닫는 수정만 요청한다.

## Root Cause

직전 pass 결함의 근원(값 확정과 의미 확정 혼동)은 이번 개정에서 대부분 고쳐졌다. 남은 틈은 "의미를 적었지만 실행 순서나 입력 표현과 연결하지 않은" 형태다.

## Findings

| id | 심각도 | 위치 | 문제 | 수정 |
|----|--------|------|------|------|
| R2-01 | MEDIUM (P2) | revision §6 R1a (c) | 이동 불가 시 잠금 갱신 여부를 테스트에 위임. 사람 결정은 "이동을 했을 때 잠금" 이므로 불가 입력은 잠금을 걸지 않아야 함. F-02/F-03 잔여 | (c) 에 "이동 불가 시 state 완전 불변(lockedUntil 포함)" 명시 |
| R2-02 | MEDIUM (P2) | revision §6 R1a (b), V-2 | 단일 dir 시그니처로 대각선 의도를 표현할 수 없음. 2장에 동시 입력 규칙 없음. 신규(시그니처 축소로 생김) | 2장에 동시 입력 규칙 확정(사람), V-2 를 그 규칙으로 고정 |
| R2-03 | MEDIUM (P2) | revision §10-4 | R1a 게이트에 design-v1(2장 표기 확정) 이 없음. AGENTS "기획서 먼저" 위반 가능. F-03 잔여 | §10-4 앞에 "design-v1 커밋 완료"를 필수 선행으로 추가 |
| R2-04 | MEDIUM (P2) | revision §11 V-1..V-6 | 2장의 "계속 누르면 150 ms마다 한 칸" 에 R1a 소유자/테스트 없음. 수동 확인(V-9-6)에만 있음 | 둘 중 하나: (가) R1a 에 V-7 추가(nowMs = lockedUntil 마다 호출 시 150 ms당 1칸, DOM 불필요), (나) 반복 구동은 R1b 소유임을 명시 |
| R2-05 | LOW (P3) | revision §8-5, §10-3 | 테스트 파일명 결정을 R1a 게이트로 둠. `node --test test/` 가 이미 디렉터리를 정하므로 과잉 블로커. 렌더 경로만 R1b 의 열린 항목이면 충분 | §10-3 을 R1a 게이트에서 빼고 렌더 경로만 R1b 항목으로 유지 |

직전 pass blocker 해소 여부:
- F-01 해소. F-02 대부분 해소(잔여 R2-01, R2-02). F-03 사람 결정 반영, 잔여 R2-03. F-04 해소. F-05 해소. F-06 부분 해소(커밋 규칙은 사람 선택으로 명시, 잔여 없음으로 간주).
- CRITICAL/HIGH 없음. 직전 pass 에 CRITICAL/HIGH 가 없었으므로 carryover blocker 없음.
- 신규 항목 전부 MEDIUM 이하이며, 이번 pass 의 신규 blocker 는 없다. rule 2(novelty justification) 는 적용 대상 없음.

## Recommendations

1. (계획 수정, 최소) R2-03: §10-4 게이트에 design-v1 선행 추가.
2. (계획 수정, 최소) R2-01: §6 R1a (c) 에 이동 불가 시 잠금 불변 문장 추가.
3. (사람 결정, 짧게) R2-02: 2장에 동시 입력 규칙 한 줄 확정. 그 다음 V-2 를 그 규칙으로 고정.
4. (계획 수정) R2-04: V-7 추가 또는 반복 구동을 R1b 소유로 명시.
5. (계획 수정) R2-05: §10-3 을 R1a 게이트에서 제거.

## Architectural Status

WATCH

이유: 방향은 맞고 pass 1 의 blocker 는 해소됐다. 그러나 R1a 실행 순서(R2-03)와 2장 입력 규칙(R2-02)이 아직 계획에 연결되어 있지 않다. 이 둘이 정리되면 CLEAR 로 올릴 수 있다. 악화는 없다.

## Code Review Recommendation

COMMENT. 직전 REQUEST CHANGES 의 blocker 는 해소되었다. 아래 MEDIUM 4건과 LOW 1건은 R1a 착수 전 계획에 반영하는 것을 권장하며 blocking 이 아니다.

## Tradeoffs

| 긴장 | 한쪽 | 다른 쪽 | 권고 |
|------|------|---------|------|
| 진척 vs 기획서 선행 | R1a 를 design-v1 전에 시작 | 2장 표기가 코드보다 늦음 | design-v1 을 R1a 선행 조건으로 (R2-03) |
| 시그니처 단순성 vs 입력 표현 | 단일 dir | 대각선·동시 입력 표현 불가 | 2장 규칙 확정 후 V-2 고정 (R2-02) |
| 로직 순수성 vs 반복 구동 | 반복은 caller 책임 | R1a 가 2장 전체를 닫지 못함 | V-7 추가 또는 R1b 소유 명시 (R2-04) |
| 게이트 엄격성 vs 과잉 블로커 | 파일명까지 사람 결정 | R1a 지연 | 파일명 게이트 제거 (R2-05) |
