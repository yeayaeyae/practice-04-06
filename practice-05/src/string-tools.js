// Аналог различия пустой и нулевой строки QString
export function isNullString(value) {
  return value === null || value === undefined;
}

export function isEmptyString(value) {
  return isNullString(value) || value.length === 0;
}

// Сравнение с учётом регистра, как операторы ==, <, > у QString
export function compareStrings(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function equalsIgnoreCase(a, b) {
  return a.toLocaleLowerCase("ru") === b.toLocaleLowerCase("ru");
}

export function concatStrings(first, second, separator = "") {
  return `${first}${separator}${second}`;
}

export function replaceText(text, from, to) {
  if (from === "") return text;
  return text.replaceAll(from, to);
}

export function changeCase(text, mode) {
  if (mode === "lower") return text.toLocaleLowerCase("ru");
  if (mode === "upper") return text.toLocaleUpperCase("ru");
  throw new Error(`Неизвестный режим: ${mode}`);
}

// Аналог split(" ") и split(" ", Qt::SkipEmptyParts)
export function splitWords(text, skipEmptyParts = false) {
  const parts = text.split(" ");
  return skipEmptyParts ? parts.filter((part) => part !== "") : parts;
}

export function joinWords(words, separator = " ") {
  return words.join(separator);
}

export function checkEdges(text, prefix, suffix) {
  return { startsWith: text.startsWith(prefix), endsWith: text.endsWith(suffix) };
}

// Аналог QString::arg(): заменяет все вхождения маркера %N с наименьшим номером
export function arg(template, value) {
  const numbers = [...template.matchAll(/%(\d{1,2})/g)]
    .map((match) => Number(match[1]))
    .filter((number) => number >= 1 && number <= 99);
  if (numbers.length === 0) return template;
  const lowest = Math.min(...numbers);
  return template.replace(/%(\d{1,2})/g, (marker, number) =>
    Number(number) === lowest ? String(value) : marker
  );
}

export function formatArgs(template, ...values) {
  return values.reduce((result, value) => arg(result, value), template);
}

export function describeString(text) {
  return {
    length: text.length,
    isEmpty: isEmptyString(text),
    words: splitWords(text, true).length,
    lower: changeCase(text, "lower"),
    upper: changeCase(text, "upper"),
  };
}
