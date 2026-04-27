import { Composer, InputFile } from "grammy";
import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { saveUser, getAllUsers } from "../data/users.js";
const ADMIN_ID = 7035304195;
export const adminComposer = new Composer();
/**
 * Middleware: Capture all users (excluding bots) and save them to users.json
 * This runs before any other handlers to catch all requests
 */
adminComposer.use(async (ctx, next) => {
    // Only track real users, not bots
    if (ctx.from && !ctx.from.is_bot) {
        const userId = ctx.from.id;
        const firstName = ctx.from.first_name;
        const username = ctx.from.username;
        // Save/update user (will avoid redundant writes if nothing changed)
        await saveUser(userId, firstName, username);
    }
    // Continue to next middleware/handler
    await next();
});
/**
 * Admin Command: /users
 * Only responds to the admin ID (7035304195)
 * Returns a formatted HTML list of all users or a .txt file if too long
 */
adminComposer.command("users", async (ctx) => {
    // Check if the user is the admin
    if (ctx.from?.id !== ADMIN_ID) {
        await ctx.reply("❌ <b>Ruxsati yo'q</b>\n\nSiz bu buyruqni ishlatishga ruxsat emassiz.", {
            parse_mode: "HTML",
        });
        return;
    }
    try {
        const users = await getAllUsers();
        if (users.length === 0) {
            await ctx.reply("📊 <b>Foydalanuvchilar soni:</b> 0\n\nHech kim botdan foydalanmagan.", {
                parse_mode: "HTML",
            });
            return;
        }
        // Build HTML formatted list
        let htmlList = `📊 <b>Foydalanuvchilar soni: ${users.length}</b>\n\n`;
        users.forEach((user, index) => {
            const nameLink = `<a href="tg://user?id=${user.id}">${escapeHtml(user.firstName)}</a>`;
            const usernameText = user.username ? `@${user.username}` : "—";
            const idCode = `<code>${user.id}</code>`;
            htmlList += `${index + 1}. ${nameLink} | ${usernameText} | ${idCode}\n`;
        });
        // Check if message exceeds Telegram's 4000 character limit
        if (htmlList.length > 4000) {
            // Create .txt file and send as document
            const txtContent = `FOYDALANUVCHILAR RO'YXATI\n${"=".repeat(50)}\n\nJami: ${users.length}\n\n`;
            const txtList = users
                .map((user, index) => `${index + 1}. ${user.firstName} | @${user.username || "—"} | ID: ${user.id}`)
                .join("\n");
            const fullTxt = txtContent + txtList;
            const txtFilePath = resolve("users_list.txt");
            // Write the file
            await fs.writeFile(txtFilePath, fullTxt, "utf-8");
            try {
                // Send as document
                await ctx.replyWithDocument(new InputFile(txtFilePath), {
                    caption: `📊 <b>Foydalanuvchilar soni: ${users.length}</b>`,
                    parse_mode: "HTML",
                });
            }
            finally {
                // Delete the file after sending
                try {
                    await fs.unlink(txtFilePath);
                }
                catch (unlinkError) {
                    console.error("[admin.ts] Error deleting users_list.txt:", unlinkError);
                }
            }
        }
        else {
            // Send as HTML message
            await ctx.reply(htmlList, {
                parse_mode: "HTML",
            });
        }
    }
    catch (error) {
        console.error("[admin.ts] Error in /users command:", error);
        await ctx.reply("❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.", {
            parse_mode: "HTML",
        });
    }
});
/**
 * Helper function to escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}
