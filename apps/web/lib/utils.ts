import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function uploadUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}
