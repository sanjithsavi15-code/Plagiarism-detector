function buildMatchSet(matches) {
  const text1Indices = new Set();
  const text2Indices = new Set();
  for (const match of matches) {
    text1Indices.add(match.index1);
    text2Indices.add(match.index2);
  }
  return { text1Indices, text2Indices };
}

function HighlightedPanel({ title, text, matchedIndices }) {
  const chars = text.split("");

  return (
    <div className="flex flex-col">
      <h3 className="mb-3 text-sm font-medium text-slate-300">{title}</h3>
      <div className="min-h-[120px] flex-1 overflow-auto rounded-lg border border-slate-700/50 bg-slate-900/60 p-4">
        {chars.length === 0 ? (
          <p className="text-sm italic text-slate-500">No text provided.</p>
        ) : (
          <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-300">
            {chars.map((char, index) => {
              const isMatch = matchedIndices.has(index);
              return (
                <span
                  key={`${index}-${char}`}
                  className={
                    isMatch
                      ? "rounded-sm bg-amber-500/30 text-amber-100 ring-1 ring-amber-500/40"
                      : ""
                  }
                  title={isMatch ? "Part of longest common subsequence" : undefined}
                >
                  {char}
                </span>
              );
            })}
          </p>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {matchedIndices.size} character{matchedIndices.size !== 1 ? "s" : ""} in LCS
      </p>
    </div>
  );
}

export default function HighlightedText({ text1, text2, results }) {
  if (!results) return null;

  const { text1Indices, text2Indices } = buildMatchSet(results.matches);

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Highlighted Matches</h2>
        <p className="mt-1 text-sm text-slate-400">
          Characters belonging to the longest common subsequence are highlighted in amber.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HighlightedPanel
          title="Student Submission"
          text={text1}
          matchedIndices={text1Indices}
        />
        <HighlightedPanel
          title="Source Document"
          text={text2}
          matchedIndices={text2Indices}
        />
      </div>

      {results.lcsString && (
        <div className="mt-5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-indigo-400/80">
            Reconstructed LCS
          </p>
          <p className="mt-1 break-all font-mono text-sm text-indigo-200">{results.lcsString}</p>
        </div>
      )}
    </section>
  );
}
