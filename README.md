# 반딧불이 이슬 모으기

밤이 끝나기 전에 반딧불이가 숲의 이슬방울 8개를 모두 모으는 한 화면 도트 게임입니다.
HTML + Canvas 2D + JavaScript(ES modules)로 만들었고, 의존성과 빌드 도구가 없습니다.

## 배포 주소

https://eunjin-kwon.github.io/dotgame-eunjin/ (GitHub Pages)

사용자와 Claude 계획 세션이 이 주소를 직접 열어 타이틀 화면, Enter 시작, 방향키 이동을 확인했습니다.

## 여는 법

ES module은 `file://`에서 CORS로 막혀 빈 화면이 됩니다. 반드시 로컬 서버로 여세요.

```sh
python3 -m http.server 8000
```

그다음 브라우저에서 http://localhost:8000/index.html 을 엽니다. `index.html`을 파일로 직접 열지 마세요.

## 조작

- 방향키: 반딧불이 이동 (한 번 누르면 한 칸, 누르고 있으면 150 ms마다 한 칸)
- Enter: 타이틀에서 시작, 실패 후 다시 시작, 클리어 후 타이틀로 돌아가기

## 규칙

- 제한 시간은 60초이고 정수 초 단위로 줄어듭니다.
- 이슬방울 8개를 모두 모으면 클리어합니다.
- 거미는 가로로 왕복합니다. 반딧불이와 같은 칸이 되거나 자리를 맞바꾸면 실패합니다. 제한 시간이 0이 되어도 실패합니다.
- 점수는 이슬방울 1개당 100점 + 클리어 때 남은 정수 초 × 10점입니다. 실패하면 0점입니다.

## 테스트

```sh
node --test
```

이 테스트는 Node 20.20.2와 22.23.5에서 66개 모두 통과하는 것을 확인했습니다. `node --test test/`처럼 폴더를 인자로 주면 Node 21 이상에서는 그 인자를 파일 패턴으로 읽어 실패하므로(`Cannot find module '…/test'`), 인자 없이 `node --test`를 씁니다. 인자 없이 실행하면 `test/` 안의 테스트를 자동으로 찾습니다.

## 현재 상태와 한계

- 레벨은 1개뿐입니다. 레벨 2·3, 소리, 최고 점수 저장은 구현하지 않았습니다. 새 레벨을 추가하는 기능도 없습니다.
- 레벨 맵은 `src/levels.js`에 있으며 GAME_DESIGN.md 5장의 문자 규칙을 그대로 씁니다. `#` 벽, `.` 바닥, `P` 반딧불이 시작, `o` 이슬방울, `S` 거미 시작입니다. 레벨을 바꾸려면 이 문자열을 고치면 됩니다.
- 한글 서체 한계: canvas font는 `monospace` 한 가지로 지정했습니다. 한글 글리프는 시스템 대체 글꼴로 그려져 영문·숫자와 모양이 다르게 보입니다. 웹폰트는 쓰지 않습니다. 사용자가 이 상태를 확인하고 인정했습니다.
- 품질 게이트(goal 완료 도장)는 통과하지 못해 goal이 blocked 상태입니다. 증거와 기록은 `.gjc/` 아래에 있습니다.

## 스크린샷

| 타이틀 | 플레이 | 클리어 | 실패 |
|---|---|---|---|
| [01-title.png](screenshots/01-title.png) | [02-play.png](screenshots/02-play.png) | [03-clear.png](screenshots/03-clear.png) | [04-fail.png](screenshots/04-fail.png) |

실제 플레이 중인 캔버스 화면을 Claude 계획 세션의 브라우저로 촬영했습니다.

## 파일 구성

- `AGENTS.md`: 이 프로젝트에서 에이전트가 따를 규칙(의존성 금지, 기획서 우선, 완료 조건 등)
- `GAME_DESIGN.md`: 기획서. 2장 이동·규칙, 3장 화면 흐름, 4장 오브젝트, 5장 맵, 6장 팔레트, 9장 수용 기준
- `.gjc/`: 작업 기록. 계획(ralplan), goal 원장(ultragoal), 검토 증거. 지우지 마세요
- `src/`: 게임 코드. `logic.js` 순수 규칙, `levels.js` 맵, `render.js` 그리기, `main.js` 입력과 프레임, `sprites.js` 스프라이트와 팔레트, `strings.js` 화면 문구
- `test/`: `node --test`로 실행하는 테스트
- `screenshots/`: 실제 화면 캡처 4장
- `index.html`: 캔버스와 `src/main.js` 로드
