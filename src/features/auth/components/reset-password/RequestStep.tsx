import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

interface ResetPasswordRequestStepProps {
  email: string;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoToConfirm: () => void;
}

export function ResetPasswordRequestStep({
  email,
  isLoading,
  onEmailChange,
  onSubmit,
  onGoToConfirm,
}: ResetPasswordRequestStepProps) {
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-wiria-yellow/10">
          <svg
            className="h-8 w-8 text-wiria-yellow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-wiria-blue-dark">Reset Password</h1>
        <p className="mt-2 text-gray-500">Enter your email to receive a password reset link</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email Address"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have a reset token?{' '}
          <button
            onClick={onGoToConfirm}
            className="font-semibold text-wiria-blue-dark hover:text-wiria-yellow"
          >
            Enter token
          </button>
        </p>
      </div>
    </>
  );
}
