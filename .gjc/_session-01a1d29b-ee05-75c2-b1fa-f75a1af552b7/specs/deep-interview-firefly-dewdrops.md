# Deep Interview Spec: 반딧불이 이슬방울 수집 게임

## Metadata
- Interview ID: 9d4c8b46-232d-47e9-89c3-b94f75d7e935
- Rounds: 4 (scored) + Round 0 topology + restate gate
- Final Ambiguity Score: 16.5%
- Type: greenfield
- Generated: 2026-11-13T11:10+09:00
- Threshold: 0.6
- Threshold Source: --quick mode default (no project/user `deepInterview.ambiguityThreshold` set)
- Initial Context Summarized: no
- Status: PASSED
- Auto-Answered Rounds: 0
- Architect Failures: 0
- Lateral Reviews: 0 (no milestone panel convened in quick mode)
- Lateral Panel Failures: 0
- Refined Rounds: 0
- Closure Overrides: none
- Restated Goal: 반딧불이가 밤이 끝나기 전에, 정해진 경로를 반복 순찰하는 거미(접촉 시 즉시 실패, 게임 오버)를 피해 숲의 이슬방울을 전부 모으면 성공하는 단일 화면 도트 게임을 만든다 (레벨 1은 60초, 레벨이 오를수록 시간이 조금씩 줄어든다).

## Clarity Breakdown
| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Goal Clarity | 0.85 | 0.40 | 0.34 |
| Constraint Clarity | 0.80 | 0.30 | 0.24 |
| Success Criteria | 0.85 | 0.30 | 0.255 |
| **Total Clarity** | | | **0.835** |
| **Ambiguity** | | | **0.165** |

## Locked Intent
- artifact:game-core — 단일 화면 도트 게임 한 개 (이슬방울 수집 + 순찰 거미 위협 포함)
- artifact:patrol-spider — 순찰하는 거미는 별도 컴포넌트가 아니라 같은 코어의 위협 요소
- surface:single-screen — 브라우저에서 여는 화면 하나
- constraint:no-deps — HTML + Canvas 2D + JS, 외부 의존성 0

## Topology
| Component | Status | Description | Coverage / Deferral Note |
|-----------|--------|-------------|--------------------------|
| 이슬방울 수집 게임 코어 | active | 이슬방울 수집 + 순찰 거미 위협을 포함한 단일 코어 | 목표, 실패 조건, 시간 규칙, 거미 이동 방식 확정. 이슬방울 개수와 시간 감소 폭은 Open Questions |

## Established Facts
- 거미는 별도 컴포넌트가 아니라 같은 코어의 위협 요소 (Round 0, 정정 후 확정)
- 성공: 밤 안에 숲의 이슬방울을 전부 모으면 성공 (Round 1)
- 실패: 거미와 접촉하면 즉시 게임 오버 (Round 2)
- 시간: 레벨 1은 60초, 레벨이 오를수록 시간이 조금씩 줄어든다 (Round 3)
- 거미: 정해진 경로를 반복 순찰 (Round 4)

## Trigger Metadata
- 모든 라운드 trigger_status: none. 모순 없음.

## Lateral Review Panel
- 퀵 모드에서 소집하지 않음.

## Goal
반딧불이가 밤이 끝나기 전에, 정해진 경로를 반복 순찰하는 거미를 피해 숲의 이슬방울을 전부 모으면 성공하는 단일 화면 도트 게임을 만든다.

## Constraints
- 단일 화면 도트 게임 한 개. 브라우저에서 여는 화면 하나.
- 구현 기술: HTML + Canvas 2D + JavaScript. 외부 의존성 0.
- 레벨 1 제한 시간 60초. 레벨이 오를수록 제한 시간이 조금씩 줄어든다.
- 거미 접촉 시 즉시 게임 오버.

## Non-Goals
- 별도 컴포넌트(추가 적, 별도 모드)는 이번 범위가 아니다.
- 명세에 없는 기능(설정 화면, 난이도 선택 등)은 만들지 않는다. (AGENTS.md 금지 목록 준수)

