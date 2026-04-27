import { promises as fs } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// ESM: Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Resolve to project root (../../ from src/data/)
const USERS_FILE = resolve(__dirname, "../../users.json");
/**
 * Read all users from users.json
 * Returns an empty array if the file doesn't exist yet
 */
export async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        // File doesn't exist yet or is invalid JSON
        if (error.code === "ENOENT") {
            return [];
        }
        console.error("[users.ts] Error reading users.json:", error);
        return [];
    }
}
/**
 * Write users to users.json (atomically)
 */
export async function writeUsers(users) {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
    }
    catch (error) {
        console.error("[users.ts] Error writing to users.json:", error);
    }
}
/**
 * Get a user by ID
 */
export async function getUserById(userId) {
    const users = await readUsers();
    return users.find((u) => u.id === userId);
}
/**
 * Save or update a user
 * Returns true if the user was added/updated, false if no changes were made
 */
export async function saveUser(userId, firstName, username) {
    const users = await readUsers();
    const existingIndex = users.findIndex((u) => u.id === userId);
    // Check if user data has changed
    if (existingIndex !== -1) {
        const existing = users[existingIndex];
        if (existing.firstName === firstName &&
            existing.username === (username || undefined)) {
            // No changes, avoid redundant write
            return false;
        }
        // Update existing user
        users[existingIndex] = {
            ...existing,
            firstName,
            username: username || undefined,
        };
    }
    else {
        // Add new user
        const newUser = {
            id: userId,
            firstName,
            username: username || undefined,
            dateAdded: new Date().toISOString(),
        };
        users.push(newUser);
    }
    await writeUsers(users);
    return true;
}
/**
 * Get all users sorted by date added (newest first)
 */
export async function getAllUsers() {
    const users = await readUsers();
    return users.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
}
