import { defineConfig } from "changelogithub";

// 分组文案按 conventional commits 生成；未在此列出的 type（如 bump 提交用的
// `release:`）会被 changelogen 静默丢弃，正好当版本提交的过滤开关用。
export default defineConfig({
  types: {
    feat: { title: "🚀 Features" },
    fix: { title: "🐛 Bug Fixes" },
    perf: { title: "⚡ Performance" },
    refactor: { title: "♻️ Refactoring" },
    revert: { title: "↩️ Reverts" },
    docs: { title: "📚 Documentation" },
    test: { title: "🧪 Tests" },
    build: { title: "🛠️ Build" },
    ci: { title: "🤖 CI" },
    chore: { title: "🧹 Chores" },
  },
});
