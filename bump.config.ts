import { defineConfig } from "bumpp";

// 版本提交用非 conventional 的 `release:` type，changelogithub 不会收录它
// （默认的 `chore: release {tag}` 会落进 Chores 段）。
export default defineConfig({
  commit: "release: {tag}",
});