## Acceptance Criteria
- [ ] 레벨 1 시작 시 제한 시간은 60초다.
- [ ] 플레이어가 숲의 이슬방울을 전부 모으면(제한 시간 내) 성공 판정이 난다.
- [ ] 제한 시간이 끝나기 전 이슬방울을 전부 모으지 못하면 실패다.
- [ ] 거미와 접촉하면 즉시 게임 오버다.
- [ ] 거미는 정해진 경로를 반복 순찰한다.
- [ ] 레벨이 오르면 제한 시간이 줄어든다.
- [ ] 외부 라이브러리·이미지·오디오 파일 없이 브라우저에서 실행된다.

## Deferrals
- Convergence Pacing: 최소 라운드, 점수 하락 상한, 감쇠를 두지 않음. 양방향 점수가 페이싱 수단.

## Assumptions Exposed & Resolved
| Assumption | Challenge | Resolution |
|------------|-----------|------------|
| 거미는 별도 컴포넌트일 수 있다 | Round 0 확인 | 같은 코어의 위협 요소로 확정 |
| 성공 기준이 시간 기반인지 불분명 | Round 1 질문 | 밤 안에 이슬방울 전부 수집 |
| 접촉 시 패널티가 불분명 | Round 2 질문 | 즉시 게임 오버 |
| 시간 제한 수치가 불분명 | Round 3 질문 | 레벨 1 = 60초, 레벨마다 소폭 감소 |
| 거미 이동 방식이 불분명 | Round 4 질문 | 정해진 경로 반복 순찰 |

## Open Questions (명세 전 사람이 정해야 할 항목)
- 이슬방울 개수 (맵 한 장당 몇 개인지)
- 레벨당 시간 감소 폭 (몇 초씩 줄어드는지)
- 순찰 경로의 모양 (맵 위에서 어떤 경로인지)
- 레벨 수와 레벨 종료 조건

이 항목들은 기획서(GAME_DESIGN.md)에서 숫자로 정해야 하며, 코드에서 임의로 정하지 않는다 (AGENTS.md 금지 사항).

## Technical Context
- 현재 저장소: AGENTS.md, .git만 존재. 소스 없음. AGENTS.md는 GAME_DESIGN.md를 기획 기준으로 지정하지만 파일이 아직 없음.
- 기술 제약: HTML + Canvas 2D + JS ES modules, 빌드 없음, src/logic.js는 순수 함수, 색은 GAME_DESIGN.md 6장의 8색만 사용.

## Ontology (Key Entities)
| Entity | Type | Fields | Relationships |
|--------|------|--------|---------------|
| 반딧불이 | core domain | 위치, 수집 상태 | 이슬방울을 수집한다 |
| 이슬방울 | core domain | 위치, 수집 여부 | 반딧불이가 모은다 |
| 거미 | core domain (threat) | 경로, 위치 | 정해진 경로를 반복 순찰하며 반딧불이와 접촉하면 실패 |
| 레벨 | supporting | 번호, 제한 시간 | 레벨 1은 60초, 레벨이 오를수록 시간 감소 |

## Ontology Convergence
| Round | Entity Count | Notes |
|-------|-------------|-------|
| 1-4 | 4 | 엔티티 이름 변경 없이 안정 (Stability 100%) |

## Interview Transcript
<details>
<summary>Full Q&A (4 scored rounds + Round 0)</summary>

### Round 0 (topology)
**Q:** 이슬방울 수집 코어 1개로 읽음. 맞는지?
**A:** 맞아요. 다만 순찰 거미(위협)가 빠져 있으니 같은 코어에 포함.
**A (정정 후 확인):** 맞아요.

### Round 1
**Q:** 플레이어가 '성공'했다고 판정되는 순간은?
**A:** 숲의 이슬방울을 전부 모으면 성공 (밤 안에). Ambiguity 36.5%

### Round 2
**Q:** 순찰하는 거미에게 닿으면?
**A:** 즉시 실패 (게임 오버). Ambiguity 29%

### Round 3
**Q:** 밤 한 번에 시간은?
**A:** 짧게. 레벨 1은 60초, 레벨이 올라갈수록 시간이 조금 줄어드는 정도. Ambiguity 20%

### Round 4
**Q:** 순찰하는 거미는 어떻게 움직이나?
**A:** 정해진 경로를 반복 순찰. Ambiguity 16.5%

### Restate
- 목표 한 문장 확정 (거미 접촉 = 즉시 실패(게임 오버) 문구 수정 후 확정)
</details>
