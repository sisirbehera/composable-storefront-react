#!/usr/bin/env node

/**
 * Storefront Adapter & Normalizer Scaffolder
 * Usage: node tools/scaffold-adapter.mjs <EntityName>
 * Example: pnpm run generate:adapter Wishlist
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const rawName = process.argv[2];

if (!rawName) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Please provide an entity name.');
  console.log('Usage: pnpm run generate:adapter <EntityName>');
  console.log('Example: pnpm run generate:adapter Wishlist');
  process.exit(1);
}

// e.g. "wishlist" or "Wishlist" -> "wishlist", "Wishlist"
const lower = rawName.toLowerCase().replace(/adapter$/, '');
const pascal = lower.charAt(0).toUpperCase() + lower.slice(1);

const contractFile = `${lower}-adapter.ts`;
const mockFile = `mock-${lower}-adapter.ts`;
const occFile = `occ-${lower}-adapter.ts`;

console.log('\x1b[36m%s\x1b[0m', `🚀 Scaffolding Domain Adapter: ${pascal}Adapter...`);

// 1. Create Contract Interface
const contractPath = path.join(rootDir, 'packages', 'api', 'src', 'contracts', contractFile);
const contractTemplate = `export interface ${pascal}Item {
  id: string;
  name: string;
  created: string;
  metadata?: Record<string, any>;
}

export interface ${pascal}Adapter {
  get${pascal}Items(userId?: string): Promise<${pascal}Item[]>;
  add${pascal}Item(item: Omit<${pascal}Item, 'id' | 'created'>, userId?: string): Promise<${pascal}Item>;
  remove${pascal}Item(id: string, userId?: string): Promise<void>;
}
`;

fs.writeFileSync(contractPath, contractTemplate, 'utf8');
console.log('\x1b[32m%s\x1b[0m', `✓ Created ${contractPath}`);

// 2. Create Mock Adapter
const mockPath = path.join(rootDir, 'packages', 'api', 'src', 'mocks', mockFile);
const mockTemplate = `import { ${pascal}Adapter, ${pascal}Item } from '../contracts/${lower}-adapter';

export class Mock${pascal}Adapter implements ${pascal}Adapter {
  private items: Map<string, ${pascal}Item[]> = new Map();
  private delayMs: number;

  constructor(delayMs: number = 50) {
    this.delayMs = delayMs;
  }

  private async delay(): Promise<void> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
  }

  async get${pascal}Items(userId: string = 'default'): Promise<${pascal}Item[]> {
    await this.delay();
    return this.items.get(userId) || [];
  }

  async add${pascal}Item(
    item: Omit<${pascal}Item, 'id' | 'created'>,
    userId: string = 'default'
  ): Promise<${pascal}Item> {
    await this.delay();
    const newItem: ${pascal}Item = {
      ...item,
      id: \`${lower.toUpperCase()}-\${Date.now()}\`,
      created: new Date().toISOString(),
    };
    const userItems = this.items.get(userId) || [];
    userItems.push(newItem);
    this.items.set(userId, userItems);
    return newItem;
  }

  async remove${pascal}Item(id: string, userId: string = 'default'): Promise<void> {
    await this.delay();
    const userItems = this.items.get(userId) || [];
    this.items.set(
      userId,
      userItems.filter((i) => i.id !== id)
    );
  }
}
`;

fs.writeFileSync(mockPath, mockTemplate, 'utf8');
console.log('\x1b[32m%s\x1b[0m', `✓ Created ${mockPath}`);

// 3. Create OCC Adapter
const occPath = path.join(rootDir, 'packages', 'api', 'src', 'occ', occFile);
const occTemplate = `import { OccConfig } from '@storefront/core';
import { ${pascal}Adapter, ${pascal}Item } from '../contracts/${lower}-adapter';
import { OccClient } from './occ-client';

export class Occ${pascal}Adapter implements ${pascal}Adapter {
  private client: OccClient;

  constructor(config: OccConfig) {
    this.client = new OccClient(config);
  }

  async get${pascal}Items(userId: string = 'current'): Promise<${pascal}Item[]> {
    try {
      const response = await this.client.get<any>(\`users/\${userId}/${lower}s\`);
      return response?.${lower}s || [];
    } catch (err) {
      console.warn('[Occ${pascal}Adapter] Failed to fetch items:', err);
      return [];
    }
  }

  async add${pascal}Item(
    item: Omit<${pascal}Item, 'id' | 'created'>,
    userId: string = 'current'
  ): Promise<${pascal}Item> {
    return this.client.post<${pascal}Item>(\`users/\${userId}/${lower}s\`, item);
  }

  async remove${pascal}Item(id: string, userId: string = 'current'): Promise<void> {
    await this.client.delete(\`users/\${userId}/${lower}s/\${id}\`);
  }
}
`;

fs.writeFileSync(occPath, occTemplate, 'utf8');
console.log('\x1b[32m%s\x1b[0m', `✓ Created ${occPath}`);

// 4. Update contracts/index.ts
const contractsIndexPath = path.join(rootDir, 'packages', 'api', 'src', 'contracts', 'index.ts');
let contractsIndex = fs.readFileSync(contractsIndexPath, 'utf8');
const exportContract = `export * from './${lower}-adapter';\n`;
if (!contractsIndex.includes(lower)) {
  contractsIndex += exportContract;
  fs.writeFileSync(contractsIndexPath, contractsIndex, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', `✓ Added export to contracts/index.ts`);
}

// 5. Update api/src/index.ts
const apiIndexPath = path.join(rootDir, 'packages', 'api', 'src', 'index.ts');
let apiIndex = fs.readFileSync(apiIndexPath, 'utf8');
const exportMock = `export * from './mocks/${lower}-adapter';\n`;
const exportOcc = `export * from './occ/${lower}-adapter';\n`;
if (!apiIndex.includes(`mock-${lower}-adapter`)) {
  apiIndex += `export * from './mocks/mock-${lower}-adapter';\nexport * from './occ/occ-${lower}-adapter';\n`;
  fs.writeFileSync(apiIndexPath, apiIndex, 'utf8');
  console.log('\x1b[32m%s\x1b[0m', `✓ Added exports to packages/api/src/index.ts`);
}

console.log('\n\x1b[32m%s\x1b[0m', `🎉 Successfully scaffolded ${pascal}Adapter!`);
console.log(`- Contract: packages/api/src/contracts/${contractFile}`);
console.log(`- Mock Adapter: packages/api/src/mocks/${mockFile}`);
console.log(`- OCC Adapter: packages/api/src/occ/${occFile}`);
