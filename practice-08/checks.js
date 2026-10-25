import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BinaryWriter, BinaryReader, encodeRecord, decodeRecord, toHex } from "./src/binary-stream.js";
import { writeRecordFile, readRecordFile, readBinaryFile } from "./src/binary-file.js";

let passed = 0;
function check(name, fn) {
  fn();
  console.log(`OK: ${name}`);
  passed += 1;
}

const dir = mkdtempSync(join(tmpdir(), "practice-08-"));
const sample = { str: "Hello World!", v1: 25, d1: 17.2 };

check("int32 записывается в 4 байта big-endian", () => {
  assert.deepEqual([...new BinaryWriter().writeInt32(25).toBytes()], [0, 0, 0, 25]);
  assert.deepEqual([...new BinaryWriter().writeInt32(-1).toBytes()], [255, 255, 255, 255]);
});
check("double записывается в 8 байт", () => {
  assert.equal(toHex(new BinaryWriter().writeDouble(17.2).toBytes()), "00000000  40 31 33 33 33 33 33 33");
});
check("строка: длина в байтах и UTF-16", () => {
  assert.deepEqual([...new BinaryWriter().writeString("Hi").toBytes()], [0, 0, 0, 4, 0, 72, 0, 105]);
});
check("размер записи из методички — 40 байт", () => {
  assert.equal(encodeRecord(sample).length, 4 + 24 + 4 + 8);
});
check("байты совпадают с форматом QDataStream", () => {
  assert.equal(
    toHex(encodeRecord(sample)),
    [
      "00000000  00 00 00 18 00 48 00 65 00 6c 00 6c 00 6f 00 20",
      "00000010  00 57 00 6f 00 72 00 6c 00 64 00 21 00 00 00 19",
      "00000020  40 31 33 33 33 33 33 33",
    ].join("\n")
  );
});
check("чтение в том же порядке, что и запись", () => {
  assert.deepEqual(decodeRecord(encodeRecord(sample)), { ok: true, record: sample });
});
check("кириллица и пустая строка", () => {
  assert.deepEqual(decodeRecord(encodeRecord({ str: "Привет", v1: -7, d1: 0.5 })).record.str, "Привет");
  assert.deepEqual(decodeRecord(encodeRecord({ str: "", v1: 0, d1: 0 })).record, { str: "", v1: 0, d1: 0 });
});
check("нулевая строка (null)", () => {
  const bytes = new BinaryWriter().writeString(null).toBytes();
  assert.deepEqual([...bytes], [255, 255, 255, 255]);
  assert.equal(new BinaryReader(bytes).readString(), null);
});
check("int вне диапазона int32 отклоняется", () => {
  assert.throws(() => new BinaryWriter().writeInt32(2147483648), RangeError);
  assert.throws(() => new BinaryWriter().writeInt32(1.5), RangeError);
});
check("обрезанный файл не читается", () => {
  const result = decodeRecord(encodeRecord(sample).slice(0, 30));
  assert.equal(result.ok, false);
});
check("atEnd после чтения всех данных", () => {
  const reader = new BinaryReader(encodeRecord(sample));
  reader.readString();
  reader.readInt32();
  assert.equal(reader.atEnd(), false);
  reader.readDouble();
  assert.equal(reader.atEnd(), true);
});
check("запись и чтение файла data.bin", () => {
  const path = join(dir, "data.bin");
  assert.equal(writeRecordFile(path, sample).ok, true);
  assert.equal(readBinaryFile(path).bytes.length, 40);
  assert.deepEqual(readRecordFile(path).record, sample);
});
check("повреждённый и отсутствующий файл", () => {
  const path = join(dir, "broken.bin");
  writeFileSync(path, Buffer.from([0, 0, 0, 99, 1, 2]));
  assert.equal(readRecordFile(path).ok, false);
  assert.equal(readRecordFile(join(dir, "missing.bin")).ok, false);
});

rmSync(dir, { recursive: true, force: true });
console.log(`Проверок пройдено: ${passed}.`);
