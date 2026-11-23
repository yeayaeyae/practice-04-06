export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data, null, 2));
}

export async function readJson(request) {
  const contentType = request.headers['content-type']?.split(';')[0].trim();
  if (contentType !== 'application/json') {
    throw new HttpError(415, 'Используйте Content-Type: application/json.');
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1024 * 1024) {
      throw new HttpError(413, 'Слишком большой запрос.');
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'Некорректный JSON.', {
      body: 'Проверьте синтаксис JSON в теле запроса.',
    });
  }
}
