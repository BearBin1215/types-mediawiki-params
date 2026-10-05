/**
 * Publish-surface guard: the shipped package must be pure params.
 *
 * The request → response correlation (`src/with-response.ts`) and the global
 * `mw.Api` pack (`src/mw.ts`) are parked. Their sources stay in the repo so
 * `pnpm test` keeps type-checking them, but neither the `exports` map nor the
 * built `dist/` may expose them to consumers — not even to a classic-resolution
 * deep import, which ignores `exports`.
 *
 * This asserts that, so re-adding an export or letting a parked file reach
 * `dist/` fails CI instead of shipping silently.
 *
 * Run: `pnpm check:surface` (needs a fresh `dist/`, so it sits after
 * `check:pack` in the `check` chain).
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface PackageJson {
  exports?: Record<string, unknown>;
  typesVersions?: Record<string, Record<string, unknown>>;
  peerDependencies?: Record<string, unknown>;
}

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")) as PackageJson;

/** Public entries that make up the pure-params surface. */
const EXPECTED_EXPORTS = [".", "./define", "./ext/*", "./package.json"];
const EXPECTED_TYPES_VERSIONS = ["define", "ext/*"];

/** Parked subpaths: their dist files must not exist and must not be exported. */
const PARKED_DIST_FILES = /(^|\/)(with-response|mw)\.(d\.ts|d\.mts|d\.cts)$/;
const RESPONSE_IMPORT = /from\s*["']types-mediawiki-response["']/;

const failures: string[] = [];

const exportsKeys = Object.keys(pkg.exports ?? {});
for (const key of exportsKeys) {
  if (!EXPECTED_EXPORTS.includes(key)) failures.push(`exports exposes "${key}" (parked surface)`);
}
for (const key of EXPECTED_EXPORTS) {
  if (!exportsKeys.includes(key)) failures.push(`exports is missing "${key}"`);
}

const typesVersionsKeys = Object.keys(pkg.typesVersions?.["*"] ?? {});
for (const key of typesVersionsKeys) {
  if (!EXPECTED_TYPES_VERSIONS.includes(key)) {
    failures.push(`typesVersions exposes "${key}" (parked surface)`);
  }
}

for (const name of Object.keys(pkg.peerDependencies ?? {})) {
  failures.push(`peerDependencies still declares "${name}"`);
}

const dist = join(ROOT, "dist");
if (!existsSync(dist)) {
  failures.push("dist/ is missing — run a build first");
} else {
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      const rel = path
        .slice(ROOT.length + 1)
        .split("\\")
        .join("/");
      if (PARKED_DIST_FILES.test(rel)) {
        failures.push(`dist ships ${rel} (parked surface)`);
      } else if (rel.endsWith(".d.ts") || rel.endsWith(".d.mts") || rel.endsWith(".d.cts")) {
        if (RESPONSE_IMPORT.test(readFileSync(path, "utf8"))) {
          failures.push(`${rel} imports types-mediawiki-response (parked surface)`);
        }
      }
    }
  };
  walk(dist);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`[check:surface] ${failure}`);
  console.error("[check:surface] publish surface is not pure params.");
  process.exit(1);
}
console.log("[check:surface] publish surface is pure params (., ./define, ./ext/*).");
