#!/usr/bin/env node
/*
 Lightweight repository evals for scaffold-agent-farm.
 Verifies structural integrity, documentation consistency, and runtime readiness.
*/

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const strictMode = process.argv.includes("--strict") || process.env.EVAL_STRICT === "1";

const requiredSkills = [
  "ado-reader",
  "chart-creator",
  "doc-writer",
  "docx-writer",
  "make-agent-farm",
  "make-skill-template",
  "ppt-creator",
  "send-email",
  "sharepoint-reader",
  "web-search",
  "workiq-context",
  "xlsx-writer",
];

const requiredDeps = [
  "pptxgenjs",
  "docx",
  "exceljs",
  "vega",
  "vega-lite",
  "sharp",
];

const state = {
  pass: 0,
  fail: 0,
  warn: 0,
};

function report(status, title, detail) {
  if (status === "PASS") state.pass += 1;
  if (status === "FAIL") state.fail += 1;
  if (status === "WARN") state.warn += 1;
  const icon = status === "PASS" ? "[PASS]" : status === "FAIL" ? "[FAIL]" : "[WARN]";
  console.log(`${icon} ${title} -- ${detail}`);
}

function exists(relPath) {
  return fs.existsSync(path.join(repoRoot, relPath));
}

function readText(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), "utf8");
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function listDirs(relPath) {
  const abs = path.join(repoRoot, relPath);
  return fs
    .readdirSync(abs, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function extractFrontmatterName(text) {
  // Parser for `name: value` inside YAML frontmatter.
  // Some SKILL.md files start with a wrapper fence (e.g. ```skill),
  // so we search for the first frontmatter block anywhere in the file.
  const frontmatterMatch = text.match(/---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;
  const body = frontmatterMatch[1];
  const nameLine = body.split(/\r?\n/).find((line) => /^name\s*:\s*/.test(line));
  if (!nameLine) return null;
  return nameLine.replace(/^name\s*:\s*/, "").trim().replace(/^['"]|['"]$/g, "");
}

function run() {
  console.log(`=== scaffold-agent-farm evals${strictMode ? " (strict)" : ""} ===`);

  // 1) Core files
  [
    "README.md",
    "package.json",
    "package-lock.json",
    ".vscode/mcp.json",
    ".github/agents/scaffold-agent-farm.agent.md",
  ].forEach((p) => {
    if (exists(p)) {
      report("PASS", "Core file", `${p} exists`);
    } else {
      report("FAIL", "Core file", `${p} missing`);
    }
  });

  // 2) Skills inventory
  if (!exists(".github/skills")) {
    report("FAIL", "Skills folder", ".github/skills missing");
  } else {
    const skills = listDirs(".github/skills");
    requiredSkills.forEach((skill) => {
      if (skills.includes(skill)) {
        report("PASS", "Skill folder", `${skill} present`);
      } else {
        report("FAIL", "Skill folder", `${skill} missing`);
      }
    });

    skills.forEach((skill) => {
      const skillPath = `.github/skills/${skill}/SKILL.md`;
      if (!exists(skillPath)) {
        report("FAIL", "Skill definition", `${skillPath} missing`);
        return;
      }
      const txt = readText(skillPath);
      const frontmatterName = extractFrontmatterName(txt);
      if (!frontmatterName) {
        report("FAIL", "Skill frontmatter", `${skillPath} missing frontmatter name`);
      } else if (frontmatterName !== skill) {
        report("FAIL", "Skill frontmatter", `${skillPath} name '${frontmatterName}' != folder '${skill}'`);
      } else {
        report("PASS", "Skill frontmatter", `${skill} name matches folder`);
      }
    });
  }

  // 3) Package dependencies
  if (exists("package.json")) {
    const pkg = readJson("package.json");
    const deps = pkg.dependencies || {};
    requiredDeps.forEach((dep) => {
      if (deps[dep]) {
        report("PASS", "Dependency", `${dep}@${deps[dep]} declared`);
      } else {
        report("FAIL", "Dependency", `${dep} missing from package.json`);
      }
    });
  }

  // 4) mcp.json sanity
  if (exists(".vscode/mcp.json")) {
    try {
      const mcp = readJson(".vscode/mcp.json");
      if (mcp && mcp.servers && mcp.servers["Azure MCP Server"]) {
        report("PASS", "MCP config", "Azure MCP Server configured");
      } else {
        report("FAIL", "MCP config", "Azure MCP Server not configured");
      }

      if (mcp && mcp.servers && mcp.servers["microsoft-outlook-mail"]) {
        const url = mcp.servers["microsoft-outlook-mail"].url || "";
        if (/72f988bf-86f1-41af-91ab-2d7cd011db47/i.test(url)) {
          report("WARN", "MCP config", "Outlook MCP is pinned to Microsoft tenant (expected for Microsoft-only audience)");
        } else {
          report("PASS", "MCP config", "Outlook MCP configured with non-hardcoded/alternative endpoint");
        }
      } else {
        report("WARN", "MCP config", "Outlook MCP not configured in workspace mcp.json");
      }
    } catch (err) {
      report("FAIL", "MCP config", `.vscode/mcp.json invalid JSON: ${err.message}`);
    }
  }

  // 5) README consistency checks
  if (exists("README.md")) {
    const readme = readText("README.md");

    const mustMentionSkills = [
      "ado-reader",
      "chart-creator",
      "xlsx-writer",
      "send-email",
      "sharepoint-reader",
    ];

    mustMentionSkills.forEach((skill) => {
      if (readme.includes(`**${skill}**`) || readme.includes(skill)) {
        report("PASS", "README coverage", `${skill} referenced`);
      } else {
        report("FAIL", "README coverage", `${skill} not referenced`);
      }
    });

    const hasCombined = /Skeptic-Reviser/.test(readme);
    const hasSplit = /Skeptic and Reviser are separate/.test(readText(".github/agents/scaffold-agent-farm.agent.md"));
    if (hasCombined && hasSplit) {
      report(
        "WARN",
        "Workflow wording",
        "README uses combined Skeptic-Reviser wording while agent uses separate Skeptic + Reviser steps"
      );
    } else {
      report("PASS", "Workflow wording", "README and agent workflow wording aligned");
    }
  }

  // 6) .gitignore checks
  if (exists(".gitignore")) {
    const gi = readText(".gitignore");
    ["node_modules/", "farms/", "work/"]
      .forEach((entry) => {
        if (gi.includes(entry)) {
          report("PASS", ".gitignore", `${entry} ignored`);
        } else {
          report("WARN", ".gitignore", `${entry} not listed`);
        }
      });
  }

  console.log("\n=== summary ===");
  console.log(`Passed: ${state.pass}`);
  console.log(`Warnings: ${state.warn}`);
  console.log(`Failed: ${state.fail}`);

  if (state.fail > 0) {
    process.exitCode = 1;
    return;
  }
  if (strictMode && state.warn > 0) {
    process.exitCode = 1;
    return;
  }
  process.exitCode = 0;
}

run();
