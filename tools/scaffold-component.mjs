#!/usr/bin/env node

/**
 * Storefront CMS Component Scaffolder
 * Usage: node tools/scaffold-component.mjs <ComponentName>
 * Example: pnpm run generate:component AnnouncementBar
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawName = process.argv[2];

if (!rawName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide a component name.');
  console.log('Usage: pnpm run generate:component <ComponentName>');
  console.log('Example: pnpm run generate:component AnnouncementBar');
  process.exit(1);
}

// Normalize name: e.g. "AnnouncementBar" or "announcement-bar" -> "AnnouncementBar"
const pascalName = rawName
  .replace(/(?:^|[-_])(\w)/g, (_, c) => c.toUpperCase())
  .replace(/Component$/, '');

const componentName = `${pascalName}Component`;
const propsName = `${pascalName}ComponentProperties`;
const typeCode = `${pascalName}Component`;

console.log('\x1b[36m%s\x1b[0m', `🚀 Scaffolding CMS Component: ${componentName}...`);

// 1. Create Component File
const componentFilePath = path.join(
  rootDir,
  'packages',
  'cms',
  'src',
  'components',
  `${componentName}.tsx`
);

if (fs.existsSync(componentFilePath)) {
  console.error('\x1b[31m%s\x1b[0m', `Error: File already exists at ${componentFilePath}`);
  process.exit(1);
}

const componentTemplate = `'use client';

import React from 'react';
import { CmsComponent } from '@storefront/core';

export interface ${propsName} {
  title?: string;
  headline?: string;
  content?: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ${componentName}Props {
  properties: ${propsName};
}

export const ${componentName}: React.FC<${componentName}Props> = ({ properties }) => {
  return (
    <section className="my-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          {properties.title && (
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-2.5 py-1 rounded-md">
              {properties.title}
            </span>
          )}
          <h3 className="text-xl font-bold text-slate-900 mt-2">
            {properties.headline || '${pascalName}'}
          </h3>
          {properties.content && (
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              {properties.content}
            </p>
          )}
        </div>

        {properties.ctaText && (
          <a
            href={properties.ctaLink || '#'}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow transition-colors"
          >
            {properties.ctaText} &rarr;
          </a>
        )}
      </div>
    </section>
  );
};
`;

fs.writeFileSync(componentFilePath, componentTemplate, 'utf8');
console.log('\x1b[32m%s\x1b[0m', `✓ Created ${componentFilePath}`);

// 2. Export in packages/cms/src/index.ts
const cmsIndexPath = path.join(rootDir, 'packages', 'cms', 'src', 'index.ts');
let indexContent = fs.readFileSync(cmsIndexPath, 'utf8');
const exportLine = `export * from './components/${componentName}';\n`;
if (!indexContent.includes(componentName)) {
  indexContent += exportLine;
  fs.writeFileSync(cmsIndexPath, indexContent, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', `✓ Added export to ${cmsIndexPath}`);
}

// 3. Register in Component Registry
const registryPath = path.join(
  rootDir,
  'packages',
  'cms',
  'src',
  'registry',
  'component-registry.tsx'
);
let registryContent = fs.readFileSync(registryPath, 'utf8');
const importStmt = `import { ${componentName} } from '../components/${componentName}';\n`;

if (!registryContent.includes(componentName)) {
  // Add import at the top
  registryContent = importStmt + registryContent;
  // Add registration in the default registry map
  const targetPattern = "CmsComponentRegistry.register('CMSParagraphComponent', ParagraphComponent);";
  const newRegistration = `CmsComponentRegistry.register('${typeCode}', ${componentName});\n  ${targetPattern}`;
  registryContent = registryContent.replace(targetPattern, newRegistration);
  fs.writeFileSync(registryPath, registryContent, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', `✓ Registered '${typeCode}' in ${registryPath}`);
}

console.log('\n\x1b[32m%s\x1b[0m', `🎉 Successfully scaffolded ${componentName}!`);
console.log('\x1b[33m%s\x1b[0m', 'Sample CMS Slot Fixture to add into packages/api/src/mocks/fixtures/cms-pages.fixture.ts:');
console.log(`
{
  uid: '${pascalName}Demo1',
  typeCode: '${typeCode}',
  name: '${pascalName} Component',
  properties: {
    title: 'Special Announcement',
    headline: 'Welcome to our next-gen composable storefront',
    content: 'Ultra-fast headless experience equivalent to SAP Spartacus.',
    ctaText: 'Learn More',
    ctaLink: '/search'
  }
}
`);
