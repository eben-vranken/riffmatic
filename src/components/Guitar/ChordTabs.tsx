interface Tabs {
  tabs: string; // low-E -> high-e, e.g. "x32010" or "x 10 12 12 12 10"
  barre?: number | null; // fret number of barre or null
}

const STRINGS = ["E", "A", "D", "G", "B", "e"] as const;

function parseShape(shape: string): (number | null)[] {
  const s = shape.trim();
  const parts = (/\s|,/.test(s) ? s.split(/[\s,]+/) : s.split("")).filter(
    Boolean
  );
  if (parts.length !== 6) throw new Error("Shape must have 6 entries.");
  return parts.map((p) => {
    const c = p.toLowerCase();
    if (c === "x") return null;
    if (/^\d+$/.test(c)) return parseInt(c, 10);
    throw new Error("Bad token in shape.");
  });
}

function toAsciiFretboard(shape: string, barre?: number | null): string {
  const vals = parseShape(shape); // lowE..highE
  const hasOpen = vals.some((v) => v === 0);
  const positives = vals.filter(
    (v): v is number => typeof v === "number" && v > 0
  );
  const maxNote = positives.length ? Math.max(...positives) : 0;

  // window start
  let start = 1;
  if (barre && barre > 0) start = barre;
  else if (!hasOpen && positives.length) start = Math.min(...positives);

  // window end (>=3 frets)
  const maxFret = Math.max(barre ?? 0, maxNote);
  const span = Math.max(3, Math.max(0, maxFret - start + 1));
  const end = start + span - 1;

  // dynamic cell width (keeps labels aligned for 10+)
  const cellWidth = Math.max(3, String(end).length + 0); // 3 min
  const makeEmpty = () => "-".repeat(cellWidth);
  const makeFinger = () => {
    const left = Math.floor((cellWidth - 1) / 2);
    const right = cellWidth - 1 - left;
    return "-".repeat(left) + "O" + "-".repeat(right);
  };
  const makeBarre = () => {
    const left = Math.floor((cellWidth - 1) / 2);
    const right = cellWidth - 1 - left;
    return "=".repeat(left) + "B" + "=".repeat(right);
  };
  const padCenter = (t: string) => {
    const w = cellWidth,
      pad = Math.max(0, w - t.length);
    const l = Math.floor(pad / 2),
      r = pad - l;
    return " ".repeat(l) + t + " ".repeat(r);
  };

  const basePipe = start === 1 ? "||" : "|";
  const buildRow = (name: string, v: number | null) => {
    const pre = v === null ? "x " : v === 0 ? "o " : "  ";
    const cells = [];
    for (let f = start; f <= end; f++) {
      if (barre && f === barre) cells.push(makeBarre());
      else if (typeof v === "number" && v > 0 && v === f)
        cells.push(makeFinger());
      else cells.push(makeEmpty());
    }
    return `${name} ${pre}${basePipe}${cells.join("|")}|`;
  };

  // print high-e to low-E
  const lines = STRINGS.slice()
    .reverse()
    .map((nm, iRev) => {
      const i = 5 - iRev; // back to lowE..highE index
      return buildRow(nm, vals[i]);
    });

  // bottom fret numbers
  const leftPad = "    " + (start === 1 ? "||" : "|"); // "e " width ≈ any string row prefix
  const labels =
    Array.from({ length: span }, (_, k) => padCenter(String(start + k))).join(
      "|"
    ) + "|";
  lines.push(leftPad.replace(/[^\|]/g, " ") + labels);

  return lines.join("\n");
}

export const ChordTabs = ({ tabs, barre = null }: Tabs) => {
  let ascii = "";
  try {
    ascii = toAsciiFretboard(tabs, barre ?? undefined);
  } catch (e: any) {
    ascii = `Invalid: ${e.message ?? e}`;
  }
  return (
    <section className="font-bold">
      <pre style={{ lineHeight: 1.1, fontFamily: "monospace" }}>{ascii}</pre>
    </section>
  );
};
