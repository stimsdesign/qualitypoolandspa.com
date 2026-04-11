const fs = require('fs');

const data = JSON.parse(fs.readFileSync('pagespeed-mobile-raw.json', 'utf8'));
const audits = data.audits;

console.log("=== LCP Element ===");
if (audits['largest-contentful-paint-element']?.details?.items) {
  audits['largest-contentful-paint-element'].details.items.forEach(i => console.log(i.node?.selector));
}

console.log("\n=== Failed Audits Details ===");
['color-contrast', 'landmark-one-main', 'heading-order', 'label', 'link-name', 'is-crawlable'].forEach(id => {
  const audit = audits[id];
  if (audit && audit.score < 1) {
    console.log(`\n-> ${audit.title}`);
    if (audit.details && audit.details.items) {
      audit.details.items.forEach(item => {
        if (item.node) console.log(`  - Node: ${item.node.selector} `);
        else console.log(`  - `, item);
      });
    }
  }
});
