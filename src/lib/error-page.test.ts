import { describe, it, expect } from 'vitest';
import { renderErrorPage } from './error-page';

describe('renderErrorPage', () => {
  it('should return a valid HTML string', () => {
    const html = renderErrorPage();

    // Check doctype and basic HTML structure
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<head>');
    expect(html).toContain('</head>');
    expect(html).toContain('<body>');
    expect(html).toContain('</body>');
    expect(html).toContain('</html>');
  });

  it('should contain the correct title and heading', () => {
    const html = renderErrorPage();

    expect(html).toContain('<title>This page didn\'t load</title>');
    expect(html).toContain('<h1>This page didn\'t load</h1>');
    expect(html).toContain('<p>Something went wrong on our end. You can try refreshing or head back home.</p>');
  });

  it('should contain the action buttons', () => {
    const html = renderErrorPage();

    expect(html).toContain('<button class="primary" onclick="location.reload()">Try again</button>');
    expect(html).toContain('<a class="secondary" href="/">Go home</a>');
  });

  it('should include viewport and charset meta tags for responsiveness and encoding', () => {
    const html = renderErrorPage();

    expect(html).toContain('<meta charset="utf-8" />');
    expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1" />');
  });

  it('should include styling', () => {
    const html = renderErrorPage();

    expect(html).toContain('<style>');
    expect(html).toContain('</style>');
    expect(html).toContain('.card {');
    expect(html).toContain('.actions {');
  });
});
