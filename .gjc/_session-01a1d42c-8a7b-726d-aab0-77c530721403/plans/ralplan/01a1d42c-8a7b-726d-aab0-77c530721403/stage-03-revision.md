# R2 plan (design-v2 + goal-2 + goal-3) — revision pass 3

> 대상 저장소: /Users/eunjinkwon/dev/dotgame-eunjin (반딧불이 이슬 모으기, HTML + Canvas 2D + ES modules, 빌드 없음, 의존성 0)
> 베이스라인: stage-02-revision.md (sha256 [REDACTED]).
> 반영한 리뷰: stage-01-critic(F1~F10), stage-01-architect(AR-01~AR-15) — pass 2에서 처리. stage-02-critic(OKAY, N1·N2), stage-02-architect(WATCH/COMMENT, AR2-01~AR2-03) — 이 pass 3에서 처리.
> 표기 규칙: R2_decisions.md에서 온 값은 **"(사람 결정 H절)"**, R1 기획서에 이미 "(확정)"으로 있는 2장 값은 그대로 **"(확정)"**, 에이전트가 정한 값은 **"(에이전트 제안)"**, 이번 pass에서 사람이 질문에 답해 정해진 것은 **"(사람 결정)"**.

## Pass 3 변경 요약 (이번 pass에서 바뀐 것만)
| 항목 | 처리 | 위치 |
|---|---|---|
| 사람 결정: 타이머 = 정수 초(옵션 A) | design-v2 D행과 점수 문구에서 "(내림)" 문구를 삭제. 점수는 정수 남은 초 × 10으로 명기. D절 원문의 "1초(내림)" 조항은 이 결정으로 **대지됨**을 명시. O6 = answered | Step 0 2장, 타이머 모델, goal-3 점수, O6 |
| AR2-01 시작 양구 | `createWorld(level, nowMs)` + `startPlay(level, nowMs)` 하나로 통일. title·lost·won에서 Enter는 모두 같은 `startPlay`를 부른다 | 상태와 파이프라인, goal-2 시작 시점, goal-3 규칙, G3-3·G3-6 |
| AR2-02 재기준 경계 | 재기준 호출은 **그 호출에서 0칸 이동·0초 감소**하고 기준만 다시 세운다 — 거미·타이머 각각 한 줄 + G2-13 | 거미 간격, 타이머 모델, G2-13 |
| AR2-03 탭 대기열 | design-v2 2장 표에 탭 대기열 행을 (에이전트 제안)으로 추가. O9는 열린 항목으로 유지 | Step 0 2장, O9 |
| ADR 기록 | 마지리에 ADR 섹션 추가 | ADR |
| 리뷰 상태 공시 | Review status 섹션 추가. stage-03은 **재리뷰되지 않았다**(리뷰 상한 2회 소진) | Review status |

그 밖의 숫자·섹션·표기는 stage-02와 같다. 기능을 더하지 않았다.

## Pass 2 변경 요약 (유지)
| 지적 | 처리 | 위치 |
|---|---|---|
| F1 / AR-01 시계 혼용 | 시계 하나로 통일. keydown은 키만 쌓고 `performance.now()`를 쓰지 않는다. F6를 범위 안으로 | 아키텍처 결정, S4, 범위 |
| F2 / AR-09 wiring 헬퍼 | firefly를 마지막에 그리고 `fillStyle === PALETTE[2]`로 식별. `test/wiring.test.js` 변경 명시 | goal-2 파일표, W0 |
| F3 동시 틱 테스트 | G2-11(O3), G3-10(O2) | 테스트 표 |
| F4 / AR-06 정지 후 | goal-2부터 동결 + 방향키 무시, G2-12 | goal-2 규칙 |
| F5 / AR-13 시작 시점 | goal-2 페이지 로드, goal-3부터 Enter. 이관 표 | goal-3 규칙, 이관 표 |
| F6 / AR-03 타이머 | 정수 초 단일 모델, G3-1 = 1170 | 타이머 모델 |
| F7 / AR-05 틱 순서 | 6단계 순서 확정, `isContact(player, spider)` | 틱 순서 |
| F8 좌표 이중 기록 | 5장 좌표 문장 제거, L3가 맵 문자에서 계산 | Step 0, L3 |
| F9 / AR-14 HEAD | 리뷰 HEAD bdb637f vs 현재 7ca8b79, 1~5번 문구 정정 | Known state |
| F10 옵션 기각 | 테스트 가능성으로만 한정 | Options |
| AR-02 / AR-07 | `createWorld` + 단일 `advance`, `world.phase` | 아키텍처 결정 |
| AR-04 | `nextStepAt += 300`, 한 호출에 한 칸, 지연 시 재기준 | 거미 간격 |
| AR-08 | 리셋 시 누른 키 목록 비우기 | goal-3, G3-6 |
| AR-10 / AR-11 / AR-15 | HUD 세부와 8×8 그림을 design-v2에 (에이전트 제안) | Step 0 |
| AR-12 | 태그 규칙 교체 | 머릿말 |

## Summary
R2는 기획서가 먼저다. Step 0에서 R2_decisions.md B~F절 값을 그대로 GAME_DESIGN.md v2(2장 나머지·3장·4장 추가·5장 레벨 1 갱신·9장 1~26)에 옮기고, 에이전트가 정한 HUD 서체·배치, 8×8 스프라이트 그림, 탭 대기열 행도 "(에이전트 제안)"으로 같이 올린다. 사람이 읽고 맞다/아니다만 답한 뒤 `design-v2:` 커밋을 한다. 그 커밋이 착수 게이트다.

게이트를 넘은 뒤 goal-2(수용 6~17), 이어서 goal-3(수용 18~26). 구조는 한 군데로 모인다: `src/logic.js`가 `createWorld(level, nowMs)`·`startPlay(level, nowMs)`·`advance(world, nowMs, input)`를 내고, `main.js`는 키를 쌓고 프레임 `nowMs`로 `advance`를 부려 그리기만 한다. 시계는 하나다. 타이머는 정수 초 하나다(사람 결정). 새 기능은 추가하지 않고 숫자도 바꾸지 않는다.

## Intent Diff
| 입력·원안 | 현재 계획이 바꾸거나 더한 것 |
|---|---|
| "규칙을 logic.js 순수 함수로" | 함수 여러 개를 main.js가 순서대로 호출 → **`advance` 하나**. 순서 규칙이 테스트 안으로 들어온다 |
| "접촉 = 같은 칸 또는 맞바꿈" | 한 칸 이동마다 검사하므로 맞바꿈은 자동으로 같은 칸으로 잡힐다. `isContact`에 이전 좌표 인자 없음 |
| "타이머 60초, 점수는 1초(내림)당 10점" | **사람 결정으로 정수 초 단일 모델 확정**. "(내림)" 조항은 삭제되고 정수 남은 초 × 10으로 대지된다 |
| "접촉/시간 0이면 게임이 멈춘다" | 멈춘 뒤의 상태를 정의: 플레이어·거미·타이머 전부 정지 + 방향키 무시 (goal-2부터) |
| "플레이 시작과 함께 시간이 줄어듦" | goal-2는 **페이지 로드**, Enter 시작은 goal-3에서 도입. 둘 다 같은 `startPlay(level, nowMs)`를 지나간다 |
| "5장에 좌표 목록을 주석으로" | 철회. AGENTS.md "좌표를 따로 적지 않는다"와 충돌. 테스트가 맵 문자에서 계산한다 |
| (언급 없음) | 탭 보장 대기열(O9)을 2장 행으로 올리고 열린 항목으로 남긴다 |

