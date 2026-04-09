// rules/default-rules.js

export const DEFAULT_RULES = [
  // Work
  { match: 'url', pattern: 'github.com',            category: 'Work' },
  { match: 'url', pattern: 'gitlab.com',             category: 'Work' },
  { match: 'url', pattern: 'atlassian.net',          category: 'Work' },
  { match: 'url', pattern: 'linear.app',             category: 'Work' },
  { match: 'url', pattern: 'notion.so',              category: 'Work' },
  { match: 'url', pattern: 'figma.com',              category: 'Work' },
  { match: 'url', pattern: 'slack.com',              category: 'Work' },
  { match: 'url', pattern: 'asana.com',              category: 'Work' },
  { match: 'url', pattern: 'trello.com',             category: 'Work' },
  { match: 'url', pattern: 'bitbucket.org',          category: 'Work' },
  // Video
  { match: 'url', pattern: 'youtube.com',            category: 'Video' },
  { match: 'url', pattern: 'netflix.com',            category: 'Video' },
  { match: 'url', pattern: 'twitch.tv',              category: 'Video' },
  { match: 'url', pattern: 'vimeo.com',              category: 'Video' },
  { match: 'url', pattern: 'disneyplus.com',         category: 'Video' },
  { match: 'url', pattern: 'hulu.com',               category: 'Video' },
  { match: 'url', pattern: 'primevideo.com',         category: 'Video' },
  { match: 'url', pattern: 'mubi.com',               category: 'Video' },
  { match: 'url', pattern: 'dailymotion.com',        category: 'Video' },
  // Social
  { match: 'url', pattern: 'twitter.com',            category: 'Social' },
  { match: 'url', pattern: 'x.com',                  category: 'Social' },
  { match: 'url', pattern: 'facebook.com',           category: 'Social' },
  { match: 'url', pattern: 'instagram.com',          category: 'Social' },
  { match: 'url', pattern: 'linkedin.com',           category: 'Social' },
  { match: 'url', pattern: 'reddit.com',             category: 'Social' },
  { match: 'url', pattern: 'discord.com',            category: 'Social' },
  { match: 'url', pattern: 'threads.net',            category: 'Social' },
  { match: 'url', pattern: 'bsky.app',               category: 'Social' },
  // News
  { match: 'url', pattern: 'bbc.',                   category: 'News' },
  { match: 'url', pattern: 'cnn.com',                category: 'News' },
  { match: 'url', pattern: 'nytimes.com',            category: 'News' },
  { match: 'url', pattern: 'theguardian.com',        category: 'News' },
  { match: 'url', pattern: 'techcrunch.com',         category: 'News' },
  { match: 'url', pattern: 'news.ycombinator.com',   category: 'News' },
  { match: 'url', pattern: 'medium.com',             category: 'News' },
  { match: 'url', pattern: 'substack.com',           category: 'News' },
  { match: 'url', pattern: 'wired.com',              category: 'News' },
  // Shopping
  { match: 'url', pattern: 'amazon.',                category: 'Shopping' },
  { match: 'url', pattern: 'ebay.com',               category: 'Shopping' },
  { match: 'url', pattern: 'etsy.com',               category: 'Shopping' },
  { match: 'url', pattern: 'aliexpress.com',         category: 'Shopping' },
  { match: 'url', pattern: 'walmart.com',            category: 'Shopping' },
  { match: 'url', pattern: 'target.com',             category: 'Shopping' },
  // Docs
  { match: 'url', pattern: 'docs.google.com',        category: 'Docs' },
  { match: 'url', pattern: 'sheets.google.com',      category: 'Docs' },
  { match: 'url', pattern: 'slides.google.com',      category: 'Docs' },
  { match: 'url', pattern: 'dropbox.com',            category: 'Docs' },
  { match: 'url', pattern: 'onedrive.live.com',      category: 'Docs' },
  { match: 'url', pattern: 'sharepoint.com',         category: 'Docs' },
  { match: 'url', pattern: 'airtable.com',           category: 'Docs' },
];

// color: Chrome tabGroups color name; hex: popup color bar
export const CATEGORY_COLORS = {
  Work:     { color: 'blue',   hex: '#89b4fa' },
  Video:    { color: 'red',    hex: '#f38ba8' },
  Social:   { color: 'green',  hex: '#a6e3a1' },
  News:     { color: 'orange', hex: '#fab387' },
  Shopping: { color: 'cyan',   hex: '#94e2d5' },
  Docs:     { color: 'purple', hex: '#cba6f7' },
  Other:    { color: 'grey',   hex: '#45475a' },
};
