import { findAll, containsIp, findIp, isValidIp, hasDomain, parseDate } from "./regex-tools.js";

const presets = {
  ip: { pattern: "[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}", text: "Эта строка содержит ip-адрес 123.222.63.1" },
  domain: { pattern: "(\\.com|\\.ru)$", text: "www.bhv.ru" },
  word: { pattern: "\\d\\d \\w+", text: "abc123 def" },
  date: { pattern: "^(?<date>\\d\\d)/(?<month>\\d\\d)/(?<year>\\d\\d\\d\\d)$", text: "08/12/1985" },
};

const patternInput = document.querySelector("#pattern");
const flagsInput = document.querySelector("#flags");
const textInput = document.querySelector("#text");
const message = document.querySelector("#tester-message");
const resultBody = document.querySelector("#matches tbody");

function renderMatches() {
  const result = findAll(patternInput.value, flagsInput.value, textInput.value);
  resultBody.replaceChildren();
  if (!result.ok) {
    message.textContent = result.error;
    message.classList.add("is-error");
    return;
  }
  message.classList.remove("is-error");
  message.textContent = `Совпадений: ${result.matches.length}`;
  for (const match of result.matches) {
    const row = document.createElement("tr");
    const named = Object.entries(match.named).map(([name, value]) => `${name}=${value}`);
    for (const cell of [match.index, match.value, match.groups.join(", "), named.join(", ")]) {
      const td = document.createElement("td");
      td.textContent = cell;
      row.append(td);
    }
    resultBody.append(row);
  }
}

document.querySelector("#tester-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderMatches();
});

document.querySelector("#presets").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-preset]");
  if (!button) return;
  const preset = presets[button.dataset.preset];
  patternInput.value = preset.pattern;
  textInput.value = preset.text;
  renderMatches();
});

document.querySelector("#check-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const value = document.querySelector("#check-value").value;
  const date = parseDate(value.trim());
  document.querySelector("#check-output").textContent = [
    `Содержит IP-адрес: ${containsIp(value) ? `да (${findIp(value)})` : "нет"}`,
    `Корректный IP-адрес целиком: ${isValidIp(value.trim()) ? "да" : "нет"}`,
    `Домен .com или .ru: ${hasDomain(value.trim()) ? "да" : "нет"}`,
    `Дата: ${date.ok ? `день ${date.date}, месяц ${date.month}, год ${date.year}` : date.error}`,
  ].join("\n");
});

renderMatches();
