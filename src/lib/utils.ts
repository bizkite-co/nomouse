import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as fs from 'fs/promises';
import TurndownService from 'turndown';

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

export function createRawMarkdown(htmlContent: string) {
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });

    turndownService.remove(['style', 'script','div', 'span']);
    turndownService.keep('a');

    const markdownContent = turndownService.turndown(htmlContent);
    return markdownContent;
}
