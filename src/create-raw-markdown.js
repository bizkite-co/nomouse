import { createRawMarkdown } from './lib/utils.js';
import * as fs from 'fs/promises';

async function run() {
    try {
        const htmlFilePath = 'src/content/websites/www_wired_com_story_quick_select_keyboard_shortcuts_no_mouse/raw.html';
        const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');

        console.log('HTML content read successfully:'); // Log to validate
        // console.log(htmlContent); // Log the content - commented out to reduce output length

        const markdownContent = createRawMarkdown(htmlContent);

        console.log('Markdown content generated:'); // Log to validate
        // console.log(markdownContent); // Log the content - commented out to reduce output length

        const markdownFilePath = 'src/content/websites/www_wired_com_story_quick_select_keyboard_shortcuts_no_mouse/output.md';
        await fs.writeFile(markdownFilePath, markdownContent, 'utf-8');

        console.log(`Markdown content written to ${markdownFilePath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

run();
