/**
 * LoginForm Component
 * Reusable login form for members and staff
 */

import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { useLogin } from '../hooks/useLogin';

interface LoginFormProps {
    isMember?: boolean;
    title?: string;
    subtitle?: string;
}

export function LoginForm({ isMember = false, title, subtitle }: LoginFormProps) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, isLoading, error } = useLogin(isMember);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await handleLogin({ identifier, password });
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-wiria-blue-dark mb-2">
                    {title || (isMember ? 'Member Login' : 'Staff Login')}
                </h1>
                {subtitle && <p className="text-gray-600">{subtitle}</p>}
            </div>

            <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
                <Input
                    type="text"
                    id="identifier"
                    label={isMember ? 'Email or Phone' : 'Username or Email'}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    placeholder={isMember ? 'your@email.com or 0712345678' : 'username'}
                    disabled={isLoading}
                />

                <Input
                    type="password"
                    id="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                />

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <Button type="submit" fullWidth isLoading={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center space-y-2 text-sm">
                    <Link
                        to="/reset-password"
                        className="block text-wiria-blue-dark hover:text-wiria-yellow transition-colors"
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
            </form>
        </div>
    );
}
