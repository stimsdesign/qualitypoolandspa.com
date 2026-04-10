const fs = require('fs');
const files = ['pagespeed-mobile.json'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    const lh = data.lighthouseResult || data;
    const audits = lh.audits || {};
    
    console.log(`\n=== ${f} ===\n`);

    const bootup = audits['bootup-time'];
    if (bootup && bootup.details && bootup.details.items) {
         console.log("\nJS Bootup Time (Slowest JS files):");
         bootup.details.items.forEach(i => {
             console.log(`- ${i.url.substring(0,80)}: ${i.total}ms script execution time`);
         });
    }

    const mainthread = audits['mainthread-work-breakdown'];
    if (mainthread && mainthread.details && mainthread.details.items) {
         console.log("\nMain Thread Work Breakdown:");
         mainthread.details.items.forEach(i => {
             console.log(`- ${i.groupLabel}: ${i.duration}ms`);
         });
    }
  }
});
