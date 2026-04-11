const fs = require('fs');

const key = 'AIzaSyCsPlrHQbIiSnDoNPCB-UPg6LPVAstbvgU';
const urls = [
  'https://qualitypoolandspa.netlify.app/services.html',
  'https://qualitypoolandspa.netlify.app/opening.html',
  'https://qualitypoolandspa.netlify.app/jobs.html',
  'https://qualitypoolandspa.netlify.app/contact.html',
  'https://qualitypoolandspa.netlify.app/about.html'
];
const categories = '&category=performance&category=accessibility&category=seo&category=best-practices';

let output = '# Inner Pages Audit Results\n\n';

async function runTest(url) {
  const pageName = url.split('/').pop();
  output += `## Page: ${pageName}\n`;
  const apiCall = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=${key}&strategy=mobile${categories}`;
  
  try {
    const response = await fetch(apiCall);
    const data = await response.json();
    
    if (data.error) {
      output += `Error: ${data.error.message}\n\n`;
      return;
    }

    const categoriesList = data.lighthouseResult.categories;
    output += `- **Performance**: ${Math.round(categoriesList.performance?.score * 100) || 'N/A'}\n`;
    output += `- **Accessibility**: ${Math.round(categoriesList.accessibility?.score * 100) || 'N/A'}\n`;
    output += `- **SEO**: ${Math.round(categoriesList.seo?.score * 100) || 'N/A'}\n`;
    output += `- **Best Practices**: ${Math.round(categoriesList['best-practices']?.score * 100) || 'N/A'}\n`;

    const audits = data.lighthouseResult.audits;
    
    output += `\n### Issues (Score < 100)\n`;
    
    const accessibilityIssues = Object.values(audits).filter(a => categoriesList.accessibility?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1);
    if (accessibilityIssues.length > 0) {
      output += "\n**Accessibility:**\n";
      accessibilityIssues.forEach(a => {
        output += `  - ${a.title}\n`;
        if (a.details && a.details.items) {
           a.details.items.forEach(i => { if (i.node) output += `    - ${i.node.selector}\n` });
        }
      });
    }

    const seoIssues = Object.values(audits).filter(a => categoriesList.seo?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1 && a.id !== 'is-crawlable'); // skip is-crawlable since it's just netlify blocking
    if (seoIssues.length > 0) {
      output += "\n**SEO:**\n";
      seoIssues.forEach(a => output += `  - ${a.title}\n`);
    }

    const perfIssues = Object.values(audits).filter(a => categoriesList.performance?.auditRefs.find(r => r.id === a.id)?.weight > 0 && a.score !== null && a.score < 1);
    output += `\n**Performance Metrics:**\n`;
    output += `  - LCP: ${audits['largest-contentful-paint']?.displayValue}\n`;
    output += `  - FCP: ${audits['first-contentful-paint']?.displayValue}\n`;
    output += `  - TBT: ${audits['total-blocking-time']?.displayValue}\n`;
    if (audits['largest-contentful-paint-element']?.details?.items) {
      output += `  - LCP Node: ${audits['largest-contentful-paint-element'].details.items[0]?.node?.selector}\n`;
    }

    output += '\n---\n\n';

  } catch (err) {
    output += `Failed to fetch: ${err.message}\n\n`;
  }
}

async function main() {
  for (const url of urls) {
    console.log(`Running ${url}...`);
    await runTest(url);
  }
  fs.writeFileSync('inner_pages_results.md', output);
  console.log("Done. Results saved to inner_pages_results.md");
}

main();
