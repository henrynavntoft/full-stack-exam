import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../api/authApi';


interface FormData {
  password: string;
  confirmPassword: string;
}

function ResetPassword() {
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setToken(urlParams.get('token'));
  }, []);

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccess("New password successfully created!");
      setFormData({ password: '', confirmPassword: '' });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create password. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields.");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$!%-^&+=_]).{8,}$/;
    if (!passwordPattern.test(formData.password)) {
        setError(
            "Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character."
        );
        return;
    }

    mutation.mutate({ password: formData.password, confirmPassword: formData.confirmPassword, token: token });
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Create new password</h2>
        
        {error && <div className="text-destructive mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm new password</label>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded bg-input text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded bg-input text-foreground"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary-dark transition disabled:opacity-50"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Creating...' : 'Create new password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;