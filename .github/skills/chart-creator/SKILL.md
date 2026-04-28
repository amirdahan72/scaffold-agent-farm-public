```skill
---
name: chart-creator
description: 'Generate PNG/SVG chart images from data tables. Use when asked to create a chart, graph, visualization, trend line, bar chart, pie chart, or dashboard visual. Produces static images that can be embedded in markdown, Word docs, or slide decks. Triggers: create chart, make a graph, visualize data, bar chart, line chart, pie chart, trend, dashboard visual.'
---

# Chart Creator

Generate static chart images (PNG/SVG) from structured data. Produces bar charts, line charts, pie charts, stacked bars, and scorecards that can be embedded in markdown documents, Word files, or PowerPoint decks.

## When to Use This Skill

- A deliverable needs visual data representation (trend lines, comparisons, distributions)
- Building a health dashboard with status indicators over time
- Competitive market share or pricing comparison needs a visual
- Sprint velocity or feature completion needs a chart
- Any tabular data that would be more impactful as a visualization

## Prerequisites

Before running this skill, install the required packages:

```bash
npm install vega vega-lite sharp
```

> **Why Vega-Lite?** It generates charts from a declarative JSON spec — no browser, no canvas, no DOM required. Works in pure Node.js and produces high-quality PNG/SVG output via the sharp library.

## Workflow

### Step 1 — Analyze input data

Read the source data (markdown tables, JSON, or structured text) and identify:

- **Chart type** — bar, line, pie, stacked bar, grouped bar, heatmap
- **X axis** — categories, dates, or labels
- **Y axis** — values, counts, scores, percentages
- **Series / grouping** — multiple data series? color-coded by category?
- **Output format** — PNG (default) or SVG

### Step 2 — Choose chart type

| Data shape | Recommended chart |
|-----------|------------------|
| Categories vs. single value (e.g., competitor scores) | Horizontal bar chart |
| Categories vs. multiple values (e.g., feature matrix) | Grouped bar chart |
| Time series (e.g., weekly trend) | Line chart |
| Parts of a whole (e.g., market share) | Pie / donut chart |
| Categories vs. multiple stacked values | Stacked bar chart |
| Two dimensions with intensity (e.g., gap matrix) | Heatmap |
| Status grid (e.g., readiness scorecard) | Colored table / heatmap |

### Step 3 — Generate the chart (Node.js + Vega-Lite)

**Important:** Vega and Vega-Lite are ESM-only packages. Always use `.mjs` file extension and `import` syntax (not `require`).

```javascript
// chart.mjs — use .mjs extension or "type": "module" in package.json
import * as vl from "vega-lite";
import * as vega from "vega";
import sharp from "sharp";
import fs from "fs";

// Define Vega-Lite spec
const vlSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 600,
  height: 400,
  title: {
    text: "<Chart Title>",
    fontSize: 16,
    font: "Segoe UI",
  },
  data: {
    values: [
      // { category: "Competitor A", score: 85 },
      // { category: "Competitor B", score: 72 },
      // { category: "Our Product", score: 91 },
    ],
  },
  mark: { type: "bar", cornerRadiusEnd: 4 },
  encoding: {
    x: {
      field: "score",
      type: "quantitative",
      title: "Score",
    },
    y: {
      field: "category",
      type: "nominal",
      title: null,
      sort: "-x",
    },
    color: {
      condition: {
        test: "datum.category === 'Our Product'",
        value: "#0078D4",  // Azure blue for our product
      },
      value: "#747474",  // Gray for competitors
    },
  },
};

// Compile Vega-Lite to Vega
const vegaSpec = vl.compile(vlSpec).spec;

// Create view and render to PNG
const view = new vega.View(vega.parse(vegaSpec), { renderer: "none" });

const svg = await view.toSVG();
fs.writeFileSync("<output-path>.svg", svg);

// Or render to PNG via sharp
const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
fs.writeFileSync("<output-path>.png", pngBuffer);

