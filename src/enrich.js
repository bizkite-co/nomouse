import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

function normalizeUrl(url) {
  return url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
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

async function enrichData() {
  try {
    // Read pages.csv
    const csvData = await fs.readFile('src/data/pages.csv', 'utf-8');
    const urls = parse(csvData, {
      skip_empty_lines: true,
    }).flat();

    // Read existing websites.json
    const jsonData = await fs.readFile('src/data/websites.json', 'utf-8');
    const existingData = JSON.parse(jsonData);

    // Get current date
    const currentDate = new Date().toISOString();

    // Enrich data for each URL
    const newData = [];
    for (const url of urls) {
      const normalizedUrl = normalizeUrl(url);
      const existingEntry = existingData.find(
        (entry) => normalizeUrl(entry.url) === normalizedUrl
      );

      if (!existingEntry) {
        const html = await fetchPage(url);
        if (html) {
          const extractedData = extractData(html, url, currentDate);
          newData.push(extractedData);
        }
      } else {
        console.log(`Skipping duplicate URL: ${url}`);
      }
    }

    // Combine existing and new data, only adding new entries
    const combinedData = [...existingData, ...newData];

    // Write updated websites.json
    await fs.writeFile(
      'src/data/websites.json',
      JSON.stringify(combinedData, null, 2), // Pretty-print JSON
      'utf-8'
    );

    console.log('Data enrichment complete.');
  } catch (error) {
    console.error('Error during enrichment:', error);
  }
}

enrichData();