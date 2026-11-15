R3 승인 계획(stage-04-final.md, 2026-11-15). 공통 제약: 테스트 명령은 node --test(폴더 인자 없음). 맵은 R3_decisions.md C·D절 블록을 글자 단위로 복사한다. 제품 코드는 design-v3 커밋 전에 건드리지 않는다. .gjc/state/sdk/ 커밋 금지. 사람이 맞다고 답하기 전에는 커밋하지 않는다.

@goal: S0 design-v3 (GAME_DESIGN.md v3)
GAME_DESIGN.md 한 파일만 v3로 쓴다. 5장 레벨 2·3 맵은 R3_decisions.md C절·D절 코드 블록을 글자 단위로 그대로 옮기고 일치를 확인해 보고한다. 7장, 8장(테스트 명령 node --test), 9장 수용 27~37, 10장 전부, 승인 계획의 충돌 표 14행을 반영한다. 완료 조건: 사람이 v3를 열어 맞다고 답한다. 그 전에는 커밋하지 않는다.

@goal: goal-4 레벨 2·3
design-v3 커밋 뒤에만 시작. 레벨 2·3 데이터, 레벨별 시간 60/50/45, 레벨 전환(클리어 Enter → 다음 레벨), 실패 시 같은 레벨 재시작, HUD 레벨 표시. 사람 브라우저 확인 수용 27~31. 품질 게이트 1회, 40분 제한.

@goal: goal-5 효과음·최고 점수·최종 화면
goal-4 뒤에만 시작. 효과음 3개(Web Audio), 최고 점수 localStorage 키 dotgame-eunjin-highscore, 최종 화면과 총점. 사람 브라우저 확인 수용 32~37. 품질 게이트 1회, 40분 제한.
