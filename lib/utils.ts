import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UIMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract all text content from a UIMessage (AI SDK v6 uses .parts instead of .content).
 */
export function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Generate a short unique ID (not crypto-random, but fine for UI keys)
 */
export function nanoid(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Format a timestamp to a human-readable relative time or short date.
 */
export function formatChatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const MINUTE = 60_000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  if (diff < MINUTE) return "Just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

/**
 * Truncate a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + "...";
}

/**
 * Extract a short title from the first user message content.
 */
export function getTitleFromMessage(content: string): string {
  const clean = content.replace(/\s+/g, " ").trim();
  return truncate(clean, 40);
}
