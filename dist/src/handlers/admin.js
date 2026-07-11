import { Composer, InputFile } from "grammy";
import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { toDbUserId } from "../db/ids.js";
import { prisma } from "../db/prisma.js";
import { isGroupChat } from "../utils/chat.js";
import { escapeHtml } from "../utils/html.js";
const ADMIN_ID = 7035304195;
export const adminComposer = new Composer();
adminComposer.use(async (ctx, next) => {
    if (ctx.from && !ctx.from.is_bot) {
        const id = toDbUserId(ctx.from.id);
        void prisma.user
            .upsert({
            where: { id },
            create: {
                id,
                firstName: ctx.from.first_name,
                username: ctx.from.username,
            },
            update: {
                firstName: ctx.from.first_name,
                username: ctx.from.username,
            },
        })
            .catch((err) => console.error("[admin] upsert user failed:", err));
    }
    await next();
});
adminComposer.command("users", async (ctx) => {
    if (isGroupChat(ctx))
        return;
    if (ctx.from?.id !== ADMIN_ID) {
        await ctx.reply("❌ <b>Ruxsati yo'q</b>\n\nSiz bu buyruqni ishlatishga ruxsat emassiz.", {
            parse_mode: "HTML",
        });
        return;
    }
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        if (users.length === 0) {
            await ctx.reply("📊 <b>Foydalanuvchilar soni:</b> 0\n\nHech kim botdan foydalanmagan.", {
                parse_mode: "HTML",
            });
            return;
        }
        let htmlList = `📊 <b>Foydalanuvchilar soni: ${users.length}</b>\n\n`;
        users.forEach((user, index) => {
            const name = escapeHtml(user.firstName);
            const nameLink = `<a href="tg://user?id=${user.id}">${name}</a>`;
            const usernameText = user.username ? `@${escapeHtml(user.username)}` : "—";
            const idCode = `<code>${user.id}</code>`;
            htmlList += `${index + 1}. ${nameLink} | ${usernameText} | ${idCode}\n`;
        });
        if (htmlList.length > 4000) {
            const txtList = users
                .map((user, index) => `${index + 1}. ${user.firstName} | @${user.username ?? "—"} | ID: ${user.id}`)
                .join("\n");
            const fullTxt = `FOYDALANUVCHILAR RO'YXATI\n${"=".repeat(50)}\n\nJami: ${users.length}\n\n${txtList}`;
            const txtFilePath = resolve("users_list.txt");
            await fs.writeFile(txtFilePath, fullTxt, "utf-8");
            try {
                await ctx.replyWithDocument(new InputFile(txtFilePath), {
                    caption: `📊 <b>Foydalanuvchilar soni: ${users.length}</b>`,
                    parse_mode: "HTML",
                });
            }
            finally {
                try {
                    await fs.unlink(txtFilePath);
                }
                catch {
                    /* ignore */
                }
            }
        }
        else {
            await ctx.reply(htmlList, { parse_mode: "HTML" });
        }
    }
    catch (error) {
        console.error("[admin] /users failed:", error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.", {
            parse_mode: "HTML",
        });
    }
});
