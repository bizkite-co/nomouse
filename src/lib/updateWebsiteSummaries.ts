import { Dirent } from 'fs';
import fs from 'fs/promises';
import path from 'path';

async function updateWebsiteSummaries() {
  console.log('Starting updateWebsiteSummaries...');
  const websitesDir = 'src/content/websites';

  try {
    console.log(`Reading directory: ${websitesDir}`);
    const dirContents = await fs.readdir(websitesDir, {withFileTypes: true});
    const folders = dirContents.filter((dirent) => dirent.isDirectory())
    console.log(`Found folders: ${folders.length}`);

    for (const folder of folders) {
      console.log(`Processing folder: ${folder}`);
      const folderPath = path.join(websitesDir, folder.name);
      const summaryPath = path.join(folderPath, '_summary.md');
      const indexPath = path.join(folderPath, 'index.md');

      try {
        console.log(`Reading summary file: ${summaryPath}`);
        // Read _summary.md
        const summaryContent = await fs.readFile(summaryPath, 'utf-8');

        // Read index.md
        let indexContent = await fs.readFile(indexPath, 'utf-8');

        // Find the end of the frontmatter (assuming it's marked by ---)
        const frontmatterEnd = indexContent.indexOf('---', 3); // Start after the first ---

        if (frontmatterEnd === -1) {
          console.warn(`No frontmatter found in ${indexPath}. Skipping.`);
          continue;
        }

        // Replace the content after the frontmatter with the summary
        const newIndexContent =
          indexContent.substring(0, frontmatterEnd + 3) +
          '\n' +
          summaryContent;

        // Write the updated content to index.md
        await fs.writeFile(indexPath, newIndexContent, 'utf-8');
        console.log(`Updated ${indexPath} with content from ${summaryPath}`);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.warn(
            `Skipping website: ${folder} (_summary.md or index.md not found)`
          );
        } else {
          console.error(`Error processing website ${folder}:`, error);
        }
      }
    }
    console.log('Website summaries updated successfully.');
  } catch (error) {
    console.error('Error updating website summaries: ', error);
  }
  console.log('Finished updateWebsiteSummaries.');
}

// Run the update function if this script is executed directly
if (process.env.DEBUG_ONCE != null) {
  updateWebsiteSummaries();
}

export { updateWebsiteSummaries };