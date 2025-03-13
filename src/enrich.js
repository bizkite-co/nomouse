import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { chromium } from 'playwright';
import { v4 as uuidv4 } from 'uuid';

export function normalizeUrl(url) {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function generateFilename(url) {
    const normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_') + '.png';
}

export function generateUrlPath(url) {
    const normalized = normalizeUrl(url);
    return normalized.replace(/[^a-z0-9]/gi, '_');
}

async function captureScreenshot(url, outputPath) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({ path: outputPath });
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error);
    throw error; // Throw error instead of returning null
  } finally {
    await browser.close();
  }
}

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error; // Throw error instead of returning null
  }
}

async function extractData(html, url, currentDate) {
  const cheerio = await import('cheerio');
  const $ = cheerio.load(html);

  const title = $('title').text() ?? '';
  if (!title) {
    console.error(`Error: Could not extract title for ${url}`);
    return null; // Return null if title is missing
  }
  const description = $('meta[name="description"]').attr('content') ?? '';
  let favicon = $('link[rel="icon"]').attr('href') ?? $('link[rel="shortcut icon"]').attr('href') ?? '';
  const image = $('meta[property="og:image"]').attr('content') ?? $('img').first().attr('src') ?? '';
  const keywords = $('meta[name="keywords"]').attr('content');

    // Handle relative favicon URLs
    if (favicon && !favicon.startsWith('http')) {
        favicon = new URL(favicon, url).href;
    }

      // Handle relative image URLs
    let absoluteImage = '';
    if (image && !image.startsWith('http')) {
        absoluteImage = new URL(image, url).href;
    } else {
      absoluteImage = image;
    }


    return {
        title,
        description,
        favicon,
        image: absoluteImage,
        url,
        tags: keywords ? keywords.split(',').map((keyword) => keyword.trim()) : [],
        lastReviewAt: currentDate,
        uuid: uuidv4(), //Keep generating UUID for internal use
    };
}

function createMarkdownContent(data) {
    return `---
title: "${data.title.replace(/"/g, '\\"')}"
description: "${data.description.replace(/"/g, '\\"')}"
url: "${data.url}"
favicon: "${data.favicon}"
image: "${data.image}"
tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]
lastReviewAt: "${data.lastReviewAt}"
desktopSnapshot: "${data.desktopSnapshot || ''}"
uuid: "${data.uuid}"
---
`;
}

async function processWebsite(url, refresh, currentDate) {
    const normalizedUrl = normalizeUrl(url);
    const urlPath = generateUrlPath(url);
    const filePath = `src/content/websites/${urlPath}.md`;

    if (refresh) {
        console.log(`Refreshing data for ${url}`);
        const html = await fetchPage(url);
        if (html) {
            const extractedData = await extractData(html, url, currentDate);
            if (!extractedData) {
                console.error(`Skipping ${url} due to missing data.`);
                return;
            }

            const screenshotFilename = `screenshots/${normalizedUrl.replace(/[^a-z0-9]/gi, '_')}.png`;
            const screenshotPath = `public/${screenshotFilename}`;
            try {
                await captureScreenshot(url, screenshotPath);
                extractedData.desktopSnapshot = screenshotFilename;
            } catch (error) {
                // Error is already logged in captureScreenshot, but we still continue
                extractedData.desktopSnapshot = ''; // Set to empty string if capture fails
            }

            const markdownContent = createMarkdownContent(extractedData);
            try {
                await fs.writeFile(filePath, markdownContent, 'utf-8');
                console.log(`Successfully wrote to ${filePath}`);
            } catch (writeError) {
                console.error(`Error writing to ${filePath}:`, writeError);
            }
        }
    } else {
      let existingContent = null;
      try {
          existingContent = await fs.readFile(filePath, 'utf-8');
      } catch (e) {
          // File doesn't exist, which is fine
      }
      if (!existingContent) {
        console.log(`Creating new file for ${url}`);
          const html = await fetchPage(url);
          if (html) {
              const extractedData = await extractData(html, url, currentDate);
              if (!extractedData) {
                console.error(`Skipping ${url} due to missing data.`);
                return;
              }

              const screenshotFilename = `screenshots/${normalizedUrl.replace(/[^a-z0-9]/gi, '_')}.png`;
              const screenshotPath = `public/${screenshotFilename}`;
              try {
                await captureScreenshot(url, screenshotPath);
                extractedData.desktopSnapshot = screenshotFilename;
              } catch (error) {
                // Error is already logged in captureScreenshot, but we still continue
                extractedData.desktopSnapshot = ''; // Set to empty string if capture fails
              }

              const markdownContent = createMarkdownContent(extractedData);
              try {
                  await fs.writeFile(filePath, markdownContent, 'utf-8');
                  console.log(`Successfully wrote to ${filePath}`);
              } catch(e) {
                  console.error('Error writing file', e);
              }
          }
      } else {
        console.log(`Skipping URL: ${url}`);
      }
    }
}

async function enrichData(refresh = false, targetUrl = null) {
  console.log(`Running enrichData with refresh = ${refresh}, targetUrl = ${targetUrl}`);
  try {
    const csvData = await fs.readFile('src/data/pages.csv', 'utf-8');
    const urls = parse(csvData, {
      skip_empty_lines: true,
    }).flat();

    const currentDate = new Date().toISOString();

    // Create screenshots directory if it doesn't exist
    try {
      await fs.mkdir('public/screenshots', { recursive: true }); // Use recursive: true
    } catch (error) {
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
const refreshFlag = process.argv.includes('--refresh');
const targetUrl = process.argv.find(arg => arg.startsWith('http'));

enrichData(refreshFlag, targetUrl);