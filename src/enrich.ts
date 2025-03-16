import * as fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { normalizeUrl, generateUrlPath, createRawMarkdown } from './lib/utils.ts';
import { processWebsite } from './lib/website.ts';

export async function enrichData(refresh: boolean = false, targetUrl: string | null = null): Promise<void> {
  console.log(`Running enrichData with refresh = ${refresh}, targetUrl = ${targetUrl}`);
  try {
    const csvData: string = await fs.readFile('src/data/pages.csv', 'utf-8');
    const urls: string[] = parse(csvData, {
      skip_empty_lines: true,
    }).flat();

    const currentDate: string = new Date().toISOString();

    // Create screenshots directory if it doesn't exist
    try {
      await fs.mkdir('public/screenshots', { recursive: true }); // Use recursive: true
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    for (const url of (targetUrl ? [targetUrl] : urls)) {
        await processWebsite(url, refresh, currentDate);
    }

    console.log('Data enrichment complete.');
  } catch (error) {
    console.error('Error during enrichment:', error);
  }
}

// Get refresh flag and optional URL from command line arguments
const refreshFlag: boolean = process.argv.includes('--refresh');
const targetUrl: string | undefined = process.argv.find(arg => arg.startsWith('http'));

enrichData(refreshFlag, targetUrl ?? null);