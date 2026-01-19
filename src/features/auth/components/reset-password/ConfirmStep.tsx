import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

interface ResetPasswordConfirmStepProps {
  token: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  onTokenChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onBackToRequest: () => void;
}

export function ResetPasswordConfirmStep({
  token,
  newPassword,
  confirmPassword,
  isLoading,
  onTokenChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onBackToRequest,
}: ResetPasswordConfirmStepProps) {
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-wiria-blue-dark">Check Your Email</h1>
        <p className="mt-2 text-gray-500">Enter the token from your email and set a new password</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          label="Reset Token"
          value={token}
          onChange={(event) => onTokenChange(event.target.value)}
          placeholder="Enter token from email"
          required
        />

        <Input
          type="password"
          label="New Password"
          value={newPassword}
          onChange={(event) => onNewPasswordChange(event.target.value)}
          placeholder="••••••••"
          helperText="Minimum 8 characters"
          required
        />

        <Input
          type="password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Reset Password
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBackToRequest}
          className="text-sm text-gray-500 hover:text-wiria-blue-dark"
        >
          ← Request new reset link
        </button>
      </div>
    </>
  );
}
