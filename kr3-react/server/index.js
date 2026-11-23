import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HttpError, sendJson } from './http.js';
import { routeApi } from './routes.js';
import { createTaskService } from './task-service.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultStaticRoot = path.join(projectRoot, 'dist');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

async function serveStatic(response, url, staticRoot) {
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  const requestedFile = path.resolve(staticRoot, relativePath);

  if (!requestedFile.startsWith(staticRoot + path.sep)) {
    throw new HttpError(403, 'Доступ запрещён.');
  }

  try {
    const content = await readFile(requestedFile);
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(requestedFile)] ?? 'application/octet-stream',
    });
    response.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new HttpError(404, 'Файл не найден. Перед запуском выполните npm run build.');
    }
    throw error;
  }
}

export function createAppServer({ taskService = createTaskService(), staticRoot = defaultStaticRoot } = {}) {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1');

      if (url.pathname.startsWith('/api/')) {
        await routeApi(request, response, url, taskService);
        return;
      }

      if (request.method !== 'GET') {
        throw new HttpError(405, 'Метод не поддерживается.');
      }
      await serveStatic(response, url, staticRoot);
    } catch (error) {
      if (error instanceof URIError) {
        sendJson(response, 400, { message: 'Некорректный адрес запроса.' });
      } else if (error instanceof HttpError) {
        sendJson(response, error.status, { message: error.message, errors: error.errors });
      } else {
        console.error(error);
        sendJson(response, 500, { message: 'Внутренняя ошибка сервера.' });
      }
    }
  });
}

const isEntryPoint = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntryPoint) {
  const port = Number(process.env.PORT ?? 5505);
  const server = createAppServer();
  server.listen(port, '127.0.0.1', () => {
    console.log(`Приложение и API запущены: http://localhost:${port}`);
  });
  server.on('error', (error) => {
    console.error(`Не удалось запустить сервер: ${error.message}`);
    process.exitCode = 1;
  });
}
