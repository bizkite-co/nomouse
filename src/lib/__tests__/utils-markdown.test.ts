import { describe, it, expect } from 'vitest';
import { createRawMarkdown } from '../utils.js';

describe('createRawMarkdown', () => {
    it('should handle empty input', () => {
        expect(createRawMarkdown('')).toBe('');
    });

    it('should handle complex HTML', () => {
        const html = `
      <div>
        <h1>Heading 1</h1>
        <p>Paragraph <em>with emphasis</em>.</p>
        <table>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </table>
      </div>
    `;
        const expectedMarkdown = `# Heading 1

Paragraph *with emphasis*.

| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |`;

        expect(createRawMarkdown(html)).toBe(expectedMarkdown);
    });

    it('should handle malformed or incomplete HTML', () => {
        const html = '<p>Unclosed paragraph';
        expect(createRawMarkdown(html)).toBe('Unclosed paragraph');
    });

    it('should handle special characters and HTML entities', () => {
        const html = '<p>&copy; &amp; < > " &apos;</p>';
        const expectedMarkdown = '© & < > " \'';
        expect(createRawMarkdown(html)).toBe(expectedMarkdown);
    });

    it('should handle code blocks (fenced style)', () => {
        const html = '<pre><code class="language-javascript">const x = 1;</code></pre>';
        const expectedMarkdown = '```javascript\nconst x = 1;\n```';
        expect(createRawMarkdown(html)).toBe(expectedMarkdown);
    });

    it('should handle headings (atx style)', () => {
        const html = '<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>';
        const expectedMarkdown = '# Heading 1\n\n## Heading 2\n\n### Heading 3';
        expect(createRawMarkdown(html)).toBe(expectedMarkdown);
    });
});