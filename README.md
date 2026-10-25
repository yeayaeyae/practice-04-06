# Технологии индустриального программирования

Учебный репозиторий практических работ №4–8 по JavaScript.

## Автор

**Студент:** Кигози Елисей Маликович
**Группа:** ЭФБО-13-25
**Вариант:** 1

## Практические работы

* [Практическая работа №4. Вещественные числа. Бесконечность и не число](./practice-04/README.md)
* [Практическая работа №5. Функции работы со строками](./practice-05/README.md)
* [Практическая работа №6. Регулярные выражения](./practice-06/README.md)
* [Практическая работа №7. Текстовые потоки и файлы](./practice-07/README.md)
* [Практическая работа №8. Двоичные потоки](./practice-08/README.md)

## Структура репозитория

```text
practice-04-08/
├── practice-04/
│   ├── README.md
│   ├── checks.js
│   ├── index.html
│   ├── package.json
│   └── src/
├── practice-05/
│   ├── README.md
│   ├── checks.js
│   ├── index.html
│   ├── package.json
│   └── src/
├── practice-06/
│   ├── README.md
│   ├── checks.js
│   ├── index.html
│   ├── package.json
│   └── src/
├── practice-07/
│   ├── README.md
│   ├── checks.js
│   ├── demo.js
│   ├── index.html
│   ├── package.json
│   └── src/
├── practice-08/
│   ├── README.md
│   ├── checks.js
│   ├── demo.js
│   ├── index.html
│   ├── package.json
│   └── src/
├── .gitignore
└── README.md
```

## Проверка

Необходимо установить Node.js.

Автоматические проверки из корня репозитория:

```powershell
node practice-04/checks.js
node practice-05/checks.js
node practice-06/checks.js
node practice-07/checks.js
node practice-08/checks.js
```

Также для каждой работы доступен npm-скрипт, например:

```powershell
npm.cmd --prefix practice-04 run check
```

Демонстрация работы с файлами:

```powershell
node practice-07/demo.js
node practice-08/demo.js
```

Для браузерной части из корня репозитория:

```powershell
python -m http.server 5504
```

После запуска открыть:

```text
http://127.0.0.1:5504/practice-04/index.html
http://127.0.0.1:5504/practice-05/index.html
http://127.0.0.1:5504/practice-06/index.html
http://127.0.0.1:5504/practice-07/index.html
http://127.0.0.1:5504/practice-08/index.html
```

## Результат

В репозитории представлены пять практических работ по JavaScript:

* вещественные числа, бесконечность, NaN и тригонометрические функции;
* функции работы со строками и диалоговые сообщения;
* регулярные выражения;
* текстовые потоки и файлы;
* двоичные потоки и файлы.

Каждая практическая работа содержит исходный код, автоматические проверки, страницу с интерфейсом, собственный README с описанием выполненных заданий и инструкции по запуску.
