import { v4 as uuidv4 } from 'uuid';

async function getShortestTitle(html: string): Promise<string> {
    const cheerio = await import('cheerio');
    const $ = cheerio.load(html);

    const titles = [
      $('meta[property="og:title"]').attr('content'),
      $('title').text(),
      $('h1').first().text(),
    ];

    let shortestTitle = '';
    for (const title of titles) {
      if (title && (shortestTitle === '' || title.length < shortestTitle.length)) {
        shortestTitle = title;
      }
    }
    return shortestTitle;
  }

export async function extractData(html: string, url: string, currentDate: string): Promise<{
    title: string;
    description: string;
    favicon: string;
    image: string;
    url: string;
    tags: string[];
    lastReviewAt: string;
    uuid: string;
    desktopSnapshot?: string;
} | null> {
  const title = await getShortestTitle(html);

  if (!title) {
    console.error(`Error: Could not extract title for ${url}`);
    return null;
  }

  const cheerio = await import('cheerio');
  const $ = cheerio.load(html);

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
        uuid: uuidv4(),
        desktopSnapshot: '',
    };
}

export function createMarkdownContent(data: {
    title: string;
    description: string;
    url: string;
    favicon: string;
    image: string;
    tags: string[];
    lastReviewAt: string;
    desktopSnapshot?: string;
    uuid: string;
}) {
    return `---\ntitle: "${data.title.replace(/"/g, '\\"')}"\ndescription: "${data.description.replace(/"/g, '\\"')}"\nurl: "${data.url}"\nfavi
con: "${data.favicon}"\nimage: "${data.image}"\ntags: [${data.tags.map(tag => `"${tag.replace(/"/g, '\\"')}"`).join(', ')}]\nlastReviewAt: "${data.lastReviewAt}"\ndesktopSnapshot: "${data.desktopSnapshot || ''}"\nuuid: "${data.uuid}"\n---\n`;
}