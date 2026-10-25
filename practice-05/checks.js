import assert from "node:assert/strict";
import {
  isNullString,
  isEmptyString,
  compareStrings,
  equalsIgnoreCase,
  concatStrings,
  replaceText,
  changeCase,
  splitWords,
  joinWords,
  checkEdges,
  arg,
  formatArgs,
  describeString,
} from "./src/string-tools.js";

let passed = 0;
function check(name, fn) {
  fn();
  console.log(`OK: ${name}`);
  passed += 1;
}

check("сравнение зависит от регистра", () => {
  assert.equal(compareStrings("Qt", "Qt"), 0);
  assert.notEqual(compareStrings("Qt", "QT"), 0);
  assert.equal(equalsIgnoreCase("Qt", "QT"), true);
});
check("порядок строк", () => {
  assert.equal(compareStrings("abc", "abd"), -1);
  assert.equal(compareStrings("b", "a"), 1);
});
check("пустая и нулевая строка", () => {
  assert.equal(isEmptyString(""), true);
  assert.equal("".length === 0, true);
  assert.equal(isNullString(""), false);
  assert.equal(isNullString(null), true);
  assert.equal(isEmptyString(null), true);
});
check("объединение строк", () => {
  assert.equal(concatStrings("Библиотека", "Qt"), "БиблиотекаQt");
  assert.equal(concatStrings("Библиотека", "Qt", " "), "Библиотека Qt");
});
check("замена подстроки", () => {
  assert.equal(replaceText("Программирование", "ирование", "а"), "Программа");
  assert.equal(replaceText("a-b-c", "-", "+"), "a+b+c");
  assert.equal(replaceText("abc", "", "x"), "abc");
});
check("смена регистра с кириллицей", () => {
  assert.equal(changeCase("ПрОгРаМмА", "lower"), "программа");
  assert.equal(changeCase("ПрОгРаМмА", "upper"), "ПРОГРАММА");
});
check("split сохраняет пустые части", () => {
  assert.deepEqual(splitWords("Библиотека Qt"), ["Библиотека", "Qt"]);
  assert.deepEqual(splitWords("Библиотека Qt "), ["Библиотека", "Qt", ""]);
});
check("split с пропуском пустых частей", () => {
  assert.deepEqual(splitWords("Библиотека Qt ", true), ["Библиотека", "Qt"]);
  assert.deepEqual(splitWords("  a   b  ", true), ["a", "b"]);
});
check("join", () => {
  assert.equal(joinWords(["Библиотека", "Qt"]), "Библиотека Qt");
  assert.equal(joinWords(["a", "b", "c"], ", "), "a, b, c");
});
check("startsWith и endsWith", () => {
  assert.deepEqual(checkEdges("Библиотека Qt", "Библ", "Qt"), { startsWith: true, endsWith: true });
  assert.deepEqual(checkEdges("Библиотека Qt", "Qt", "Библ"), { startsWith: false, endsWith: false });
});
check("arg заменяет наименьший номер во всех местах", () => {
  assert.equal(arg("%2 и %1, снова %1", "A"), "%2 и A, снова A");
});
check("форматирование даты из методички", () => {
  assert.equal(
    formatArgs("Дата: %1.%2.%3. %1 %4 шёл дождь.", 17, "09", 2024, "сентября"),
    "Дата: 17.09.2024. 17 сентября шёл дождь."
  );
});
check("arg без маркеров не меняет строку", () => {
  assert.equal(arg("без маркеров", 1), "без маркеров");
});
check("сводка по строке", () => {
  assert.deepEqual(describeString("Библиотека Qt "), {
    length: 14,
    isEmpty: false,
    words: 2,
    lower: "библиотека qt ",
    upper: "БИБЛИОТЕКА QT ",
  });
});

console.log(`Проверок пройдено: ${passed}.`);
