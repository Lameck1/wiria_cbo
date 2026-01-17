/**
 * LoginForm Component (Refactored)
 * Uses the unified Form abstraction for boilerplate-free validation and state management.
 */

import { Link } from 'react-router-dom';

import { Button } from '@/shared/components/ui/Button';
import { Form, FormField } from '@/shared/components/ui/form';

import { useLogin } from '../hooks/useLogin';
import { loginSchema } from '../schemas/auth.schema';

import type { LoginData } from '../schemas/auth.schema';

interface LoginFormProps {
  isMember?: boolean;
  title?: string;
  subtitle?: string;
}

export function LoginForm({ isMember = false, title, subtitle }: LoginFormProps) {
  const { handleLogin, isLoading, error: apiError } = useLogin(isMember);

  const onSubmit = async (data: LoginData) => {
    await handleLogin(data);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-wiria-blue-dark">
          {title ?? (isMember ? 'Member Login' : 'Staff Login')}
        </h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <Form
        schema={loginSchema}
        defaultValues={{ identifier: '', password: '' }}
        onSubmit={onSubmit}
        className="rounded-lg bg-white p-8 shadow-lg"
      >
        {() => (
          <>
            <FormField
              name="identifier"
              label={isMember ? 'Email or Phone' : 'Username or Email'}
              placeholder={isMember ? 'your@email.com or 0712345678' : 'username'}
              disabled={isLoading}
            />

            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              disabled={isLoading}
            />

            {apiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">{apiError}</p>
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <Link
                to="/reset-password"
                className="block text-wiria-blue-dark transition-colors hover:text-wiria-yellow"
              >
                Forgot password?
              </Link>
              {isMember && (
                <p className="text-gray-600">
                  Not a member?{' '}
                  <Link to="/membership" className="text-wiria-yellow hover:underline">
                    Register here
                  </Link>
                </p>
              )}
            </div>
          </>
        )}
      </Form>
    </div>
  );
}
