import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

// WCAG contrast checks for the design tokens in globals.css, in light and dark.
// Text pairs need 4.5:1 (AA normal text); UI indicators like the focus ring need 3:1.

const css = readFileSync(path.join(__dirname, "../../src/app/globals.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.search(new RegExp(`^${selector.replace(".", "\\.")} \\{`, "m"));
  if (start < 0) throw new Error(`${selector} block not found`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const vars: Record<string, string> = {};
  for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

type RGBA = [number, number, number, number];

function parse(color: string): RGBA {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgb = color.match(/^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3], rgb[4] === undefined ? 1 : +rgb[4]];
  throw new Error(`Unsupported color: ${color}`);
}

// Composite a (possibly translucent) colour over an opaque base
function over(top: RGBA, base: RGBA): RGBA {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + base[i] * (1 - a)).concat(1) as RGBA;
}

function luminance([r, g, b]: RGBA) {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: RGBA, b: RGBA) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const WHITE = "#ffffff";

for (const [mode, selector] of [
  ["light", ":root"],
  ["dark", ".dark"],
] as const) {
  describe(`theme contrast (${mode})`, () => {
    const t = block(selector);
    const color = (name: string) => (name.startsWith("#") ? name : t[name]);
    const card = parse(t.card);
    // Translucent backgrounds are judged as they render: over a card
    const resolve = (name: string) => over(parse(color(name)), card);

    const check = (fg: string, bg: string, min: number) =>
      it(`${fg} on ${bg} ≥ ${min}:1`, () => {
        const ratio = contrast(resolve(fg), resolve(bg));
        expect(ratio, `${fg} on ${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min);
      });

    for (const bg of ["background", "surface", "card", "accent"]) {
      check("foreground", bg, 4.5);
      check("muted", bg, 4.5);
    }
    for (const bg of ["background", "card", "surface"]) {
      check("primary", bg, 4.5);
      check("secondary", bg, 4.5);
    }
    check("primary-foreground", "primary", 4.5);
    check("secondary-foreground", "secondary", 4.5);
    check("primary-emphasis", "primary-subtle", 4.5);

    for (const s of ["success", "warning", "danger", "info", "highlight", "notice"]) {
      check(WHITE, s, 4.5); // solid badges/buttons use white text
      check(`${s}-emphasis`, `${s}-subtle`, 4.5);
      check(`${s}-emphasis`, "card", 4.5);
    }

    check("ring", "background", 3);
    check("ring", "card", 3);
  });
}