console.log("Chart created: <output-path>.png");
```

### Step 4 — Common chart templates

#### Horizontal bar chart (competitor comparison)

```javascript
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 500, height: 300,
  title: { text: "Feature Parity Score by Competitor" },
  data: { values: [ /* { name, score } */ ] },
  mark: { type: "bar", cornerRadiusEnd: 4 },
  encoding: {
    y: { field: "name", type: "nominal", sort: "-x" },
    x: { field: "score", type: "quantitative", scale: { domain: [0, 100] } },
    color: { condition: { test: "datum.name === 'Our Product'", value: "#0078D4" }, value: "#B0B0B0" },
  },
};
```

#### Line chart (trend over time)

```javascript
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 600, height: 350,
  title: { text: "Weekly Error Rate Trend" },
  data: { values: [ /* { date, rate, environment } */ ] },
  mark: { type: "line", point: true },
  encoding: {
    x: { field: "date", type: "temporal", title: "Week" },
    y: { field: "rate", type: "quantitative", title: "Error Rate (%)" },
    color: { field: "environment", type: "nominal" },
  },
};
```

#### Grouped bar chart (multi-dimension comparison)

```javascript
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 600, height: 400,
  title: { text: "Feature Comparison by Dimension" },
  data: { values: [ /* { competitor, dimension, score } */ ] },
  mark: { type: "bar" },
  encoding: {
    x: { field: "dimension", type: "nominal" },
    y: { field: "score", type: "quantitative" },
    color: { field: "competitor", type: "nominal" },
    xOffset: { field: "competitor" },
  },
};
```

#### Pie chart (market share)

```javascript
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 400, height: 400,
  title: { text: "Estimated Market Share" },
  data: { values: [ /* { vendor, share } */ ] },
  mark: { type: "arc", innerRadius: 60 },  // donut style
  encoding: {
    theta: { field: "share", type: "quantitative" },
    color: { field: "vendor", type: "nominal" },
  },
};
```

#### Heatmap (readiness matrix)

```javascript
const spec = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  width: 500, height: 300,
  title: { text: "Release Readiness Heatmap" },
  data: { values: [ /* { area, milestone, status } */ ] },
  mark: { type: "rect" },
  encoding: {
    x: { field: "milestone", type: "nominal" },
    y: { field: "area", type: "nominal" },
    color: {
      field: "status", type: "quantitative",
      scale: { domain: [0, 1, 2], range: ["#FF4444", "#FFD700", "#4CAF50"] },
    },
  },
};
```

## Color Palette

Use consistent brand-aligned colors across all charts:

| Role | Hex | Usage |
|------|-----|-------|
| Primary / Our product | `#0078D4` | Azure blue — highlight our data |
| Competitor 1 | `#747474` | Gray |
| Competitor 2 | `#B0B0B0` | Light gray |
| Competitor 3 | `#467886` | Teal |
| Competitor 4 | `#96607D` | Mauve |
| Positive / Good | `#4CAF50` | Green status |
| Warning / Partial | `#FFD700` | Yellow status |
| Negative / Missing | `#FF4444` | Red status |
| Accent | `#E97132` | Orange — callout attention |

## Embedding Charts

Charts are saved as PNG or SVG files. To embed in other deliverables:

- **Markdown:** `![Chart Title](./chart-name.png)`
- **Word (docx-writer):** Use `docx` package's `ImageRun` to embed the PNG
- **PowerPoint (ppt-creator):** Use `slide.addImage({ path: "chart.png", ... })`

## Rules

- **Always include a chart title** — the image should be self-explanatory.
- **Use the brand color palette** — don't pick random colors.
- **Highlight "our product"** in Azure blue (`#0078D4`) to make it visually distinct from competitors.
- **Keep charts simple** — one message per chart. If you need to show multiple things, create multiple charts.
- **Save as PNG by default** (better compatibility). Use SVG only if the agent or user requests it.
- **Include source data in alt text or a caption** — the PM may need to verify the numbers.
- **Charts go in the output folder** alongside the deliverable they support.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module 'vega'` | Run `npm install vega vega-lite sharp` |
| `require() cannot be used on an ESM graph` | Vega/Vega-Lite are ESM-only. Use `.mjs` extension and `import` syntax instead of `require()` |
| SVG rendering fails | Ensure `sharp` is installed — it handles SVG→PNG conversion |
| Chart too small/large | Adjust `width` and `height` in the Vega-Lite spec |
| Colors not rendering | Use hex strings without `#` in Vega-Lite (e.g., `"0078D4"`) or with `#` depending on context |
| Font not available | Vega falls back to system fonts. Segoe UI → Calibri → Arial |
| `canvas` errors | Don't install `canvas` — Vega + sharp handles rendering without it |

```
