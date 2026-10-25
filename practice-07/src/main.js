import { readRecord, textStats } from "./text-stream.js";

const editor = document.querySelector("#editor");
const fileInput = document.querySelector("#file-input");
const fileNameInput = document.querySelector("#file-name");
const status = document.querySelector("#status");
const output = document.querySelector("#output");
let modified = false;

function setStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle("is-error", isError);
}

function setModified(value) {
  modified = value;
  document.title = `${modified ? "* " : ""}ПР7 — текстовые файлы`;
}

editor.addEventListener("input", () => setModified(true));

// Аналог QFileDialog::getOpenFileName: если файл не выбран, ничего не меняется
document.querySelector("#open-button").addEventListener("click", () => {
  if (modified && !confirm("Текст изменён. Открыть другой файл без сохранения?")) return;
  fileInput.click();
});

fileInput.addEventListener("change", async () => {
  const [file] = fileInput.files;
  fileInput.value = "";
  if (!file) return;
  try {
    editor.value = await file.text();
    fileNameInput.value = file.name;
    setModified(false);
    setStatus(`Открыт файл ${file.name}`);
  } catch (error) {
    setStatus(`Ошибка чтения: ${error.message}`, true);
  }
});

// Аналог QFileDialog::getSaveFileName: пустое имя означает отмену
document.querySelector("#save-button").addEventListener("click", () => {
  const name = fileNameInput.value.trim();
  if (name === "") {
    setStatus("Сохранение отменено: не задано имя файла.", true);
    return;
  }
  const blob = new Blob([editor.value], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name.endsWith(".txt") ? name : `${name}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  setModified(false);
  setStatus(`Файл ${link.download} сохранён`);
});

document.querySelector("#stats-button").addEventListener("click", () => {
  const stats = textStats(editor.value);
  output.textContent = [
    `Символов: ${stats.characters}`,
    `Строк: ${stats.lines}`,
    `Непустых строк: ${stats.nonEmptyLines}`,
    `Слов: ${stats.words}`,
  ].join("\n");
});

document.querySelector("#read-button").addEventListener("click", () => {
  const record = readRecord(editor.value);
  output.textContent = record.ok
    ? `h = "${record.h}"\nw = "${record.w}"\nv1 = ${record.v1}\nd1 = ${record.d1}`
    : record.error;
});

window.addEventListener("beforeunload", (event) => {
  if (modified) event.preventDefault();
});
