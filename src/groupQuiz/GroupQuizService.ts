import type { Api } from "grammy";
import { GrammyError, InlineKeyboard } from "grammy";
import type { GamePlayer } from "@prisma/client";
import { buildQuestionsForUnit, getWordCountForUnit } from "../duel/wordRepository.js";
import { escapeHtml } from "../utils/html.js";
import { GROUP_QUIZ_CONFIG } from "./config.js";
import { groupQuizManager } from "./GroupQuizManager.js";
import { groupQuizRepository } from "./GroupQuizRepository.js";
import { createAnswerKeyboard, createJoinKeyboard } from "./keyboard.js";
import type { LiveGroupGame, QuizOption } from "./types.js";

function parseOptions(json: string): QuizOption[] {
  return JSON.parse(json) as QuizOption[];
}

function formatLobbyText(
  unit: number,
  wordCount: number,
  secondsLeft: number,
  players: { firstName: string }[],
): string {
  const lines = players.map((p, i) => `${i + 1}. ${escapeHtml(p.firstName)}`);
  const list = lines.length > 0 ? lines.join("\n") : "— hali hech kim qo'shilmadi";

  return (
    `🎮 <b>Unit ${unit}</b> — <b>${wordCount}</b> ta so'z\n\n` +
    `✅ Qatnashish uchun tugmani bosing.\n` +
    `1 daqiqa ichida qo'shilganlar o'ynaydi.\n\n` +
    `⏳ <b>${secondsLeft}</b> soniya\n\n` +
    `👥 Ishtirokchilar: <b>${players.length}</b> ta\n` +
    list
  );
}

function formatQuestionText(
  word: string,
  prompt: string,
  index: number,
  total: number,
): string {
  return (
    `❓ <b>Savol ${index + 1}/${total}</b>\n\n` +
    `<b>${escapeHtml(word)}</b>\n` +
    escapeHtml(prompt)
  );
}

