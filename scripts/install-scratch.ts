// Fake-install this package into .mw-scratch/node_modules so the consumer
// harnesses there (.mw-scratch/ts-*.json and probe-global/*) can resolve the
// documented one-liner — `/// <reference types="types-mediawiki-params/mw" />`
// in .mw-scratch/types.d.ts. Type reference directives ignore tsconfig `paths`
// and only walk ancestor node_modules, and pnpm does not self-link a package
// into its own node_modules, so without this install the reference silently
// fails to resolve. Copies, not symlinks (Windows denies symlink creation
// without privileges); re-run after `pnpm build` to refresh dist.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DEST = join(ROOT, ".mw-scratch", "node_modules", "types-mediawiki-params");

rmSync(DEST, { recursive: true, force: true });
mkdirSync(DEST, { recursive: true });
cpSync(join(ROOT, "package.json"), join(DEST, "package.json"));
cpSync(join(ROOT, "dist"), join(DEST, "dist"), { recursive: true, dereference: true });
console.log("installed", DEST);
