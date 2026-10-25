import assert from "node:assert/strict";
import {
  containsIp,
  findIp,
  isValidIp,
  hasDomain,
  matchPattern,
  parseDate,
  findAll,
} from "./src/regex-tools.js";

let passed = 0;
function check(name, fn) {
  fn();
  console.log(`OK: ${name}`);
  passed += 1;
}

check("строка содержит IP-адрес", () => {
  assert.equal(containsIp("Эта строка содержит ip-адрес 123.222.63.1"), true);
  assert.equal(findIp("Эта строка содержит ip-адрес 123.222.63.1"), "123.222.63.1");
});
check("экранированная точка не принимает 1z2y3x4", () => {
  assert.equal(containsIp("1z2y3x4"), false);
  assert.equal(/[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/.test("1z2y3x4"), true);
});
check("строгая проверка диапазона 0–255", () => {
  assert.equal(isValidIp("192.168.0.1"), true);
  assert.equal(isValidIp("256.1.1.1"), false);
  assert.equal(isValidIp("1.2.3"), false);
});
check("ветвление (.com|.ru)", () => {
  assert.equal(hasDomain("www.bhv.ru"), true);
  assert.equal(hasDomain("example.com"), true);
  assert.equal(hasDomain("www.bhv.de"), false);
});
check("hasMatch и captured(0)", () => {
  const match = matchPattern(/\d\d \w+/, "abc123 def");
  assert.equal(match.hasMatch, true);
  assert.equal(match.captured(0), "23 def");
});
check("нумерованные группы начинаются с 1", () => {
  const match = matchPattern(/^(\d\d)\/(\d\d)\/(\d\d\d\d)$/, "08/12/1985");
  assert.equal(match.captured(1), "08");
  assert.equal(match.captured(2), "12");
  assert.equal(match.captured(3), "1985");
});
check("именованные группы", () => {
  assert.deepEqual(parseDate("08/12/1985"), { ok: true, date: "08", month: "12", year: "1985" });
});
check("неверный формат и несуществующая дата", () => {
  assert.equal(parseDate("8/12/1985").ok, false);
  assert.equal(parseDate("31/02/2024").ok, false);
});
check("нет совпадения — пустая строка", () => {
  const match = matchPattern(/\d+/, "без цифр");
  assert.equal(match.hasMatch, false);
  assert.equal(match.captured(0), "");
});
check("поиск всех совпадений", () => {
  const result = findAll("\\d+", "", "a1 b22 c333");
  assert.deepEqual(result.matches.map((m) => m.value), ["1", "22", "333"]);
  assert.deepEqual(result.matches.map((m) => m.index), [1, 4, 8]);
});
check("ошибка в шаблоне обрабатывается", () => {
  assert.equal(findAll("(abc", "", "abc").ok, false);
  assert.equal(findAll("", "", "abc").ok, false);
});
check("квантификаторы из таблицы", () => {
  assert.equal(/^A{3}b$/.test("AAAb"), true);
  assert.equal(/^a{2,3}b$/.test("ab"), false);
  assert.equal(/^A?b$/.test("b"), true);
  assert.equal(/^[^def]+$/.test("abc"), true);
});

console.log(`Проверок пройдено: ${passed}.`);
