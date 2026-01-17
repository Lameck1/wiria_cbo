import type { ReactNode } from 'react';

import { Button } from '@/shared/components/ui/Button';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  children?: ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  action,
  children,
  className = '',
}: AdminPageHeaderProps) {
  return (
    <header
      className={`mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-wiria-blue-dark">{title}</h1>
        {description && <p className="mt-1 text-gray-600">{description}</p>}
      </div>

      <div className="flex items-center gap-3">
        {children}
        {action && (
          <Button onClick={action.onClick} className="flex items-center gap-2">
            {action.icon && <span>{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </header>
  );
}
