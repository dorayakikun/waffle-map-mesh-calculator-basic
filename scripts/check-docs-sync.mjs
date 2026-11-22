#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const errors = [];

function read(relPath) {
  const full = resolve(root, relPath);
  if (!existsSync(full)) {
    errors.push(`Missing required file: ${relPath}`);
    return "";
  }
  return readFileSync(full, "utf8");
}

function listFiles(relPath, pattern) {
  return readdirSync(resolve(root, relPath), { withFileTypes: true })
    .filter((d) => d.isFile() && pattern.test(d.name))
    .map((d) => d.name)
    .sort();
}

const agentsMd = read("AGENTS.md");
const claudeMd = read("CLAUDE.md");
const readmeMd = read("README.md");
const pkg = JSON.parse(read("package.json") || "{}");
const nvmrc = read(".nvmrc").trim();

if (claudeMd.trim() !== "@AGENTS.md") {
  errors.push(
    'CLAUDE.md must import "@AGENTS.md" as its sole content to keep a single source of truth.',
  );
}

for (const hookConfig of [
  ".agents/hooks.json",
  ".claude/settings.json",
  ".codex/hooks.json",
  ".cursor/hooks.json",
]) {
  const raw = read(hookConfig);
  if (!raw) continue;
  try {
    JSON.parse(raw);
  } catch (err) {
    errors.push(
      `${hookConfig} is not valid JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

const scripts = pkg.scripts ?? {};
const scriptNames = Object.keys(scripts);

const agentsReferencedScripts = new Set();

for (const [docName, content] of [
  ["AGENTS.md", agentsMd],
  ["README.md", readmeMd],
]) {
  for (const match of content.matchAll(/\bnpm run ([a-zA-Z0-9:_-]+)/g)) {
    const scriptName = match[1];
    if (docName === "AGENTS.md") {
      agentsReferencedScripts.add(scriptName);
    }
    if (!Object.hasOwn(scripts, scriptName)) {
      errors.push(`${docName} references unknown npm script "npm run ${scriptName}".`);
    }
  }
}

for (const scriptName of scriptNames) {
  if (scriptName === "prepare") continue;
  if (scriptName === "test") {
    if (!/\bnpm test\b/.test(agentsMd)) {
      errors.push('AGENTS.md is missing package.json script "npm test".');
    }
    continue;
  }
  if (!agentsReferencedScripts.has(scriptName)) {
    errors.push(`AGENTS.md is missing package.json script "npm run ${scriptName}".`);
  }
}

const pathPrefixes = [
  "src/",
  "scripts/",
  ".agents/",
  ".claude/",
  ".codex/",
  ".cursor/",
  ".nvmrc",
  "biome.json",
  "tsconfig.json",
  "vitest.config.mts",
];

for (const match of agentsMd.matchAll(/`([^`\n]+)`/g)) {
  const token = match[1].trim();
  if (token.includes(" ") || token.includes("*")) continue;
  if (!pathPrefixes.some((p) => token === p || token.startsWith(p))) continue;
  const clean = token.replace(/\/$/, "");
  if (!existsSync(resolve(root, clean))) {
    errors.push(`AGENTS.md references non-existent path "${token}".`);
  }
}

for (const srcFile of listFiles("src", /\.ts$/)) {
  if (!agentsMd.includes(`src/${srcFile}`)) {
    errors.push(`AGENTS.md is missing source file "src/${srcFile}".`);
  }
}

for (const scriptFile of listFiles("scripts", /\.(mjs|js)$/)) {
  if (!agentsMd.includes(scriptFile)) {
    errors.push(`AGENTS.md is missing script "${scriptFile}".`);
  }
}

const enginesNode = pkg.engines?.node;
if (enginesNode) {
  for (const [docName, content] of [
    ["AGENTS.md", agentsMd],
    ["README.md", readmeMd],
  ]) {
    if (!content.includes(enginesNode)) {
      errors.push(`${docName} does not mention package.json engines.node "${enginesNode}".`);
    }
  }
}

if (nvmrc && !agentsMd.includes(nvmrc)) {
  errors.push(`AGENTS.md does not mention .nvmrc version "${nvmrc}".`);
}

if (errors.length > 0) {
  console.error("Documentation sync check failed:");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("Documentation sync check passed (AGENTS.md, CLAUDE.md, README.md).");
