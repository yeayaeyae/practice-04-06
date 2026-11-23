async function requestJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message ?? `HTTP ${response.status}`);
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const taskClient = {
  getTasks({ signal } = {}) {
    return requestJson('/api/tasks', { signal });
  },

  createTask(draft) {
    return requestJson('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(draft),
    });
  },
};
