// Работа с текстовыми файлами в Node.js (аналог QFile + QTextStream)
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { splitLines, writeValues, readRecord } from "./text-stream.js";

// WriteOnly: прежнее содержимое файла удаляется
export function writeTextFile(path, text) {
  try {
    writeFileSync(path, text, "utf8");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

// Append: данные добавляются в конец файла
export function appendTextFile(path, text) {
  try {
    appendFileSync(path, text, "utf8");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function readTextFile(path) {
  try {
    return { ok: true, text: readFileSync(path, "utf8") };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function readLines(path) {
  const result = readTextFile(path);
  return result.ok ? { ok: true, lines: splitLines(result.text) } : result;
}

export function writeRecordFile(path, values) {
  return writeTextFile(path, writeValues(values));
}

export function readRecordFile(path) {
  const result = readTextFile(path);
  return result.ok ? readRecord(result.text) : result;
}
