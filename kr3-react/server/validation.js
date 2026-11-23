export function validateTaskDraft(draft) {
  const errors = {};

  if (draft === null || typeof draft !== 'object' || Array.isArray(draft)) {
    return {
      ok: false,
      errors: { body: 'Тело запроса должно быть JSON-объектом.' },
    };
  }

  if (typeof draft.title !== 'string' || draft.title.trim().length === 0) {
    errors.title = 'Название должно быть непустой строкой.';
  } else if (draft.title.trim().length > 100) {
    errors.title = 'Название должно содержать не более 100 символов.';
  }

  if (draft.completed !== undefined && typeof draft.completed !== 'boolean') {
    errors.completed = 'Поле completed должно быть логическим значением.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      title: draft.title.trim(),
      completed: draft.completed ?? false,
    },
  };
}
