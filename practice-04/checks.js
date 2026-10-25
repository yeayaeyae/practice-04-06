import assert from "node:assert/strict";
import {
  parseReal,
  checkResult,
  calculate,
  formatNumber,
  sine,
  cosine,
  arcsine,
} from "./src/real-numbers.js";

let passed = 0;
function check(name, fn) {
  fn();
  console.log(`OK: ${name}`);
  passed += 1;
}

check("разбор вещественного числа", () => {
  assert.deepEqual(parseReal("12.5"), { ok: true, value: 12.5 });
  assert.deepEqual(parseReal(" -0,75 "), { ok: true, value: -0.75 });
  assert.deepEqual(parseReal("1e3"), { ok: true, value: 1000 });
});
check("некорректный ввод не превращается в ноль", () => {
  assert.equal(parseReal("").ok, false);
  assert.equal(parseReal("12a").ok, false);
  assert.equal(parseReal("abc").ok, false);
});
check("число вне диапазона double отклоняется", () => {
  assert.equal(parseReal("1e309").ok, false);
});
check("сумма вещественных чисел", () => {
  assert.equal(calculate("2.5", "3.25", "+").value, 5.75);
});
check("формат g округляет до 6 значащих цифр", () => {
  assert.equal(formatNumber(0.1 + 0.2), "0.3");
  assert.equal(formatNumber(0.000001234567), "1.23457e-06");
  assert.equal(formatNumber(1234567), "1.23457e+06");
});
check("формат f с 10 знаками после запятой", () => {
  assert.equal(formatNumber(0.1 + 0.2, "f", 10), "0.3000000000");
  assert.equal(formatNumber(1 / 3, "f", 10), "0.3333333333");
});
check("форматы e, E и G", () => {
  assert.equal(formatNumber(12345.678, "e", 3), "1.235e+04");
  assert.equal(formatNumber(12345.678, "E", 3), "1.235E+04");
  assert.equal(formatNumber(0.00001, "G"), "1E-05");
});
check("переполнение даёт бесконечность", () => {
  const result = calculate("1.7e308", "1.7e308", "+");
  assert.equal(result.ok, false);
  assert.match(result.error, /бесконечность/);
});
check("деление на ноль даёт бесконечность", () => {
  assert.equal(calculate("1", "0", "/").ok, false);
});
check("бесконечность на ноль — не число (NaN)", () => {
  assert.match(checkResult(Infinity * 0).error, /NaN/);
  assert.match(calculate("0", "0", "/").error, /NaN/);
});
check("вывод inf и nan", () => {
  assert.equal(formatNumber(Infinity), "inf");
  assert.equal(formatNumber(-Infinity), "-inf");
  assert.equal(formatNumber(NaN), "nan");
});
check("синус в градусах", () => {
  assert.equal(sine(30), 0.5);
  assert.equal(sine(90), 1);
});
check("синус 180° после округления равен нулю", () => {
  assert.notEqual(Math.sin(Math.PI), 0);
  assert.equal(sine(180), 0);
  assert.equal(sine(360), 0);
});
check("синус в радианах", () => {
  assert.equal(sine(0.523599, "rad", 4), 0.5);
});
check("косинус", () => {
  assert.equal(cosine(60), 0.5);
  assert.equal(cosine(90), 0);
});
check("арксинус в градусах и радианах", () => {
  assert.deepEqual(arcsine(0.5), { ok: true, value: 30 });
  assert.deepEqual(arcsine(0.5, "rad", 6), { ok: true, value: 0.523599 });
});
check("арксинус вне [-1; 1] отклоняется", () => {
  assert.equal(arcsine(2).ok, false);
});

console.log(`Проверок пройдено: ${passed}.`);