async function withTelegramRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 4,
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (
        err instanceof GrammyError &&
        err.error_code === 429 &&
        attempt < maxAttempts
      ) {
        const waitMs = ((err.parameters?.retry_after as number | undefined) ?? 1) * 1000;
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

function formatFinalResults(players: GamePlayer[]): string {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const medals = ["🥇", "🥈", "🥉"];
  const lines = sorted.map((p, i) => {
    const medal = medals[i] ?? "▪️";
    return `${medal} ${escapeHtml(p.firstName)} — <b>${p.score}</b> ball`;
  });
  const winner = sorted[0];
  const header = winner ? `\n\n🎉 G'olib: <b>${escapeHtml(winner.firstName)}</b>` : "";
  return `🏁 <b>O'yin yakunlandi</b>\n\n${lines.join("\n")}${header}`;
}

export class GroupQuizService {
  private readonly lobbyEditChains = new Map<string, Promise<void>>();
  private readonly questionChains = new Map<string, Promise<void>>();

  constructor(private readonly api: Api) {}

  private runQuestionStep(gameId: string, fn: () => Promise<void>): void {
    const prev = this.questionChains.get(gameId) ?? Promise.resolve();
    const next = prev.then(fn).catch((err) => {
      console.error("[GroupQuiz] question step failed:", err);
    });
    this.questionChains.set(gameId, next);
  }

  private clearQuestionChain(gameId: string): void {
    this.questionChains.delete(gameId);
  }

  private runLobbyEdit(gameId: string, fn: () => Promise<void>): void {
    const prev = this.lobbyEditChains.get(gameId) ?? Promise.resolve();
    const next = prev.then(fn).catch((err) => {
      console.error("[GroupQuiz] lobby edit failed:", err);
    });
    this.lobbyEditChains.set(gameId, next);
  }

  private clearLobbyEditChain(gameId: string): void {
    this.lobbyEditChains.delete(gameId);
  }

  async reconcileChat(chatId: number): Promise<void> {
    if (!groupQuizManager.hasChat(chatId)) {
      await groupQuizRepository.cancelOrphanedByChat(chatId);
    }
  }

  async endDueToInactivity(gameId: string): Promise<void> {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "ACTIVE") return;

    groupQuizManager.clearQuestionTimer(gameId);
    groupQuizManager.clearInactivityTimer(gameId);

    const board = await groupQuizRepository.getLeaderboard(gameId);
    await groupQuizRepository.updateStatus(gameId, "FINISHED");
    groupQuizManager.remove(gameId);

    const results =
      board.length > 0 && board.some((p) => p.score > 0)
        ? formatFinalResults(board)
        : "Hech kim javob bermadi.";

    await this.editOrSend(
      live,
      `⏱ <b>2 daqiqa javob yo'q — o'yin tugadi</b>\n\n${results}`,
    );
  }

  private resetInactivityTimer(gameId: string): void {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "ACTIVE") return;

    groupQuizManager.recordPlayerAction(gameId);
    groupQuizManager.clearInactivityTimer(gameId);

    live.inactivityTimer = setTimeout(() => {
      void this.endDueToInactivity(gameId);
    }, GROUP_QUIZ_CONFIG.INACTIVE_GAME_TIMEOUT_MS);
  }

  async startLobby(
    chatId: number,
    hostUserId: number,
    unit: number,
  ): Promise<{ ok: true; gameId: string } | { ok: false; reason: string }> {
    await this.reconcileChat(chatId);

    if (groupQuizManager.hasChat(chatId)) {
      return { ok: false, reason: "active" };
    }

    const existing = await groupQuizRepository.findActiveByChat(chatId);
    if (existing) return { ok: false, reason: "active" };

    const lobbyEndsAt = new Date(Date.now() + GROUP_QUIZ_CONFIG.LOBBY_SECONDS * 1000);

    let wordCount: number;
    try {
      wordCount = await getWordCountForUnit(unit);
    } catch {
      return { ok: false, reason: "no_words" };
    }

    const game = await groupQuizRepository.createGame({
      chatId,
      hostUserId,
      unit,
      lobbyEndsAt,
    });

    const live: LiveGroupGame = {
      gameId: game.id,
      chatId,
      messageId: null,
      unit,
      status: "LOBBY",
      hostUserId,
      currentIndex: 0,
      totalQuestions: wordCount,
      lobbyEndsAt: lobbyEndsAt.getTime(),
      lobbyEndTimer: null,
      lobbyTickInterval: null,
      lobbyPlayersCache: [],
      lobbyPlayersDirty: false,
      lastLobbySecondsShown: null,
      questionTimer: null,
      inactivityTimer: null,
      lastPlayerActionAt: Date.now(),
      lastActivityAt: Date.now(),
    };
    groupQuizManager.register(live);

    const text = formatLobbyText(unit, wordCount, GROUP_QUIZ_CONFIG.LOBBY_SECONDS, []);
    const msg = await this.api.sendMessage(chatId, text, {
      parse_mode: "HTML",
      reply_markup: createJoinKeyboard(game.id),
    });

    groupQuizManager.setMessageId(game.id, msg.message_id);
    await groupQuizRepository.setMessageId(game.id, msg.message_id);

    this.startLobbyCountdown(game.id);
    return { ok: true, gameId: game.id };
  }

  private startLobbyCountdown(gameId: string): void {
    const live = groupQuizManager.get(gameId);
    if (!live) return;

    groupQuizManager.clearLobbyEndTimer(gameId);
    groupQuizManager.clearLobbyTickInterval(gameId);

    const msUntilEnd = Math.max(0, live.lobbyEndsAt - Date.now());
    live.lobbyEndTimer = setTimeout(() => {
      void this.endLobby(gameId);
    }, msUntilEnd);

    live.lobbyTickInterval = setInterval(() => {
      void this.tickLobby(gameId);
    }, 1000);

    void this.tickLobby(gameId);
  }

  tickLobby(gameId: string): void {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "LOBBY" || !live.messageId) return;

    const secondsLeft = Math.max(0, Math.ceil((live.lobbyEndsAt - Date.now()) / 1000));
    if (secondsLeft <= 0) return;

    const needsUpdate =
      live.lastLobbySecondsShown !== secondsLeft || live.lobbyPlayersDirty;
    if (!needsUpdate) return;

    this.runLobbyEdit(gameId, async () => {
      const liveNow = groupQuizManager.get(gameId);
      if (!liveNow || liveNow.status !== "LOBBY" || !liveNow.messageId) return;

      const secs = Math.max(0, Math.ceil((liveNow.lobbyEndsAt - Date.now()) / 1000));
      if (secs <= 0) return;

      try {
        await this.api.editMessageText(
          liveNow.chatId,
          liveNow.messageId,
          formatLobbyText(
            liveNow.unit,
            liveNow.totalQuestions,
            secs,
            liveNow.lobbyPlayersCache,
          ),
          {
            parse_mode: "HTML",
            reply_markup: createJoinKeyboard(gameId),
          },
        );
        liveNow.lastLobbySecondsShown = secs;
        liveNow.lobbyPlayersDirty = false;
      } catch (err: unknown) {
        const desc =
          err && typeof err === "object" && "description" in err
            ? String((err as { description: string }).description)
            : "";
        if (desc.includes("message is not modified")) {
          liveNow.lastLobbySecondsShown = secs;
          liveNow.lobbyPlayersDirty = false;
        }
      }
    });
  }

  async joinGame(
    gameId: string,
    userId: number,
    firstName: string,
    username?: string,
  ): Promise<boolean> {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "LOBBY") return false;

    const added = await groupQuizRepository.addPlayer(gameId, userId, firstName, username);
    if (!added) return false;

    const players = await groupQuizRepository.listPlayers(gameId);
    live.lobbyPlayersCache = players.map((p) => ({ firstName: p.firstName }));
    live.lobbyPlayersDirty = true;
    groupQuizManager.recordPlayerAction(gameId);
    this.tickLobby(gameId);
    return true;
  }

  async endLobby(gameId: string): Promise<void> {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "LOBBY") return;

    groupQuizManager.clearLobbyEndTimer(gameId);
    groupQuizManager.clearLobbyTickInterval(gameId);
    this.clearLobbyEditChain(gameId);
    const players = await groupQuizRepository.listPlayers(gameId);

    if (players.length < GROUP_QUIZ_CONFIG.MIN_PLAYERS) {
      await groupQuizRepository.updateStatus(gameId, "CANCELLED");
      groupQuizManager.remove(gameId);
      await this.editOrSend(
        live,
        "❌ O'yin bekor qilindi.\n\nHech kim qatnashmadi.",
        undefined,
      );
      return;
    }

    try {
      const built = await buildQuestionsForUnit(live.unit, { useAllWords: true });
      const questions = built.map((q, index) => ({
        index,
        word: q.word,
        prompt: q.prompt,
        options: q.options,
      }));

      live.totalQuestions = questions.length;
      await groupQuizRepository.createQuestions(gameId, questions);
      live.status = "ACTIVE";
      live.currentIndex = 0;
      live.lastPlayerActionAt = Date.now();
      groupQuizManager.touch(gameId);
      await groupQuizRepository.updateStatus(gameId, "ACTIVE");
      await this.showQuestion(gameId, 0);
      this.resetInactivityTimer(gameId);
    } catch (err) {
      console.error("[GroupQuiz] endLobby failed:", err);
      await groupQuizRepository.updateStatus(gameId, "CANCELLED");
      groupQuizManager.remove(gameId);
      await this.editOrSend(live, "❌ Savollar yuklanmadi. O'yin bekor qilindi.");
    }
  }

  async showQuestion(gameId: string, index: number): Promise<void> {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "ACTIVE") return;

    const question = await groupQuizRepository.getQuestion(gameId, index);
    if (!question) {
      await this.finishGame(gameId);
      return;
    }

    const options = parseOptions(question.optionsJson);
    const text = formatQuestionText(
      question.word,
      question.prompt,
      index,
      live.totalQuestions,
    );

    const displayed = await this.publishQuestion(
      live,
      text,
      createAnswerKeyboard(gameId, index, options),
    );
    if (!displayed) {
      console.error(`[GroupQuiz] publishQuestion failed game=${gameId} index=${index}`);
      this.scheduleQuestionTimeout(gameId, live.currentIndex);
      return;
    }

    live.currentIndex = index;
    live.lastActivityAt = Date.now();
    groupQuizManager.recordPlayerAction(gameId);
    await groupQuizRepository.setCurrentIndex(gameId, index);
    this.scheduleQuestionTimeout(gameId, index);
  }

  private scheduleQuestionTimeout(gameId: string, index: number): void {
    const live = groupQuizManager.get(gameId);
    if (!live) return;

    groupQuizManager.clearQuestionTimer(gameId);
    live.questionTimer = setTimeout(() => {
      void this.advanceQuestion(gameId, index);
    }, GROUP_QUIZ_CONFIG.QUESTION_TIMEOUT_MS);
  }

  async processAnswer(
    gameId: string,
    questionIndex: number,
    optionId: number,
    userId: number,
    clickedMessageId?: number,
  ): Promise<{ feedback: string; advance: boolean; answeredIndex?: number }> {
    const live = groupQuizManager.get(gameId);
    if (!live || live.status !== "ACTIVE") {
      return { feedback: "O'yin tugagan", advance: false };
    }

    if (clickedMessageId && live.messageId && clickedMessageId !== live.messageId) {
      return {
        feedback: "⏭ Bu eski xabar — chatda eng pastidagi savolga javob bering.",
        advance: false,
      };
    }

    const activeIndex = live.currentIndex;
    if (questionIndex !== activeIndex) {
      return {
        feedback: "⏭ Bu eski savol — eng pastdagi yangi savolga javob bering.",
        advance: false,
      };
    }

    const question = await groupQuizRepository.getQuestion(gameId, activeIndex);
    if (!question) return { feedback: "Savol topilmadi", advance: false };

    const isPlayer = await groupQuizRepository.isPlayer(gameId, userId);
    if (!isPlayer) {
      return { feedback: "❌ Siz o'yinga qo'shilmagansiz", advance: false };
    }

    if (question.answeredById !== null) {
      return { feedback: "😅 Bu savol allaqachon yakunlangan.", advance: false };
    }

    const options = parseOptions(question.optionsJson);
    const option = options.find((o) => o.id === optionId);
    if (!option) return { feedback: "Noto'g'ri variant", advance: false };

    if (!option.isCorrect) {
      this.resetInactivityTimer(gameId);
      return { feedback: "❌ Noto'g'ri — yana urinib ko'ring!", advance: false };
    }

    const claim = await groupQuizRepository.claimCorrectAnswer(gameId, activeIndex, userId);
    if (!claim.claimed) {
      return { feedback: "😅 Bu savol allaqachon yakunlangan.", advance: false };
    }

    groupQuizManager.clearQuestionTimer(gameId);
    this.resetInactivityTimer(gameId);

    const winText =
      `✅ <b>${escapeHtml(claim.firstName!)}</b> birinchi topdi!\n\n` +
      `+1 ball ⚡`;

    const liveNow = groupQuizManager.get(gameId);
    if (liveNow?.messageId) {
      try {
        await this.api.editMessageText(liveNow.chatId, liveNow.messageId, winText, {
          parse_mode: "HTML",
          reply_markup: new InlineKeyboard(),
        });
      } catch {
        await this.stripKeyboard(liveNow.chatId, liveNow.messageId);
      }
    }

    return { feedback: "✅ To'g'ri!", advance: true, answeredIndex: activeIndex };
  }

  async advanceQuestion(gameId: string, fromIndex: number): Promise<void> {
    return new Promise((resolve) => {
      this.runQuestionStep(gameId, async () => {
        const live = groupQuizManager.get(gameId);
        if (!live || live.status !== "ACTIVE") return;
        if (live.currentIndex !== fromIndex) return;

        groupQuizManager.clearQuestionTimer(gameId);

        const next = fromIndex + 1;

        if (next >= live.totalQuestions) {
          await this.finishGame(gameId);
          return;
        }

        await this.stripKeyboard(live.chatId, live.messageId);
        await new Promise((r) => setTimeout(r, GROUP_QUIZ_CONFIG.ADVANCE_DELAY_MS));
        await this.showQuestion(gameId, next);
      });
      const chain = this.questionChains.get(gameId);
      if (chain) void chain.then(() => resolve());
      else resolve();
    });
  }

  async finishGame(gameId: string): Promise<void> {
    const live = groupQuizManager.get(gameId);
    if (!live) return;

    groupQuizManager.clearQuestionTimer(gameId);
    groupQuizManager.clearInactivityTimer(gameId);
    this.clearQuestionChain(gameId);
    const board = await groupQuizRepository.getLeaderboard(gameId);
    await groupQuizRepository.updateStatus(gameId, "FINISHED");
    groupQuizManager.remove(gameId);

    const text = formatFinalResults(board);
    await this.editOrSend(live, text);
  }

  private async stripKeyboard(chatId: number, messageId: number | null): Promise<void> {
    if (!messageId) return;
    try {
      await this.api.editMessageReplyMarkup(chatId, messageId, {
        reply_markup: new InlineKeyboard(),
      });
    } catch {
      /* ignore */
    }
  }

  private async publishQuestion(
    live: LiveGroupGame,
    text: string,
    keyboard: ReturnType<typeof createAnswerKeyboard>,
  ): Promise<boolean> {
    const oldMessageId = live.messageId;
    try {
      const msg = await withTelegramRetry(() =>
        this.api.sendMessage(live.chatId, text, {
          parse_mode: "HTML",
          reply_markup: keyboard,
        }),
      );
      groupQuizManager.setMessageId(live.gameId, msg.message_id);
      await groupQuizRepository.setMessageId(live.gameId, msg.message_id);
      if (oldMessageId) {
        void this.api.deleteMessage(live.chatId, oldMessageId).catch(() => {});
      }
      return true;
    } catch (err) {
      console.error("[GroupQuiz] publishQuestion failed:", err);
      return false;
    }
  }

  private async editOrSend(
    live: LiveGroupGame,
    text: string,
    keyboard?: ReturnType<typeof createAnswerKeyboard> | ReturnType<typeof createJoinKeyboard>,
  ): Promise<boolean> {
    const opts = {
      parse_mode: "HTML" as const,
      reply_markup: keyboard,
    };

    if (live.messageId) {
      try {
        await this.api.editMessageText(live.chatId, live.messageId, text, opts);
        return true;
      } catch (err: unknown) {
        const desc =
          err && typeof err === "object" && "description" in err
            ? String((err as { description: string }).description)
            : "";
        if (desc.includes("message is not modified")) return true;
        await this.stripKeyboard(live.chatId, live.messageId);
      }
    }

    const oldMessageId = live.messageId;
    try {
      const msg = await withTelegramRetry(() =>
        this.api.sendMessage(live.chatId, text, opts),
      );
      groupQuizManager.setMessageId(live.gameId, msg.message_id);
      await groupQuizRepository.setMessageId(live.gameId, msg.message_id);
      if (oldMessageId) {
        void this.api.deleteMessage(live.chatId, oldMessageId).catch(() => {});
      }
      return true;
    } catch (err) {
      console.error("[GroupQuiz] sendMessage failed:", err);
      return false;
    }
  }
}
