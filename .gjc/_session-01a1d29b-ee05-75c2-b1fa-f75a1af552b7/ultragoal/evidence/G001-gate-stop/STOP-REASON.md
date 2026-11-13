# G001 게이트 중단 사유 (goal-1)

## 사유 (사용자 지정 문구)
5번 수정(fix-1~fix-5) 후에도 리뷰 레인이 라운드마다 새 지적을 내서 architect/cleaner/critic이 통과하지 않았고, 오늘 마감 때문에 더 반복하지 않는다. 해시, 리뷰 전문, 커밋은 모두 보존한다.

## 최종 상태
- goal-1 (G001): 완료로 기록하지 않음. 체크포인트 상태는 아래 "보류 상태" 참조.
- 마지막 커밋: fix-6 (이 파일과 함께 커밋, 메시지는 fix-6: 으로 시작).
- 마지막 리뷰 해시: sha256:ab3b8d18de08c9684e2f9655720bad0e7e7ff71b43e6c95b0033b4a9d378a0fb (HEAD bdb637f, 43 경로). fix-6 이후 해시는 리뷰하지 않았다.

## 라운드별 해시 이력
| 라운드 | 커밋 | 해시 | 경로 수 | 결과 |
|---|---|---|---|---|
| 1 | e179cd6 fix-1 | sha256:3881db4e...be62 | 37 | architect WATCH, cleaner failed(4), qa failed(V-11) |
| 2 | 4072ee9 fix-2 | sha256:f8885a21...8d99 | 38 | 리뷰 전 커밋 |
| 3 | e32e281 fix-3 | sha256:f5e7d934...db61 | 39 | architect WATCH, cleaner failed(redteam 상수), critic OKAY, qa passed |
| 4 | 75ee1b2 fix-4 | sha256:78c4cd90...caaa8 | 42 | architect WATCH/REQUEST CHANGES, cleaner passed, qa passed, critic OKAY. checkpoint 거절: blocked 상태 |
| 5 | bdb637f fix-5 | sha256:ab3b8d18...78a0fb | 43 | architect WATCH/REQUEST CHANGES, cleaner failed(wiring 순서 의존, 오타), qa passed, critic REJECT(red-team 누락). checkpoint 거절 |

## 보류 상태
- checkpoint --status complete는 거절됐고 goal은 complete가 아니다.
- 사실에 가장 가까운 상태: blocked (리뷰가 막혀 있고 사람이 결정할 항목이 남음). 그 상태는 아래 명령으로 기록한다.

## 증거 위치
- 리뷰 원문 (라운드 5): ultragoal/evidence/G001-gate-stop/review-round5-fix5/RAW-REVIEWS.md
- 게이트 JSON: ultragoal/evidence/G001-gate-stop/quality-gate-fix1.json, fix3, fix4, fix5
- checkpoint 거절 출력: ultragoal/evidence/G001-gate-stop/checkpoint-fix4.out, checkpoint-fix5.out
- 사람 확정: ultragoal/evidence/G001-human-design-confirm/confirmation.md
- 브라우저 기록: ultragoal/evidence/G001-fix1-browser/ (PROVENANCE.md 포함)
- 상태 스냅샷: ultragoal/evidence/G001-state-snapshot/

## 알려진 한계 (ledger 기록)
- F5 (node --test 디렉터리 인자): 이 환경에서 32/32 통과. 일부 Node 버전 거부 가능성은 미검증.
- 프레임 간격 실측 없음 (60 Hz 이외 기기 미검증).
- 5장 맵, 6장 팔레트는 "(에이전트 제안)" 상태 유지 (사람 확정 아님).
- 사람의 브라우저 직접 확인은 fix-2 이전 빌드 기준. fix-5/fix-6 빌드에는 주장하지 않음.
- 리뷰 레인 cleaner, qa는 에이전트가 없어 critic과 executor(읽기 전용)가 대행.
- F6 (rAF 시각과 performance.now() 혼용): 테스트 없음, 미수정.
- A-1 (V-6 substring test): 무시.
