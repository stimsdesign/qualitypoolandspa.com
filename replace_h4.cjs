const fs = require('fs');
let content = fs.readFileSync('src/components/sections/SeasonalServices.astro', 'utf8');

content = content.replace(/<h4>/g, '<h3>');
content = content.replace(/<\/h4>/g, '</h3>');
content = content.replace(/\.card-context h4/g, '.card-context h3');

fs.writeFileSync('src/components/sections/SeasonalServices.astro', content);
console.log('Done SeasonalServices.astro');
