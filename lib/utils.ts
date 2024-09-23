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