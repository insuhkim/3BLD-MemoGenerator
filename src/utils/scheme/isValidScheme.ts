export function isValidScheme(scheme: string) {
  if (scheme.length !== 54) return false;
  const edgeIndices = [1, 3, 5, 7];
  const cornerIndices = [0, 2, 6, 8];
  let edges = [],
    corners = [];
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 4; j++) {
      edges.push(scheme[i * 9 + edgeIndices[j]]);
      corners.push(scheme[i * 9 + cornerIndices[j]]);
    }
  }
  if (edges.includes(" ") || corners.includes(" ")) return false;

  const hasDuplicate = (arr: string[]) => new Set(arr).size !== arr.length;
  return !hasDuplicate(edges) && !hasDuplicate(corners);
}
