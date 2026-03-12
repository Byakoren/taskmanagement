import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
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

const renderLogin = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Login />
  </MemoryRouter>
);

describe('Login - Unit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('submits credentials and redirects on success', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ success: true });

    renderLogin();

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'password');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeEnabled();
    });
  });

  test('shows error message on failed login', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValueOnce({ success: false, error: 'Identifiants invalides' });

    renderLogin();

    await act(async () => {
      await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
      await user.type(screen.getByLabelText(/mot de passe/i), 'bad-password');
      await user.click(screen.getByRole('button', { name: /se connecter/i }));
    });

    expect(await screen.findByText('Identifiants invalides')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeEnabled();
    });
  });
});
