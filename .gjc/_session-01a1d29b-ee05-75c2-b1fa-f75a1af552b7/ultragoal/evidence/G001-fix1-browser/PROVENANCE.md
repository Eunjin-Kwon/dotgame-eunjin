# fix-1 browser evidence provenance

- browser-run-fix1.json and gui-screenshot-fix1.jpg were produced by the Claude planning session's built-in browser pane, not by gjc.
- gjc automated browser failed to start 3 times (`Tab worker startup failed (stage=init, mode=native-free, platform=darwin)`).
- The target was http://127.0.0.1:8765/index.html on the working tree after the F1/F4/F5 fixes, before the fix-1 commit.
- Human (user) direct browser confirmation of fix-1 is NOT claimed here. It is not recorded as confirmed until the user says so.

## browser-trace-fix2.json (fix-2, commit 4072ee9)

- Claude 계획 세션이 내장 브라우저로 fix-2(4072ee9) 기준으로 수행했습니다. gjc 자동 브라우저는 시작 실패(3회 이상)했습니다.
- 사용자의 직접 확인('동작 잘 한다')은 fix-2 이전 빌드(fix-1 작업 트리) 기준입니다. fix-2는 이 기록과 node --test 25/25로 확인합니다.
- 이 기록을 사용자 직접 확인과 섞어 쓰지 않습니다. 사람 확인으로 기록하지 않습니다.
