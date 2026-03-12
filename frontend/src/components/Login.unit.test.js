import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Login - Unit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submits credentials and redirects on success', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message on failed login', async () => {
    mockLogin.mockResolvedValueOnce({ success: false, error: 'Identifiants invalides' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await userEvent.type(screen.getByLabelText(/mot de passe/i), 'bad-password');
    await userEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
