/**
 * Next.js CLI 래퍼 — 인자를 그대로 전달
 */
import { spawn } from "child_process";

const args = process.argv.slice(2);
const child = spawn("node", ["./node_modules/next/dist/bin/next", ...args], {
  stdio: "inherit",
  cwd: process.cwd(),
});

child.on("exit", (code) => process.exit(code ?? 0));
