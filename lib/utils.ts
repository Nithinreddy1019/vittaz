import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function convertAmountToMillUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function converAmountFromMillUnits(amount: number) {
  return Math.round(amount / 1000);
}

// WIP: Do this for Indian currency
export function formatCurrency(value: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}