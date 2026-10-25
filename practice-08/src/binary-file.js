// Работа с двоичными файлами в Node.js (аналог QFile + QDataStream)
import { readFileSync, writeFileSync } from "node:fs";
import { encodeRecord, decodeRecord } from "./binary-stream.js";

export function writeBinaryFile(path, bytes) {
  try {
    writeFileSync(path, bytes);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function readBinaryFile(path) {
  try {
    return { ok: true, bytes: new Uint8Array(readFileSync(path)) };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function writeRecordFile(path, record) {
  try {
    return writeBinaryFile(path, encodeRecord(record));
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function readRecordFile(path) {
  const result = readBinaryFile(path);
  return result.ok ? decodeRecord(result.bytes) : result;
}
