// rules/tab-logic.js
import { DEFAULT_RULES } from './default-rules.js';

/**
 * Categorize a single tab. Custom rules take priority (checked first).
 * @param {string} url
 * @param {string} title
 * @param {Array<{match:'url'|'title', pattern:string, category:string}>} customRules
 * @param {Array} defaultRules
 * @returns {string} category name
 */
export function categorizeTab(url, title, customRules = [], defaultRules = DEFAULT_RULES) {
  const urlLower   = (url   || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();
  for (const rule of [...customRules, ...defaultRules]) {
    const pat = rule.pattern.toLowerCase();
    if (rule.match === 'url'   && urlLower.includes(pat))   return rule.category;
    if (rule.match === 'title' && titleLower.includes(pat)) return rule.category;
  }
  return 'Other';
}

/**
 * Filter tabs by query — case-insensitive substring match on title + URL.
 * @param {Array<{title:string, url:string}>} tabs
 * @param {string} query
 * @returns {Array} filtered tabs
 */
export function filterTabs(tabs, query) {
  if (!query) return tabs;
  const q = query.toLowerCase();
  return tabs.filter(t =>
    (t.title || '').toLowerCase().includes(q) ||
    (t.url   || '').toLowerCase().includes(q)
  );
}
