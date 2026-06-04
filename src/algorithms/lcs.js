/**
 * Longest Common Subsequence (LCS) via Dynamic Programming
 *
 * Time Complexity:  O(m × n)
 * Space Complexity: O(m × n)
 *
 * @param {string} text1
 * @param {string} text2
 * @returns {{
 *   similarityScore: number,
 *   lcsLength: number,
 *   lcsString: string,
 *   alignedText1: string,
 *   alignedText2: string,
 *   dpTable: {
 *     matrix: number[][],
 *     rowHeaders: string[],
 *     colHeaders: string[],
 *     pathCells: string[],
 *     dimensions: { rows: number, cols: number }
 *   },
 *   matches: Array<{ index1: number, index2: number, char: string }>,
 *   text1Length: number,
 *   text2Length: number
 * }}
 */
export function computeLCS(text1, text2) {
  const s1 = text1 ?? "";
  const s2 = text2 ?? "";
  const m = s1.length;
  const n = s2.length;

  const matrix = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const matches = [];
  const pathCells = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      matches.unshift({ index1: i - 1, index2: j - 1, char: s1[i - 1] });
      pathCells.unshift(`${i},${j}`);
      i--;
      j--;
    } else if (matrix[i - 1][j] >= matrix[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const lcsLength = matrix[m][n];
  const maxLen = Math.max(m, n, 1);
  const similarityScore = Math.round((lcsLength / maxLen) * 1000) / 10;

  const rowHeaders = ["ε", ...s1.split("")];
  const colHeaders = ["ε", ...s2.split("")];

  return {
    similarityScore,
    lcsLength,
    lcsString: matches.map((match) => match.char).join(""),
    alignedText1: matches.map((match) => match.char).join(""),
    alignedText2: matches.map((match) => match.char).join(""),
    dpTable: {
      matrix,
      rowHeaders,
      colHeaders,
      pathCells,
      dimensions: { rows: m + 1, cols: n + 1 },
    },
    matches,
    text1Length: m,
    text2Length: n,
  };
}

export default computeLCS;
