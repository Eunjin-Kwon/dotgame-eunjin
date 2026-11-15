# Critic 재리뷰 pass 2 — R2 plan (stage-02-revision.md, sha256 [REDACTED], stage_n 2)

기준: stage-01-critic.md (sha [REDACTED], ITERATE, F1~F10). Architect: stage-02-architect.md (WATCH/COMMENT, AR2-01~AR2-03). 이 리뷰는 delta만 본다.

## Verdict
**OKAY**

## F1~F10 해소 상태 (pass 1 대비)
| 지적 | 상태 | 근거 (stage-02-revision.md) |
|---|---|---|
| F1 시계 혼용 | 해소 | 아키텍처 결정 '시계는 프레임 nowMs 하나', S4에서 performance.now() 제거, F6을 범위 안으로 편입. 소스(main.js:33)는 아직 구버전이며 계획은 구현 전 상태를 올바르게 기술한다 |
| F2 wiring 헬퍼 | 해소 | W0(fillStyle===PALETTE[2]), 그리기 순서 level→dewdrops→spider→firefly→HUD, test/wiring.test.js를 S4 변경 목록에 명시 |
| F3 동시 틱 테스트 | 해소 | G2-11(O3, 접촉 우선), G3-10(O2, 클리어 우선) |
| F4 정지 후 규칙 | 해소 | goal-2 '정지 후 규칙': phase!=='play'이면 advance 즉시 반환, G2-12, 수용 14·15·17 확인 항목에 방향키 무반응 추가 |
| F5 타이틀·테스트 이관 | 해소 | 3장 타이틀 입력 규칙, goal-3 이관 표, G3-11, W1, goal-2 페이지 로드 시작 / goal-3 Enter 시작 (AR-13) |
| F6 타이머 표현 | 해소 | 정수 초 단일 모델, nextSecondAt 재기준, G3-1 픽스처 37 → 1170 |
| F7 갱신 순서 | 해소 | 틱 순서 6단계 확정, isContact(player, spider). 검증: 플레이어가 먼저 움직이므로 맞바꿈은 2단계에서, 거미가 먼저 움직인 틱은 5단계에서 같은 칸으로 잡힌다. 두 경우 모두 참 |
| F8 좌표 이중 기록 | 해소 | 5장 좌표 문장 제거(Step 0 F8 항목), L3·L4·L6이 맵 문자에서 계산 |
| F9 HEAD·1~5번 | 해소 | 리뷰 HEAD bdb637f와 현재 HEAD 7ca8b79 구분, 9장 1~5 머리말 'R1 게이트 미통과'. HEAD 값은 pass 1 git log와 일치 |
| F10 옵션 근거 | 해소 | 옵션 A 기각 근거가 Decision Driver 2(테스트 가능성)로 한정됨 |

수치 추적: 8 / 300 ms / 60 s / 100 / 10 / 16×12 / 32 px / 8색 / 26항목 / 150 ms 전부 R2_decisions.md 또는 GAME_DESIGN.md와 일치. 기능 추가 없음. 대기열(O9)과 정지 규칙은 기존 2장 잠금·'끝난 뒤' 규칙에서 파생된 것이며 수용 2를 지키기 위한 최소 규칙이다.

## Architect 산출물 반대 검토 (rule 5)
- AR2-01 (createWorld 시작 앵커, MEDIUM): 실제 공백으로 인정한다. createWorld(level)만으로는 startedAt을 정할 수 없고, goal-2는 '첫 프레임 nowMs = startedAt', goal-3 G3-3은 '그 프레임 nowMs'를 요구한다. 과장은 아니다. 비차단으로 둔다. 해결은 한 줄이면 된다(createWorld가 startedAt=null을 두고 advance가 play에서 처음 받은 nowMs로 채운다, 또는 startPlay(world, nowMs)).
- AR2-02 (재기준 시 이동 여부, LOW): 인정. 비차단.
- AR2-03 (O9 탭 대기열을 2장 행으로, LOW): 인정. 수용 2 보존의 파생 규칙이므로 기획서에 행으로 올리는 것이 AGENTS '기획서에 없는 것은 만들지 않는다'와 맞다.
- 인플레이션 판정: 발견 없음. 3건 모두 goal-2/3 계약 안이고 새 기능·새 숫자를 요구하지 않는다. Architect 판정(WATCH/COMMENT)은 단조성을 지키며, 이 리뷰의 verdict를 끌어올리거나 내리는 근거로 쓰지 않았다.