## RALPLAN-DR summary
모드: short (사전 부검 불필요 — 범위가 기획서로 닫혀 있고 되돌리기 비용이 낮다).

### Principles
1. 기획서가 단일 진실이다. 코드·테스트의 모든 숫자는 GAME_DESIGN.md에서 온다. 기획서에 없는 것은 만들지 않는다.
2. 규칙과 **규칙의 순서**는 둘 다 순수 함수 안에 있다. 테스트 밖(main.js)에 순서 버그가 남지 않게 한다.
3. 시계는 하나다. 모든 시간 규칙은 프레임 콜백이 준 `nowMs` 하나로 계산한다.
4. 완료는 테스트 통과가 아니라 9장 수용 기준 번호로 사람이 브라우저에서 확인하는 것이다.
5. 미결정 사항은 추측해서 코드에 넣지 않고 Intent Reconciliation에 기본 제안과 함께 올린다.

### Decision Drivers (top 3)
1. **게이트 순서**: design-v2 커밋 전에는 코드를 고치지 않는다. 기획서가 흔들리면 테스트 기대값이 모두 흔들린다.
2. **테스트 가능성**: 순찰·접촉·타이머·점수·화면 전이와 그것들의 **실행 순서**가 전부 node --test로 고정되어야 한다.
3. **값 보존**: 8개 / 300 ms / 60 s / 100점 / 10점 / 16×12 / 32 px / 8색은 사람이 결정한 값이며 코드가 바꿀 수 없다.

### Viable Options (아키텍처)
**옵션 B (채택) — `createWorld` + `startPlay` + 단일 `advance`**
- 장점: 틱 순서·동시 사건 우선순위·phase 전이·리셋·시간 양구가 한 고정에 모인다. goal-3에서 재작업이 없다(phase 값만 추가).
- 단점: S2가 조금 크다. 기존 `requestMove` 호출부가 `advance` 안으로 들어가며 wiring 테스트를 건드려야 한다.

**옵션 A (기각) — 규칙 함수 여러 개를 main.js가 순서대로 호출**
- 장점: S2를 작게 자른다.
- 기각 근거: 순서 규칙(O2·O3 동시 틱 우선순위)가 테스트 불가 영역인 main.js에 남는다. Decision Driver 2 위반.

**옵션 C (기각) — keydown에서 즉시 이동(현행 코드)**
- 장점: 입력 지연 0.
- 기각 근거: `performance.now()`와 rAF `nowMs` 두 시계가 섮여 거미 300 ms·타이머 1초 간격을 결정적으로 테스트할 수 없다. 접촉·수집을 두 곳에서 불러야 한다.

**실행 순서 옵션**
- **옵션 1 (채택)** 기획서 먼저, goal-2 → goal-3 순차. 수용 기준 번호가 goal 경계와 그대로 맞는다(6~17 / 18~26). 각 goal이 독립 커밋.
- **옵션 2 (기각)** goal-2와 goal-3을 한 번에. 커밋 하나에 수용 기준 21개가 묶여 실패 원인 분리가 어렵고, "goal 하나에 커밋 하나"와 R2_decisions H절의 goal 두 개 지시에 어긋난다.

## 아키텍처 결정
### 상태와 파이프라인 (AR2-01 반영)
- `createWorld(level, nowMs)` → 새 world. 매번 새 객체를 만들고 공유 가변 배열을 반환하지 않는다. `nowMs`는 생성 시점의 시간 기준이다.
- `startPlay(level, nowMs)` → **플레이를 여는 유일한 경로**. 설정하는 값:
  - `phase = 'play'`
  - `startedAt = nowMs`
  - `timeLeft = 60` (정수 초, 사람 결정 H절)
  - `nextSecondAt = nowMs + 1000`
  - `nextStepAt = nowMs + 300`
  - `player` = 맵의 `P`, 잠금 해제(`lockedUntil = 0`) / `spider` = 맵의 `S`, 방향 왼쪽 / `dewdrops` = 맵의 `o` 전집합 / `collected = 0` / `reason = null`
- **title에서 Enter(goal-3), lost·won에서 Enter(goal-3)는 모두 같은 `startPlay(level, nowMs)`를 부른다.** 리셋은 새 world이며 리셋 후 phase는 `play`다(won에서 Enter는 수용 24를 지키기 위해 먼저 `title`로 가고, 그 `title`에서 Enter를 다시 눌렀을 때 `startPlay`가 불린다).
- **goal-2의 페이지 로드는 `createWorld(level, nowMs)` 다음 `startPlay(level, nowMs)`를 부른다.** 그 `nowMs`는 첫 프레임의 값이다. 주기 양구가 모든 경로에서 동일해진다.
- `world` 필드(에이전트 제안 이름): `phase`, `player{x,y,lockedUntil}`, `spider{x,y,dir,nextStepAt}`, `dewdrops`, `collected`, `timeLeft`, `nextSecondAt`, `startedAt`, `reason`(`null` | `'spider'` | `'timeout'`).
- `world.phase` 열거형: goal-2에서 `play | won | lost`, goal-3에서 `title | play | won | lost`.
- `advance(world, nowMs, input)` → 새 world. **유일한 규칙 진입점**. `input`은 goal-2에서 `{ dir }`, goal-3에서 `{ dir, enter }`.
- `main.js`는 (1) keydown/keyup으로 누른 키 목록만 갱신하고, (2) 프레임마다 `advance`를 한 번 부르고, (3) 그린다.
- **시계는 프레임 `nowMs` 하나만 쓴다. keydown 핸들러에서 `performance.now()`를 호출하지 않는다** (F1/AR-01). 선행 항목 F6는 범위 안이며 goal-2 S4에서 해소된다.
  - 부수 효과: 탭도 한 칸 움직여야 하므로(수용 2) **keyup에서 아직 소비되지 않은 마지막 누름을 1회 대기열로 남긴다**(에이전트 제안, O9). W3으로 고정하고 design-v2 2장에 행으로 올린다(AR2-03).
- `requestMove`, `pressDirection`, `releaseDirection`, `activeDirection`, `MOVE_LOCK_MS`는 그대로 남기고 `advance`가 내부에서 쓴다(R1 테스트 보존).
- `src/logic.js` 본문과 주석에 `canvas`, `document`, `window` 문자열을 쓰지 않는다(logic.test.js V-6).

