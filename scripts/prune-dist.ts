/**
 * Post-build pruning for the `./define` subpath's runtime files.
 *
 * The declaration pass emits the dist .d.ts tree only. The two extra tsc passes
 * that compile `src/define.ts` (ESM into dist/, CJS into dist-cjs/) drag the
 * whole import graph with them — type-only sources emit as junk `.js` stubs.
 * Keep `dist/define.js`, move the CJS variant to `dist/define.cjs`, drop the
 * rest: the package must ship exactly the .d.ts tree plus the two define
 * runtimes.
 */
import { copyFileSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";

function pruneJs(dir: string, keep: Set<string>): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      pruneJs(path, keep);
    } else if (entry.name.endsWith(".js") && !keep.has(path)) {
      rmSync(path);
    }
  }
}

pruneJs("dist", new Set([join("dist", "define.js")]));
// Dual declarations: same content, parsed as ESM (.d.mts) and CJS (.d.cts)
// respectively by the matching export conditions.
copyFileSync(join("dist", "define.d.ts"), join("dist", "define.d.mts"));
copyFileSync(join("dist", "define.d.ts"), join("dist", "define.d.cts"));
renameSync(join("dist", "define.js"), join("dist", "define.mjs"));
renameSync(join("dist-cjs", "define.js"), join("dist", "define.cjs"));
rmSync("dist-cjs", { recursive: true, force: true });
console.log("[prune-dist] dist/define(.mjs|.cjs|.d.ts|.d.mts|.d.cts) kept; graph stubs removed");
