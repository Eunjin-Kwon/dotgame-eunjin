# Post-interview reconciliation (stage post-interview, stage_n 5)

- status: reconciled-with-revision
- evidence inspected: stage-05-revision.md, stage-05-architect.md (CLEAR / APPROVE), stage-05-critic.md (OKAY), GAME_DESIGN.md v0 section 2, AGENTS.md, intent receipt from deep-interview spec.
- resolved material decisions (user, this session):
  1. 2장 values confirmed: 격자 한 칸, 150 ms, 타일 32 px, 512x384 (16x12), 방향키 4개 대각선 없음, 벽/화면 밖 제자리, 키 입력 규칙.
  2. 타이밍 의미: 입력 시 즉시 한 칸 이동 + 150 ms 입력 잠금 (쿨다운, 트윈 없음).
  3. 막힌 입력(벽/화면 밖으로 이동 실패)은 150 ms 잠금을 걸지 않는다 (확정).
  4. 동시 입력: 마지막에 누른 키의 방향만 인정 (확정).
  5. R1은 goal-1 하나. R1a/R1b는 goal-1 안의 단계. 완료 조건은 브라우저에서 볼 수 있는 문장으로 쓰고, 4·5·6장 작성 전까지 차단 상태.
  6. 남은 규칙이 2장 밖이면 에이전트 기본값으로 두고 "(에이전트 제안)"으로 표기.
- retained non-goals: 10장 범위 밖 전부, 이슬방울, 거미, 점수, 타이머(기획서 미정의), 레벨 2·3, 사운드·UI 텍스트.
- material-open-items: 4장 오브젝트, 5장 맵 문자/레벨 1 맵, 6장 8색 팔레트, 9장 수용 기준 (human authoring; blocks goal-1 completion). design-v1 커밋 (GAME_DESIGN.md 2장 "(확정)" 표기 + 막힌 입력/동시 입력 행 추가) is a follow-up not yet performed.