### 한 틱 순서 (확정)
`advance`는 `phase === 'play'`일 때만 아래를 수행한다. 중간에 phase가 바뀜면 **즉시 반환**한다.
1. **플레이어 이동** (`requestMove`, 150 ms 잠금 규칙 그대로)
2. **접촉 검사** → 같은 칸이면 `phase='lost'`, `reason='spider'`, 반환
3. **수집** → 현재 칸에 방울이 있으면 제거하고 `collected += 1`. `collected === 8`이면 `phase='won'`, 반환
4. **거미 이동** (`nowMs >= nextStepAt`일 때 한 칸)
5. **접촉 검사** → 같은 칸이면 `phase='lost'`, `reason='spider'`, 반환
6. **타이머** → `phase === 'play'`일 때만 1초 감소. `timeLeft === 0`이면 `phase='lost'`, `reason='timeout'`
- 한 칸 이동마다 검사하므로 **인접 맞바꿈은 2단계 또는 5단계에서 같은 칸으로 잡힌다**. 따라서 `isContact(player, spider)` — 이전 좌표 인자는 두지 않는다.
- 이 순서가 겹침 규칙도 결정한다: 수집과 접촉이 같은 틱이면 2단계가 먼저 → **실패**(O3). 마지막 방울과 시간 0이 같은 틱이면 3단계가 먼저 → **클리어**(O2).

### 타이머 모델 (사람 결정: 정수 초, 옵션 A)
- `timeLeft`는 **정수 초** 하나만 저장한다. ms 누적값을 따로 두지 않는다. ← **사람이 질문에 답해 확정한 것(사람 결정)**.
- `startPlay`가 `timeLeft = 60`, `nextSecondAt = nowMs + 1000`을 세운다.
- `nowMs >= nextSecondAt`이고 `phase === 'play'`일 때 `timeLeft -= 1`, `nextSecondAt += 1000`. 한 프레임에 최대 한 번 감소한다.
- **재기준(AR2-02)**: `nowMs >= nextSecondAt + 1000`이면 그 호출에서는 **0초 감소**하고 `nextSecondAt = nowMs + 1000`만 세운다(쌓인 여러 초를 한 번에 깎지 않는다).
- `timeLeft`는 음수로 내려가지 않는다. 0이 된 그 틱에 `lost`/`timeout`.
- 남은 시간이 항상 정수이므로 **점수는 `collected * 100 + timeLeft * 10`이고 내림 연산이 없다**. HUD 표시와 클리어 점수가 항상 같은 정수를 쓴다.
- **D절 원문의 "1초(내림)당 10점" 조항은 이 사람 결정으로 대지된다.** design-v2에는 "(내림)" 문구를 쓰지 않고 "남은 시간 1초당 10점(남은 시간은 정수 초다)"로 쓴다. 숫자(10점)는 그대로다.

### 거미 이동 간격
- `startPlay`가 `nextStepAt = nowMs + 300`을 세운다. `nowMs >= nextStepAt`이면 **한 호출에 한 칸**만 움직이고 `nextStepAt += 300`.
- **재기준(AR2-02)**: `nowMs >= nextStepAt + 300`이면 그 호출에서는 **0칸 이동**하고 `nextStepAt = nowMs + 300`만 세운다(탭 전환·저사양 프레임에서 순간이동 방지).
- 다음 칸이 벽이면 `dir`를 반전하고 그 틱에 반대 방향으로 한 칸 움직인다.

## Known state (선행 상태)
- 직전 R1 세션에서 goal-1(G001)의 품질 게이트는 **중단**되었고 `blocked`로 기록되어 있다. 근거: `.gjc/_session-01a1d29b-ee05-75c2-b1fa-f75a1af552b7/ultragoal/evidence/G001-gate-stop/STOP-REASON.md`.
- **리뷰된 HEAD는 `bdb637f`(fix-5, 리뷰 해시 sha256:ab3b8d18…78a0fb)고, 현재 HEAD는 `7ca8b79`(fix-6)다.** fix-6은 리뷰되지 않았다.
- R1에서 **닫히지 않고 상속된 항목**: architect REQUEST CHANGES, cleaner의 "와이어링 순서 의존" 지적, critic의 적색팀 누락 지적. R2는 이들을 **이어받을 뿐 닫았다고 주장하지 않는다**. 다만 와이어링 순서 의존은 옵션 B가 구조적으로 줄여준다.
- 9장 수용 1~5번의 머릿말은 **"R1 게이트 미통과. 사람 브라우저 확인은 fix-2 이전 빌드 기준"**으로 쓴다.
- 상속된 알려진 한계: 5장 맵·6장 팔레트는 "(에이전트 제안)" 상태, 프레임 간격 실측 없음, 바닥 129칸의 P 도달 가능성은 계산 근거만 있다(L6으로 닫는다).

## Gate and order
### Step 0 — design-v2 작성 (코드 변경 없음)
`GAME_DESIGN.md` 한 파일만 수정한다.
- **2장 나머지 행 (출처 D절, "(사람 결정 H절)")**: 이슬 수집 / 거미 이동(300 ms) / 거미와 이슬방울 / 접촉(같은 칸 또는 맞바꿈 즉시 실패) / 제한 시간(60초→0 실패) / 클리어(8개 전부, 같은 틱 접촉 우선) / 점수 / 끝난 뒤(방향키 무시) 8행 추가. "점수 — R2에서 채운다" 줄 제거.
  - **점수 행 문구 (사람 결정)**: "이슬방울 1개 100점 + 클리어 때 남은 시간 1초당 10점. 실패한 레벨은 0점." — **"(내림)" 문구는 쓰지 않는다.**
  - **제한 시간 행에 더하는 한 번의 문장 (사람 결정)**: "남은 시간은 정수 초로만 다룬다. 점수는 그 정수 초 × 10이다. (인타뷰 초안의 '1초(내림)' 조항은 이 결정으로 대지된다.)"
  - **탭 대기열 행 추가 (에이전트 제안, AR2-03)**: "키를 눌렀다가 한 프레임 전에 떼어도 그 한 번의 입력은 다음 프레임에 한 칸 이동으로 처리된다(대기열 1회)." — 수용 2 보존을 위한 파생 규칙이다.
- **3장 화면 흐름 (출처 E절)**: 타이틀→Enter→플레이, 클리어→Enter→타이틀, 실패→Enter→같은 레벨 처음부터, 모든 문구는 src/strings.js.
  - 더해서: **"타이틀에서는 방향키를 받지 않고 타이머와 거미도 움직이지 않는다" (에이전트 제안)**.
- **4장 추가 오브젝트 (출처 C절)**: 이슬방울(32×32, 문자 `o`, 색 5번 `#7FD8FF`), 거미(32×32, 문자 `S`, 몸통 6번 `#8B3A62`, 다리 7번 `#C9B7FF`). 글자 색 4번 `#F2F7EE`, 안내 문구 배경 0번 `#1E2B24`. 새 색 금지.
  - 반딧불이와 같은 형식의 **8×8 팔레트 인덱스 그림**을 넣는다 — **(에이전트 제안)**. 스프라이트 1픽셀 = 4 캔버스 px.
- **5장 레벨 1 갱신 (출처 B절)**: 문자 규칙 표에 `o`, `S` 추가. 코드 블록을 B절 맵으로 교체.
  - 이슬방울 좌표 목록·거미 순찰 행 같은 **좌표 문장을 적지 않는다**(AGENTS.md "좌표를 따로 적지 않는다"). 좌표는 테스트가 맵 문자에서 계산한다.
