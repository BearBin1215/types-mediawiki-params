/**
 * External-consumer harness for the opt-in extension mechanism (subpath
 * `./ext/*`).
 *
 * Simulates a downstream project that installs the built package and verifies:
 *  - core isolation: with nothing imported, extension modules are ABSENT from
 *    the query gating and the `ActionRequest` union;
 *  - import activation: importing anything from a pack file — an empty
 *    `import type {}` or the parameter interface being used — applies the
 *    registry augmentation shipped inside the pack, with full module gating;
 *  - specificity: activating pack A never pulls pack B's modules;
 *  - legacy seam: a consumer `declare module` still merges into the exported
 *    registries (third-party extensions this package does not cover);
 *  - reference limitation: `/// <reference types>` resolves the pack file but
 *    does NOT apply its augmentation (asserted so a future TS change surfaces
 *    here instead of silently inverting the docs);
 *  - emit: the type-only import is erased — no runtime import lands in
 *    compiled JS, while a side-effect import would emit one (the hazard).
 *
 * Run: `pnpm check:ext`. Exits non-zero if any expectation breaks.
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TSC = join(ROOT, "node_modules", "typescript", "bin", "tsc");
const DIR = join(ROOT, ".ext-harness");
const NODE_MODULES = join(DIR, "node_modules");
const PKG = join(NODE_MODULES, "types-mediawiki-params");

// Mirrors the repo tsconfig's consumer-relevant options (bundler + strict +
// verbatimModuleSyntax) so the harness parses/erases like a real consumer.
const BASE_TSCONFIG = {
  compilerOptions: {
    target: "es2022",
    module: "esnext",
    moduleResolution: "bundler",
    strict: true,
    verbatimModuleSyntax: true,
    types: [],
    skipLibCheck: true,
    rootDir: DIR,
    noEmit: true,
  },
};

/**
 * Run tsc on a consumer tsconfig; return whether it type-checked clean.
 *
 * `expect` is what the case pins — the isolation checks MUST fail to compile.
 * The captured compiler output is echoed only when the result is unexpected: a
 * deliberate failure must never print a `file(l,c): error TS…` line, because
 * `actions/setup-node` registers the `tsc` problem matcher for the whole job
 * (`^([^\s].*)[\(:](\d+)[,:](\d+)(?:\):\s+|\s+-\s+)(error|warning|info)\s+TS\d+\s*:\s*(.*)$`).
 * The runner turns every matching line into a GitHub error annotation, and an
 * annotation does not fail the step — exit codes do — so the expected failure
 * shows up as a red annotation on an otherwise green run. Prefixing the line
 * does not help: the file group matches anything up to `(l,c)`.
 */
function check(name: string, include: string[], expect: "clean" | "fails"): boolean {
  const cfg = join(DIR, `tsconfig.${name}.json`);
  writeFileSync(cfg, JSON.stringify({ ...BASE_TSCONFIG, include }, null, 2));
  try {
    execFileSync(process.execPath, [TSC, "-p", cfg], { cwd: DIR, stdio: "pipe" });
    return true;
  } catch (err) {
    if (expect === "clean") {
      console.error(String(err instanceof Error ? err.message : err).slice(0, 2000));
      const stdout = (err as { stdout?: Buffer }).stdout;
      const stderr = (err as { stderr?: Buffer }).stderr;
      if (stdout) console.error(stdout.toString().slice(0, 2000));
      if (stderr) console.error(stderr.toString().slice(0, 2000));
    }
    return false;
  }
}

/** Compile a consumer file WITH emit; return the emitted JS source. */
function emit(name: string, file: string): string {
  const outDir = join(DIR, `emit/${name}`);
  const cfg = join(DIR, `tsconfig.${name}.json`);
  writeFileSync(
    cfg,
    JSON.stringify(
      {
        ...BASE_TSCONFIG,
        include: [file],
        compilerOptions: { ...BASE_TSCONFIG.compilerOptions, noEmit: false, outDir },
      },
      null,
      2,
    ),
  );
  execFileSync(process.execPath, [TSC, "-p", cfg], { cwd: DIR, stdio: "pipe" });
  return readFileSync(join(outDir, file.replace(/\.ts$/, ".js")), "utf8");
}

/** A gated query entry, as a wrapper author writes it. */
const API_QUERY = `
import type { QueryListParams, QueryPropParams, QueryRequest } from 'types-mediawiki-params';
declare function apiQuery<
  P extends keyof QueryPropParams & string = never,
  L extends keyof QueryListParams & string = never,
>(params: QueryRequest<P, L>): void;
`;

// Fresh dist, then a fake install of the package into the harness.
execFileSync(process.execPath, [TSC, "-p", join(ROOT, "tsconfig.build.json")], {
  cwd: ROOT,
  stdio: "inherit",
});
rmSync(DIR, { recursive: true, force: true });
mkdirSync(PKG, { recursive: true });
cpSync(join(ROOT, "package.json"), join(PKG, "package.json"));
cpSync(join(ROOT, "dist"), join(PKG, "dist"), { recursive: true });

