// Общие функции текстового потока: работают и в браузере, и в Node.js

// Построчное чтение, как readLine() до atEnd()
export function splitLines(text) {
  if (text === "") return [];
  const lines = text.split(/\r?\n/);
  if (lines.at(-1) === "") lines.pop();
  return lines;
}

// Аналог ts << value << " " << value
export function writeValues(values) {
  return values.map(String).join(" ");
}

// Аналог ts >> value: значения разделяются пробельными символами
export function readTokens(text) {
  const trimmed = text.trim();
  return trimmed === "" ? [] : trimmed.split(/\s+/);
}

// Чтение записи "строка строка целое вещественное", как ts >> h >> w >> v1 >> d1
export function readRecord(text) {
  const tokens = readTokens(text);
  if (tokens.length < 4) return { ok: false, error: "Ожидалось четыре значения." };
  const [h, w, intText, doubleText] = tokens;
  if (!/^[+-]?\d+$/.test(intText)) return { ok: false, error: `«${intText}» не является целым числом.` };
  const d1 = Number(doubleText);
  if (doubleText === "" || Number.isNaN(d1)) {
    return { ok: false, error: `«${doubleText}» не является вещественным числом.` };
  }
  return { ok: true, h, w, v1: Number(intText), d1 };
}

export function textStats(text) {
  const lines = splitLines(text);
  return {
    characters: text.length,
    lines: lines.length,
    nonEmptyLines: lines.filter((line) => line.trim() !== "").length,
    words: readTokens(text).length,
  };
}
