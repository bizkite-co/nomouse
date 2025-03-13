import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { chromium } from 'playwright';
// import * as jsonpatch from 'json-patch'; // No longer needed
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
  const browser = await chromium.launch({ headless: true }); // Add headless: true
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.screenshot({ path: outputPath });
  } catch (error) {
    console.error(`Error capturing screenshot for ${url}:`, error);
    return null; // Return null if screenshot capture fails
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
    return null;
  }
}

async function extractData(html, url, currentDate) {
  const cheerio = await import('cheerio');
  const $ = cheerio.load(html);

  const title = $('title').text() ?? '';
  const description = $('meta[name="description"]').attr('content') ?? '';
  let favicon = $('link[rel="icon"]').attr('href') ?? $('link[rel="shortcut icon"]').attr('href') ?? '';
  const image = $('meta[property="og:image"]').attr('content') ?? $('img').first().attr('src') ?? ''; //og:image is better
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

async function enrichData(refresh = false, targetUrl = null) { // Add targetUrl argument
  console.log(`Running enrichData with refresh = ${refresh}, targetUrl = ${targetUrl}`); // Debugging statement
  try {
    // Read pages.csv
    const csvData = await fs.readFile('src/data/pages.csv', 'utf-8');
    const urls = parse(csvData, {
      skip_empty_lines: true,
    }).flat();

    // Get current date
    const currentDate = new Date().toISOString();

    // Enrich data for each URL, or only the target URL if provided
    for (const url of (targetUrl ? [targetUrl] : urls)) { // Filter URLs based on targetUrl
      if (targetUrl && normalizeUrl(url) !== normalizeUrl(targetUrl)) {
          continue; // Skip if we have a target URL and it doesn't match
      }
      const normalizedUrl = normalizeUrl(url);
      const urlPath = generateUrlPath(url); // Use generateUrlPath
      const filePath = `src/content/websites/${urlPath}.md`; // Use urlPath for filename
      console.log(`Processing URL: ${url}, File Path: ${filePath}`); // Debugging statement


      if (refresh) { // Always overwrite if refresh is true
        console.log(`Refreshing data for ${url}`); // Debugging statement
        const html = await fetchPage(url);
        if (html) {
          const extractedData = await extractData(html, url, currentDate);
        //   extractedData.uuid = uuid; // Don't overwrite the uuid
          console.log(`Extracted Data for ${url}:`, extractedData); // Debugging statement


          // Capture screenshot
          const screenshotFilename = `screenshots/${normalizedUrl.replace(/[^a-z0-9]/gi, '_')}.png`;
          const screenshotPath = `public/${screenshotFilename}`;
          const captureResult = await captureScreenshot(url, screenshotPath);
          if (captureResult !== null) {
            extractedData.desktopSnapshot = screenshotFilename; // Store relative path
          }

          // Create Markdown content with frontmatter
          const markdownContent = `---
title: "${extractedData.title.replace(/"/g, '\\"')}"
description: "${extractedData.description.replace(/"/g, '\\"')}"
url: "${extractedData.url}"
favicon: "${extractedData.favicon}"
image: "${extractedData.image}"
tags: [${extractedData.tags.map(tag => `"${tag}"`).join(', ')}]
lastReviewAt: "${extractedData.lastReviewAt}"
desktopSnapshot: "${extractedData.desktopSnapshot || ''}"
uuid: "${extractedData.uuid}"
---
`;

          // Write to Markdown file
          try {
            await fs.writeFile(filePath, markdownContent, 'utf-8');
            console.log(`Successfully wrote to ${filePath}`); // Debugging statement
          } catch (writeError) {
            console.error(`Error writing to ${filePath}:`, writeError); // Debugging statement
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
          console.log(`Creating new file for ${url}`); // Debugging statement
            const html = await fetchPage(url);
            if (html) {
              const extractedData = await extractData(html, url, currentDate);
            //   extractedData.uuid = uuid; // Ensure UUID is in extracted data. No!

              // Capture screenshot
              const screenshotFilename = `screenshots/${normalizedUrl.replace(/[^a-z0-9]/gi, '_')}.png`;
              const screenshotPath = `public/${screenshotFilename}`;
              const captureResult = await captureScreenshot(url, screenshotPath);
              if (captureResult !== null) {
                extractedData.desktopSnapshot = screenshotFilename; // Store relative path
              }

              // Create Markdown content with frontmatter
              const markdownContent = `---
title: "${extractedData.title.replace(/"/g, '\\"')}"
description: "${extractedData.description.replace(/"/g, '\\"')}"
url: "${extractedData.url}"
favicon: "${extractedData.favicon}"
image: "${extractedData.image}"
tags: [${extractedData.tags.map(tag => `"${tag}"`).join(', ')}]
lastReviewAt: "${extractedData.lastReviewAt}"
desktopSnapshot: "${extractedData.desktopSnapshot || ''}"
uuid: "${extractedData.uuid}"
---
`;
              // Write to Markdown file
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

    // Create screenshots directory if it doesn't exist
    try {
      await fs.mkdir('public/screenshots');
    } catch (error) {
      if (error.code !== 'EEXIST') {
        // Ignore if directory already exists
        throw error;
      }
    }

    console.log('Data enrichment complete.');
  } catch (error) {
    console.error('Error during enrichment:', error);
  }
}

// Get refresh flag and optional URL from command line arguments
const refreshFlag = process.argv.includes('--refresh');
const targetUrl = process.argv.find(arg => arg.startsWith('http')); // Find a URL argument

enrichData(refreshFlag, targetUrl);