const numberPattern = /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/;
const formats = new Set(["g", "G", "e", "E", "f"]);

export function parseReal(text) {
  if (typeof text !== "string") return { ok: false, error: "Значение должно быть строкой." };
  const normalized = text.trim().replace(",", ".");
  if (normalized === "") return { ok: false, error: "Введите число." };
  if (!numberPattern.test(normalized)) {
    return { ok: false, error: `«${text.trim()}» не является числом.` };
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) return { ok: false, error: "Число выходит за пределы double." };
  return { ok: true, value };
}

// Аналог проверок qIsInf() и qIsNaN()
export function checkResult(value) {
  if (Number.isNaN(value)) return { ok: false, error: "Результат не является числом (NaN)." };
  if (!Number.isFinite(value)) return { ok: false, error: "Результат — бесконечность (infinity)." };
  return { ok: true, value };
}

export function calculate(aText, bText, operation) {
  const a = parseReal(aText);
  if (!a.ok) return { ok: false, error: `Первое число: ${a.error}` };
  const b = parseReal(bText);
  if (!b.ok) return { ok: false, error: `Второе число: ${b.error}` };

  const operations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
  };
  if (!operations[operation]) return { ok: false, error: "Неизвестная операция." };
  return checkResult(operations[operation](a.value, b.value));
}

function padExponent(text) {
  return text.replace(/e([+-])(\d)$/, "e$10$2");
}

function stripZeros(text) {
  return text.includes(".") ? text.replace(/0+$/, "").replace(/\.$/, "") : text;
}

function formatGeneral(value, precision) {
  if (value === 0) return "0";
  const digits = Math.max(precision, 1);
  const exponent = Number(value.toExponential(digits - 1).split("e")[1]);
  if (exponent < -4 || exponent >= digits) {
    const [mantissa, power] = value.toExponential(digits - 1).split("e");
    return padExponent(`${stripZeros(mantissa)}e${power}`);
  }
  return stripZeros(value.toFixed(digits - 1 - exponent));
}

// Аналог QString::number(value, format, precision)
export function formatNumber(value, format = "g", precision = 6) {
  if (!formats.has(format)) throw new Error(`Неизвестный формат: ${format}`);
  if (!Number.isInteger(precision) || precision < 0 || precision > 100) {
    throw new Error("Точность должна быть целым числом от 0 до 100.");
  }
  if (Number.isNaN(value)) return "nan";
  if (!Number.isFinite(value)) return value > 0 ? "inf" : "-inf";

  let result;
  if (format === "f") result = value.toFixed(precision);
  else if (format === "e" || format === "E") result = padExponent(value.toExponential(precision));
  else result = formatGeneral(value, precision);
  return format === format.toUpperCase() && format !== "f" ? result.toUpperCase() : result;
}

export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

export function roundTo(value, digits) {
  const factor = 10 ** digits;
  const result = Math.round(value * factor) / factor;
  return result === 0 ? 0 : result;
}

export function sine(angle, unit = "deg", digits = 10) {
  const radians = unit === "deg" ? toRadians(angle) : angle;
  return roundTo(Math.sin(radians), digits);
}

export function cosine(angle, unit = "deg", digits = 10) {
  const radians = unit === "deg" ? toRadians(angle) : angle;
  return roundTo(Math.cos(radians), digits);
}

export function arcsine(value, unit = "deg", digits = 10) {
  if (value < -1 || value > 1) {
    return { ok: false, error: "Аргумент arcsin должен быть в диапазоне [-1; 1]." };
  }
  const radians = Math.asin(value);
  return { ok: true, value: roundTo(unit === "deg" ? toDegrees(radians) : radians, digits) };
}
