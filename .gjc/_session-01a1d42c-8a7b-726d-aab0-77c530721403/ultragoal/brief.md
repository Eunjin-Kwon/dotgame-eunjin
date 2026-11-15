R2 for the 반딧불이 이슬 모으기 dot game (HTML + Canvas 2D + ES modules, no build, no dependencies).

Source of truth: .gjc/_session-01a1d42c-8a7b-726d-aab0-77c530721403/plans/ralplan/01a1d42c-8a7b-726d-aab0-77c530721403/pending-approval.md (sha256 b696f57f...). Human-confirmed values: /Users/eunjinkwon/dev/dot_game/R2_decisions.md sections B~G, plus open items O1, O2, O4, O5, O8, O9 as stated in the plan.

Gate before any goal: S0 design-v2. Write GAME_DESIGN.md (the only file touched in S0). No code edits. Do not commit until the human says 맞다. Human-confirmed values are tagged (확정) in design-v2; agent-proposed values are tagged (에이전트 제안).

Hard rules: integer-second timer (option A). Spider 300 ms per tile, reverses at walls, does not eat dewdrops. Contact (same cell or swap) is immediate failure. 8 dewdrops (o), spider S, time limit 60 s, score = dewdrops x 100 + remaining integer seconds x 10, failed = 0. Screens: title -> play -> clear or fail. Enter starts and restarts. HUD on the top wall row, 16px monospace, baseline 22, left 8 / right 504.

Repository safety: the tracked file .gjc/state/sdk/01a1d29b-ee05-75c2-b1fa-f75a1af552b7.json holds a session token and is already in history at a0ea9ca. Remove it from the index with git rm --cached (kept on disk) only in the design-v2 commit, after the human confirms. Never commit .gjc/state/sdk/. Before every commit, check git diff --staged for tokens or keys and report the result. Do not touch plans, evidence, or ledger folders of prior sessions.

Quality gate policy: attempt once per goal (one review, then one checkpoint on that review's hash). On failure, record the actual state truthfully and move to the next goal. Do not repeat.

@goal: goal-2 목표물·위협·타이머
Implement in src/logic.js (pure, no canvas): createWorld(level, nowMs), startPlay(level, nowMs), advance(world, nowMs, input) as one tick pipeline (player move, contact, pickup, spider move, contact, timer). Spider patrols row y=6 every 300 ms with re-anchor on long delay. Integer-second timer 60 -> 0. Contact = immediate stop; 8/8 pickup = won stop (screen is goal-3). Use the frame nowMs only; no performance.now() in keydown. Level map from GAME_DESIGN 5장 characters (o, S) copied into src/levels.js. HUD on wall row. Tests in node --test test/ with expectations from the design numbers.
Completion sentence: index.html을 http로 열어 플레이하면 이슬방울 8개를 먹을 때마다 사라지고 개수가 올라가며, 거미가 가로로 왕복하고, 시간이 60에서 줄어들고, 거미에 닿거나 0이 되면 게임이 멈춘다. (수용 기준 6~17)

@goal: goal-3 승패와 화면 전환
Add title, clear, fail screens to the same pipeline (phase title | play | won | lost). Enter on title starts play; Enter on won returns to title; Enter on lost restarts the same level. Clear screen shows score (8x100 + remaining seconds x10). Fail screen shows "거미에게 잡혔어요" or "밤이 끝났어요" with "Enter 키로 다시 시작". All UI strings in src/strings.js. Directional keys ignored after won or lost. Move wiring tests that assumed play-on-load into goal-3 scope as listed in the plan.
Completion sentence: 타이틀에서 Enter로 시작해 모두 모으면 점수가 있는 클리어 화면이, 거미에게 잡히거나 시간이 다 되면 이유가 있는 실패 화면이 뜨고, Enter로 다시 하거나 타이틀로 돌아간다. (수용 기준 18~26)
