import fs from 'fs';
import path from 'path';

const uiDir = path.join(process.cwd(), 'src', 'components', 'ui');
const output = path.join(process.cwd(), 'src', 'lib', 'registry.ts');

const categories = fs.readdirSync(uiDir).filter(c => fs.statSync(path.join(uiDir, c)).isDirectory());

let imports = `import dynamic from 'next/dynamic';\n\n`;
let registry = 'export const Registry: Record<string, { component: any, name: string, category: string, slug: string, code: string }> = {\n';

let navData = {};

categories.forEach(category => {
    const files = fs.readdirSync(path.join(uiDir, category)).filter(f => f.endsWith('.tsx'));
    navData[category] = [];
    files.forEach(file => {
        const slug = file.replace('.tsx', '');
        const componentName = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
        const title = slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        // Read the file code for preview 
        let codeStr = fs.readFileSync(path.join(uiDir, category, file), 'utf8');
        // Escape backticks and dollars for template literals
        codeStr = codeStr.replace(/`/g, '\\`').replace(/\$/g, '\\$');

        // Next.js dynamic import for Client Components to avoid SSR issues with window/document
        registry += `  "${category}/${slug}": {
    component: dynamic(() => import("@/components/ui/${category}/${slug}").then(mod => mod.${componentName} || mod.default)),
    name: "${title}",
    category: "${category}",
    slug: "${slug}",
    code: \`${codeStr}\`
  },\n`;

        navData[category].push({ title, slug, href: `/components/${category}/${slug}` });
    });
});

registry += '};\n\n';

registry += `export const NavigationData = ${JSON.stringify(navData, null, 2)
    }; \n`;

fs.writeFileSync(output, imports + registry);
console.log("Registry generated at src/lib/registry.ts");
