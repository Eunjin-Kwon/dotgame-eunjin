# Critic 리뷰 pass 2 (delta-only) — R1 계획

- stage: critic / stage_n 2
- 대상: stage-02-revision.md (sha256 [REDACTED])
- 직전: stage-01-critic.md (ITERATE, CR-R1-01..07)
- counter-review 대상: stage-02-architect.md (WATCH / COMMENT, R2-01..05)
- 기준: GAME_DESIGN.md 2장, AGENTS.md. 테스트·빌드 미실행. 소스 파일 생성/수정 없음.

## Verdict: ITERATE

근거: 직전 blocker는 모두 해소되었거나 사람 결정으로 닫혔다. CRITICAL/HIGH 이월 없음. 남은 항목은 MEDIUM 3건과 LOW 2건이며, 전부 executor의 동작 기대값을 바꾸는 계획 결함이라 한 번의 수정이 필요하다. 판정은 악화되지 않았다(monotonicity 준수).

## 직전 blocker 해소 확인

| id | 상태 | 근거 |
|----|------|------|
| CR-R1-01 완료 기준 | 해소 | §7 머리말, §8-3, 게이트 5. 계획은 완료 기준을 만들지 않고 9장 공백을 블로커로 둠 |
| CR-R1-02 착수 게이트 | 해소 | 사람이 2장 값 7개 확정. 착수 조건 충족. 잔여 순서 문제는 CR2-02 |
| CR-R1-03 goal 열림 | 해소 | Summary, §5, §7 머리말에 R1 goal 열림 명시 |
| CR-R1-04 AC 검증성 | 해소 | V-6 텍스트 assert, V-9 관찰 절차, V-10 차단, V-7/V-8 조건부 |
| CR-R1-05 인터페이스·시간 모델 | 대부분 해소 | requestMove(state, dir, nowMs, grid), state {x,y,lockedUntil}, grid {width,height,blocked}, 즉시 이동 + 150 ms 잠금 확정. 잔여 CR2-01 |
| CR-R1-06 경로 허용 | 해소 | src/render.js, test/logic.test.js 확정 사용 제외, 렌더 경로 사람 결정으로 올림 |
| CR-R1-07 fixture 벽 | 해소 | blocked(x,y) boolean 질의만, 벽 문자 없음 |

CRITICAL/HIGH 이월: 없음.

## 신규 findings (delta)

### CR2-01 [MEDIUM] 막힌 입력이 잠금을 거는지 테스트에 위임됨
- 근거: revision §6 R1a (c)는 제자리 경우의 잠금 갱신 여부를 "테스트로 고정한다"고 적는다. (d)는 "이동이 성립하면" 잠금을 건다고 적어 암시만 한다. 2장에는 이 경우에 대한 규정이 없다.
- 영향: 테스트 기대값이 기획서 숫자 밖에서 정해진다. 원칙 5(기대값은 기획서에서만) 위반.
- 수정: 계획이 기본값을 명시한다. "입력이 이동을 만들지 않으면 state 전체 불변(lockedUntil 포함)". 이 기본값을 사람 확인 항목으로 표시한다.

### CR2-02 [MEDIUM] design-v1 선행 여부가 계획 안에서 충돌함
- 근거: §1-4와 §5 Summary는 "계획 승인 후 R1a 착수 가능"이라 한다. §10-2는 design-v1 커밋을 R1a(§10-4) 앞 필수 단계로 둔다. 어느 쪽이 게이트인지 불명확하다.
- 영향: design-v1 없이 R1a가 먼저 커밋되면 기획서는 여전히 "(에이전트 제안)"이고 테스트는 그 값으로 고정된다. AGENTS.md "기획서를 먼저 고친다" 취지와 어긋난다.
- 수정: 게이트를 하나로 쓴다. "design-v1 커밋 완료 → R1a 착수". §1-4, §5, §10을 이 문장에 맞춘다.

