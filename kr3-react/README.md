# Контрольная работа 3

Учебное приложение по бланку КР3 «React-компоненты, интеграция с API и серверная разработка на Node.js».

Кигози Елисей Маликович, ЭФБО-13-25.

## Запуск

Нужен Node.js 22.12 или новее.

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd start
```

Откройте [http://localhost:5505](http://localhost:5505). Этот же сервер обслуживает интерфейс и `/api/tasks`.

Для разработки можно запустить второй терминал с `npm.cmd run dev`. Vite откроет интерфейс на порту 5173 и передаст запросы API серверу на 5505.

## Проверки контрольной работы

1. Выберите «Завершенные». Активная кнопка выделяется синим, список содержит задачи №7 и №9. `TaskList` выводит «Список задач пуст», если передан пустой массив.
2. Откройте DevTools → Console и обновите страницу. Хук `useTaskData` выводит реальные состояния `true 0` и затем `false 5`. Число может увеличиться после добавления задач. Успешные ответы и ошибки обрабатываются в этом же хуке.
3. Откройте `http://localhost:5505/api/tasks?completed=true`. Сервер возвращает HTTP 200 и JSON-массив выполненных задач.
4. Отправьте `POST /api/tasks` с `Content-Type: application/json` и телом `{"title":"   "}`. Ответ — HTTP 400 и объект `errors.title`. Следующий GET продолжает работать.

Пример запроса в PowerShell через curl.exe:

```powershell
curl.exe -i http://localhost:5505/api/tasks?completed=true
```

Для невалидного POST в PowerShell используйте файл, чтобы сохранить JSON-кавычки:

```powershell
'{"title":"   "}' | Set-Content -Encoding ascii invalid-task.json
curl.exe -i -X POST http://localhost:5505/api/tasks -H "Content-Type: application/json" --data-binary "@invalid-task.json"
```

## Проверки кода

```powershell
npm.cmd test
npm.cmd run build
```

Тесты запускают отдельные серверы на свободных портах и проверяют фильтрацию, валидацию, HTTP-статусы, сохранение нормализованного названия и работоспособность после ошибочного запроса.

## Структура

- `src/App.jsx` — состояние фильтра и клиентская фильтрация.
- `src/components/TaskList.jsx` — пустое состояние и `.map`.
- `src/components/TaskFilters.jsx` — переключение и активная кнопка.
- `src/hooks/useTaskData.js` — данные, загрузка, ошибка и диагностический вывод в консоль для КР3.
- `src/api/task-client.js` — HTTP-клиент.
- `server/routes.js` — GET/POST и HTTP-ответы.
- `server/task-service.js` — исходные задачи и серверная фильтрация.
- `server/validation.js` — проверка входящего объекта.
- `tests/api.test.js` — проверки запросов через настоящий HTTP-сервер.

Данные API хранятся в памяти. Перезапуск Node.js восстанавливает исходные пять задач. Клиентская фильтрация сохраняет весь загруженный массив и не отправляет дополнительные запросы.
