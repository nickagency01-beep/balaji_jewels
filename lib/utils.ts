import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LMR-${ts}-${rand}`;
}

export const METAL_LABELS: Record<string, string> = {
  YELLOW_GOLD_14K: "14K Yellow Gold",
  YELLOW_GOLD_18K: "18K Yellow Gold",
  WHITE_GOLD_14K: "14K White Gold",
  WHITE_GOLD_18K: "18K White Gold",
  ROSE_GOLD_14K: "14K Rose Gold",
  ROSE_GOLD_18K: "18K Rose Gold",
  PLATINUM: "Platinum",
  SILVER_925: "Sterling Silver 925",
};

export const SHIPPING_THRESHOLD = 5000;
export const SHIPPING_COST = 150;
export const TAX_RATE = 0.03;
