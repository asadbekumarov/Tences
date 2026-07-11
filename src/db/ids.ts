/** Telegram user id → Prisma BigInt (SQLite INTEGER 64-bit) */
export function toDbUserId(userId: number): bigint {
  return BigInt(userId);
}
