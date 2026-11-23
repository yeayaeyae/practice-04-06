export const initialTasks = [
  { id: 4, title: 'Подготовить отчёт по React', completed: false },
  { id: 7, title: 'Разобрать компонентный подход', completed: true },
  { id: 9, title: 'Подключить приложение к API', completed: true },
  { id: 13, title: 'Проверить серверную валидацию', completed: false },
  { id: 34, title: 'Изучить асинхронные хуки', completed: false },
];

export function createTaskService(seed = initialTasks) {
  const tasks = seed.map((task) => ({ ...task }));
  let nextId = Math.max(0, ...tasks.map((task) => task.id)) + 1;

  return {
    listTasks({ completed } = {}) {
      const selectedTasks = completed === undefined
        ? tasks
        : tasks.filter((task) => task.completed === completed);

      return selectedTasks.map((task) => ({ ...task }));
    },

    addTask(value) {
      const task = { id: nextId, ...value };
      nextId += 1;
      tasks.push(task);
      return { ...task };
    },
  };
}
