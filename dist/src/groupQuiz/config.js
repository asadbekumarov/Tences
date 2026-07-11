export const GROUP_QUIZ_CONFIG = {
    LOBBY_SECONDS: 60,
    OPTIONS_PER_QUESTION: 4,
    MIN_PLAYERS: 1,
    /** Javob bo'lmasa keyingi savolga o'tish */
    QUESTION_TIMEOUT_MS: 20_000,
    /** Aktiv o'yinda hech kim javob bermasa */
    INACTIVE_GAME_TIMEOUT_MS: 2 * 60_000,
    /** DB dagi LOBBY eskirishi (bot restart) */
    STALE_LOBBY_DB_MS: 3 * 60_000,
    /** DB dagi ACTIVE eskirishi */
    STALE_ACTIVE_DB_MS: 20 * 60_000,
    CLEANUP_INTERVAL_MS: 15_000,
    ADVANCE_DELAY_MS: 800,
    MIN_UNIT: 1,
    MAX_UNIT: 60,
};
