import {
  compareStrings,
  concatStrings,
  replaceText,
  changeCase,
  splitWords,
  joinWords,
  checkEdges,
  formatArgs,
  describeString,
} from "./string-tools.js";
import { showMessage } from "./message-box.js";

const output = document.querySelector("#output");
const field = (id) => document.querySelector(`#${id}`).value;

function show(lines) {
  output.textContent = lines.join("\n");
}

const actions = {
  describe() {
    const info = describeString(field("text1"));
    show([
      `Длина: ${info.length}`,
      `Пустая строка: ${info.isEmpty ? "да" : "нет"}`,
      `Слов: ${info.words}`,
      `Нижний регистр: ${info.lower}`,
      `Верхний регистр: ${info.upper}`,
    ]);
  },
  compare() {
    const result = compareStrings(field("text1"), field("text2"));
    const relation = result === 0 ? "==" : result < 0 ? "<" : ">";
    show([`«${field("text1")}» ${relation} «${field("text2")}»`]);
  },
  concat() {
    show([
      `Без разделителя: ${concatStrings(field("text1"), field("text2"))}`,
      `С пробелом: ${concatStrings(field("text1"), field("text2"), " ")}`,
    ]);
  },
  replace() {
    show([replaceText(field("text1"), field("from"), field("to"))]);
  },
  split() {
    const all = splitWords(field("text1"));
    const skip = splitWords(field("text1"), true);
    show([
      `split(" "): ${JSON.stringify(all)}`,
      `split(" ", SkipEmptyParts): ${JSON.stringify(skip)}`,
      `join("-"): ${joinWords(skip, "-")}`,
    ]);
  },
  edges() {
    const edges = checkEdges(field("text1"), field("prefix"), field("suffix"));
    show([
      `startsWith(«${field("prefix")}»): ${edges.startsWith}`,
      `endsWith(«${field("suffix")}»): ${edges.endsWith}`,
    ]);
  },
  format() {
    const values = field("args").split(";").map((value) => value.trim());
    show([formatArgs(field("template"), ...values)]);
  },
  upper() {
    show([changeCase(field("text1"), "upper")]);
  },
  async information() {
    await showMessage("information", `Длина строки: ${field("text1").length}`);
  },
  async warning() {
    await showMessage("warning", "Строка пуста!");
  },
  async critical() {
    const choice = await showMessage("critical", "Очистить поле?", ["yes", "no", "cancel"]);
    if (choice === "yes") document.querySelector("#text1").value = "";
    const names = { yes: "Да", no: "Нет", cancel: "Отмена" };
    show([`Выбрана кнопка: ${names[choice]}`]);
  },
};

document.querySelector("#actions").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (button) actions[button.dataset.action]();
});
