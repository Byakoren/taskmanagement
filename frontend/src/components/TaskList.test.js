import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskList from './TaskList';

vi.mock('./TaskCard', () => ({
  default: ({ task }) => <div data-testid="task-card">{task.title}</div>
}));

describe('TaskList - Unit', () => {
  test('renders columns and task counts by status', () => {
    const tasks = [
      { id: '1', title: 'Todo 1', status: 'todo' },
      { id: '2', title: 'In Progress 1', status: 'progress' },
      { id: '3', title: 'Done 1', status: 'done' },
      { id: '4', title: 'Done 2', status: 'done' }
    ];

    render(<TaskList tasks={tasks} onEditTask={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'À faire' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'En cours' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Terminé' })).toBeInTheDocument();

    const counts = screen.getAllByText(/^[0-9]+$/);
    expect(counts.map((el) => el.textContent)).toEqual(['1', '1', '2']);

    expect(screen.getAllByTestId('task-card')).toHaveLength(4);
  });

  test('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} onEditTask={vi.fn()} />);

    expect(screen.getByText('Aucune tâche à faire')).toBeInTheDocument();
    expect(screen.getByText('Aucune tâche en cours')).toBeInTheDocument();
    expect(screen.getByText('Aucune tâche terminé')).toBeInTheDocument();
  });
});
