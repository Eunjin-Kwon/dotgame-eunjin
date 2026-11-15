# goal-4 증거 출처

- 브라우저 측정(goal4-browser-run.json)과 스크린샷(shots/, 6장): Claude 계획 세션이 수행함. gjc 자동 브라우저는 사용하지 않음.
  - 원본 경로: scratchpad/evidence/goal4-browser-run.json, scratchpad/shots-r3/*.png
  - 측정 항목: 레벨 1→2→3 전환, 방울을 모두 밟는 실제 클리어 경로, 레벨 2·3 맵과 방울 수, 레벨 3에서 잡힌 뒤 Enter로 같은 레벨 재시작, 레벨 3 클리어 점수 1530(12 × 100 + 남은 33초 × 10), 콘솔 에러 0, HUD 세 문구 겹침 없음.
- 사람(사용자) 브라우저 확인: 수용 27~31을 사용자가 직접 확인함(출처: 사용자 응답).
- node --test 출력: node-test-node20.txt (Node v20.20.2, 76/76), node-test-node22.txt (Node v22.23.5, 76/76). 실행 명령: `node --test`(폴더 인자 없음).
