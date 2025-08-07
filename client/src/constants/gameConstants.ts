export const GAME_CONSTANTS = {
  MATCH_WIN_THRESHOLD: 10,
  MAX_HISTORY_ITEMS: 10,
  CLICK_DEBOUNCE_MS: 500,
  MAX_PLAYER_NAME_LENGTH: 20,
  MIN_PLAYER_NAME_LENGTH: 2,

  QUERY_STALE_TIME: 5 * 60 * 1000,
  QUERY_CACHE_TIME: 10 * 60 * 1000,

  API_TIMEOUT: 10000,

  DEFAULT_VOLUME: 0.5 as number,
} as const;

export const SOUND_NAMES = {
  WIN: 'win',
  LOSE: 'lose',
  TIE: 'tie',
  TAP: 'tap',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  GAME: '/game',
  ROOT: '/',
} as const;