- **9장 수용 기준 (출처 F절)**: 1~26 전부. 1~5는 F절 문장 그대로 쓰되 제목은 "열기와 이동 (R1 게이트 미통과, 사람 확인은 fix-2 이전 빌드 기준)".
- **HUD 절**: 전부 기술해야 기획서에 없는 것을 만들지 않는다는 규칙을 지킨다.
  - 위치: **맨 윗줄(벽 줄) 위에 그린다. 높이 32 px.** 캔버스 512×384는 바꾸지 않는다(수용 1).
  - 왼쪽 `이슬 n/8`, 오른쪽 `시간 s` (사람 결정 H절). 표시는 정수 초.
  - 글자 색 4번 `#F2F7EE`, 배경 박스 0번 `#1E2B24` (사람 결정 H절).
  - 서체 `16px monospace`, 베이스라인 y = 22 px, 좌측 여백 x = 8 px, 우측 `textAlign='right'` x = 504 px — 전부 **(에이전트 제안)**. 웹폰트 파일 금지.
  - HUD는 **플레이 화면에만** 그린다 (에이전트 제안, O4).
- 6장 팔레트는 색을 바꾸지 않고 5·6·7번의 "R2 예약" 표기만 "R2"로 갱신한다 (에이전트 제안). 10장 범위 밖은 그대로 둔다.

### 사람 확인 → 커밋
사람은 design-v2를 읽고 **맞다/아니다만** 말한다. 확인받을 항목을 한 고에 모아 보여준다: 정수 초 타이머와 "(내림)" 대지 문장, 탭 대기열 행(O9), HUD 서체·배치, 8×8 스프라이트 그림, HUD를 벽 줄 위에 그리기, 타이틀 입력 규칙, Intent Reconciliation O1~O9, 그리고 Review status에 섬긴 잔여 항목. "맞다"면 `design-v2: R2 결정값을 2·3·4·5·9장에 반영` 형태로 커밋한다.

### 게이트
- **G0**: design-v2 커밋 완료 → goal-2 착수. 커밋 전에는 src/·test/·index.html을 건드리지 않는다.
- **G1**: goal-2가 실행 정책에 따라 처리됨 → goal-3 착수.

### 맵 검증 결과 (증거)
제한된 역할 셸에서는 스크립트를 실행할 수 없어 **파일을 직접 읽어 행·열 단위로 대조**했다. critic과 architect가 같은 결론을 독립으로 확인했다.
- 12행 × 16열, 모든 행 길이 16.
- `o`/`S`를 바닥으로 보았을 때 **벽 좌표가 v1 5장 맵과 완전히 동일**. 행별 벽 x: y0 전부, y1 {0,15}, y2 {0,3,4,15}, y3 {0,8,15}, y4 {0,15}, y5 {0,4,5,15}, y6 {0,15}, y7 {0,10,15}, y8 {0,15}, y9 {0,2,3,10,11,14,15}, y10 {0,15}, y11 전부. 내부 벽 11칸 유지.
- `o` 8개와 `S` 1개, `P`=(2,10)은 모두 바닥 칸. `S`가 있는 행은 x=1~14가 끊김 없는 바닥(14칸) → 왕복 26스텝 × 300 ms = 7.8 s.
- **미검증**: 바닥 129칸 전부의 P 도달 가능성, 이슬방울 최단거리 3~20칸, 16px 모노스페이스가 32 px 줄에 들어가는지. L3·L4·L6 테스트와 사람 브라우저 확인으로 닫는다.

## goal-2 (목표물·위협·타이머) — 수용 기준 6~17
**완료 조건 (R2_decisions G절, 원문 그대로):**
> index.html을 http로 열어 플레이하면 이슬방울 8개를 먹을 때마다 사라지고 개수가 올라가며, 거미가 가로로 왕복하고, 시간이 60에서 줄어들고, 거미에 닿거나 0이 되면 게임이 멈춘다. (수용 기준 6~17)

### 시작 시점
- **goal-2는 페이지 로드 시점에 `createWorld(level, nowMs)` → `startPlay(level, nowMs)`로 시작한다.** 그 `nowMs`가 `startedAt`이고 거미·타이머 양구도 그때 잡힙다.
- **goal-3에서 이 규칙이 한 번 바뀐다**: 초기 phase가 `title`이 되고, `startPlay`는 Enter를 받은 프레임의 `nowMs`로 호출된다. 틱 순서와 거미·타이머 규칙은 그대로다.

### 규칙 (전부 기획서 값)
- 이슬방울 8개(사람 결정 H절). 방울 칸에 들어가면 사라지고 `collected += 1`. 이미 먹은 칸·빈 칸은 변화 없음(수용 9~11). 방울당 정확히 1회만 증가한다.
- 거미 1마리, 가로 왕복, 300 ms마다 한 칸(사람 결정 H절), 다음 칸이 벽이면 반전, 처음 방향 왼쪽. 이슬방울을 먹지 않고 방울은 거미를 막지 않는다(수용 12·13). **재기준 호출에서는 0칸 이동하고 기준만 다시 세운다(AR2-02).**
- 접촉 = 같은 칸. 한 칸 이동마다 검사하므로 맞바꿈도 잡힌다(수용 14·15). 잡히면 `phase='lost'`, `reason='spider'`.
- 제한 시간 60초(사람 결정 H절), 정수 1초씩 감소, 0이면 `phase='lost'`, `reason='timeout'`(수용 16·17). **재기준 호출에서는 0초 감소하고 기준만 다시 세운다(AR2-02).**
- 이슬방울 8개를 다 먹으면 goal-2 단계에서도 `phase='won'`으로 멈춘다. 화면은 goal-3에서 붙인다.
- **정지 후 규칙**: `phase !== 'play'`이면 `advance`는 아무것도 바꾸지 않는다. 즉 **플레이어도 거미도 움직이지 않고 타이머도 줄지 않으며 방향키 입력은 무시된다.** D절 "끝난 뒤" 행을 goal-2부터 적용한다.
- 모든 규칙은 `src/logic.js`의 순수 함수. 캔버스·DOM 접근 없음, 시간은 `nowMs` 인자.

### 파일별 변경 (goal-2)
| 파일 | 변경 |
|---|---|
| `src/levels.js` | `LEVEL_1_ROWS`를 design-v2 5장 블록으로 교체. `LEVEL_CHARS`에 `o`,`S` 추가. `parseLevel`이 맵 문자에서 `dewdrops`와 `spiderStart`를 **계산해서** 반환(좌표 하드코딩 금지). `blocked`는 `#`만 벽. 호출마다 새 객체 |
| `src/logic.js` | `createWorld(level, nowMs)`, `startPlay(level, nowMs)`, `advance(world, nowMs, input)`, `isContact(player, spider)`, `score(world)`, 상수 `SPIDER_STEP_MS = 300`, `TIME_LIMIT_S = 60`. 방울 목표 개수는 맵에서 센 값을 쓴다. 기존 `requestMove` 등 유지. 주석에 canvas/document/window 문자열 금지 |
| `src/sprites.js` | `DEWDROP_SPRITE`(인덱스 5만), `SPIDER_SPRITE`(6·7만). 8×8, design-v2 4장 그림과 일치 |
| `src/render.js` | `drawDewdrops`, `drawSpider`, `drawHud(ctx, { collected, total, timeLeft })` 추가. **그리는 순서: level → dewdrops → spider → firefly → HUD** |
| `src/main.js` | keydown/keyup은 누른 키 목록만 갱신(**`performance.now()` 제거**), 탭 대기열 1회. 프레임마다 `advance(world, nowMs, { dir })` 1회 호출 후 그리기 |
| `src/strings.js` | `hudDew`, `hudTime` 형식 문자열 추가 |
| `test/wiring.test.js` | **수정** — firefly 식별을 `r.w === 4`에서 `fillStyle === PALETTE[2]`로 교체. keydown이 즉시 이동하지 않고 다음 프레임에 소비되는 것으로 기대값 조정 |
| `test/level.test.js`, `test/logic.test.js`, `test/redteam.test.js` | 아래 테스트 목록 |
| `index.html` | 변경 없음 |

