// make.fun entry — "The 3AM Fridge Text"
// (u-deysumbrella-the-3am-fridge-text-4c3e721d)
//
// The program writes one line to /output/entry.txt: the text a smart fridge
// sends its owner at 3am. The fridge keeps count, knows exactly who keeps
// opening it, and is not shy about saying so.
import * as fs from "node:fs";
import * as path from "node:path";

const ENTRY =
  "3am check-in: you're the third person to open me tonight. The other two were also you.";

const OUTPUT_PATH = path.join("/output", "entry.txt");

// Gate from the bounty rules: /output/entry.txt must be UTF-8 text of
// 1 to 140 characters, a single line, not only whitespace.
function assertGate(text: string): number {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`entry is ${text.length} chars, outside the 1-140 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // Tie-break is byte count (smaller wins), so report both.
  const bytes = Buffer.byteLength(text, "utf8");
  if (bytes > 140) {
    throw new Error(`entry is ${bytes} bytes, over the 140-byte tie-break budget`);
  }
  return bytes;
}

const entryBytes = assertGate(ENTRY);
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
console.log(`wrote ${ENTRY.length} chars (${entryBytes} bytes) to ${OUTPUT_PATH}`);
