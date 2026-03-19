/**
 * Next.js trace WriteStream ENOENT 에러 패치 (WSL2 + NTFS 환경)
 *
 * npm install 후 자동 실행되어 node_modules 내 Next.js를 패치합니다.
 * Next.js가 .next/trace 파일을 열 때 ENOENT 에러가 발생하면
 * 프로세스가 크래시하는 대신 무시하도록 에러 핸들러를 추가합니다.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";

const file = "node_modules/next/dist/trace/report/to-json.js";
if (!existsSync(file)) {
  console.log("[patch-next-trace] 파일 없음, 스킵");
  process.exit(0);
}

const content = readFileSync(file, "utf8");
const needle = 'this.writeStream = _fs.default.createWriteStream(this.file, writeStreamOptions);';
const patched = needle + "\n        this.writeStream.on('error', () => {});";

if (content.includes("this.writeStream.on('error'")) {
  console.log("[patch-next-trace] 이미 패치됨");
  process.exit(0);
}

if (!content.includes(needle)) {
  console.log("[patch-next-trace] 패치 대상 코드를 찾을 수 없음, 스킵");
  process.exit(0);
}

writeFileSync(file, content.replace(needle, patched), "utf8");
console.log("[patch-next-trace] 패치 완료 ✓");
