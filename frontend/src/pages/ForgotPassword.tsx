import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/authApi';


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; }>({});

  const mutation = useMutation({
  mutationFn: (email: string) => forgotPassword(email), 
  onSuccess: () => {
    console.log('Email sent successfully');
  },
  onError: () => {
    setError('Invalid email');
  },
});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    if (!validateInputs()) return;
  
    mutation.mutate( email );
  };

  // Validation function
  const validateInputs = () => {
    const errors: { email?: string; } = {};

    // Email validation
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-card shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Get a new password</h2>

        <p className="m-5">If your email is in the database, you'll receive a message to change your password.</p>

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

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary-dark transition disabled:opacity-50"
          >
            Send email
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default ForgotPassword;