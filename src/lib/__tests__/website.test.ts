import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'fs/promises';
import * as child_process from 'child_process';

vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
  mkdir: vi.fn(),
  access: vi.fn(),
  readFile: vi.fn(),
}));

describe('processWithCrawl4AI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create _c4ai.md file with the correct content', async () => {
    const mockStdout = 'Mocked Crawl4AI output';
    (child_process.exec as any).mockImplementation(
      (command: string, callback: (error: any, stdout: string, stderr: string) => void) => {
        callback(null, mockStdout, '');
      }
    );

    (fs.mkdir as any).mockResolvedValue(undefined);
    (fs.access as any).mockResolvedValue(undefined);
    (fs.readFile as any).mockResolvedValue('Mocked file content');
    (fs.writeFile as any).mockResolvedValue(undefined);

    vi.doMock('../website.js', () => ({
      generateUrlPath: vi.fn().mockReturnValue('/mocked/url/path'),
      processWithCrawl4AI: vi.fn(),
    }));

    const { processWithCrawl4AI } = await import('../website.js');

    const testUrl = 'https://www.example.com/test';
    const testDate = '2024-03-17';

    (processWithCrawl4AI as any).mockImplementation(async (url: string, date: string) => {
      await fs.writeFile('/mocked/url/path/_c4ai.md', mockStdout, 'utf-8');
    });

    await processWithCrawl4AI(testUrl, testDate);

    const expectedFilePath = `/mocked/url/path/_c4ai.md`;

    expect(fs.writeFile).toHaveBeenCalledWith(
      expectedFilePath,
      mockStdout,
      'utf-8'
    );
  });
});