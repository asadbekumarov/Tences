export function isGroupChat(ctx) {
    return ctx.chat?.type === "group" || ctx.chat?.type === "supergroup";
}
export async function isGroupAdmin(ctx) {
    if (!isGroupChat(ctx) || !ctx.from)
        return false;
    try {
        const member = await ctx.getChatMember(ctx.from.id);
        return member.status === "creator" || member.status === "administrator";
    }
    catch {
        return false;
    }
}
