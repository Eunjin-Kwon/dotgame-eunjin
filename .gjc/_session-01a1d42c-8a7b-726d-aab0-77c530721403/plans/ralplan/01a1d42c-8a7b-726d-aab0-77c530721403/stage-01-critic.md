# Critic 리뷰 pass 1 — R2 plan (stage-01-planner.md, sha256 [REDACTED])

## Verdict
**ITERATE**

## Claim Checks (검증됨)
- 5장 v2 맵의 벽 좌표는 v1과 행별로 동일하다. 내부 벽 11칸, 가장자리 전부 벽. 근거: src/levels.js LEVEL_1_ROWS와 GAME_DESIGN.md 5장 v1 블록 대조. 계획의 행별 벽 x좌표 목록(y1~y11)과 일치.
- P=(2,10) 유지(levels.js 행10 `#.P`). 이슬방울 8개 (13,1)(1,3)(13,4)(7,5)(1,8)(11,8)(8,9)(13,10)은 모두 바닥 칸. S=(13,6), 행6은 x=1~14 바닥. 왕복 26스텝 x 300 ms = 7.8 s 일치.
- 바닥 칸 수: 16x12 중 가장자리 52칸 제외 내부 140칸 - 내부 벽 11 = 129. R2_decisions.md 주장과 일치. 단 'P에서 전부 도달 가능' 주장은 실행하지 않아 미검증.
- 숫자 추적: 8개 / 300 ms / 60 s / 100점 / 10점 / 16x12 / 32 px / 8색 / 26항목은 R2_decisions.md A·F절과 일치. 150 ms 잠금은 src/logic.js MOVE_LOCK_MS=150과 일치. 에이전트 제안 값(16px, 베이스라인 22, x=8/504, O1~O8)은 '(에이전트 제안)'으로 표기됨.
- Known state: STOP-REASON.md 존재, 마지막 리뷰 해시 ab3b8d18...78a0fb, 'fix-2 이전 빌드 기준 브라우저 확인' 한계 기록 일치. 단 현재 HEAD는 7ca8b79(fix-6)다.
- 기능 추가 없음: 사운드·일시정지·추가 적·레벨 2/3 등 기획서 밖 항목은 발견되지 않음. 실행 정책(goal당 품질 게이트 1회, 기록 후 진행)은 사용자 합의와 일치.
- 수용 기준 매핑: 6→L1~L3, 8→W2, 9→G2-10+수동, 10→G2-1, 11→G2-2, 12→G2-3/4, 13→G2-5, 14→G2-6, 15→G2-7/8, 16·17→G2-9, 18→G3-3, 19→G3-4, 20→G3-1, 21·22→G3-5, 23→G3-6, 24→G3-7, 25→G3-8. 7·26은 자동 테스트 없이 수동 확인만 있음(허용하되 명시됨).

## Findings

### F1 — blocker, high — 상충 (Risk 표 / 범위 밖)
- findingId: F1
- targetId: Risks and mitigations 행 'rAF 시각과 performance.now() 혼용'; In scope/out of scope
- action: change
- 근거: src/main.js:33 `requestMove(state, dir, performance.now(), level)` — keydown은 performance.now()를 쓴다. 계획은 'main.js는 프레임 콜백 인자 nowMs 하나만 쓴다'라고 완화책을 적었으나 현재 코드와 다르다. 같은 계획의 범위 밖 목록은 'F6 수정'을 제외한다.
- 요구: 둘 중 하나를 확정하고 문장을 맞춘다. (a) 시계를 하나로 통일하는 최소 변경을 goal-2 파일별 변경에 넣거나, (b) F6를 범위 안에 두고 완화책을 사실대로 고친다. 타이머(60 s)와 거미(300 ms)가 같은 시계를 쓰는지 명시한다.

### F2 — blocker, high — 누락 (테스트 헬퍼 깨짐)
- findingId: F2
- targetId: goal-2 파일별 변경 `src/render.js`·`test/*.js`; 자동 테스트 표
- action: add
- 근거: test/wiring.test.js:53 `app.fillRects.find((r) => r.w === 4)`가 반딧불이 위치를 '첫 4x4 사각형'으로 찾는다. src/main.js:50-51은 drawLevel 다음 drawFirefly 순서로 그린다. SPRITE_SCALE=4(src/sprites.js)이므로 이슬방울·거미 스프라이트가 반딧불이보다 먼저 그려지면 헬퍼가 다른 물체 좌표를 읽는다. 기존 startup·keydown·keyup·blur·잠금 wiring 테스트가 모두 깨진다.
- 요구: 헬퍼 수정 방식(그리기 순서 고정 또는 PALETTE[2] 색으로 식별)을 계획에 쓰고 변경 파일 목록에 test/wiring.test.js 수정을 명시한다.

