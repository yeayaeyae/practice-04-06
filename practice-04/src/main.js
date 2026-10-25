import { calculate, formatNumber, parseReal, sine, cosine, arcsine } from "./real-numbers.js";

const calcForm = document.querySelector("#calc-form");
const calcResult = document.querySelector("#calc-result");
const trigForm = document.querySelector("#trig-form");
const trigResult = document.querySelector("#trig-result");

function showResult(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle("is-error", isError);
}

calcForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(calcForm);
  const result = calculate(data.get("value1"), data.get("value2"), data.get("operation"));
  if (!result.ok) {
    showResult(calcResult, result.error, true);
    return;
  }
  const precision = Number(data.get("precision"));
  try {
    showResult(calcResult, `Результат: ${formatNumber(result.value, data.get("format"), precision)}`);
  } catch (error) {
    showResult(calcResult, error.message, true);
  }
});

trigForm.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-function]");
  if (!button) return;
  const angle = parseReal(document.querySelector("#angle").value);
  if (!angle.ok) {
    showResult(trigResult, angle.error, true);
    return;
  }
  // Аналог radioButton_grad->isChecked()
  const unit = document.querySelector("#radioButton_grad").checked ? "deg" : "rad";
  const unitName = unit === "deg" ? "°" : " рад";

  if (button.dataset.function === "sin") {
    showResult(trigResult, `sin(${angle.value}${unitName}) = ${sine(angle.value, unit)}`);
  } else if (button.dataset.function === "cos") {
    showResult(trigResult, `cos(${angle.value}${unitName}) = ${cosine(angle.value, unit)}`);
  } else {
    const result = arcsine(angle.value, unit);
    if (!result.ok) {
      showResult(trigResult, result.error, true);
      return;
    }
    showResult(trigResult, `arcsin(${angle.value}) = ${result.value}${unitName}`);
  }
});
