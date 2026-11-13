# Architect 리뷰 pass 1 — R1 반딧불이 한 칸 이동

- stage: architect / stage_n 1
- 대상: stage-01-planner.md (sha256 [REDACTED])
- 근거: GAME_DESIGN.md 1·2·4·5·6·9·10장, AGENTS.md, stage-01-planner.md 전문, `git ls-files`(소스 0개 확인)

## Summary

Architectural Status: **WATCH**
Decision: **REQUEST CHANGES**

R1a(src/logic.js 순수 이동 로직 + node --test) 와 R1b(맵·팔레트·렌더·index.html) 분리는 구조적으로 타당하다. logic.js는 canvas를 모르고 맵을 인자로 받는 구조는 AGENTS.md와 맞는다. 다만 (1) 계획이 값 하나(제한 시간 60초)를 기획서 밖에서 만들었고, (2) R1a 테스트가 의존하는 logic.js 경계와 2장 이동 타이밍 해석이 정의되지 않았으며, (3) 계획이 만든 AC-R1-* 를 완료 근거처럼 읽힐 여지가 있다. 이 셋을 고치기 전에 executor가 logic.js와 테스트를 쓰면 5장 확정 때 재작업이 생긴다. CRITICAL/HIGH 없음.

## Claims

- C1: 소스 파일 0개, src/ test/ index.html 없음. 확인됨 (git ls-files: AGENTS.md, GAME_DESIGN.md, .gjc/** 만).
- C2: 2장 7개 숫자(격자, 150 ms, 32 px, 512×384/16×12, 방향키 4개, 벽·화면 밖 제자리, 입력 무시)는 전부 "(에이전트 제안)" 표기. 계획은 이를 그대로 유지하고 사람 확정을 요구한다. 확인됨.
- C3: 5장(맵), 6장(팔레트), 4장(오브젝트), 9장(수용 기준)은 비어 있다. 계획은 이를 발명하지 않고 블로커로 올렸다. 확인됨.
- C4: 계획 §8 "제한 시간 60초" 는 GAME_DESIGN.md 어디에도 없다. 계획이 만든 값. 확인됨 (grep 결과 없음).
- C5: 계획 §5 R1b 표에 src/strings.js 가 생성 대상으로 있다. 7장은 R3 소관.

## Analysis

### Stage 1 — 스펙 준수
- 2장 숫자는 전부 기획서에서 왔다. 16×12 경계(x 0/15, y 0/11)와 512/32=16, 384/32=12 는 정합.
- 계획 Option C(임시 맵/색)는 AGENTS 금지 위반으로 기각한 판단이 맞다.
- 발명된 값: 60초(F-01). 그 외 AC 번호와 경계 좌표는 2장에서 역산 가능.

### Stage 2 — 아키텍처
- 분리 축: 로직(순수) / 데이터(levels) / 표현(sprites, render, index.html). AGENTS 코드 규칙과 일치. 좋다.
- 맵 인터페이스: AGENTS는 5장 문자 규칙을 levels.js에 그대로 복사하고 좌표를 따로 쓰지 말라고 한다. 따라서 문자→통행 가능 여부 변환은 levels.js 한 곳에만 있어야 하고, logic.js는 통행 가능 질의만 받아야 한다. 계획은 이 방향을 말하지만 시그니처를 정하지 않았다(F-02).
- 상태 모델: 계획은 150 ms 를 테스트에서 가짜 시간으로 검증한다고 했지만 시간 인자 이름, 상태 형태, 이동 확정 시점을 정하지 않았다(F-02, F-03).
- 실패 모드: 벽 밖 입력 시 제자리, 잠금 중 입력 무시. 계획은 두 경우 모두 테스트를 요구하므로 실패 모드 자체는 커버된다.
- 완료 근거: AGENTS는 완료 조건이 9장이라고 한다. 9장은 비어 있다. 계획의 AC-R1-* 는 임시로 표기되어 있으나 Summary 와 Option A 의 서술은 R1a가 goal 행동을 보장하는 것처럼 읽힌다(F-04).

### Antithesis (가장 강한 반론)
- 반론: "2장만으로 R1a를 바로 쓰는 것은 기획서 숫자 확정 전에 코드를 고정하는 것이다. 사람이 150 ms를 바꾸면 테스트가 전부 바뀐다."
- 평가: 타당하다. 그러나 숫자는 테스트 상단 상수 한 곳(계획 Risk 표 완화책)으로 모으면 비용이 낮다. 숫자 자체보다 F-03(타이밍 의미)과 F-02(경계 시그니처)가 더 위험하다. 이 둘은 숫자 확정과 무관하게 먼저 정해야 한다.

### Stage 3 — 건설적 종합 (pass 1 한정)
- 권장 경계(제안, 값은 기획서 2장에 따른다):
  - `requestMove(state, dir, nowMs, grid)` 순수 함수. 반환은 새 state.
  - `state = { x, y, lockedUntil }`.
  - `grid = { width, height, blocked(x, y) -> boolean }`. 벽 문자는 logic.js 와 테스트 fixture 어디에도 나타나지 않는다.
  - 이동 확정 시점: 입력 시점에 x,y 를 바꾸고 lockedUntil = now + 150 (가장 작은 상태). 대안(도착 시 확정)은 pendingTarget, startedAt 이 추가되어 상태가 커진다. 사람이 2장에서 고르게 한다.
  - 시작 위치는 5장 확정 전까지 테스트 fixture 값이며, 레벨 데이터가 아니라고 주석으로 명시한다.

## Root Cause

계획의 결함 원인은 하나다: 2장 표를 "값이 다 있다"로 읽고 값이 아닌 의미(타이밍, 경계 시그니처, 완료 근거)를 확인하지 않은 점. 그래서 테스트 기대값을 먼저 정할 수 있다고 본 것이다.

## Findings

| id | 심각도 | 위치 | 문제 | 수정 |
|----|--------|------|------|------|
| F-01 | MEDIUM (P2) | stage-01-planner.md §8 | 제한 시간 60초: GAME_DESIGN에 없는 값을 계획이 만듦 (AGENTS 금지 위반) | 숫자 삭제. "타이머 — 기획서 미정의" 로 표기 |
| F-02 | MEDIUM (P2) | stage-01-planner.md §5, GAME_DESIGN 2장 | logic.js 경계(상태 형태, 통행 질의 방식, 시간 인자, 시작 위치) 미정의. 테스트 AC-R1-3/4/5 가 결정적으로 쓰일 수 없음 | §5에 시그니처 명시. 벽 문자는 logic/fixture 어디에도 쓰지 않음 |
| F-03 | MEDIUM (P2) | GAME_DESIGN 2장 이동 규칙 | "한 칸 이동 시간 150 ms" 의 확정 시점(입력 시 vs 도착 시) 미정의. AC-R1-1 과 AC-R1-5 가 한 해석만 가정 | 사람이 2장에 해석을 적고 확정. 권장: 입력 시 확정 + 잠금 150 ms |
| F-04 | MEDIUM (P2) | stage-01-planner.md §6, Summary | 계획 자작 AC 가 완료 근거처럼 읽힘. AGENTS는 완료 = 9장 | R1a는 2장 단위 계약(AC-R1-1..6)만 닫는다고 명시. goal 1은 열린 상태 유지 |
| F-05 | LOW (P3) | stage-01-planner.md §5 R1b 표 | src/strings.js 생성 대상 표기. 7장은 R3, R1에 UI 문구 없음 | R1b 목록에서 제거 |
| F-06 | LOW (P3) | stage-01-planner.md §5 / AGENTS 커밋 규칙 | goal 1 커밋 단위 모호. R1a를 goal-1 로 커밋하면 완료로 오인될 수 있음 | R1a 커밋 시 goal-1 partial 명시, 또는 R1b 완료 시 단일 커밋 |

CRITICAL/HIGH 없음. 1차 리뷰이므로 CRITICAL/HIGH 는 blocking 대상이며 해당 없음.

## Recommendations

1. (사람, 선행) GAME_DESIGN 2장에 이동 확정 시점(F-03)을 적고 확정 표기 유지. 숫자 확정 여부도 함께.
2. (계획 수정) §5 에 logic.js 시그니처와 상태 형태 추가(F-02). 벽 문자 금지 문구 추가.
3. (계획 수정) §8 60초 삭제(F-01). §5 R1b 에서 strings.js 제거(F-05).
4. (계획 수정) Summary 와 §6 에 "R1a는 2장 단위 계약만 닫는다, goal 1 은 열림" 명시(F-04). 커밋 규칙 명시(F-06).
5. R1a executor 착수는 1~4 가 끝난 뒤. 그 전에는 logic.js 를 쓰지 않는다.

## Architectural Status

WATCH

이유: 설계 방향은 맞지만, R1a가 의존하는 경계와 타이밍 해석이 기획·계획 수준에서 아직 정해지지 않았다. 5장·6장·4장·9장 블로커는 계획이 정확히 올렸다. BLOCK은 아니다. 계획이 수정되면 CLEAR 로 올릴 수 있다.

## Code Review Recommendation

REQUEST CHANGES (F-01, F-02, F-03, F-04 를 수정하고 재리뷰 요청). F-05, F-06 은 수정 권장이며 blocking 아님.

## Tradeoffs

| 긴장 | 한쪽 | 다른 쪽 | 권고 |
|------|------|---------|------|
| 진척 vs 발명 금지 | R1a 즉시 착수 | 5·6장 공백 상태의 코드 고정 | R1a는 2장 숫자만, 경계 계약 확정 후 착수 |
| 상태 최소화 vs 의미 명확성 | 입력 시 확정(상태 작음) | 도착 시 확정(의미상 자연스러움, 상태 큼) | 입력 시 확정 + lockedUntil. 사람 승인 필요 |
| 테스트 결정성 vs 실시간 | 시간 인자 주입 | 실제 타이머 검증 | 시간 인자 주입 |
| fixture 벽 vs 5장 문자 규칙 | fixture 에 임의 벽 문자 | 문자 규칙 선행 노출 | fixture 는 boolean/abstract 벽만 사용 |
| 완료 선언 vs 9장 공백 | R1a 를 goal 완료로 기록 | goal 1 열어 둠 | goal 1 열어 둠. R1a는 2장 계약만 닫음 |
