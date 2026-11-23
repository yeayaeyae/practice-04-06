import React from 'react';

export default function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Список задач пуст</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className="task">
          <span className="task-id">№{task.id}</span>
          <span className="task-title">{task.title}</span>
          <span className={task.completed ? 'status completed' : 'status'}>
            {task.completed ? 'Завершена' : 'В работе'}
          </span>
        </li>
      ))}
    </ul>
  );
}
