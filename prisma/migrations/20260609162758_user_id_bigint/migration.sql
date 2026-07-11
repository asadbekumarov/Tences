/*
  Warnings:

  - You are about to alter the column `player1Id` on the `DuelHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `player2Id` on the `DuelHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - You are about to alter the column `winnerId` on the `DuelHistory` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DuelHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unit" INTEGER NOT NULL,
    "player1Id" BIGINT NOT NULL,
    "player2Id" BIGINT NOT NULL,
    "player1Score" INTEGER NOT NULL,
    "player2Score" INTEGER NOT NULL,
    "winnerId" BIGINT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DuelHistory_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DuelHistory_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DuelHistory" ("createdAt", "id", "player1Id", "player1Score", "player2Id", "player2Score", "unit", "winnerId") SELECT "createdAt", "id", "player1Id", "player1Score", "player2Id", "player2Score", "unit", "winnerId" FROM "DuelHistory";
DROP TABLE "DuelHistory";
ALTER TABLE "new_DuelHistory" RENAME TO "DuelHistory";
CREATE INDEX "DuelHistory_player1Id_idx" ON "DuelHistory"("player1Id");
CREATE INDEX "DuelHistory_player2Id_idx" ON "DuelHistory"("player2Id");
CREATE INDEX "DuelHistory_createdAt_idx" ON "DuelHistory"("createdAt");
CREATE TABLE "new_User" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "username" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 1000,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "draws", "firstName", "id", "losses", "rating", "updatedAt", "username", "wins") SELECT "createdAt", "draws", "firstName", "id", "losses", "rating", "updatedAt", "username", "wins" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
