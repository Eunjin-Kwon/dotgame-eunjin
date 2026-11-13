# Critic 리뷰 pass 1 — R1 계획 (plan-only)

- stage: critic / stage_n 1
- 대상: stage-01-planner.md (sha256 [REDACTED])
- 기준: GAME_DESIGN.md v0, AGENTS.md
- 확인: git ls-files 기준 소스 파일 0개. src/, test/, index.html, package.json 없음. 계획의 저장소 현황 주장은 사실이다.
- Architect 산출물은 읽지 않았다. 테스트·빌드는 실행하지 않았다.

## Verdict: ITERATE

골격(R1a 로직+테스트, R1b 렌더는 5장·6장 확정 후, Option C 기각)은 타당하다. 그러나 완료 기준의 근거, 착수 게이트, 인터페이스 정의, 파일 경로 허용 여부가 정리되지 않아 executor가 바로 실행할 수 없다.

## Findings

### CR-R1-01 [HIGH] 완료 기준 발명
- 근거: AGENTS.md '완료 조건'은 완료를 GAME_DESIGN.md 9장으로 정의한다. 9장은 비어 있다. 계획 §6의 AC-R1-1..10은 계획자가 만든 기준이며, 'R1 임시 확인'으로 완료를 선언하자고 한다.
- 영향: 계획자가 완료 기준을 만든다. AGENTS.md 위반.
- 수정: 사람이 R1 범위 9장 항목을 GAME_DESIGN.md에 먼저 쓴다. 임시 기준을 쓰려면 GAME_DESIGN.md에 승인된 규칙으로 명시한다. 계획 안에만 두지 않는다.

### CR-R1-02 [HIGH] 착수 게이트 모순
- 근거: Sequencing 1번은 2장 7개 값의 사람 확정을 테스트 기대값 고정의 선행 조건으로 둔다. 그러나 Summary, Option A, §5 R1a, Handoff는 executor가 지금 R1a를 시작한다고 한다. GAME_DESIGN.md 헤더는 2장 값을 사람이 검토해 확정해야 한다고 적는다.
- 수정: (a) R1a를 2장 확정에 묶거나, (b) 미확정 값으로 구현하도록 명시 승인하고, 값이 바뀌면 기획서 수정 후 테스트를 재작성한다는 규칙을 계획에 쓴다. 둘 중 하나를 계획에서 고른다.

### CR-R1-03 [MEDIUM] R1a는 단일 goal을 닫지 못함
- 근거: 사용자 goal은 '맵 위에서 캐릭터가 한 칸 움직인다' 하나다. R1a에는 맵도 캐릭터 화면도 없다. 계획 Option A도 R1이 4장·5장·6장 사람 작성 전에는 닫히지 않는다고 인정한다. 그런데 Summary와 Decision은 R1a를 'R1 goal' 진척으로 기술한다.
- 수정: Summary와 Decision에 'R1a는 선행 슬라이스이며 R1 goal은 열려 있다'고 명시한다. R1a를 단독 머지할 가치가 있는지도 판단 근거를 쓴다.

### CR-R1-04 [MEDIUM] 수용 기준 검증 불가 또는 모호
- AC-R1-6: '테스트 또는 소스 확인'은 검증 명령이 아니다. 'src/logic.js를 텍스트로 읽어 canvas/document/window 토큰이 없음을 assert'처럼 테스트 하나로 고정한다.
- AC-R1-9: '눈에 보이게'는 주관적이다. 관찰 절차를 적는다.
- AC-R1-10: 6장이 비어 있어 현재 검증 불가. 차단 상태로 표기한다.
- AC-R1-7, AC-R1-8: 렌더와 5장이 있어야 한다. 조건부 항목으로 표기하고 R1a 결과에 포함하지 않는다.

### CR-R1-05 [MEDIUM] 로직 인터페이스와 시간 모델 미정의
- 상태 객체 필드, 함수 이름과 시그니처, 벽·경계 판정 인터페이스, 방향 입력 타입이 없다.
- '계속 누르면 150 ms마다'가 OS 자동 반복인지 held-key 모델인지 정의되지 않았다. AC-R1-5의 테스트 기대값이 이에 달려 있다.
- 2장 '한 칸 이동 시간 150 ms'는 이동 상태(모션)를 암시한다. 그런데 §8은 '애니메이션 보간, 이동 이징'을 범위 밖으로 둔다. 150 ms가 쿨다운(즉시 이동)인지 트윈인지 선택해야 한다. 이는 사람 결정 항목이다.
- 수정: 단일 export step 함수 시그니처, state 필드, 경계·벽 판정 규칙, 쿨다운 대 트윈 결정을 계획에 명시한다.

### CR-R1-06 [MEDIUM] AGENTS.md가 허용하지 않은 경로
- AGENTS.md가 명명한 파일: src/logic.js, src/levels.js, src/sprites.js, src/strings.js, index.html, 그리고 명령 node --test test/. 계획이 추가한 src/render.js와 test/logic.test.js는 명명되어 있지 않다.
- index.html을 8장(기술 스펙)에 근거 짓지만, 8장은 비어 있고 R3 소관이다. 2장만 근거로 쓴다.
- 수정: 렌더를 허용된 파일에 넣거나, 경로를 AGENTS.md에 추가하는 사람 결정을 먼저 받는다.

### CR-R1-07 [LOW] 테스트 fixture 벽 표현 미정의
- AC-R1-4는 '벽 칸' 동작을 요구하지만 5장은 벽 문자를 정의하지 않는다. 계획은 fixture라고만 말하고 표현을 정하지 않는다.
- 수정: 테스트 파일 안의 명시적 boolean 배열 또는 차단 좌표 Set으로 쓰고, 문자 의미를 부여하지 않으며, src/levels.js에서 가져오지 않는다고 주석한다.

## Checks passed
- 2장 숫자(격자 한 칸, 150 ms, 32 px, 512×384 = 16×12, 방향키 4개, 대각선 없음)는 GAME_DESIGN.md 2장과 일치한다.
- 5장·6장·4장 공백 주장은 GAME_DESIGN.md와 일치한다.
- 10장 범위 밖과 Option C 기각은 AGENTS.md 금지 사항과 일치한다.
- 발명된 맵 문자와 색 hex는 본문에 없다.

## Request for expansion (pass 2 시 필요)
1. 9장 R1 항목 또는 승인된 임시 기준 문서화 (CR-R1-01)
2. 2장 게이트 결정 (CR-R1-02)
3. 로직 시그니처, 상태 필드, 시간 모델, 쿨다운 대 트윈 결정 (CR-R1-05)
4. 경로 허용 결정 (CR-R1-06)
5. AC-R1-6, 9, 10의 검증 방법 또는 차단 표기 (CR-R1-04)
