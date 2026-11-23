import React from 'react';

const filters = [
  { value: 'all', label: 'Все' },
  { value: 'active', label: 'В работе' },
  { value: 'completed', label: 'Завершенные' },
];

export default function TaskFilters({ value, onChange }) {
  return (
    <div className="task-filters" role="group" aria-label="Фильтр задач">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={value === filter.value ? 'filter active' : 'filter'}
          aria-pressed={value === filter.value}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