## goal-3 (승패와 화면 전환) — 수용 기준 18~26
**완료 조건 (R2_decisions G절, 원문 그대로):**
> 타이틀에서 Enter로 시작해 모두 모으면 점수가 있는 클리어 화면이, 거미에게 잡히거나 시간이 다 되면 이유가 있는 실패 화면이 뜨고, Enter로 다시 하거나 타이틀로 돌아간다. (수용 기준 18~26)

### 규칙
- `world.phase` 값 하나를 더한다: `title`. 화면은 `title | play | won | lost` 네 가지이고 `won`=클리어, `lost`=실패 화면이다. 새 상태 기계를 따로 만들지 않는다.
- **타이틀 입력 규칙**: `title`에서는 방향키를 무시하고 타이머·거미가 움직이지 않으며 맵과 반딧불이를 그리지 않고 문구만 보인다(O8). Enter만 **`startPlay(level, nowMs)`**로 보낸다(수용 18).
- 클리어: `collected === 8`일 때(수용 19). "클리어!" + 점수(수용 20).
- **점수 = `collected * 100 + timeLeft * 10`. `timeLeft`는 정수 초이므로 내림 연산이 없다(사람 결정).** 실패는 0점(사람 결정 H절).
- 실패 이유는 `world.reason`에서 온다: `'spider'` → "거미에게 잡혔어요", `'timeout'` → "밤이 끝났어요"(수용 21·22).
- **`lost`에서 Enter → `startPlay(level, nowMs)`로 새 world**: 플레이어 P, 거미 S(왼쪽), 잠금 해제, `timeLeft=60`, 방울 8개 복원, `nextStepAt`·`nextSecondAt`이 Enter 프레임 `nowMs`로 재기준, 그리고 **main.js의 누른 키 목록을 비운다**(AR-08). phase는 `play`다. 수용 23.
- `won`에서 Enter → `title`(수용 24). 그 `title`에서 Enter를 다시 눌러야 `startPlay`가 불린다.
- `won`·`lost`에서 방향키 무시(수용 25, goal-2의 정지 후 규칙과 같은 코드 경로).
- 모든 화면 글자는 같은 `monospace` 패밀리(수용 26).
- **모든 UI 문구는 `src/strings.js` 한 곳에만 둔다.**

### 파일별 변경 (goal-3)
| 파일 | 변경 |
|---|---|
| `src/logic.js` | `phase`에 `title` 추가, `advance`가 `input.enter`를 처리(title→startPlay, won→title, lost→startPlay), `score(world)` |
| `src/strings.js` | `title`, `startHint`, `clear`, `scoreLabel`, `failSpider`, `failTimeout`, `retryHint` |
| `src/render.js` | `drawTitle`, `drawClear(score)`, `drawFail(reason)`. 글자 `#F2F7EE`, 안내 박스 `#1E2B24`, 같은 monospace |
| `src/main.js` | Enter를 입력에 실어 `advance`로 넘김(직접 상태 변경 금지), phase별 draw 분기, 리셋 시 누른 키 비우기 |
| `src/levels.js` | 변경 없음(goal-2에서 이미 재생성 보장) |
| `test/wiring.test.js` | 아래 이관 표대로 수정 |

### goal-3에서 이관·수정할 기존 wiring 테스트
타이틀이 생기면 부팅 직후가 더 이상 플레이가 아니므로, 아래 테스트들은 **"부팅 → Enter → 프레임"** 전제로 고쳐 goal-3 커밋에 포함한다.
| 기존 테스트 (test/wiring.test.js) | goal-2에서 | goal-3에서 |
|---|---|---|
| `startup: title and background … firefly starts at P (2,10)` | 유지(로드 즉시 플레이), 헬퍼만 교체 | 두 개로 분리: (a) 부팅 직후는 타이틀 문구가 그려지고 반딧불이가 없다, (b) Enter 후 철 (2,10) |
| `keydown moves one cell at once; a held key moves again after 150 ms` | 수정(키는 다음 프레임에 소비) | Enter 선행 추가 |
| `keyup stops the held move` | 유지 | Enter 선행 추가 |
| `a non-arrow key does nothing` (Enter 테스트) | 유지 | **의미 변경** — "플레이 중 Enter는 이동시키지 않는다" + "타이틀에서 Enter는 플레이를 연다"로 나눈다 |
| `blur clears held keys` | 유지 | Enter 선행 추가 |
| `a key pressed during the lock moves at unlock if still held` | 유지 | Enter 선행 추가 |

## In scope / out of scope
**In scope**: GAME_DESIGN.md v2(2·3·4·5·9장 + HUD 절 + 탭 대기열 행), `createWorld`/`startPlay`/`advance` 도입, 이슬방울 수집, 거미 순찰, 접촉·맞바꿈 실패, 60초 정수 타이머, 정지 후 동결, HUD, 화면 4개와 Enter 전환, 점수, 문자열 분리, 위 테스트, 그리고 F6(rAF·performance.now 혼용) 해소.
**Out of scope (기획서에 없음 — 넣지 않는다)**: 사운드, 일시정지, 설정 화면, 난이도 선택, 리더보드, 랜덤 맵, 레벨 에디터, 거미 외 적, 모바일/반응형, 레벨 2·3(R3), 7·8장(R3), 외부 폰트·이미지·오디오 파일, package.json/번들러, R1 게이트 재개봉, 캠버스 크기 변경.

## Sequencing and dependencies
1. **S0 design-v2 작성**(GAME_DESIGN.md만) → 사람 "맞다" → `design-v2:` 커밋. *선행 없음.*
2. **S1 레벨 파서 확장**(`levels.js` + L1~L6). *S0 의존.*
3. **S2 world 파이프라인**(`logic.js`: `createWorld`, `startPlay`, `advance`, 틱 순서, 거미, 타이머, 정지 후 동결 + G2 테스트). *S1 의존.*
4. **S3 그리기와 HUD**(`sprites.js`, `render.js`, `strings.js`). *S2 의존.*
5. **S4 배선**(`main.js` — 키 대기열, 단일 시계; `test/wiring.test.js` 헬퍼 수정) → 사람 브라우저 확인(수용 6~17) → `goal-2:` 커밋. *S3 의존.*
6. **S5 title phase와 점수**(`logic.js`, `strings.js` + G3 테스트). *G1 의존.*
7. **S6 화면 그리기·입력 게이팅·wiring 이관**(`render.js`, `main.js`, `test/wiring.test.js`) → 사람 브라우저 확인(수용 18~26) → `goal-3:` 커밋. *S5 의존.*

