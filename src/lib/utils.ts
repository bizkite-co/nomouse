import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as fs from 'fs/promises';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

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
    console.log("createRawMarkdown called");
    console.log("Input HTML Content:", htmlContent.substring(0, 500)); // Log first 500 chars
    const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced'
    });

    // Use the GFM plugin
    turndownService.use(gfm);

    turndownService.addRule('emphasis', {
      filter: ['em', 'i'],
      replacement: function (content) {
        return '*' + content + '*'
      }
    });

    turndownService.addRule('strikethrough', {
      filter: function (node) {
        return node.nodeName === 'DEL' || node.nodeName === 'S'
      },
      replacement: function (content) {
        return '~~' + content + '~~'
      }
    });

    turndownService.remove(['style', 'script']); // Removed div and span
    // turndownService.keep('a');

    const markdownContent = turndownService.turndown(htmlContent);
    console.log("Markdown Content:", markdownContent.substring(0, 500)); // Log first 500 chars of output
    return markdownContent;
}

// export async function createAndSaveMarkdown(htmlFilePath: string) {
//     try {
//         const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');
//         const markdownContent = createRawMarkdown(htmlContent);
//         const markdownFilePath = htmlFilePath.replace(/\.html$/, '.md');
//         await fs.writeFile(markdownFilePath, markdownContent, 'utf-8');
//         console.log(`Markdown saved to: ${markdownFilePath}`);
//     } catch (error) {
//         console.error('Error in createAndSaveMarkdown:', error);
//     }
// }
