import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateWebsiteSummaries } from '../updateWebsiteSummaries.js';
import * as fs from 'node:fs/promises';
import type { Dirent } from 'node:fs';

vi.mock('node:fs/promises');

describe('updateWebsiteSummaries', () => {
  const mockFolders = ['folder1', 'folder2'].map(
    (folder) =>
      ({
        name: folder,
        isDirectory: () => true,
        isFile: () => false,
      }) as Dirent
  );
  const mockSummaryContent = '# Summary Content';
  const mockIndexContent = '---\ntitle: Example\n---\nOriginal Content';
  const expectedNewIndexContent =
    '---\ntitle: Example\n---\n# Summary Content';

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(fs.readdir).mockResolvedValue(mockFolders as any);
    vi.mocked(fs.readFile)
      .mockResolvedValueOnce(mockSummaryContent) // _summary.md for folder1
      .mockResolvedValueOnce(mockIndexContent) // index.md for folder1
      .mockResolvedValueOnce(mockSummaryContent) // _summary.md for folder2
      .mockResolvedValueOnce(mockIndexContent); // index.md for folder2
    vi.mocked(fs.writeFile).mockResolvedValue(undefined);
  });

  it('should read _summary.md and index.md, combine content, and write to index.md', async () => {
    await updateWebsiteSummaries();

    expect(fs.readdir).toHaveBeenCalledWith('src/content/websites', {
      withFileTypes: true,
    });
    expect(fs.readFile).toHaveBeenCalledTimes(4);
    expect(fs.readFile).toHaveBeenCalledWith(
      'src/content/websites/folder1/_summary.md',
      'utf-8'
    );
    expect(fs.readFile).toHaveBeenCalledWith(
      'src/content/websites/folder1/index.md',
      'utf-8'
    );
    expect(fs.readFile).toHaveBeenCalledWith(
      'src/content/websites/folder2/_summary.md',
      'utf-8'
    );
    expect(fs.readFile).toHaveBeenCalledWith(
      'src/content/websites/folder2/index.md',
      'utf-8'
    );
    expect(fs.writeFile).toHaveBeenCalledTimes(2);
    expect(fs.writeFile).toHaveBeenCalledWith(
      'src/content/websites/folder1/index.md',
      expectedNewIndexContent,
      'utf-8'
    );
    expect(fs.writeFile).toHaveBeenCalledWith(
      'src/content/websites/folder2/index.md',
      expectedNewIndexContent,
      'utf-8'
    );
  });
});