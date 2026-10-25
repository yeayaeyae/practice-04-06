// Двоичный поток в формате QDataStream: порядок байтов big-endian,
// строка — длина в байтах (uint32) и символы UTF-16, int — 4 байта, double — 8 байт.
const NULL_STRING = 0xffffffff;

export class BinaryWriter {
  #chunks = [];

  #push(size, write) {
    const view = new DataView(new ArrayBuffer(size));
    write(view);
    this.#chunks.push(new Uint8Array(view.buffer));
    return this;
  }

  writeUint32(value) {
    return this.#push(4, (view) => view.setUint32(0, value, false));
  }

  writeInt32(value) {
    if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) {
      throw new RangeError("Значение не помещается в int32.");
    }
    return this.#push(4, (view) => view.setInt32(0, value, false));
  }

  writeDouble(value) {
    return this.#push(8, (view) => view.setFloat64(0, value, false));
  }

  writeString(text) {
    if (text === null) return this.writeUint32(NULL_STRING);
    this.writeUint32(text.length * 2);
    return this.#push(text.length * 2, (view) => {
      for (let i = 0; i < text.length; i += 1) view.setUint16(i * 2, text.charCodeAt(i), false);
    });
  }

  toBytes() {
    const size = this.#chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of this.#chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    return bytes;
  }
}

export class BinaryReader {
  #view;
  #offset = 0;

  constructor(bytes) {
    this.#view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  #take(size) {
    if (this.#offset + size > this.#view.byteLength) {
      throw new RangeError("Попытка чтения за концом данных.");
    }
    const start = this.#offset;
    this.#offset += size;
    return start;
  }

  readUint32() {
    return this.#view.getUint32(this.#take(4), false);
  }

  readInt32() {
    return this.#view.getInt32(this.#take(4), false);
  }

  readDouble() {
    return this.#view.getFloat64(this.#take(8), false);
  }

  readString() {
    const size = this.readUint32();
    if (size === NULL_STRING) return null;
    if (size % 2 !== 0) throw new RangeError("Повреждённая строка: нечётная длина.");
    const start = this.#take(size);
    let text = "";
    for (let i = 0; i < size; i += 2) text += String.fromCharCode(this.#view.getUint16(start + i, false));
    return text;
  }

  atEnd() {
    return this.#offset >= this.#view.byteLength;
  }
}

// Запись из методички: ds << str << v1 << d1
export function encodeRecord({ str, v1, d1 }) {
  return new BinaryWriter().writeString(str).writeInt32(v1).writeDouble(d1).toBytes();
}

// Чтение в том же порядке: ds >> str >> v1 >> d1
export function decodeRecord(bytes) {
  try {
    const reader = new BinaryReader(bytes);
    const record = { str: reader.readString(), v1: reader.readInt32(), d1: reader.readDouble() };
    return { ok: true, record };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function toHex(bytes, perLine = 16) {
  const lines = [];
  for (let i = 0; i < bytes.length; i += perLine) {
    const part = [...bytes.slice(i, i + perLine)].map((byte) => byte.toString(16).padStart(2, "0"));
    lines.push(`${i.toString(16).padStart(8, "0")}  ${part.join(" ")}`);
  }
  return lines.join("\n");
}
