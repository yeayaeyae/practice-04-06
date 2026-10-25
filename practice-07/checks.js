import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { splitLines, writeValues, readTokens, readRecord, textStats } from "./src/text-stream.js";
import {
  writeTextFile,
  appendTextFile,
  readTextFile,
  readLines,
  writeRecordFile,
  readRecordFile,
} from "./src/text-file.js";

let passed = 0;
function check(name, fn) {
  fn();
  console.log(`OK: ${name}`);
  passed += 1;
}

const dir = mkdtempSync(join(tmpdir(), "practice-07-"));

check("построчное разбиение", () => {
  assert.deepEqual(splitLines("a\nb\r\nc\n"), ["a", "b", "c"]);
  assert.deepEqual(splitLines("a\n\nb"), ["a", "", "b"]);
  assert.deepEqual(splitLines(""), []);
});
check("запись значений в поток через пробел", () => {
  assert.equal(writeValues(["Hello world!", 12, 63.5]), "Hello world! 12 63.5");
});
check("чтение значений, разделённых пробелами", () => {
  assert.deepEqual(readTokens("Hello world! 12 63.5"), ["Hello", "world!", "12", "63.5"]);
  assert.deepEqual(readTokens("  a \n\t b  "), ["a", "b"]);
  assert.deepEqual(readTokens("   "), []);
});
check("чтение записи h, w, v1, d1", () => {
  assert.deepEqual(readRecord("Hello world! 12 63.5"), {
    ok: true, h: "Hello", w: "world!", v1: 12, d1: 63.5,
  });
});
check("ошибки разбора записи", () => {
  assert.equal(readRecord("Hello world!").ok, false);
  assert.equal(readRecord("Hello world! 12.5 63.5").ok, false);
  assert.equal(readRecord("Hello world! 12 abc").ok, false);
});
check("статистика текста", () => {
  assert.deepEqual(textStats("Первая строка\n\nТретья"), {
    characters: 21, lines: 3, nonEmptyLines: 2, words: 3,
  });
});
check("запись и чтение файла с кириллицей", () => {
  const path = join(dir, "file.txt");
  assert.equal(writeTextFile(path, "Привет, мир!\n").ok, true);
  assert.equal(readTextFile(path).text, "Привет, мир!\n");
});
check("WriteOnly перезаписывает файл", () => {
  const path = join(dir, "rewrite.txt");
  writeTextFile(path, "старое");
  writeTextFile(path, "новое");
  assert.equal(readTextFile(path).text, "новое");
});
check("Append добавляет в конец", () => {
  const path = join(dir, "append.txt");
  writeTextFile(path, "1\n");
  appendTextFile(path, "2\n");
  assert.deepEqual(readLines(path).lines, ["1", "2"]);
});
check("файл записи через поток", () => {
  const path = join(dir, "stream.txt");
  writeRecordFile(path, ["Hello", "world!", 12, 63.5]);
  assert.equal(readTextFile(path).text, "Hello world! 12 63.5");
  assert.equal(readRecordFile(path).v1, 12);
});
check("пустой файл читается без ошибки", () => {
  const path = join(dir, "empty.txt");
  writeTextFile(path, "");
  assert.deepEqual(readLines(path), { ok: true, lines: [] });
});
check("ошибка открытия отсутствующего файла", () => {
  const result = readTextFile(join(dir, "missing.txt"));
  assert.equal(result.ok, false);
  assert.ok(result.error.length > 0);
});
check("ошибка записи в несуществующий каталог", () => {
  assert.equal(writeTextFile(join(dir, "no-dir", "file.txt"), "x").ok, false);
});

rmSync(dir, { recursive: true, force: true });
console.log(`Проверок пройдено: ${passed}.`);
