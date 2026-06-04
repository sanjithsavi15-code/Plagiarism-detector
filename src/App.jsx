import { useCallback, useState } from "react";
import computeLCS from "./algorithms/lcs.js";
import TextInput from "./components/TextInput.jsx";
import ResultSummary from "./components/ResultSummary.jsx";
import DPTable from "./components/DPTable.jsx";
import HighlightedText from "./components/HighlightedText.jsx";
import exportPdfReport from "./utils/exportPdf.js";

export default function App() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = useCallback(() => {
    if (!text1.trim() || !text2.trim()) return;

    setLoading(true);
    setAnalysisResults(null);

    requestAnimationFrame(() => {
      setTimeout(() => {
        const results = computeLCS(text1, text2);
        setAnalysisResults(results);
        setLoading(false);
      }, 150);
    });
  }, [text1, text2]);

  const handleExport = useCallback(() => {
    exportPdfReport({ text1, text2, results: analysisResults });
  }, [text1, text2, analysisResults]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">
            Academic Plagiarism Detector
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Design &amp; Analysis of Algorithms — Longest Common Subsequence via Dynamic
            Programming
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <TextInput
          text1={text1}
          text2={text2}
          onText1Change={setText1}
          onText2Change={setText2}
          onAnalyze={handleAnalyze}
          loading={loading}
        />

        {analysisResults && (
          <>
            <ResultSummary
              text1={text1}
              text2={text2}
              results={analysisResults}
              onExport={handleExport}
            />

            <HighlightedText text1={text1} text2={text2} results={analysisResults} />

            <div className="grid gap-6">
              <DPTable results={analysisResults} />
            </div>
          </>
        )}

        {!analysisResults && !loading && (
          <div className="rounded-xl border border-dashed border-slate-700/50 bg-slate-800/30 px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              Enter both documents above and click{" "}
              <span className="font-medium text-slate-400">Analyze Text</span> to view similarity
              results, highlighted matches, and the DP matrix.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
