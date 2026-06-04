function getSeverity(score) {
  if (score < 15) {
    return {
      label: "Low similarity",
      color: "text-emerald-400",
      ring: "stroke-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    };
  }
  if (score <= 40) {
    return {
      label: "Moderate similarity",
      color: "text-amber-400",
      ring: "stroke-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    };
  }
  return {
    label: "High similarity",
    color: "text-red-400",
    ring: "stroke-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  };
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function RadialProgress({ score, ringClass }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${ringClass} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold tabular-nums text-slate-100">{clamped}%</span>
        <p className="text-[10px] uppercase tracking-wider text-slate-400">Similarity</p>
      </div>
    </div>
  );
}

export default function ResultSummary({ text1, text2, results, onExport }) {
  if (!results) return null;

  const severity = getSeverity(results.similarityScore);
  const words1 = countWords(text1);
  const words2 = countWords(text2);

  return (
    <section
      className={`rounded-xl border ${severity.border} ${severity.bg} p-6 shadow-lg backdrop-blur-sm`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Results Summary</h2>
          <p className={`mt-1 text-sm font-medium ${severity.color}`}>{severity.label}</p>
        </div>
        <button
          type="button"
          onClick={onExport}
          className="shrink-0 rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
        >
          Export Report
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <RadialProgress score={results.similarityScore} ringClass={severity.ring} />

        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
          <MetricCard label="Submission words" value={words1.toLocaleString()} />
          <MetricCard label="Source words" value={words2.toLocaleString()} />
          <MetricCard label="Submission chars" value={results.text1Length.toLocaleString()} />
          <MetricCard label="Source chars" value={results.text2Length.toLocaleString()} />
          <MetricCard
            label="LCS length"
            value={results.lcsLength.toLocaleString()}
            highlight
          />
          <MetricCard
            label="Matched sequence"
            value={results.lcsLength > 0 ? `"${truncate(results.lcsString, 24)}"` : "—"}
            mono
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-900/50 px-4 py-3">
        <p className="text-xs uppercase tracking-wider text-slate-500">Algorithm</p>
        <p className="mt-1 font-mono text-xs text-slate-400">
          Dynamic Programming · LCS · O(m × n) time &amp; space
        </p>
      </div>
    </section>
  );
}

function MetricCard({ label, value, highlight, mono }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`mt-0.5 truncate text-sm font-semibold ${
          highlight ? "text-indigo-300" : "text-slate-200"
        } ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return `${str.slice(0, max)}…`;
}
