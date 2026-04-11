const fs = require('fs');

const key = 'AIzaSyCsPlrHQbIiSnDoNPCB-UPg6LPVAstbvgU';
const url = 'https://qualitypoolandspa.netlify.app/';
const categories = '&category=performance&category=accessibility&category=seo&category=best-practices';

let output = '';

async function runTest(strategy) {
  output += `\n# SCORES: ${strategy.toUpperCase()}\n`;
  const apiCall = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${key}&strategy=${strategy}${categories}`;
  
  try {
    const response = await fetch(apiCall);
    const data = await response.json();
    
    if (data.error) {
      output += `Error for ${strategy}: ${data.error.message}\n`;
      return;
    }

    const categoriesList = data.lighthouseResult.categories;
    output += `Performance: ${Math.round(categoriesList.performance?.score * 100) || 'N/A'}\n`;
    output += `Accessibility: ${Math.round(categoriesList.accessibility?.score * 100) || 'N/A'}\n`;
    output += `SEO: ${Math.round(categoriesList.seo?.score * 100) || 'N/A'}\n`;
    output += `Best Practices: ${Math.round(categoriesList['best-practices']?.score * 100) || 'N/A'}\n`;

    const audits = data.lighthouseResult.audits;
    
    output += `\n## FAILED AUDITS: ${strategy.toUpperCase()}\n`;
    
    output += "\n### Accessibility:\n";
    Object.values(audits).filter(a => categoriesList.accessibility?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1)
      .forEach(a => output += `- **${a.title}**: ${a.description}\n`);

    output += "\n### SEO:\n";
    Object.values(audits).filter(a => categoriesList.seo?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1)
      .forEach(a => output += `- **${a.title}**: ${a.description}\n`);

    output += "\n### Performance:\n";
    Object.values(audits).filter(a => categoriesList.performance?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1)
      .forEach(a => output += `- **${a.title}**: ${a.displayValue || ''}\n`);
      
    // Write out the raw JSON to a file so we can view specific nodes
    fs.writeFileSync(`pagespeed-${strategy}-raw.json`, JSON.stringify(data.lighthouseResult, null, 2));

  } catch (err) {
    output += `Failed to fetch ${strategy}: ${err.message}\n`;
  }
}

async function main() {
  await runTest('mobile');
  await runTest('desktop');
  fs.writeFileSync('pagespeed_results.md', output);
  console.log("Done. Results saved to pagespeed_results.md");
}

main();
