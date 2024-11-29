import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/usersApi';
import DOMPurify from 'dompurify';


// sanitize inputs function to prevent XSS attacks
function sanitizeInput(input: string | null | undefined): string {
  if (!input) return ''; // Handle null/undefined
  return DOMPurify.sanitize(input); // Use DOMPurify for sanitization
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function CreateUserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSuccess("User created successfully!");
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create user. Please try again.");
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

    const name = sanitizeInput(formData.name);
    const email = sanitizeInput(formData.email);

    if (!name || !email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all fields.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        setError("Invalid email address.");
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

    mutation.mutate({ name, email, password: formData.password, confirmPassword: formData.confirmPassword });
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Create New User</h2>
        
        {error && <div className="text-destructive mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 mb-4 text-center">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded bg-input text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-border rounded bg-input text-foreground"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
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
            {mutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUserForm;