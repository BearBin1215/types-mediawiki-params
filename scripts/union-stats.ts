import { loadUnion } from "./paraminfo-union";
const u = loadUnion();
let removed = 0,
  sinceTags = 0,
  params = 0;
const removedList: string[] = [];
for (const mod of [...u.queryModules.values(), ...u.actions.values()]) {
  for (const p of mod.params.values()) {
    params++;
    if (p.removedIn) {
      removed++;
      removedList.push(`${mod.name}.${p.name} (${p.since}→${p.until}, removed ${p.removedIn})`);
    } else if (p.since !== "1.39") sinceTags++;
  }
}
console.log("total params:", params, "| removed-in-range:", removed, "| since>1.39:", sinceTags);
console.log(removedList.join("\n"));
