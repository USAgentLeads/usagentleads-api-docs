import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import SwaggerParser from '@apidevtools/swagger-parser';
import { compile } from '@mdx-js/mdx';
const config=JSON.parse(fs.readFileSync('docs.json','utf8'));
const specs={};
for(const name of ['openapi.json']) {
  await SwaggerParser.validate(name);
  specs[name]=JSON.parse(fs.readFileSync(name,'utf8'));
}
const pages=config.navigation.tabs.flatMap(t=>t.groups.flatMap(g=>g.pages));
for(const page of pages) {
  const file=page+'.mdx'; assert(fs.existsSync(file),'Missing '+file);
  const source=fs.readFileSync(file,'utf8');
  const reference=source.match(/^openapi: "([^ ]+) ([A-Z]+) ([^"]+)"$/m);
  if(reference) assert(specs[reference[1]]?.paths[reference[3]]?.[reference[2].toLowerCase()], 'Missing OpenAPI operation in '+file);
  await compile(source.replace(/^---\n[\s\S]*?\n---\n/,''));
}
for(const file of [config.logo.light,config.logo.dark,config.favicon])assert(fs.existsSync(path.join('.',file)),'Missing asset '+file);
console.log('Validated OpenAPI v3, '+pages.length+' MDX pages, operation links and brand assets');
