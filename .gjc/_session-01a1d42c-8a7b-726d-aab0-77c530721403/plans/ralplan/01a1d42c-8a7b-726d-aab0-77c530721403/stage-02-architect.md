# Architect 재리뷰 pass 2 - R2 planner stage-02 (revision)

Architectural Status: WATCH
Architect Decision: COMMENT

## Summary
AR-01~AR-15 전부 stage-02에서 해소 표시 및 본문 반영을 확인했다. 단일 시계(AR-01), advance 단일 틱 순서(AR-02), 정수 초 타이머(AR-03), 거미 재기준(AR-04), isContact 인자 제거(AR-05), goal-2 won 동결(AR-06), phase 열거형(AR-07), 리셋 키 비우기(AR-08), 그리기 순서와 fillStyle 식별(AR-09), HUD·스프라이트를 design-v2에 올림(AR-10·11·15), 태그 교체(AR-12), 시작 시점 분리(AR-13), HEAD·상속 항목 구분(AR-14)이 모두 본문에 있다. 새 지적은 MEDIUM 1건과 LOW 2건이며 전부 non-blocking이다. 이 중 createWorld의 시간 기준 문제는 pass 2 수정이 만든 새 공백이므로 S2 전에 고친다. 판정은 WATCH/COMMENT 유지(단조성: 상향 없음).

## Claims
- C1 해소 확인: AR-01~AR-15 각각 stage-02 본문 위치를 대조했다(아래 표).
- C2 새 항목: createWorld(level)에 시간 인자가 없어 goal-2 시작 앵커와 goal-3 리셋 앵커를 정할 수 없다. 리셋 후 phase가 play인지 title인지도 정해지지 않았다(AR2-01).
- C3 수치 추적 유지: 8 / 300 ms / 60 s / 100 / 10 / 16x12 / 32 px / 8색 / 26항목 / 150 ms가 R2_decisions.md 또는 GAME_DESIGN.md와 일치한다.
- C4 맵: 5장 좌표 문장은 제거됐다(F8). 맵 검증은 L3·L4·L6 테스트로 닫는다.

## Analysis
### 스펙 준수 (Stage 1)
- 수용 1~26 번호와 G 문장은 R2_decisions.md와 일치한다. 1~5의 머리말은 R1 게이트 미통과 상태로 바뀌었다(AR-14·F9).
- 점수 식은 collected*100 + timeLeft*10이다. 정수 초에서 '내림'은 아무것도 바꾸지 않는다. 사람 D절의 '1초(내림)' 문장은 wording이 바뀌었으므로 게이트에서 사람이 명시적으로 봐야 한다(LOW, AR2-03과 같은 게이트 항목).

### 구조 (Stage 2)
- 틱 순서 검증: 플레이어 이동 후 접촉, 수집, 거미 이동, 접촉, 타이머. 맞바꿈은 플레이어가 먼저 움직이면 2단계에서, 거미가 먼저 움직이면 5단계에서 같은 칸으로 잡힌다. isContact(player, spider) 인자 두 개로 충분하다.
- O2·O3 우선순위가 한 함수 안에서 테스트된다(G2-11, G3-10). AR-02의 목적을 달성했다.
- 거미 벽 반전 규칙을 26스텝 왕복(x=1~14)과 대조했다. 벽에서 돌아서며 같은 틱에 한 칸 움직이는 규칙이면 주기가 26이다. 일관된다.
- 시계는 프레임 nowMs 하나다. keydown에서 performance.now()를 쓰지 않는다. 대기열(O9)로 탭 보장.
- 그리기 순서 level→dewdrops→spider→firefly→HUD와 PALETTE[2] 식별은 스프라이트 색 인덱스 2가 firefly 전용이라 충돌하지 않는다(dewdrop 5, spider 6·7). 확인 완료.

### 안티테제
- 정지 후 동결(won/lost 동안 타이머 정지)은 HUD가 결과 화면에서도 같은 값을 보여 준다는 장점이 있지만, 사람이 기대하는 것이 '멈추는 순간 값 고정'인지 '계속 표시'인지는 O4·A절에 명시되지 않았다. 판정에는 영향이 없다.
- 대기열 O9는 탭 보장을 위해 입력 의미를 바꾼다. 장점은 크고 비용은 한 프레임이다.

### 종합 제안 (Stage 3)
- 옵션 B(createWorld + advance, phase)를 유지한다. 추가 제안: createWorld(level, nowMs)로 시작 앵커를 받게 하거나 startPlay(world, nowMs)를 둔다(AR2-01).
- 거미 재기준 시 이동 여부를 한 줄로 고정한다(AR2-02).