### F3 — blocker, high — 누락 (보장되지 않은 테스트)
- findingId: F3
- targetId: Risks 행 '한 틱 동시 사건 우선순위'; 자동 테스트 표 G2·G3
- action: add
- 근거: 위험 표는 'O2·O3을 ... 테스트로 고정'이라고 하지만 테스트 표에 해당 ID가 없다. 같은 틱 방울 수집+거미 접촉(O3, 접촉 우선 → 실패), 마지막 방울 수집+시간 0 동시(O2, 클리어 우선) 두 케이스가 빠져 있다.
- 요구: G2-11(수집과 접촉 동시 → 실패, 방울 수는 1 증가하지만 점수는 0), G3-10(마지막 방울과 시간 0 동시 → 클리어) 등 기대값을 추가한다. 'O2·O3 우선순위 테스트' 항목을 정확히 명시한다.

### F4 — blocker, high — 규칙 공백 (goal-2 정지 후 동작)
- findingId: F4
- targetId: goal-2 규칙 '접촉 ... 즉시 정지' · '제한 시간 ... 0에서 정지'; 수용 14·15·17
- action: add
- 근거: D절 '끝난 뒤 — 클리어나 실패 후에는 방향키 입력을 받지 않는다'(R2_decisions.md D절)는 goal-2에도 적용되어야 하지만, 계획은 goal-2에서 '정지 플래그'만 말한다. 정지 후 거미 이동·타이머 진행·방향키 입력을 어떻게 막는지 정의하지 않았다. G3-8은 clear·fail에서만 검사한다.
- 요구: goal-2에 '정지 후 플레이어·거미·타이머가 모두 멈추고 방향키를 무시한다'를 규칙으로 쓰고 G2-12 테스트를 추가한다. 수용 14·15·17 확인 항목에도 '멈춘 뒤 방향키가 반응하지 않는다'를 넣는다.

### F5 — blocker, medium-high — 누락 (goal-3 테스트 이관)
- findingId: F5
- targetId: goal-3 규칙 '타이틀 → Enter → 플레이'; 테스트 목록; S6
- action: add
- 근거: 타이틀 도입 후 test/wiring.test.js의 startup 테스트(부팅 직후 (2,10))와 방향키 즉시 이동 테스트는 플레이 진입 전 입력을 가정한다. 타이틀에서 방향키를 무시하는지, 타이틀에서 반딧불이를 그리는지 계획에 없다. wiring.test.js:93-95의 'Enter는 무시된다' 테스트는 goal-3에서 Enter가 플레이를 시작하므로 의미가 바뀐다. goal-2는 '페이지 로드 = 플레이 시작'(조건문으로만 기술)이고 O1은 'Enter 시작'이라 goal 사이에 시작 규칙이 달라진다.
- 요구: (a) 타이틀에서 방향키·타이머·거미의 동작을 명시, (b) 이관할 기존 wiring 테스트 목록과 수정 내용, (c) goal-2→goal-3에서 시작 시점이 바뀌는 지점을 한 문장으로 명시.

### F6 — thin, medium — 모호 (타이머 표현)
- findingId: F6
- targetId: goal-3 규칙 '점수 = ... 남은 시간의 정수 초(내림)'; G3-1; O6
- action: change
- 근거: O6은 표시를 정수 초로 정하고, goal-2 타이머는 1초 단위 감소다. 그러면 남은 시간은 항상 정수이므로 'Math.floor' 규칙은 효과가 없다. G3-1 픽스처 37.9초는 이 설계에서 발생하지 않는 값이다. 'ms 누적 후 내림'인지 '정수 초 감소'인지 정하지 않았다. 시간 0 판정 시점(정확히 60000 ms)도 없다.
- 요구: 타이머 저장 단위(ms 누적 또는 정수 초)와 표시·점수 반올림 규칙을 하나로 정하고, G3-1 픽스처를 그 규칙에서 나오는 값으로 바꾼다.

### F7 — thin, medium — 모호 (한 프레임 안의 갱신 순서)
- findingId: F7
- targetId: goal-2 규칙 '접촉 검사 ... 반딧불이 이동 직후와 거미 이동 직후 각각'; `isContact(prevPlayer, player, prevSpider, spider)`; G2-7
- action: change
- 근거: 계획은 순서를 정하지 않았다. 순서를 '플레이어 이동 → 검사 → 거미 이동 → 검사'로 두면 맞바꿈은 어느 하위 단계에서든 같은 칸이 되어 잡히므로 이전 좌표 인자가 필요 없다. 이전 좌표 인자를 쓰는 이유가 계획에 없다.
- 요구: 하위 단계 순서를 명시하고, 필요 없으면 isContact를 단순화한다. G2-7 기대값을 그 순서에서 정의한다.

