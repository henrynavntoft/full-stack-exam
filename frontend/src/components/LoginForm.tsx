import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (user: { id: number; name: string; email: string; role: string }) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      onLogin(data.user); // Pass user data to the onLogin callback
      navigate('/dashboard');
    },
    onError: () => {
      setError('Invalid email or password');
    },
  });

  // Validation function
  const validateInputs = () => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }

    // Password validation
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_]).{8,}$/;

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (!passwordPattern.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!validateInputs()) return;

    mutation.mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Login</h2>

        {error && <div className="text-destructive mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded bg-input text-foreground ${
                validationErrors.email ? 'border-destructive' : 'border-border'
              }`}
              required
            />
            {validationErrors.email && (
              <p className="text-destructive text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded bg-input text-foreground ${
                validationErrors.password ? 'border-destructive' : 'border-border'
              }`}
              required
            />
            {validationErrors.password && (
              <p className="text-destructive text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary-dark transition disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;