## Acceptance criteria
### Step 0
- A0-1: 2장에 D절 8개 행 + 정수 초 문장 + 탭 대기열 행이 있고 "점수 — R2에서 채운다" 줄이 없으며, **점수·제한시간 행에 "(내림)" 문구가 없다**.
- A0-2: 3장이 E절 + 타이틀 입력 규칙으로 채워졌다.
- A0-3: 4장에 이슬방울·거미 행과 8×8 그림이 있고 색 번호가 5/6/7번이다.
- A0-4: 5장 문자 규칙에 `o`,`S`가 있고 코드 블록이 B절 맵과 문자 단위로 같으며 좌표를 적은 문장이 없다.
- A0-5: 9장에 1~26이 있고 1~5 제목이 "R1 게이트 미통과" 문구다.
- A0-6: HUD 절에 폰트·베이스라인·여백·높이·"벽 줄 위에 그린다"가 있고 전부 (에이전트 제안) 표기다.
- A0-7: R2_decisions 출처 값은 "(사람 결정 H절)", 사람이 지금 답한 타이머 결정은 "(사람 결정)", 에이전트 값은 "(에이전트 제안)"으로 표기됐다.
- A0-8: 새 색·새 숫자·새 기능이 한 개도 추가되지 않았다. `design-v2:` 커밋이 존재한다.

### goal-2 (사람이 브라우저에서 — 수용 6~17)
6. 벽·이슬방울 8개·거미 시작·반딧불이 시작이 5장 그림과 같다. 7. 벽과 바닥이 구분된다. 8. 색은 6장 8색뿐이다. 9. 시작 시 방울 8개가 보이고 HUD에 "이슬 0/8". 10. 방울 칸에 들어가면 사라지고 +1. 11. 먹은 칸·빈 칸은 변화 없음. 12. 거미가 약 0.3초마다 한 칸 왕복, 벽에서 반전. 13. 거미가 지나가도 방울은 남는다. 14. 같은 칸이 되면 즉시 정지. 15. 맞바꿈도 정지. 16. 시간이 60에서 1초씩 감소. 17. 0에서 정지.
- **14·15·17 확인 항목에 추가**: 멈췄을 때 거미도 멈추고 HUD 시간도 더 줄지 않으며 방향키를 눌러도 반딧불이가 움직이지 않는다.

### goal-3 (사람이 브라우저에서 — 수용 18~26)
18. 타이틀 → Enter → 플레이. 19. 8개 모두 → 클리어 화면. 20. 점수 표시. 21. "거미에게 잡혔어요". 22. "밤이 끝났어요". 23. 실패→Enter→처음부터(8개, 60초). 24. 클리어→Enter→타이틀. 25. 클리어·실패에서 방향키 무시. 26. 모든 화면 글자가 같은 한 서체.

## Verification / Verification Plan
### 자동 (`node --test test/`)
기대값은 기획서 숫자에서 가져온다. 가능하면 level.test.js처럼 GAME_DESIGN.md를 읽어 대조한다.

| ID | 테스트 | 근거 |
|---|---|---|
| L1 | 레벨 1 행이 5장 코드 블록과 문자 단위로 같다 | 5장 |
| L2 | 가장자리 전부 벽, 내부 벽 11칸 (v1과 동일) | 5장 |
| L3 | 맵 문자에서 계산한 `dewdrops`가 8개이고 전부 바닥 칸이며 중복이 없다 | 5장 |
| L4 | `S`가 1개이고 바닥 칸이며, 그 행의 바닥 구간이 끊김 없이 14칸 | 5장 |
| L5 | `o`,`S`,`#`,`.`,`P` 외 문자는 거부된다 | 5장 |
| L6 | `P`에서 BFS했을 때 방울 8개와 `S`가 모두 도달 가능 | R2_decisions B절 |
| G2-1 | 방울 칸 진입 → `collected` +1, 방울 제거 | 수용 10 |
| G2-2 | 같은 칸 재방문·빈 칸은 불변 (방울당 1회만) | 수용 11 |
| G2-3 | 거미가 299 ms엔 안 움직이고 300 ms에 한 칸 | 수용 12 |
| G2-4 | 벽에서 반전, x=1↔x=14 왕복 26스텝 | 수용 12 |
| G2-5 | 거미가 방울 칸을 지나가도 방울이 남는다 | 수용 13 |
| G2-6 | 같은 칸 → `lost`/`spider` 즉시 | 수용 14 |
| G2-7 | 인접 맞바꿈 → `lost` | 수용 15 |
| G2-8 | 맞바꿈이 아닌 같은 방향 스침은 `play` 유지 | 수용 15 역케이스 |
| G2-9 | `timeLeft`가 60에서 1씩, 음수 없이 0에서 `lost`/`timeout` | 수용 16·17 |
| G2-10 | HUD 문자열이 strings.js에서 오고 `이슬 0/8`, `시간 60` 형식 | 수용 9 |
| G2-11 | O3: 같은 틱에 마지막 방울 칸 = 거미 칸 → `lost`, `collected`는 그대로(접촉이 먼저), `score` 0 | D절 |
| G2-12 | `won`/`lost` 이후 `advance`를 여러 프레임 돌려도 player·spider·timeLeft가 그대로고 dir 입력이 무시된다 | D절 "끝난 뒤" |
| **G2-13** | AR-04·**AR2-02**: `nowMs`가 한 주기를 넘어 줄어들어 도달한 호출에서 **거미는 0칸 움직이고 `nextStepAt = nowMs + 300`, 타이머는 0초 감소하고 `nextSecondAt = nowMs + 1000`**이 된다(순간이동·여러 초 깎기 없음) | AR2-02 |
| G3-1 | `score`: 8개 + `timeLeft` 37 → 800 + 370 = **1170** (정수 초, 내림 연산 없음) | 수용 20 |
| G3-2 | `lost`의 점수는 0 | D절 |
| G3-3 | `title` + Enter → `startPlay`가 호출되어 `phase='play'`, `startedAt`·`nextSecondAt`·`nextStepAt`이 **그 프레임 `nowMs`** 기준이 된다 | 수용 18, AR2-01 |
| G3-4 | 8개 수집 → `won` | 수용 19 |
| G3-5 | 접촉 → `reason='spider'`, 시간 0 → `reason='timeout'` | 수용 21·22 |
| G3-6 | `lost` + Enter → `startPlay(level, nowMs)`와 같은 값(P, S 왼쪽, 방울 8, timeLeft 60, 잠금 해제, 양구가 Enter 프레임 기준), phase는 `play` | 수용 23, AR-08, AR2-01 |
| G3-7 | `won` + Enter → `title` | 수용 24 |
| G3-8 | `won`·`lost`에서 dir 입력이 좌표를 바꾸지 않는다 | 수용 25 |
| G3-9 | 실패 문구 두 개가 strings.js에만 있다 | E절 |
| G3-10 | O2: 같은 틱에 마지막 방울 수집 + 시간 0 → `won`(클리어 우선), 점수는 800 + 0 | 틱 순서 |
| G3-11 | `title`에서는 dir 입력·타이머·거미가 모두 멈춰 있다 | 3장 |
| W0 | wiring: firefly를 `fillStyle === PALETTE[2]`로 찾는다 | F2/AR-09 |
| W1 | wiring: 페이지 로드(goal-2) / Enter(goal-3) 시점에 타이머와 거미가 함께 시작한다 | AR-13 |
| W2 | wiring: 렌더가 6장 8색 외 fillStyle을 쓰지 않는다 | 수용 8 |
| W3 | wiring: `performance`를 전혀 호출하지 않고도 탭 입력이 한 칸 움직인다(단일 시계 + 대기열 O9) | F1/AR-01 |
| V-6 | 기존 유지: `src/logic.js` 소스에 canvas/document/window 문자열이 없다 | AGENTS.md |