### F8 — required, high — 상충 (AGENTS.md 좌표 규칙)
- findingId: F8
- targetId: Step 0 '5장 레벨 1 갱신'; 자동 테스트 L3
- action: change
- 근거: AGENTS.md 코드 규칙은 '맵은 ... 그대로 복사한다. 좌표를 따로 적지 않는다'라고 한다. 계획은 GAME_DESIGN.md 5장에 이슬방울 좌표 목록과 거미 행 y=6 정보를 주석 문장으로 추가한다(계획 Step 0 5장 항목). 기획서가 단일 진실이라는 원칙과 함께 보면, 좌표를 문장으로 이중 기록하는 것은 AGENTS 규칙과 충돌하고 L3 테스트 파싱 방식도 정의되지 않는다.
- 요구: 좌표 문장을 5장에서 빼고 L3는 맵 문자에서 계산한 좌표로 검증하거나, 좌표 기록을 유지하려면 사람에게 AGENTS 규칙 변경을 요청하고 그 결정을 계획에 적는다.

### F9 — thin, low — 문서 정확도
- findingId: F9
- targetId: Known state; 9장 수용 1~5 문구
- action: change
- 근거: 계획은 '현재 HEAD bdb637f'처럼 읽힌다. 실제 HEAD는 7ca8b79(fix-6)이고 bdb637f는 fix-5 리뷰 해시 커밋이다(git log 확인). STOP-REASON.md는 사람 브라우저 확인이 fix-2 이전 빌드 기준이라고 기록한다. 그런데 9장에 쓸 수용 1~5 문구는 'R1에서 이미 확인됨'이다.
- 요구: 현재 HEAD 값을 7ca8b79로 바로잡고, 9장에서 1~5를 '확인됨'이 아니라 'R1 게이트 미통과, fix-2 이전 빌드 기준 확인'으로 쓴다.

### F10 — thin, low — 과장된 기각 근거
- findingId: F10
- targetId: Viable Options 옵션 3
- action: change
- 근거: 옵션 3 기각 이유에 'AGENTS.md logic.js 규칙 위반'을 넣었다. AGENTS.md는 main.js에 상태를 두는 것을 금지하지 않는다. 실제 근거는 테스트 가능성(Decision Driver 2)이다.
- 요구: 기각 근거를 테스트 가능성으로 한정해 다시 쓴다.

## Missing Evidence
- 확정으로 부족: F1(시계 상충), F2(헬퍼), F3(테스트 누락), F4(정지 후 규칙), F5(wiring 이관), F8(좌표 규칙 상충).
- 불확실 / 검증 안 됨: 바닥 129칸 전부의 P 도달 가능성(계산 근거는 인정하나 실행 미검증), 이슬방울 최단 거리 3~20칸, 16px 모노스페이스 글자가 32 px 줄에 들어가는지(폰트 메트릭 미확인), 실제 브라우저 프레임 간격.
- 얇은 영역(확장 요청): 타이머 표현(F6), 프레임 내 갱신 순서(F7), 타이틀 화면의 입력·드로잉 규칙(F5), 수용 7·26 자동 확인 방법(현재 수동만).

## Approval Boundary
- 실행 가능: S0 design-v2 초안 작성은 F8을 반영한 뒤 사람 확인을 받는다. 그 전까지 src/·test/·index.html은 건드리지 않는다.
- 승인 밖: goal-2 구현(S1~S4), goal-3 구현(S5~S6), 수용 번호 확인, 숫자 변경. F1~F5가 해결되어 계획 v2에 반영되기 전에는 승인되지 않는다.

## Summary
- Clarity: 중상. 표기(확정 / 에이전트 제안)가 명확하다.
- Verifiability: 중. 수용 기준 대부분에 테스트가 연결되지만 테스트 헬퍼·이관·O2/O3 테스트가 빠져 있다.
- Completeness: 중. goal-2 정지 후 동작, goal-3 wiring 이관, 타이머 표현이 비어 있다.
- Big Picture: 상. 기획서 우선, goal 2개 분리, 순수 로직 경계가 맞다. 기능 추가 없음.
- Principle/Option Consistency: 중. 시계 원칙(F1)과 좌표 규칙(F8)이 상충한다.
- Alternatives Depth: 중. 옵션 3개. 옵션 3 기각 근거 과장(F10).
- Risk/Verification Rigor: 중. 위험 표의 완화책 두 개가 실제 테스트 목록이나 코드와 맞지 않는다(F1, F3).

## Required Changes
1. F1: 시계 하나로 통일하거나 F6 범위 편입과 완화책 문장 정정 중 하나 확정.
2. F2: wiring 헬퍼 식별 방식 명시, test/wiring.test.js를 변경 목록에 추가.
3. F3: 같은 틱 우선순위 테스트 두 개(O2, O3)를 테스트 표에 추가.
4. F4: goal-2 정지 후 규칙(플레이어·거미·타이머 정지, 입력 무시)과 G2-12 테스트 추가.
5. F5: 타이틀에서의 입력·드로잉 규칙과 wiring 테스트 이관 목록 추가.
6. F8: 5장의 좌표 문장 제거 또는 AGENTS 규칙 변경을 사람에게 확인 요청.
7. F6, F7, F9, F10: 위 문구대로 수정(얇은 영역 보강).

검증 결과: 계획 파일과 소스 대조는 읽기로만 수행했다. 테스트·빌드는 실행하지 않았다.
