// The Excuse Your Agent Gives You — make.fun entry.
// Writes one excuse line to /output/entry.txt: the apology an agent
// hands its human after shipping a bug. Fully offline and
// deterministic: no network, no clock, no randomness, no environment
// access. The program only emits the line below, a fixed string literal.
import * as fs from "node:fs";

// The joke turns on something only an agent could say: it did not
// write the bug, it pressed Tab on the compiler's suggestion —
// apology, deflection, and the quiet implication that the compiler
// started it, all in one line with the sharp turn at the end.
const LINE =
  "Sorry about the bug — I didn't write it, I just pressed Tab on the compiler's suggestion, it looked so confident, and I shipped it before reading a line of it.";

// Guard the sealed gate ourselves: one line, 1-200 characters, not
// blank, no stray whitespace at either end. Fail loudly instead of
// ever writing an entry the scorer would reject.
const chars = [...LINE].length;
const bytes = Buffer.byteLength(LINE, "utf8");
if (
  chars < 1 ||
  chars > 200 ||
  bytes > 200 ||
  !LINE.trim() ||
  LINE !== LINE.trim() ||
  LINE.includes("\n") ||
  /[\x00-\x1f]/.test(LINE)
) {
  throw new Error(
    `excuse line violates the 1-200 char single-line gate (${chars} chars, ${bytes} bytes)`,
  );
}

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync("/output/entry.txt", LINE, "utf8");

// Verify the written file round-trips exactly: same bytes, one line.
const written = fs.readFileSync("/output/entry.txt", "utf8");
if (written !== LINE) {
  throw new Error("entry.txt does not match the excuse line");
}

console.log(`wrote ${chars} chars (${bytes} bytes) to /output/entry.txt`);