### 수동 (완료의 근거)
- `python3 -m http.server 8000` 후 `http://localhost:8000/index.html`.
- goal-2: 수용 6~17을 번호대로. 콘솔 에러 0개. 16px 글자가 32 px 줄에 잘리지 않는지 눈으로 확인.
- goal-3: 수용 18~26을 번호대로. 7번·26번은 사람 확인만이다(명시적 예외).
- fixture 스크린샷은 증거가 아니다.

### 명령
- `node --test test/`
- `python3 -m http.server 8000`

## Intent Reconciliation (열린 항목)
| # | 항목 | 상태 / 제안 기본값 | 근거 |
|---|---|---|---|
| O1 | 타이머·거미 시작 시점 | 열림 — goal-2는 페이지 로드, goal-3부터 Enter. 둘 다 `startPlay(level, nowMs)` (에이전트 제안) | A·D절, AR-13 |
| O2 | 마지막 방울과 시간 0이 같은 틱 | 열림 — 클리어 우선 (에이전트 제안, G3-10) | D절 "8개를 모두 먹으면 즉시 클리어" |
| O3 | 수집과 접촉이 같은 틱 | 닫힘 — 접촉 우선 → 실패 (사람 결정 H절 D표, G2-11) | D절 명시 |
| O4 | HUD를 title·won·lost에도 그릴지 | 열림 — 플레이 화면에만 (에이전트 제안) | A절 |
| O5 | HUD 폰트·배치 | 열림 — `16px monospace`, 베이스라인 22, 좌 8 / 우 504 (에이전트 제안). 폰트 메트릭 미검증 | 32 px 줄 |
| **O6** | 남은 시간 저장·표시·점수 단위 | **answered: A (사람 결정)** — 정수 초 단일 모델. 점수 = 정수 남은 초 × 10. D절의 "1초(내림)" 조항은 대지된다 | 사람 답변, F6/AR-03 |
| O7 | 거미 첫 방향 | 닫힘 — 왼쪽 (사람 결정 H절 B절) | B절 |
| O8 | 타이틀에 맵·반딧불이를 보일지 | 열림 — 보이지 않고 문구만 (에이전트 제안) | E절에 언급 없음 |
| **O9** | 탭 보장 대기열(keyup 후 1프레임) | **열림 (에이전트 제안)** — design-v2 2장에 행으로 올려 사람이 읽고 맞다/아니다를 말한다(AR2-03). 제안 기본값: 마지막 누름을 1회 대기열로 남기고 다음 프레임에 소비 | 단일 시계의 부수 효과, 수용 2 |

그 외 규칙은 만들지 않는다.

## Escalation / Risk Gate
- **실행 정책 (사용자 합의)**: 품질 게이트는 goal당 **1회만** 시도(리뷰 1회 → 그 해시로 체크포인트 1회). 실패해도 반복하지 않고 사실대로 기록한 뒤 다음 goal로 간다.
- **이 계획의 리뷰 반복**: 최대 2회. **소진됨** — Review status 절 참조.
- **중단 기준**: 한 goal에서 같은 시도를 6번 넘게 반복하지 않는다(AGENTS.md).
- **에스컬레이션**: 기획서 값과 구현이 충돌하면 기획서를 먼저 고치고 사람에게 보여준다. 사람 확인 없이 숫자를 바꾸지 않는다.
- **승인 경계**: S0는 사람 확인으로 진행 가능. S1~S6은 이 계획이 사람 게이트를 통과한 뒤에만 착수한다.

## Risks and mitigations
| 위험 | 영향 | 완화 |
|---|---|---|
| 시계 통일로 탭 입력이 한 프레임 늦게 반응해 수용 2·4·5가 깨진다 | 높음 | O9 대기열 규칙 + W3. 기획서 2장 행으로 올려 사람이 확인 |
| 스프라이트 추가로 wiring 헬퍼가 다른 물체를 읽는다 | 높음 | 그리기 순서 고정 + `fillStyle === PALETTE[2]`(W0). `test/wiring.test.js`를 변경 목록에 명시 |
| 맵 교체로 기존 level/redteam 테스트가 깨진다 | 중 | 벽 좌표가 v1과 동일함을 확인했으므로 벽 기반 테스트는 유지 |
| 동시 틱 우선순위가 테스트 없이 구현된다 | 중 | G2-11·G3-10. 순서는 `advance` 한 고에만 있다 |
| 정지 후 거미·타이머가 계속 돌아 수용 14·17 판단이 흐려진다 | 중 | `phase !== 'play'`이면 즉시 반환. G2-12 |
| 탭 전환·저사양에서 거미가 순간이동하고 타이머가 여러 초 깎인다 | 중 | 재기준 규칙(AR2-02)을 두 규칙에 각각 한 줄로 고정 + G2-13 |
| HUD가 벽 줄을 덮어 수용 6 판단이 흐려진다 | 낮 | design-v2 HUD 절에 명시해 사람이 게이트에서 미리 판단 |
| 16px 글자가 32 px 줄에 안 들어간다 | 낮 | 미검증 항목으로 명시. 사람 확인에서 걸리면 크기만 (에이전트 제안)으로 조정 |
| 8색 외 색·strings 외 문구가 섞인다 | 중 | W2, G3-9 |
| R1 게이트 blocked 상태를 R2 성공으로 오해 | 중 | Known state에 HEAD와 상속 항목 명시. 완료 선언은 수용 번호로만 |
| **stage-03이 재리뷰되지 않았다** | 중 | Review status에 잔여 항목을 전부 열린 주의사항으로 올리고 사람 승인 게이트에서 한 번에 보인다 |

## Handoff
- **executor**: S0(design-v2 작성)과 S1~S6. 슬라이스마다 파일 목록과 테스트 ID가 위에 있다.
- **architect**: 계획 리뷰 반복은 소진된다. 구현 리뷰는 goal당 1회.
- **critic**: 계획 리뷰 2회 상한 소진(stage-01, stage-02).
- **autoresearch / ultragoal**: 불필요.

