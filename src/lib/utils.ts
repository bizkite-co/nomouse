import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url: string) {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function generateFilename(url: string) {
    const normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_') + '.png';
}

export function generateUrlPath(url: string) {
    const normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_');
}
