import type { Game, GamePlayer, GameStatus } from "@prisma/client";
import { toDbUserId } from "../db/ids.js";
import { prisma } from "../db/prisma.js";
import { GROUP_QUIZ_CONFIG } from "./config.js";
import type { QuizOption } from "./types.js";

export interface CreateGameInput {
  chatId: number;
  hostUserId: number;
  unit: number;
  lobbyEndsAt: Date;
}

export interface QuestionInput {
  index: number;
  word: string;
  prompt: string;
  options: QuizOption[];
}

export class GroupQuizRepository {
  async findActiveByChat(chatId: number): Promise<Game | null> {
    return prisma.game.findFirst({
      where: {
        chatId: toDbUserId(chatId),
        status: { in: ["LOBBY", "ACTIVE"] },
      },
    });
  }

  async createGame(input: CreateGameInput): Promise<Game> {
    return prisma.game.create({
      data: {
        chatId: toDbUserId(input.chatId),
        hostUserId: toDbUserId(input.hostUserId),
        unit: input.unit,
        status: "LOBBY",
        lobbyEndsAt: input.lobbyEndsAt,
      },
    });
  }

  async setMessageId(gameId: string, messageId: number): Promise<void> {
    await prisma.game.update({
      where: { id: gameId },
      data: { messageId },
    });
  }

  async updateStatus(gameId: string, status: GameStatus): Promise<void> {
    await prisma.game.update({
      where: { id: gameId },
      data: { status },
    });
  }

  async addPlayer(
    gameId: string,
    userId: number,
    firstName: string,
    username?: string,
  ): Promise<GamePlayer | null> {
    try {
      return await prisma.gamePlayer.create({
        data: {
          gameId,
          userId: toDbUserId(userId),
          firstName,
          username,
        },
      });
    } catch {
      return null;
    }
  }

  async listPlayers(gameId: string): Promise<GamePlayer[]> {
    return prisma.gamePlayer.findMany({
      where: { gameId },
      orderBy: { joinedAt: "asc" },
    });
  }

  async createQuestions(gameId: string, questions: QuestionInput[]): Promise<void> {
    await prisma.gameQuestion.createMany({
      data: questions.map((q) => ({
        gameId,
        index: q.index,
        word: q.word,
        prompt: q.prompt,
        optionsJson: JSON.stringify(q.options),
        correctId: q.options.find((o) => o.isCorrect)?.id ?? 0,
      })),
    });
  }

  async getQuestion(gameId: string, index: number) {
    return prisma.gameQuestion.findUnique({
      where: { gameId_index: { gameId, index } },
    });
  }

  /** Race-safe: faqat birinchi to'g'ri javob ball oladi */
  async claimCorrectAnswer(
    gameId: string,
    questionIndex: number,
    userId: number,
  ): Promise<{ claimed: boolean; word?: string; firstName?: string }> {
    return prisma.$transaction(async (tx) => {
      const question = await tx.gameQuestion.findUnique({
        where: { gameId_index: { gameId, index: questionIndex } },
      });
      if (!question) return { claimed: false };

      const options = JSON.parse(question.optionsJson) as QuizOption[];
      const game = await tx.game.findUnique({ where: { id: gameId } });
      if (!game || game.status !== "ACTIVE") return { claimed: false };

      const player = await tx.gamePlayer.findUnique({
        where: {
          gameId_userId: { gameId, userId: toDbUserId(userId) },
        },
      });
      if (!player) return { claimed: false };

      if (question.answeredById !== null) {
        return { claimed: false };
      }

      const updated = await tx.gameQuestion.updateMany({
        where: { id: question.id, answeredById: null },
        data: {
          answeredById: toDbUserId(userId),
          answeredAt: new Date(),
        },
      });

      if (updated.count === 0) return { claimed: false };

      await tx.gamePlayer.update({
        where: { id: player.id },
        data: { score: { increment: 1 } },
      });

      return { claimed: true, word: question.word, firstName: player.firstName };
    });
  }

  async setCurrentIndex(gameId: string, index: number): Promise<void> {
    await prisma.game.update({
      where: { id: gameId },
      data: { currentIndex: index },
    });
  }

  async getLeaderboard(gameId: string): Promise<GamePlayer[]> {
    return prisma.gamePlayer.findMany({
      where: { gameId },
      orderBy: [{ score: "desc" }, { joinedAt: "asc" }],
    });
  }

  async isPlayer(gameId: string, userId: number): Promise<boolean> {
    const player = await prisma.gamePlayer.findUnique({
      where: {
        gameId_userId: { gameId, userId: toDbUserId(userId) },
      },
    });
    return player !== null;
  }

  async cancelStaleGames(): Promise<void> {
    const now = Date.now();
    await prisma.game.updateMany({
      where: {
        status: "LOBBY",
        updatedAt: { lt: new Date(now - GROUP_QUIZ_CONFIG.STALE_LOBBY_DB_MS) },
      },
      data: { status: "CANCELLED" },
    });
    await prisma.game.updateMany({
      where: {
        status: "ACTIVE",
        updatedAt: { lt: new Date(now - GROUP_QUIZ_CONFIG.STALE_ACTIVE_DB_MS) },
      },
      data: { status: "CANCELLED" },
    });
  }

  /** Bot qayta ishga tushganda DB dagi aktiv, lekin xotirada yo'q o'yin */
  async cancelOrphanedByChat(chatId: number): Promise<boolean> {
    const active = await this.findActiveByChat(chatId);
    if (!active) return false;
    await this.updateStatus(active.id, "CANCELLED");
    return true;
  }
}

export const groupQuizRepository = new GroupQuizRepository();
