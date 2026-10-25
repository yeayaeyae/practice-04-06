import { encodeRecord, decodeRecord, toHex } from "./binary-stream.js";

const form = document.querySelector("#record-form");
const fileInput = document.querySelector("#file-input");
const hexOutput = document.querySelector("#hex");
const status = document.querySelector("#status");

function setStatus(text, isError = false) {
  status.textContent = text;
  status.classList.toggle("is-error", isError);
}

function readForm() {
  const data = new FormData(form);
  const v1 = Number(data.get("v1"));
  const d1 = Number(data.get("d1"));
  if (!/^[+-]?\d+$/.test(data.get("v1").trim())) throw new Error("v1 должно быть целым числом.");
  if (data.get("d1").trim() === "" || Number.isNaN(d1)) throw new Error("d1 должно быть числом.");
  return { str: data.get("str"), v1, d1 };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let bytes;
  try {
    bytes = encodeRecord(readForm());
  } catch (error) {
    setStatus(error.message, true);
    return;
  }
  hexOutput.textContent = toHex(bytes);
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([bytes], { type: "application/octet-stream" }));
  link.download = "data.bin";
  link.click();
  URL.revokeObjectURL(link.href);
  setStatus(`Записано ${bytes.length} байт в data.bin`);
});

document.querySelector("#open-button").addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async () => {
  const [file] = fileInput.files;
  fileInput.value = "";
  if (!file) return;
  const bytes = new Uint8Array(await file.arrayBuffer());
  hexOutput.textContent = toHex(bytes);
  const result = decodeRecord(bytes);
  if (!result.ok) {
    setStatus(`Ошибка чтения ${file.name}: ${result.error}`, true);
    return;
  }
  form.elements.str.value = result.record.str ?? "";
  form.elements.v1.value = result.record.v1;
  form.elements.d1.value = result.record.d1;
  setStatus(`Прочитан файл ${file.name}`);
});
