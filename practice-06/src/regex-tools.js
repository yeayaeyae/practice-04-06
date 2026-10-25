// Шаблон IP-адреса из методички: точка экранирована, иначе она означает «любой символ»
export const ipPattern = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
const strictIpPattern = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
export const domainPattern = /(\.com|\.ru)$/;
export const datePattern = /^(?<date>\d\d)\/(?<month>\d\d)\/(?<year>\d\d\d\d)$/;

export function containsIp(text) {
  return ipPattern.test(text);
}

export function findIp(text) {
  return text.match(ipPattern)?.[0] ?? null;
}

// Дополнительно: каждая часть адреса должна быть в диапазоне 0–255
export function isValidIp(text) {
  return strictIpPattern.test(text);
}

export function hasDomain(text) {
  return domainPattern.test(text);
}

// Аналог QRegularExpressionMatch: hasMatch() и captured(номер или имя)
export function matchPattern(pattern, text) {
  const result = text.match(pattern);
  return {
    hasMatch: result !== null,
    captured(key = 0) {
      if (result === null) return "";
      const value = typeof key === "string" ? result.groups?.[key] : result[key];
      return value ?? "";
    },
  };
}

export function parseDate(text) {
  const match = matchPattern(datePattern, text);
  if (!match.hasMatch) return { ok: false, error: "Ожидался формат ДД/ММ/ГГГГ." };
  const date = match.captured("date");
  const month = match.captured("month");
  const year = match.captured("year");

  const check = new Date(Number(year), Number(month) - 1, Number(date));
  if (check.getDate() !== Number(date) || check.getMonth() !== Number(month) - 1) {
    return { ok: false, error: "Такой даты не существует." };
  }
  return { ok: true, date, month, year };
}

export function createRegex(source, flags = "") {
  try {
    return { ok: true, regex: new RegExp(source, flags) };
  } catch (error) {
    return { ok: false, error: `Ошибка в шаблоне: ${error.message}` };
  }
}

// Все совпадения с группами — для тестера шаблонов
export function findAll(source, flags, text) {
  if (source === "") return { ok: false, error: "Введите шаблон." };
  const created = createRegex(source, flags.includes("g") ? flags : `${flags}g`);
  if (!created.ok) return created;
  const matches = [...text.matchAll(created.regex)].map((match) => ({
    index: match.index,
    value: match[0],
    groups: match.slice(1),
    named: { ...(match.groups ?? {}) },
  }));
  return { ok: true, matches };
}
