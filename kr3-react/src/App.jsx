import React, { useState } from 'react';
import TaskFilters from './components/TaskFilters.jsx';
import TaskList from './components/TaskList.jsx';
import { useTaskData } from './hooks/useTaskData.js';
import { taskClient } from './api/task-client.js';

export default function App() {
  const { tasks, setTasks, isLoading, error } = useTaskData();
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const createdTask = await taskClient.createTask({ title });
      setTasks((currentTasks) => [...currentTasks, createdTask]);
      setTitle('');
    } catch (requestError) {
      setFormError(requestError.errors?.title ?? requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <p className="course">Контрольная работа №3 · React и Node.js</p>
        <h1>Список задач</h1>
      </header>

      <section className="panel" aria-labelledby="tasks-heading">
        <div className="section-header">
          <h2 id="tasks-heading">Мои задачи</h2>
          <span className="count" aria-live="polite">
            {filteredTasks.length} из {tasks.length}
          </span>
        </div>

        <TaskFilters value={filter} onChange={setFilter} />
        {isLoading && <p role="status">Загрузка задач…</p>}
        {error && <p role="alert" className="error">{error}</p>}
        {!isLoading && !error && <TaskList tasks={filteredTasks} />}
      </section>

      <section className="panel" aria-labelledby="add-heading">
        <h2 id="add-heading">Добавить задачу</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="task-title">Название</label>
          <div className="form-row">
            <input
              id="task-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Что нужно сделать?"
              required
              maxLength={100}
            />
            <button className="submit" disabled={isSaving || isLoading}>
              {isSaving ? 'Сохранение…' : 'Добавить'}
            </button>
          </div>
          {formError && <p role="alert" className="error">{formError}</p>}
        </form>
      </section>
    </main>
  );
}
