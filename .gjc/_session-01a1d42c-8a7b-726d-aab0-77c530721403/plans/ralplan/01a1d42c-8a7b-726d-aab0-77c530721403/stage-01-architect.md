# Architect 리뷰 — R2 planner stage-01 (pass 1)

Architectural Status: WATCH
Architect Decision: COMMENT

## Summary
수치와 수용 기준 번호는 R2_decisions.md와 대조해 모두 일치한다(8 / 300 ms / 60 s / 100 / 10 / 16×12 / 32 px / 8색 / 6~17, 18~26). 레벨 1 맵도 v1 벽 좌표와 일치하고, o 8개와 S(13,6)를 행 단위로 확인했다. 구조(순수 logic.js, 그리기 전용 render.js, 배선 main.js)는 맞다. CRITICAL/HIGH는 없다. 다만 틱 순서, 시계 기준, 타이머 모델, goal-2 종료 상태, goal-3 리셋이 계획에 정해져 있지 않아 S2 구현 전에 계획 본문을 고쳐야 한다.

## Claims
- C1 수치 추적: 모든 숫자가 R2_decisions.md 또는 GAME_DESIGN.md에 있다. 단, HUD 16px·베이스라인·여백은 design-v2에 없다(AR-10).
- C2 맵: 5장 B절 12행 16열, 벽 좌표가 v1과 동일, o 8개 좌표 (13,1)(1,3)(13,4)(7,5)(1,8)(11,8)(8,9)(13,10), S=(13,6), P=(2,10). 읽기 대조로 확인(스크립트 실행 안 함).
- C3 점수 예시: 8×100 + floor(37.9)×10 = 1170. 맞다.
- C4 수용 번호: goal-2 6~17, goal-3 18~26, G 문장과 일치.

## Analysis
### 스펙 준수 (Stage 1)
- 불일치 없음. (확정) 태그 출처는 AR-12.

### 구조 (Stage 2)
- 계획의 강점: 규칙을 logic.js 순수 함수로 두고 node 테스트로 고정. 옵션 2·3 기각 근거도 맞다.
- 약점: 틱 순서가 main.js에 남는다. O2·O3 같은 동시 사건 규칙이 테스트되지 않는 main.js에 들어간다. 원칙 2를 어긴다.
- 현재 코드 사실: src/main.js:33 keydown은 performance.now()로 이동한다. src/main.js:48 frame은 rAF nowMs를 쓴다. 두 시계가 섞여 있다(AR-01).
- test/wiring.test.js:53은 w===4 사각형으로 firefly를 찾는다. 4px 스프라이트가 추가되면 깨진다(AR-09).

### 종합 제안 (Stage 3, pass 1)
- 옵션 B(채택 권고): logic.js에 createWorld(level)와 advance(world, nowMs, input)를 둔다. world.phase = play|won|lost. 틱 순서는 AR-02 참고. main.js는 입력 큐와 draw만 한다. 구현 비용은 S2에 조금 더 들고, S4·S5의 재작업이 없다.
- 옵션 A(계획 원안): 규칙 함수 여러 개를 main.js가 호출. 순서 버그가 테스트 밖에 남는다.
- 옵션 C: keydown에서 바로 이동(현행). 시계 혼용이 남는다.

### 안티테제
- 원안 옵션 A의 가장 강한 이유는 S2를 작게 자르는 것이다. 그러나 순서 규칙은 작은 함수 하나로 충분하고, 그 함수는 테스트할 수 있다.

## Root Cause
계획이 규칙(무엇)은 정했지만 실행 순서와 상태 모양(언제, 어떤 상태에서)은 정하지 않았다. 그래서 같은 문제가 goal별로 다른 자리에서 다시 나온다.