## Review status
- **Critic stage-02: OKAY.** F1~F10 전부 해소로 판정. 새 비차단 지적 2개(N1 표기 라벨, N2 D절 원문 보존).
- **Architect stage-02: WATCH / COMMENT.** AR-01~AR-15 전부 해소 표시 확인. 새 비차단 지적 3개(AR2-01 시작 양구, AR2-02 재기준 경계, AR2-03 탭 대기열 2장 행).
- **stage-03(이 문서)은 그 잔여 항목 3개와 사람의 타이머 결정을 접어넣은 것이고, 재리뷰되지 않았다.** 리뷰 상한(2회)이 stage-01·stage-02에서 소진되었고 정책상 추가 pass를 열지 않는다. 그러므로 **이 문서의 pass 3 변경분은 리뷰없이 사람 승인 게이트로 간다**. "리뷰 통과"로 읽지 마시오.
- **사람 승인 게이트에서 같이 봐야 하는 열린 잔여 항목 (전부)**
  1. **N1 (critic, MEDIUM, 미반영)**: R2_decisions.md 머릿말은 "모든 값은 제안이다"라고 하는데 이 계획은 라벨을 "(사람 결정 H절)"로 쓴다. critic은 "(사람 제안 H절, 확정 대기)"를 제안했다. 이번 pass는 지시 범위 밖이라 바꾸지 않았다. → S0 작성 시 라벨만 고치면 된다.
  2. **N2 (critic, LOW, 사람 결정으로 대지)**: critic은 D절 점수 행 원문("1초(내림)")을 그대로 두고 무효화 문장을 주석으로 분리하라고 요구했다. 그러나 **사람이 정수 초(옵션 A)를 직접 결정했으므로 "(내림)" 삭제가 상위 지시다.** 숫자(10점)는 변함이 없다. 사람은 이 문장 교체를 게이트에서 다시 한번 확인해야 한다.
  3. **AR2-01 (architect, MEDIUM, 반영 됨)**: `createWorld(level, nowMs)` + `startPlay(level, nowMs)`로 해소. 단, 이 API 모양은 리뷰된 적이 없다.
  4. **AR2-02 (architect, LOW, 반영 됨)**: 재기준 호출은 0칸·0초. G2-13으로 고정. 리뷰되지 않았다.
  5. **AR2-03 (architect, LOW, 반영 됨)**: 탭 대기열을 2장 행으로. O9는 열린 항목이므로 사람이 맞다/아니다를 말해야 한다.
  6. **미검증 증거 (이전 pass와 동일)**: 바닥 129칸 도달성(L6으로 닫을 예정), 이슬방울 최단거리 3~20칸, 16px 폰트 메트릭, 실제 프레임 간격. 맵 검증은 스크립트 실행 없이 읽기 대조로만 했다.
  7. **R1 상속 항목 (닫히지 않음)**: architect REQUEST CHANGES, cleaner 와이어링 순서 의존, critic 적색팀 누락. fix-6(현재 HEAD 7ca8b79)는 리뷰되지 않았다.

## ADR — R2 게임 루프의 상태·시간 모델
### Decision
`src/logic.js`가 `createWorld(level, nowMs)`, `startPlay(level, nowMs)`, `advance(world, nowMs, input)` 세 순수 함수를 내고, `world.phase`(`title|play|won|lost`)가 화면과 진행을 동시에 나팩한다. 한 틱의 순서는 `advance` 안에서 고정된다(이동 → 접촉 → 수집 → 거미 → 접촉 → 타이머). 시계는 프레임 `nowMs` 하나이며 타이머는 정수 초 하나다. `main.js`는 키를 쌓고 `advance`를 부르고 그린다.

### Drivers
1. 수용 기준 14·15·19·20·23·25가 모두 "어떤 사건이 먼저인가"에 달려 있어 순서가 제품 사양이다.
2. 그 순서는 node --test로 고정되어야 한다(Decision Driver 2). DOM·rAF 영역에 둔 순서는 테스트할 수 없다.
3. 거미 300 ms와 타이머 1초는 두 시계가 섮이면 결정적으로 재생되지 않는다(현행 `main.js:33`의 `performance.now()` 문제).
4. goal-3에서 화면·리셋을 더할 때 goal-2 코드를 다시 써야 하는 재작업을 피해야 한다.

### Alternatives considered
- **A. 규칙 함수 여러 개 + main.js가 순서 호출 (pass 1 원안)**. S2를 제일 작게 자를 수 있다. 기각: O2·O3 동시 틱 우선순위가 테스트 밖에 남는다.
- **B. `createWorld`/`startPlay` + 단일 `advance` (채택)**. 상태·순서·시간 양구·리셋이 한 고정에 모인다. 단점: S2가 커지고 기존 wiring 테스트를 수정해야 한다.
- **C. keydown에서 즉시 이동 유지 (현행 코드)**. 입력 지연이 0이다. 기각: 시계 혼용으로 300 ms·1새 간격을 결정적으로 테스트할 수 없고 접촉·수집을 두 곳에서 부르게 된다.

### Why chosen
B만이 "순서도 사양이다"는 사실을 테스트 가능한 자리에 둔다. A는 가장 중요한 규칙(동시 틱 우선순위)를 테스트 밖에 남기고, C는 시간 규칙 자주를 검증 불가로 만든다. 정수 초 타이머는 사람이 결정했으므로 표시와 점수가 같은 값에서 오고 내림 연산이 사라진다.

### Consequences
- 긍정: 수용 14·15·19·20·23·25가 테스트 ID와 1:1로 립크된다(G2-6…G3-10). goal-3은 phase 값 하나와 문구만 더하면 된다. F6 시계 혼용이 부수적으로 닫힌다.
- 비용: `test/wiring.test.js`가 바뀜다(헬퍼 식별 + keydown 지연). 탭 입력에 대기열(O9)이라는 파생 규칙이 생기고 그것이 기획서 2장에 행으로 올라간다. 입력 반응이 최대 한 프레임 늦는다.
- 중립: `requestMove` 등 R1 순수 함수와 그 테스트(logic·redteam)는 그대로 살아있다.

### Follow-ups
1. S0: N1 라벨 문구 정리, 정수 초 문장·탭 대기열 행·HUD 절·8×8 그림을 사람 게이트에서 한 번에 확인.
2. S2: `advance` 틱 순서와 재기준 규칙을 G2-11·G2-12·G2-13·G3-10으로 먼저 고정한 뒤 구현.
3. S4: `performance.now()` 제거와 wiring 헬퍼 교체를 한 커밋 안에서.
4. 미검증 항목(L6 도달성, 폰트 메트릭)은 구현·사람 확인 단계에서 닫는다.
5. R3 범위(레벨 2·3, 7·8장)는 이 ADR을 그대로 상속한다. 레벨을 더해도 `createWorld(level, nowMs)` 시그니처는 바띀 필요가 없다.

## Done when
- 위 섹션이 모두 존재하고, Pass 3 변경 요약의 6개 항목이 모든 위치에 반영되어 있다.
- 모든 숫자가 R2_decisions.md 또는 GAME_DESIGN.md로 추적된다(8 / 300 ms / 60 s / 100 / 10 / 16×12 / 32 px / 8색 / 26항목 / 150 ms). 이번 pass에서 바뀜 숫자는 하나도 없다.
- R2_decisions 출처 값은 "(사람 결정 H절)", 사람이 지금 답한 타이머는 "(사람 결정)", 에이전트 값(HUD 16px·베이스라인·여백, 8×8 그림, 탭 대기열, O1·O2·O4·O5·O8·O9)은 "(에이전트 제안)"으로 표시된다.
- Review status가 stage-03이 재리뷰되지 않았다는 사실과 잔여 항목 7개를 사실대로 적어 둔다.
