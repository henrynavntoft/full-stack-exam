import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; // For `toBeInTheDocument` matcher
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from './LoginForm';

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>{ui}</Router>
    </QueryClientProvider>
  );
};

describe('LoginForm', () => {
  it('renders the login form', () => {
    renderWithProviders(<LoginForm onLogin={() => {}} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });
});