## Root Cause
pass 1의 근본 원인(규칙은 정했지만 순서·상태 모양을 정하지 않음)은 pass 2에서 해소됐다. 남은 공백은 같은 원인이 createWorld의 시간 인자에서 한 번 더 나온 것이다.

## AR 해소 표
| AR | 상태 | stage-02 위치 |
|---|---|---|
| AR-01 시계 혼용 | 해소 | 아키텍처 결정 시계 항목, S4, 범위 |
| AR-02 틱 순서 | 해소 | 한 틱 순서 절(1~6단계) |
| AR-03 타이머 모델 | 해소 | 타이머 모델 절, G3-1 픽스처 37 |
| AR-04 거미 간격 | 해소(경계 한 줄 남음) | 거미 이동 간격 절, G2-13 (AR2-02) |
| AR-05 isContact 4인자 | 해소 | 틱 순서 절, 파일별 변경 isContact(player, spider) |
| AR-06 8/8 후 규칙 | 해소 | goal-2 규칙, G2-12 |
| AR-07 phase/createWorld | 해소(시간 인자 공백 1개) | 상태와 파이프라인, AR2-01 |
| AR-08 리셋 범위 | 해소(시간 앵커 공백은 AR2-01) | goal-3 규칙, G3-6 |
| AR-09 wiring 헬퍼·V-6 | 해소 | 파일별 변경 test/wiring.test.js, W0, V-6 |
| AR-10 HUD design-v2 | 해소 | Step 0 HUD 절 |
| AR-11 스프라이트 그림 | 해소(게이트에서 사람 확인) | Step 0 4장 |
| AR-12 태그 | 해소 | 머릿말 표기 규칙 |
| AR-13 시작 시점 | 해소 | 시작 시점 절, O1, W1 |
| AR-14 HEAD·상속 | 해소 | Known state |
| AR-15 HUD 벽 줄 | 해소 | Step 0 HUD 절 |

## Findings
- findingId: AR2-01 | targetId: 상태와 파이프라인 createWorld, goal-3 리셋 | action: change | severity: MEDIUM | evidence: stage-02 L117-124, goal-3 규칙 'lost에서 Enter → createWorld(level)'. 새 공백: createWorld(level)에 nowMs가 없어 시작·리셋 앵커를 정할 수 없고, 리셋 후 phase가 play인지 title인지 정해지지 않았다. 대책: createWorld(level, nowMs) 또는 startPlay(world, nowMs). lost+Enter는 phase play, 앵커 = Enter 프레임 nowMs. G3-6 확장. 비차단(새 지적, pass 1에 createWorld가 없었음).
- findingId: AR2-02 | targetId: 거미·타이머 재기준 규칙 | action: change | severity: LOW | evidence: stage-02 거미 이동 간격 절, 타이머 모델 절, G2-13. 대책: 재기준 호출에서 이동하는지 한 줄로 고정. 비차단.
- findingId: AR2-03 | targetId: design-v2 2장 행 목록, O9 | action: add | severity: LOW | evidence: stage-02 Intent Reconciliation O9, Step 0 2장 행 목록, AGENTS.md '기획서에 없는 것은 만들지 않는다'. 대책: 탭 대기열 규칙을 2장 행으로 추가(에이전트 제안). 비차단.

## Recommendations
1. S0 전: AR2-03 반영(2장 행). 점수 행의 '(내림)' 무효화 문장을 게이트 확인 목록에 명시(사람이 D절 문장과 대조).
2. S2 전: AR2-01 반영(createWorld 시간 인자 또는 startPlay, 리셋 phase = play). AR2-02 한 줄 고정.
3. 그 밖의 항목은 구현 중 조정 가능.

## Architectural Status
WATCH

## Code Review Recommendation
COMMENT

## Tradeoffs
| 옵션 | 장점 | 단점 |
|---|---|---|
| B createWorld + advance (채택) | 순서·리셋·phase 한 곳 | createWorld 시간 인자 설계가 한 번 더 필요(AR2-01) |
| A 규칙 함수 + main 순서 (기각) | S2 작음 | 순서 버그가 테스트 밖 |
| C keydown 즉시 이동 (기각) | 입력 지연 0 | 시계 혼용 |

## Pass
2차 리뷰. 판정 WATCH/COMMENT 유지(단조성: 1차 WATCH/COMMENT보다 나빠지지 않음, 개선도 없음 — 남은 공백 때문). 3차 리뷰는 AR2-01 반영 여부만 본다.
