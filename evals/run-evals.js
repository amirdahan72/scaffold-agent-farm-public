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
  "chart-prompt-writer",
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
      const serverNames = Object.keys(mcp.servers || {});
      const expectedServers = [
        "microsoft-outlook-mail",
        "microsoft-outlook-calendar",
        "microsoft-teams",
        "microsoft-sharepoint-and-onedrive",
      ];
      const missing = expectedServers.filter((s) => !serverNames.includes(s));
      if (missing.length === 0) {
        report("PASS", "MCP config", `M365 MCP servers configured (${expectedServers.length}/${expectedServers.length})`);
      } else {
        report("FAIL", "MCP config", `Missing M365 MCP servers: ${missing.join(", ")}`);
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

    // Inventory-driven: every required skill must appear in README
    requiredSkills.forEach((skill) => {
      if (readme.includes(`**${skill}**`) || readme.includes(skill)) {
        report("PASS", "README coverage", `${skill} referenced`);
      } else {
        report("FAIL", "README coverage", `${skill} not referenced in README`);
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

  // 6) Agent.md cross-reference checks
  const agentPath = ".github/agents/scaffold-agent-farm.agent.md";
  if (exists(agentPath)) {
    const agentText = readText(agentPath);
    // Extract skill names only from the "Available Shared Skills" table section
    const skillsSection = agentText.match(/## Available Shared Skills[\s\S]*?(?=\n## |$)/)?.[0] || "";
    const skillTableRe = /\|\s*\*\*([a-z0-9-]+)\*\*\s*\|/g;
    let match;
    const agentSkills = [];
    while ((match = skillTableRe.exec(skillsSection)) !== null) {
      agentSkills.push(match[1]);
    }
    // Every skill listed in agent.md must exist on disk
    agentSkills.forEach((skill) => {
      const onDisk = exists(`.github/skills/${skill}/SKILL.md`);
      if (onDisk) {
        report("PASS", "Agent cross-ref", `${skill} listed in agent.md exists on disk`);
      } else {
        report("FAIL", "Agent cross-ref", `${skill} listed in agent.md but .github/skills/${skill}/SKILL.md missing`);
      }
    });
    // Every required skill must appear in the agent.md table
    requiredSkills.forEach((skill) => {
      if (agentSkills.includes(skill)) {
        report("PASS", "Agent cross-ref", `${skill} present in agent.md skill table`);
      } else {
        report("FAIL", "Agent cross-ref", `${skill} missing from agent.md skill table`);
      }
    });
  }

  // 7) Skill cross-reference dependency checks
  if (exists(".github/skills")) {
    const skills = listDirs(".github/skills");
    const skillRefRe = /\.github\/skills\/([a-z0-9-]+)\/SKILL\.md/g;
    skills.forEach((skill) => {
      const skillPath = `.github/skills/${skill}/SKILL.md`;
      if (!exists(skillPath)) return;
      const txt = readText(skillPath);
      let ref;
      const seen = new Set();
      while ((ref = skillRefRe.exec(txt)) !== null) {
        const target = ref[1];
        if (target === skill || seen.has(target)) continue; // skip self-refs and dupes
        seen.add(target);
        if (exists(`.github/skills/${target}/SKILL.md`)) {
          report("PASS", "Skill cross-ref", `${skill} → ${target} exists`);
        } else {
          report("FAIL", "Skill cross-ref", `${skill} references ${target} but .github/skills/${target}/SKILL.md missing`);
        }
      }
      skillRefRe.lastIndex = 0; // reset regex for next skill
    });
  }

  // 8) Semantic lint — ppt-creator hard invariants
  const pptSkillPath = ".github/skills/ppt-creator/SKILL.md";
  if (exists(pptSkillPath)) {
    const pptText = readText(pptSkillPath);
    // Invariant: must forbid addShape()
    if (/addShape/i.test(pptText) && /never.*addShape|no.*addShape|forbidden/i.test(pptText)) {
      report("PASS", "Semantic lint", "ppt-creator forbids addShape()");
    } else {
      report("FAIL", "Semantic lint", "ppt-creator does not clearly forbid addShape()");
    }
    // Invariant: must not contain slide.slideNumber in code templates
    // Extract only javascript/bash/js code fences (skip the outer ```skill wrapper)
    const codeBlocks = [];
    const codeBlockRe = /```(?:javascript|js|bash)\r?\n([\s\S]*?)```/g;
    let cbMatch;
    while ((cbMatch = codeBlockRe.exec(pptText)) !== null) {
      codeBlocks.push(cbMatch[1]);
    }
    const codeContent = codeBlocks.join("\n");
    if (/\.slideNumber\s*=/.test(codeContent)) {
      report("FAIL", "Semantic lint", "ppt-creator code templates still use .slideNumber (blocks Designer)");
    } else {
      report("PASS", "Semantic lint", "ppt-creator code templates free of .slideNumber");
    }
    // Invariant: no Aptos font in code templates
    if (/Aptos/i.test(codeContent)) {
      report("FAIL", "Semantic lint", "ppt-creator code templates use Aptos font (should be Segoe UI only)");
    } else {
      report("PASS", "Semantic lint", "ppt-creator code templates use Segoe UI consistently");
    }
  }

  // 9) .gitignore checks
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
