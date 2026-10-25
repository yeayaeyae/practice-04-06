// Демонстрация записи и чтения текстовых файлов: node demo.js
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { writeTextFile, appendTextFile, readLines, writeRecordFile, readRecordFile } from "./src/text-file.js";

const outputDir = join(dirname(fileURLToPath(import.meta.url)), "output");
mkdirSync(outputDir, { recursive: true });

const linesPath = join(outputDir, "file.txt");
writeTextFile(linesPath, "Hello world!\n");
appendTextFile(linesPath, "Вторая строка\n");
appendTextFile(linesPath, "Третья строка\n");
const lines = readLines(linesPath);
console.log("Построчное чтение file.txt:");
lines.lines.forEach((line, index) => console.log(`  ${index + 1}: ${line}`));

const streamPath = join(outputDir, "stream.txt");
writeRecordFile(streamPath, ["Hello", "world!", 12, 63.5]);
const record = readRecordFile(streamPath);
console.log("\nЧтение stream.txt через поток:");
console.log(`  h = "${record.h}"`);
console.log(`  w = "${record.w}"`);
console.log(`  v1 = ${record.v1}`);
console.log(`  d1 = ${record.d1}`);

const missing = readLines(join(outputDir, "missing.txt"));
console.log(`\nОткрытие отсутствующего файла: ${missing.ok ? "успех" : "ошибка обработана"}`);
