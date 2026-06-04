import { useMemo, useState } from "react";

export default function DPTable({ results }) {
  const [truncateSize, setTruncateSize] = useState(15);

  const view = useMemo(() => {
    if (!results?.dpTable) return null;

    const { matrix, rowHeaders, colHeaders, pathCells } = results.dpTable;
    const pathSet = new Set(pathCells);
    const maxRows = matrix.length;
    const maxCols = matrix[0]?.length ?? 0;
    const effectiveSize = Math.min(truncateSize, maxRows - 1, maxCols - 1);

    const displayRows = Math.min(effectiveSize + 1, maxRows);
    const displayCols = Math.min(effectiveSize + 1, maxCols);

    return {
      matrix: matrix.slice(0, displayRows).map((row) => row.slice(0, displayCols)),
      rowHeaders: rowHeaders.slice(0, displayRows),
      colHeaders: colHeaders.slice(0, displayCols),
      pathSet,
      maxRows,
      maxCols,
      isTruncated: displayRows < maxRows || displayCols < maxCols,
    };
  }, [results, truncateSize]);

  if (!results) return null;

  const sliderMax = Math.max(
    5,
    Math.min(results.dpTable.dimensions.rows - 1, results.dpTable.dimensions.cols - 1, 50)
  );

  return (
    <section className="rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 shadow-lg backdrop-blur-sm lg:col-span-2">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">DP Matrix Visualization</h2>
          <p className="mt-1 text-sm text-slate-400">
            Bottom-up LCS table — rows: Text 1, columns: Text 2. Highlighted cells trace the
            backtracking path.
          </p>
        </div>

        <div className="flex min-w-[200px] flex-col gap-1">
          <label htmlFor="truncate-slider" className="text-xs text-slate-400">
            Matrix size: {truncateSize}×{truncateSize}
            {view?.isTruncated && (
              <span className="text-amber-400/80">
                {" "}
                (full: {view.maxRows - 1}×{view.maxCols - 1})
              </span>
            )}
          </label>
          <input
            id="truncate-slider"
            type="range"
            min={5}
            max={sliderMax}
            value={Math.min(truncateSize, sliderMax)}
            onChange={(e) => setTruncateSize(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-indigo-500"
          />
        </div>
      </div>

      {!view || view.matrix.length <= 1 ? (
        <p className="text-sm text-slate-500">Enter text in both fields to generate the DP table.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-700/50">
          <table className="border-collapse text-center font-mono text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-[2rem] border border-slate-700/60 bg-slate-900 px-2 py-1.5 text-slate-500">
                  ε
                </th>
                {view.colHeaders.slice(1).map((header, colIndex) => (
                  <th
                    key={`col-${colIndex}`}
                    className="min-w-[2rem] border border-slate-700/60 bg-slate-900 px-2 py-1.5 text-indigo-300"
                    title={`Text 2[${colIndex}]`}
                  >
                    {formatCellHeader(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.matrix.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  <th
                    className="sticky left-0 z-10 min-w-[2rem] border border-slate-700/60 bg-slate-900 px-2 py-1.5 text-indigo-300"
                    title={rowIndex === 0 ? "empty prefix" : `Text 1[${rowIndex - 1}]`}
                  >
                    {formatCellHeader(view.rowHeaders[rowIndex])}
                  </th>
                  {row.map((cell, colIndex) => {
                    const isPath = view.pathSet.has(`${rowIndex},${colIndex}`);
                    const isMatchCell =
                      rowIndex > 0 &&
                      colIndex > 0 &&
                      results.dpTable.rowHeaders[rowIndex] ===
                        results.dpTable.colHeaders[colIndex];

                    return (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={`min-w-[2rem] border border-slate-700/60 px-2 py-1.5 tabular-nums transition-colors ${
                          isPath
                            ? "bg-indigo-600/40 font-bold text-indigo-100 ring-1 ring-inset ring-indigo-400/50"
                            : isMatchCell
                              ? "bg-slate-800 text-slate-300"
                              : rowIndex === 0 || colIndex === 0
                                ? "bg-slate-900/80 text-slate-500"
                                : "bg-slate-900/40 text-slate-400"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-indigo-600/40 ring-1 ring-indigo-400/50" />
          Backtrack path
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-slate-900/40" />
          DP cell value
        </span>
      </div>
    </section>
  );
}

function formatCellHeader(char) {
  if (char === "ε") return "ε";
  if (char === " ") return "␣";
  if (char === "\n") return "↵";
  if (char === "\t") return "⇥";
  return char;
}
