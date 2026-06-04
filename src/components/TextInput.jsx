export default function TextInput({
  text1,
  text2,
  onText1Change,
  onText2Change,
  onAnalyze,
  loading,
}) {
  const canAnalyze = text1.trim().length > 0 && text2.trim().length > 0 && !loading;

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">Document Input</h2>
          <p className="mt-1 text-sm text-slate-400">
            Paste or type both documents, then run the LCS analysis.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TextAreaField
          id="text1"
          label="Student Submission"
          value={text1}
          onChange={onText1Change}
          placeholder="Enter the student's submitted text here…"
        />
        <TextAreaField
          id="text2"
          label="Source Document"
          value={text2}
          onChange={onText2Change}
          placeholder="Enter the reference or source document here…"
        />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Analyzing…
            </>
          ) : (
            "Analyze Text"
          )}
        </button>
      </div>
    </section>
  );
}

function TextAreaField({ id, label, value, onChange, placeholder }) {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={!value}
          className="text-xs font-medium text-slate-400 transition hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear
        </button>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={10}
        className="w-full resize-y rounded-lg border border-slate-600/60 bg-slate-900/80 px-4 py-3 font-mono text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
      <div className="mt-2 flex gap-4 text-xs text-slate-400">
        <span>{charCount.toLocaleString()} characters</span>
        <span>{wordCount.toLocaleString()} words</span>
      </div>
    </div>
  );
}
