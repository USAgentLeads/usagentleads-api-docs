import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import SwaggerParser from '@apidevtools/swagger-parser';
import { compile } from '@mdx-js/mdx';
const config=JSON.parse(fs.readFileSync('docs.json','utf8'));
await SwaggerParser.validate('openapi.json');
const pages=config.navigation.tabs.flatMap(t=>t.groups.flatMap(g=>g.pages));
for(const page of pages){const file=`${page}.mdx`;assert(fs.existsSync(file),`Missing ${file}`);await compile(fs.readFileSync(file,'utf8').replace(/^---\n[\s\S]*?\n---\n/,''));}
for(const file of [config.logo.light,config.logo.dark,config.favicon])assert(fs.existsSync(path.join('.',file)),`Missing asset ${file}`);
console.log(`Validated OpenAPI, ${pages.length} MDX pages and brand assets`);
