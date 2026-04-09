// tests/tab-logic.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categorizeTab, filterTabs } from '../rules/tab-logic.js';

// --- categorizeTab ---

test('github.com maps to Work', () => {
  assert.equal(categorizeTab('https://github.com/user/repo', 'GitHub'), 'Work');
});

test('youtube.com maps to Video', () => {
  assert.equal(categorizeTab('https://www.youtube.com/watch?v=abc', 'YouTube'), 'Video');
});

test('twitter.com maps to Social', () => {
  assert.equal(categorizeTab('https://twitter.com/home', 'Twitter'), 'Social');
});

test('x.com maps to Social', () => {
  assert.equal(categorizeTab('https://x.com/home', 'X'), 'Social');
});

test('unknown domain maps to Other', () => {
  assert.equal(categorizeTab('https://example.com', 'Example Page'), 'Other');
});

test('empty url and title maps to Other', () => {
  assert.equal(categorizeTab('', ''), 'Other');
});

test('custom url rule overrides built-in rule', () => {
  const custom = [{ match: 'url', pattern: 'github.com', category: 'Personal' }];
  assert.equal(categorizeTab('https://github.com/user/repo', 'GitHub', custom), 'Personal');
});

test('custom title rule matches case-insensitively', () => {
  const custom = [{ match: 'title', pattern: 'invoice', category: 'Finance' }];
  assert.equal(categorizeTab('https://example.com/doc', 'INVOICE #4521', custom), 'Finance');
});

test('first matching rule wins', () => {
  const custom = [
    { match: 'url', pattern: 'example.com', category: 'A' },
    { match: 'url', pattern: 'example.com', category: 'B' },
  ];
  assert.equal(categorizeTab('https://example.com', '', custom), 'A');
});

// --- filterTabs ---

test('empty query returns all tabs', () => {
  const tabs = [
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'YouTube', url: 'https://youtube.com' },
  ];
  assert.deepEqual(filterTabs(tabs, ''), tabs);
});

test('filters by title substring', () => {
  const tabs = [
    { title: 'GitHub Pull Requests', url: 'https://github.com' },
    { title: 'YouTube', url: 'https://youtube.com' },
  ];
  assert.deepEqual(filterTabs(tabs, 'pull'), [tabs[0]]);
});

test('filters by URL substring', () => {
  const tabs = [
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'YouTube', url: 'https://youtube.com' },
  ];
  assert.deepEqual(filterTabs(tabs, 'youtube'), [tabs[1]]);
});

test('filter is case-insensitive', () => {
  const tabs = [{ title: 'GitHub', url: 'https://github.com' }];
  assert.deepEqual(filterTabs(tabs, 'GITHUB'), tabs);
});

test('returns empty array when nothing matches', () => {
  const tabs = [{ title: 'GitHub', url: 'https://github.com' }];
  assert.deepEqual(filterTabs(tabs, 'zzzzz'), []);
});

test('handles tabs with undefined title and url', () => {
  const tabs = [{ title: undefined, url: undefined }];
  assert.deepEqual(filterTabs(tabs, 'anything'), []);
});
