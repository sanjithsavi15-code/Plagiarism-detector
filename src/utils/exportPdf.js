function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHighlightedHtml(text, matchedIndices) {
  return text
    .split("")
    .map((char, index) => {
      const escaped = escapeHtml(char);
      if (matchedIndices.has(index)) {
        return `<mark>${escaped}</mark>`;
      }
      return escaped;
    })
    .join("");
}

function getSeverityLabel(score) {
  if (score < 15) return "Low similarity";
  if (score <= 40) return "Moderate similarity";
  return "High similarity";
}

/**
 * Opens a print-friendly report window and triggers the browser print dialog.
 *
 * @param {{ text1: string, text2: string, results: object }} options
 */
export function exportPdfReport({ text1, text2, results }) {
  if (!results) return;

  const text1Indices = new Set(results.matches.map((m) => m.index1));
  const text2Indices = new Set(results.matches.map((m) => m.index2));
  const timestamp = new Date().toLocaleString();

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Plagiarism Analysis Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: #1e293b;
      padding: 2rem;
      line-height: 1.5;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .score-card {
      border: 2px solid #cbd5e1;
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .score { font-size: 2.5rem; font-weight: 700; }
    .severity { font-size: 0.875rem; color: #64748b; margin-top: 0.25rem; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .metric {
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      padding: 0.75rem;
    }
    .metric-label { font-size: 0.65rem; text-transform: uppercase; color: #94a3b8; }
    .metric-value { font-size: 0.95rem; font-weight: 600; margin-top: 0.15rem; }
    .section { margin-bottom: 1.5rem; page-break-inside: avoid; }
    .section h2 { font-size: 1rem; margin-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    .text-block {
      font-family: ui-monospace, monospace;
      font-size: 0.8rem;
      white-space: pre-wrap;
      word-break: break-word;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      padding: 1rem;
      background: #f8fafc;
    }
    mark { background: #fde68a; padding: 0 1px; border-radius: 2px; }
    .lcs { font-family: ui-monospace, monospace; font-size: 0.85rem; background: #eef2ff; padding: 0.75rem; border-radius: 0.375rem; word-break: break-all; }
    .footer { margin-top: 2rem; font-size: 0.75rem; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <h1>Academic Plagiarism Detector — Analysis Report</h1>
  <p class="meta">Generated ${escapeHtml(timestamp)} · LCS Dynamic Programming · O(m×n)</p>

  <div class="score-card">
    <div class="score">${results.similarityScore}%</div>
    <div class="severity">${getSeverityLabel(results.similarityScore)}</div>
  </div>

  <div class="metrics">
    <div class="metric"><div class="metric-label">Submission words</div><div class="metric-value">${countWords(text1)}</div></div>
    <div class="metric"><div class="metric-label">Source words</div><div class="metric-value">${countWords(text2)}</div></div>
    <div class="metric"><div class="metric-label">LCS length</div><div class="metric-value">${results.lcsLength}</div></div>
    <div class="metric"><div class="metric-label">Submission chars</div><div class="metric-value">${results.text1Length}</div></div>
    <div class="metric"><div class="metric-label">Source chars</div><div class="metric-value">${results.text2Length}</div></div>
    <div class="metric"><div class="metric-label">Algorithm</div><div class="metric-value">LCS DP</div></div>
  </div>

  <div class="section">
    <h2>Reconstructed Longest Common Subsequence</h2>
    <p class="lcs">${escapeHtml(results.lcsString || "—")}</p>
  </div>

  <div class="section">
    <h2>Student Submission (highlighted)</h2>
    <div class="text-block">${buildHighlightedHtml(text1, text1Indices)}</div>
  </div>

  <div class="section">
    <h2>Source Document (highlighted)</h2>
    <div class="text-block">${buildHighlightedHtml(text2, text2Indices)}</div>
  </div>

  <p class="footer">LCS-Based Plagiarism Detector — Design &amp; Analysis of Algorithms</p>

  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    alert("Pop-up blocked. Please allow pop-ups to export the report.");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
}

export default exportPdfReport;