## Findings
- findingId: AR-01 | targetId: 리스크표 rAF/performance.now 행, S4 main.js | action: change | severity: MEDIUM | evidence: src/main.js:33, src/main.js:48, 계획 L51·L234. 대책: 키 입력은 대기열에만 넣고 frame nowMs로 소비. F6를 범위 안으로.
- findingId: AR-02 | targetId: S2 logic.js 함수 목록 | action: add | severity: MEDIUM | evidence: 계획 L104, L214-215, R2_decisions.md:59, src/main.js:33. 대책: advance(world, nowMs) 단일 파이프라인. 순서 = 플레이어 이동 → 접촉 → 수집(8개면 won 후 반환) → 거미 이동 → 접촉 → 타이머(won/lost 아닐 때만).
- findingId: AR-03 | targetId: G3-1, tickTimer | action: change | severity: MEDIUM | evidence: 계획 L104, L187, L218, R2_decisions.md:58·60. 대책: timeLeft 정수 1초 단위 하나로 통일. G3-1 기대값은 37초 기준.
- findingId: AR-04 | targetId: stepSpider, tickTimer 간격 규칙 | action: change | severity: MEDIUM | evidence: 계획 L104, src/logic.js requestMove(lockedUntil = now+150). 대책: nextStepAt += 300, 한 호출에 한 칸, 지연이 한 주기를 넘으면 재기준.
- findingId: AR-05 | targetId: isContact 4인자 | action: change | severity: LOW | evidence: 계획 L104, L183, L235. 대책: 칸을 한 칸 옮길 때마다 같은 칸 검사. 인접 맞바꿈은 첫 이동 때 같은 칸으로 잡힌다. G2-7·G2-8은 advance로 테스트.
- findingId: AR-06 | targetId: goal-2 규칙 8/8 | action: add | severity: MEDIUM | evidence: 계획 L87-88, R2_decisions.md:59. 대책: goal-2에서 won으로 멈춤, 화면은 goal-3. 테스트 추가.
- findingId: AR-07 | targetId: goal-2 정지 플래그 vs goal-3 nextScreen | action: change | severity: MEDIUM | evidence: 계획 L87-88, L104, L115-120, L244. 대책: goal-2에서 phase 열거형과 createWorld 도입. goal-3은 값만 추가.
- findingId: AR-08 | targetId: G3-6 | action: change | severity: MEDIUM | evidence: 계획 L192, R2_decisions.md 수용 23. 대책: 리셋 = createWorld(level). 플레이어 P, 거미 S(왼쪽), 잠금 해제, 타이머 기준 초기화, 누른 키 목록 비우기. 테스트로 고정.
- findingId: AR-09 | targetId: 리스크표, wiring 테스트 | action: add | severity: MEDIUM | evidence: test/wiring.test.js:53, 계획 L105, L233-240. 대책: firefly를 마지막에 그리고 fillStyle로 찾기. 리스크 행 추가. logic.js 주석에도 canvas·document·window 단어 금지(logic.test.js V-6).
- findingId: AR-10 | targetId: Step0 design-v2 목록 | action: add | severity: MEDIUM | evidence: 계획 L56-61, L93-97, L217. AGENTS.md '기획서에 없는 것은 만들지 않는다'. 대책: HUD 폰트·베이스라인·여백·높이를 design-v2에 (에이전트 제안)으로 추가.
- findingId: AR-11 | targetId: S3 sprites.js | action: add | severity: MEDIUM | evidence: 계획 L105, GAME_DESIGN.md 4장(크기·색만 있음). 대책: 8×8 그림을 design-v2 4장에 넣거나 (에이전트 제안)으로 표시.
- findingId: AR-12 | targetId: 목표 값 태그 | action: change | severity: LOW | evidence: 계획 L85-95, L219, R2_decisions.md 머리말 '모든 값은 제안이다', 계획 L64-65 게이트. 대책: 사람 확인 전에는 '(확정)' 대신 '(사람 결정 H절)'.
- findingId: AR-13 | targetId: O1, W1 | action: change | severity: LOW | evidence: 계획 L89, L196, L213. 대책: goal-2는 페이지 로드 시작, goal-3부터 Enter. O1·W1에 반영.
- findingId: AR-14 | targetId: Known state | action: change | severity: LOW | evidence: 계획 L49-51, STOP-REASON.md(리뷰 HEAD bdb637f, 현재 HEAD 7ca8b79). 대책: 리뷰된 HEAD와 현재 HEAD를 구분. R1 미해결 항목(architect REQUEST CHANGES, cleaner '와이어링 순서 의존', critic 적색팀 누락)을 이어받는다고 명시.
- findingId: AR-15 | targetId: HUD 행 | action: change | severity: LOW | evidence: 계획 L92-97, L237. 대책: design-v2 HUD 절에 'HUD는 맨 윗줄(벽 줄) 위에 그린다'고 명시. 캔버스 크기는 바꾸지 않는다(수용 1).

## Recommendations
1. S0 전에: AR-10, AR-11, AR-12, AR-15를 design-v2 초안에 반영하고, 사람 게이트에서 함께 확인받는다.
2. S2 전에: AR-02, AR-03, AR-04, AR-06, AR-07, AR-08을 계획에 반영한다. 특히 createWorld, advance 순서, 정수 초 타이머, 재기준 규칙.
3. S4 전에: AR-01, AR-09를 반영한다. 키 입력 대기열, firefly 마지막 그리기.
4. AR-05, AR-13, AR-14는 문장 수정으로 끝난다.

## Architectural Status
WATCH

## Code Review Recommendation
COMMENT

## Tradeoffs
| 옵션 | 장점 | 단점 |
|---|---|---|
| A 원안(규칙 함수 + main 순서) | S2 작음 | 순서 버그가 테스트 밖 |
| B 단일 advance + createWorld (권고) | 순서·리셋·phase가 한 곳, goal-3 재작업 없음 | S2 약간 큼 |
| C keydown 즉시 이동 유지 | 입력 지연 0 | 시계 혼용, 접촉·수집을 두 곳에서 호출 |

## Pass
1차 리뷰. 2차 리뷰 때는 이 조치들의 해결 여부만 본다.
