import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAppServer } from '../server/index.js';

async function withServer(run) {
  const server = createAppServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = `http://127.0.0.1:${server.address().port}`;

  try {
    await run(address);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  }
}

test('GET completed=true возвращает массив только выполненных задач', async () => {
  await withServer(async (address) => {
    const response = await fetch(`${address}/api/tasks?completed=true`);
    const tasks = await response.json();
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(tasks));
    assert.deepEqual(tasks.map((task) => task.id), [7, 9]);
    assert.ok(tasks.every((task) => task.completed === true));

    const activeResponse = await fetch(`${address}/api/tasks?completed=false`);
    assert.ok((await activeResponse.json()).every((task) => task.completed === false));
  });
});

test('POST отклоняет отсутствующее, пустое и нестроковое title без изменения списка', async () => {
  await withServer(async (address) => {
    const before = await (await fetch(`${address}/api/tasks`)).json();

    for (const draft of [{}, { title: '   ' }, { title: 42 }, { title: null }]) {
      const response = await fetch(`${address}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const error = await response.json();
      assert.equal(response.status, 400);
      assert.equal(typeof error.errors.title, 'string');
      assert.ok(error.errors.title.length > 0);
    }

    const afterResponse = await fetch(`${address}/api/tasks`);
    assert.equal(afterResponse.status, 200);
    assert.deepEqual(await afterResponse.json(), before);
  });
});

test('POST сохраняет нормализованное название и возвращает HTTP 201', async () => {
  await withServer(async (address) => {
    const response = await fetch(`${address}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '  Изучить React  ' }),
    });
    const created = await response.json();
    assert.equal(response.status, 201);
    assert.equal(created.title, 'Изучить React');
    assert.equal(created.completed, false);

    const allTasks = await (await fetch(`${address}/api/tasks`)).json();
    assert.deepEqual(allTasks.find((task) => task.id === created.id), created);
  });
});

test('сервер отвечает JSON 400 на повреждённый JSON и некорректный фильтр', async () => {
  await withServer(async (address) => {
    const badJson = await fetch(`${address}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"title":',
    });
    assert.equal(badJson.status, 400);
    assert.equal(typeof (await badJson.json()).errors.body, 'string');

    const badFilter = await fetch(`${address}/api/tasks?completed=yes`);
    assert.equal(badFilter.status, 400);
    assert.equal(typeof (await badFilter.json()).errors.completed, 'string');

    assert.equal((await fetch(`${address}/api/tasks`)).status, 200);
  });
});
