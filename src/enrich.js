import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';
import { chromium } from 'playwright';
import * as jsonpatch from 'json-patch';

function normalizeUrl(url) {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
}

async function captureScreenshot(url, outputPath) {
  const browser = await chromium.launch();
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

function extractData(html, url, currentDate) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : null;

  const descriptionMatch = html.match(/<meta name="description" content="(.*?)"/);
  const description = descriptionMatch ? descriptionMatch[1] : null;

  const faviconMatch = html.match(/<link rel="(?:shortcut )?icon" href="(.*?)"/);
  const favicon = faviconMatch ? new URL(faviconMatch[1], url).href : null;

  // Image extraction is tricky.  We'll need a more robust solution later.
  const imageMatch = html.match(/<img src="(.*?)"/); // Very basic, just gets the first image
  const image = imageMatch ? new URL(imageMatch[1], url).href : null;

  return {
    title,
    description,
    favicon,
    image,
    url,
    tags: [], // Placeholder
    lastReviewAt: currentDate,
  };
}

async function enrichData(refresh = false) {
  try {
    // Read pages.csv
    const csvData = await fs.readFile('src/data/pages.csv', 'utf-8');
    const urls = parse(csvData, {
      skip_empty_lines: true,
    }).flat();

    // Read existing websites.json
    let jsonData = await fs.readFile('src/data/websites.json', 'utf-8');
    let existingData = JSON.parse(jsonData);

    // Get current date
    const currentDate = new Date().toISOString();

    // Enrich data for each URL
    for (const url of urls) {
      const normalizedUrl = normalizeUrl(url);
      const existingEntryIndex = existingData.findIndex(
        (entry) => normalizeUrl(entry.url) === normalizedUrl
      );
      const existingEntry = existingData[existingEntryIndex];

      if (!existingEntry || refresh) {
        const html = await fetchPage(url);
        if (html) {
          const extractedData = extractData(html, url, currentDate);

          // Capture screenshot
          const screenshotFilename = `screenshots/${normalizedUrl.replace(/[^a-z0-9]/gi, '_')}.png`;
          const screenshotPath = `public/${screenshotFilename}`;
          const captureResult = await captureScreenshot(url, screenshotPath);
          if (captureResult !== null) {
            extractedData.desktopSnapshot = screenshotFilename; // Store relative path
          }

          if (existingEntryIndex !== -1) {
            // Update existing entry using JSON Patch
            const patch = [
              { op: 'replace', path: `/${existingEntryIndex}`, value: {...existingEntry, ...extractedData} }
            ];
            existingData = jsonpatch.apply(existingData, patch);

          } else {
            // Add new entry using JSON Patch
            const patch = [
              { op: 'add', path: '/-', value: extractedData }
            ];
            existingData = jsonpatch.apply(existingData, patch);
          }
        }
      } else {
        console.log(`Skipping URL: ${url}`);
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

    // Write updated websites.json
    await fs.writeFile(
      'src/data/websites.json',
      JSON.stringify(existingData, null, 2),
      'utf-8'
    );

    console.log('Data enrichment complete.');
  } catch (error) {
    console.error('Error during enrichment:', error);
  }
}

// Get refresh flag from command line arguments
const refreshFlag = process.argv.includes('--refresh');
enrichData(refreshFlag);