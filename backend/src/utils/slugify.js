/**
 * Pretvara string u URL-friendly slug
 * npr. "Hello World!" => "hello-world"
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // zamijeni razmake i specijalne znakove sa "-"
    .replace(/^-+|-+$/g, ''); // ukloni "-" na početku i kraju
}

module.exports = slugify;
