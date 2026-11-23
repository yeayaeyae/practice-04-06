import { useEffect, useState } from 'react';
import { taskClient } from '../api/task-client.js';

export function useTaskData() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      setIsLoading(true);
      setError(null);

      try {
        const receivedTasks = await taskClient.getTasks({
          signal: controller.signal,
        });
        setTasks(receivedTasks);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // Проверка КР3: сначала true 0, после успешной загрузки false N.
    console.log(isLoading, tasks.length);
  }, [isLoading, tasks.length]);

  return { tasks, setTasks, isLoading, error };
}
