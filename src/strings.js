// All user-visible UI text (AGENTS.md: UI strings live only in this file).

export const STRINGS = {
  gameTitle: '반딧불이 이슬 모으기',
  hudDew: (n, total) => `이슬 ${n}/${total}`,
  hudTime: (s) => `시간 ${s}`,
  hudLevel: (k) => `레벨 ${k}/3`,
  titleStart: 'Enter 키로 시작',
  clearTitle: '클리어!',
  clearScore: (score) => `점수 ${score}`,
  clearNext: 'Enter 키로 다음 레벨',
  clearBack: 'Enter 키로 타이틀',
  failSpider: '거미에게 잡혔어요',
  failTime: '밤이 끝났어요',
  failRetry: 'Enter 키로 다시 시작',
};
