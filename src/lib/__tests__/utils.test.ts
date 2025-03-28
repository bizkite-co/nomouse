import { describe, it, expect } from 'vitest';
import { filterWebsites } from '../utils.js';
import type { WebsiteData } from '../../types.js';

describe('filterWebsites', () => {
  const websites: WebsiteData[] = [
    {
      url: 'https://example.com',
      title: 'Example Website',
      tags: ['example', 'test'],
      favicon: 'favicon.ico',
      description: 'An example website',
      slug: 'example-com',
      desktopSnapshot: 'example.png',
    },
    {
      url: 'https://test.com',
      title: 'Test Website',
      tags: ['test'],
      favicon: 'favicon.ico',
      description: 'A test website',
      slug: 'test-com',
      desktopSnapshot: 'test.png',
    },
    {
      url: 'https://another.com',
      title: 'Another Website',
      tags: ['another'],
      favicon: 'favicon.ico',
      description: 'Another website',
      slug: 'another-com',
      desktopSnapshot: 'another.png',
    },
  ];

  it('should return all websites when search is empty', () => {
    expect(filterWebsites(websites, '', [])).toEqual(websites);
  });

  it('should filter websites by title', () => {
    const filtered = filterWebsites(websites, 'Example', []);
    expect(filtered).toEqual([websites[0]]);
  });

  it('should filter websites by URL', () => {
    const filtered = filterWebsites(websites, 'test.com', []);
    expect(filtered).toEqual([websites[1]]);
  });

  it('should filter websites by tag', () => {
      const filtered = filterWebsites(websites, '', ['example']);
      expect(filtered).toEqual([websites[0]]);
  });

    it('should filter by both search term and tags', () => {
        const filtered = filterWebsites(websites, 'test', ['test']);
        expect(filtered).toEqual([websites[1]]); // Corrected expectation
    });

    it('should return empty array if no websites match', () => {
        const filtered = filterWebsites(websites, 'nothing', []);
        expect(filtered).toEqual([]);
    });
});
