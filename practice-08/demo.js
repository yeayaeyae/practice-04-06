// Демонстрация записи и чтения двоичного файла: node demo.js
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { writeRecordFile, readRecordFile, readBinaryFile } from "./src/binary-file.js";
import { toHex } from "./src/binary-stream.js";

const outputDir = join(dirname(fileURLToPath(import.meta.url)), "output");
mkdirSync(outputDir, { recursive: true });
const path = join(outputDir, "data.bin");

writeRecordFile(path, { str: "Hello World!", v1: 25, d1: 17.2 });
const bytes = readBinaryFile(path).bytes;
console.log(`Записан файл data.bin, ${bytes.length} байт:`);
console.log(toHex(bytes));

const { record } = readRecordFile(path);
console.log("\nПрочитано:");
console.log(`  str = "${record.str}"`);
console.log(`  v1 = ${record.v1}`);
console.log(`  d1 = ${record.d1}`);
