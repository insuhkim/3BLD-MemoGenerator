// Pure regex validation — no cubing/alg dependency needed.
// Matches standard 3x3 notation: R, L, U, D, F, B (with optional 'w' for wide),
// slice moves M, E, S, and rotations x, y, z, all with optional 2/' modifiers.
const VALID_MOVE = /^([RLUDFB]w?|[MESxyz])(2|')?$/;

export function isValidScramble(scramble: string): boolean {
  const trimmed = scramble.trim();
  if (trimmed === "") return true; // empty is valid (no scramble)

  const moves = trimmed.split(/\s+/);
  return moves.every((move) => VALID_MOVE.test(move));
}