// (i) core isolation: `list=checkuser` must be unknown without the pack.
writeFileSync(
  join(DIR, "core.ts"),
  `${API_QUERY}
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
`,
);

// (ii) empty-import activation: one line, no registry knowledge needed;
//       module gating applies to the activated module.
writeFileSync(
  join(DIR, "empty-import.ts"),
  `import type {} from 'types-mediawiki-params/ext/checkuser';
${API_QUERY}
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
// @ts-expect-error module gating: rvprop belongs to prop=revisions, not list=checkuser
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u", rvprop: "ids" });
`,
);

// (iii) named-import activation: importing the parameter interface being used
//      activates the pack's augmentation as a side effect.
writeFileSync(
  join(DIR, "named-import.ts"),
  `import type { ApiQueryCheckuserParams } from 'types-mediawiki-params/ext/checkuser';
${API_QUERY}
declare const params: ApiQueryCheckuserParams;
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
`,
);

// (iv) specificity: activating checkuser must not pull flaggedrevs actions.
writeFileSync(
  join(DIR, "specificity.ts"),
  `import type {} from 'types-mediawiki-params/ext/checkuser';
${API_QUERY}
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
declare const review: { action: "review"; token: string };
// @ts-expect-error action=review stays unknown: the flaggedrevs pack is not active
const r: import('types-mediawiki-params').ActionRequest = review;
`,
);

// (v) legacy consumer augmentation (third-party seam): hand-written
//      `declare module` keeps working against the exported registries.
writeFileSync(
  join(DIR, "consumer-aug.d.ts"),
  `import type { QueryListParams } from 'types-mediawiki-params';
declare module 'types-mediawiki-params' {
  interface QueryListParams {
    mywikimodule: { mwmparam: string; mwmtoken: string };
  }
}
`,
);
writeFileSync(
  join(DIR, "consumer.ts"),
  `${API_QUERY}
apiQuery({ action: "query", list: "mywikimodule", mwmparam: "x", mwmtoken: "y" });
`,
);

// (vi) reference limitation: `/// <reference types>` resolves the pack file
//       but does not apply its shipped augmentation (TS 7.0.2). The compile is
//       expected to be CLEAN: the directive suppresses the unknown-module
//       error that the missing augmentation produces.
writeFileSync(
  join(DIR, "reference.ts"),
  `/// <reference types="types-mediawiki-params/ext/checkuser" />
${API_QUERY}
// @ts-expect-error a bare reference must NOT activate the augmentation
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
`,
);

const coreIsolated = !check("core", ["core.ts"], "fails");
const emptyImport = check("empty-import", ["empty-import.ts"], "clean");
const namedImport = check("named-import", ["named-import.ts"], "clean");
const specific = check("specificity", ["specificity.ts"], "clean");
const consumer = check("consumer", ["consumer.ts", "consumer-aug.d.ts"], "clean");
// Clean compile = the @ts-expect-error suppressed the unknown-module error =
// the augmentation did NOT apply through the bare reference.
const referenceLimited = check("reference", ["reference.ts"], "clean");

// (vii) emit: the type-only import is erased — no runtime import in output.
writeFileSync(
  join(DIR, "emit-import.ts"),
  `import type {} from 'types-mediawiki-params/ext/checkuser';
${API_QUERY}
apiQuery({ action: "query", list: "checkuser", curequest: "ipusers", cutoken: "x", cutarget: "u" });
`,
);
const importJs = emit("emit-import", "emit-import.ts");
const importClean = !importJs.includes("types-mediawiki-params");

// (viii) contrast: a side-effect import DOES emit a runtime import — the
//        reason the type-only import is the documented form.
writeFileSync(join(DIR, "emit-sideeffect.ts"), `import 'types-mediawiki-params/ext/checkuser';\n`);
const sideEffectJs = emit("emit-sideeffect", "emit-sideeffect.ts");
const sideEffectEmits = sideEffectJs.includes("types-mediawiki-params");

rmSync(DIR, { recursive: true, force: true });

console.log(
  `[check:ext] core isolation (checkuser unknown):      ${coreIsolated ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] empty-import activation (checkuser gated):   ${emptyImport ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] named-import activation (checkuser gated):   ${namedImport ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] specificity (no flaggedrevs leak):           ${specific ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] consumer augmentation (legacy seam):         ${consumer ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] reference limitation (checkuser unknown):    ${referenceLimited ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] emit: type import erased (no runtime):       ${importClean ? "PASS" : "FAIL"}`,
);
console.log(
  `[check:ext] emit: side-effect import emits (contrast):   ${sideEffectEmits ? "PASS" : "FAIL"}`,
);

if (
  !coreIsolated ||
  !emptyImport ||
  !namedImport ||
  !specific ||
  !consumer ||
  !referenceLimited ||
  !importClean ||
  !sideEffectEmits
) {
  console.error("[check:ext] extension opt-in mechanism regressed.");
  process.exit(1);
}
console.log("[check:ext] ok");