## 새 지적 (pass 2, rule 2 적용)
### N1 — MEDIUM — 출처 표기 불일치
- findingId: N1
- targetId: 문서 머릿말 '표기 규칙(AR-12)', Step 0 '사람 확인 → 커밋', Intent Reconciliation 머리말
- action: change
- 근거: R2_decisions.md 머리말은 '모든 값은 제안이다. 확정되면 gjc에 그대로 준다'라고 한다. stage-02-revision.md '사람 확인 → 커밋' 문단은 같은 문장에서 'R2_decisions 값은 아직 사람 확인 전'이라 하면서 라벨은 '(사람 결정 H절)'로 쓴다. 이 라벨은 AR-12 표기 규칙 변경으로 pass 2에서 새로 생겼으므로 rule 2의 새 지적에 해당한다.
- 요구: 라벨을 '(사람 제안 H절, 확정 대기)'로 바꾸거나, 사람의 확정 기록을 근거 receipt로 인용한다. design-v2 본문에 '사람 결정'을 쓰는 것은 사람 확인 후 커밋 시점부터 허용한다.
- 비차단: 최종 확인은 design-v2 사람 게이트에서 이뤄진다. S0 작성 때 라벨만 고치면 된다.

### N2 — LOW — D절 원문 문구 변경
- findingId: N2
- targetId: Step 0 '2장 나머지 행' 점수 행
- action: change
- 근거: R2_decisions.md D절은 '클리어 때 남은 시간 1초(내림)당 10점'이라 쓴다. 계획의 design-v2 점수 행은 '100점 + 남은 초당 10점'으로 '(내림)'을 뺐고, 그 대신 '1초(내림)은 값을 바꾸지 않는다'는 에이전트 제안 문장을 덧붙였다. 숫자는 그대로지만 사람이 쓴 문장이 바뀌었다.
- 요구: 점수 행을 D절 원문 그대로 두고, '(내림) 무효' 문장은 '(에이전트 제안)' 주석으로 분리해 게이트에서 사람이 고르게 한다.
- 비차단: 값 변화가 없고 사람 게이트에서 확인된다.

## Missing Evidence
- 확정 부족 항목 없음. 확인 불가 항목(16px 글자 메트릭, 129칸 도달 실행 검증, 실제 프레임 간격)은 계획 안에서 이미 '미검증'으로 표기되고 수동 확인 또는 L6 테스트에 연결되어 있다.
- 이 리뷰는 stage-02-architect.md와 stage-02-revision.md 본문을 읽기로 대조했다. receipt sha는 재계산하지 않았다.

## Approval Boundary
- 진행 가능: S0 design-v2 작성(N1·N2 반영) → 사람이 맞다/아니다 확인 → design-v2 커밋.
- S2 착수 전: AR2-01 한 줄 규칙을 계획에 반영(createWorld startedAt=null, advance가 채움 또는 startPlay).
- 승인 밖: 숫자 변경, 기획서 밖 기능, goal-2/3 범위 확장, 레벨 2·3.
- 리뷰 상한: 이 pass가 계획의 2회 상한이다. 추가 critic pass는 없다. AR2-01 반영 여부는 Architect 3차 리뷰에서 확인된다.

## Summary
- Clarity: 상. 표기 라벨 하나(N1)를 제외하면 확정/제안 구분이 명확하다.
- Verifiability: 상. 수용 기준 대부분이 테스트 ID와 1:1로 연결되고, 7·26만 수동으로 명시되어 있다.
- Completeness: 상. 정지 후 동작, 타이틀 입력, 동시 틱 우선순위, 리셋 키 비우기가 모두 정의됐다(AR2-01 한 줄 제외).
- Big Picture: 상. 기획서 우선, goal 2개 분리, 단일 advance 파이프라인, 기능 추가 없음.
- Principle/Option Consistency: 상. 단일 시계 원칙과 옵션 B 채택이 일관된다.
- Alternatives Depth: 중상. 아키텍처 3안과 실행 순서 2안이 근거와 함께 있다.
- Risk/Verification Rigor: 상. 위험 표의 완화책이 테스트 ID와 맞는다.

## Required Changes
차단 항목 없음. 비차단 반영 권고(S0·S2 작성 중 적용): N1 라벨 수정, N2 D절 원문 복원, AR2-01 createWorld 시작 앵커 한 줄.
