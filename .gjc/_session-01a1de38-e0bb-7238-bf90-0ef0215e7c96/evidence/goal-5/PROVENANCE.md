# goal-5 증거 출처

- 브라우저 측정(goal5-browser-run.json)과 스크린샷(shots/, 12장): Claude 계획 세션이 수행함. gjc 자동 브라우저는 사용하지 않음.
  - 원본 경로: scratchpad/evidence/goal5-browser-run.json, scratchpad/shots-g5/*.png
  - 소리 측정: 호출 가로채기(BaseAudioContext.prototype.createOscillator 래핑)로 파형, 주파수, 시작·정지 시각을 기록함. 귀로 들은 것이 아님.
  - 측정 항목: 3레벨 완주 총점 4230 = 1330 + 1370 + 1530(레벨 2 잡힘 후 재시작해도 총점 유지), 최종 화면 문구, 최고 점수 키 dotgame-eunjin-highscore 1개, 새로고침 유지와 타이틀 표시, 같은 페이지 두 번째 완주에서 총점 0부터 재시작, localStorage 예외와 AudioContext 없음 환경에서 완주해도 콘솔 에러 0.
  - 소리 측정값: 방울 사각파 880 Hz 80 ms, 클리어 사각파 523·659·784 Hz 각 120 ms, 실패 톱니파 220에서 110 Hz로 300 ms.
  - 소리 호출 수 40은 JSON에 적힌 값 그대로 기록함. 실행 범위별로 나누어 재계산하지 않음.
- 사람(사용자) 확인: 수용 32~37을 사용자가 브라우저에서 직접 확인함. 세 소리가 서로 다르게 들리는 것도 사용자가 귀로 확인함(사용자 응답 기준).
- node --test 출력: node-test-node20.txt (Node v20.20.2), node-test-node22.txt (Node v22.23.5). 실행 명령: `node --test`(폴더 인자 없음).
