import { HttpError, readJson, sendJson } from './http.js';
import { validateTaskDraft } from './validation.js';

export async function routeApi(request, response, url, taskService) {
  if (url.pathname !== '/api/tasks') {
    sendJson(response, 404, { message: 'Маршрут API не найден.' });
    return;
  }

  if (request.method === 'GET') {
    const completedParameter = url.searchParams.get('completed');
    if (completedParameter !== null
      && completedParameter !== 'true'
      && completedParameter !== 'false') {
      throw new HttpError(400, 'Некорректный фильтр.', {
        completed: 'Допустимы значения true и false.',
      });
    }

    const completed = completedParameter === null
      ? undefined
      : completedParameter === 'true';
    const tasks = taskService.listTasks({ completed });
    sendJson(response, 200, tasks);
    return;
  }

  if (request.method === 'POST') {
    const draft = await readJson(request);
    const validation = validateTaskDraft(draft);

    if (!validation.ok) {
      sendJson(response, 400, {
        message: 'Задача не создана. Проверьте введённые данные.',
        errors: validation.errors,
      });
      return;
    }

    const task = taskService.addTask(validation.value);
    response.setHeader('Location', `/api/tasks/${task.id}`);
    sendJson(response, 201, task);
    return;
  }

  response.setHeader('Allow', 'GET, POST');
  sendJson(response, 405, { message: 'Метод не поддерживается.' });
}