### CR2-03 [MEDIUM] 반복 구동(계속 누르기) 소유가 R1a/R1b 어디에도 없음
- 근거: 2장 "계속 누르고 있으면 150 ms마다 한 칸"은 requestMove 단일 호출로는 생기지 않는다. V-1..V-6에 반복 구동 검증이 없고, 이 행위는 V-9 (6) 수동 관찰에만 있다.
- 수정: 소유를 명시한다. "반복 구동은 R1a 범위 밖이며 호출자(R1b 입력 루프) 책임. 검증은 V-9 (6)". V-7을 R1a에 새로 추가하는 방식은 pass 2 범위 확장이므로 채택하지 않는다.

### CR2-04 [LOW] V-2 문구가 단일 dir 시그니처와 맞지 않음
- 근거: V-2의 "대각선 의도 입력"은 dir 하나로 표현할 수 없다.
- 수정: "dir이 up/down/left/right 외의 값이면 좌표 불변"으로 쓴다. 이 문구면 검증 가능하다. 2장에 동시 입력 규칙을 새로 정할 필요는 없다.

### CR2-05 [LOW] V-9 (6) 판정 기준이 주관적임
- 근거: "멈추지 않고 연속으로 칸을 옮긴다"는 판정 기준이 없다.
- 수정: "잠금 해제 시점마다 1칸, 잠금 중 입력은 무시"처럼 150 ms 단위로 쓴다.

## Counter-review: Architect pass 2 (stage-02-architect.md)

- R2-01 (MEDIUM): 타당. CR2-01과 동일. 수준 유지.
- R2-02 (MEDIUM): 과대평가. 2장 "대각선 이동 없음"과 단일 dir 시그니처만으로 규칙이 정해진다. 사람에게 동시 입력 규칙을 새로 묻는 것은 불필요한 범위 확장. LOW로 내리고 V-2 문구 수정(CR2-04)으로 닫는다.
- R2-03 (MEDIUM): 사실 오류. §10-2가 design-v1을 R1a 앞에 이미 둔다. 실제 문제는 §1-4와 Summary의 "승인 후 착수" 문구이며 CR2-02로 흡수한다.
- R2-04 (MEDIUM): 타당. 다만 Architect의 선택지(가) V-7 추가는 pass 2 범위 확장이므로 기각하고 (나) 소유 명시만 채택한다(CR2-03).
- R2-05 (LOW): 타당. AGENTS.md의 명령 "node --test test/"는 test/ 안의 어떤 파일명이든 허용한다. 테스트 파일명은 R1a 게이트에서 제외한다.
- Architect Recommendations 3(동시 입력 규칙 확정)은 불필요. 4(V-7 추가)는 기각.
- Architect WATCH / COMMENT 판정은 monotonicity 규칙과 모순되지 않는다. 이 검토의 판정은 Architect 판정에 의존하지 않는다.

## 검토 확인 (통과)
- 2장 숫자 7개는 사람 확정값과 일치. 60초 등 발명 값 없음. 맵 문자·색 hex 없음.
- 완료 근거는 9장으로 돌아갔고 계획이 임시 수용 기준을 완료 근거로 쓰지 않는다.
- src/strings.js는 R1 목록에서 제외. src/render.js와 test/logic.test.js는 AGENTS.md 미명명 상태에서 확정 사용하지 않는다.

## 요청 (수정 최소 세트)
1. CR2-01: (c)의 막힌 입력 잠금 기본값을 명시하고 사람 확인 항목으로 표시.
2. CR2-02: 착수 게이트를 "design-v1 커밋 완료 → R1a" 하나로 통일.
3. CR2-03: 반복 구동 소유를 R1a 밖 + V-9 (6)로 명시.
4. CR2-04, CR2-05: V-2, V-9 (6) 문구 수정.

위 수정이 반영되면 다음 pass에서 OKAY 판정이 가능하다.
