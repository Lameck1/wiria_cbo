/**
 * Spinner Component Tests
 */
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Spinner, PageLoader } from '@/shared/components/ui/Spinner';

describe('Spinner', () => {
  it('renders with default size (md)', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
  });

  it('renders with sm size', () => {
    const { container } = render(<Spinner size="sm" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-4');
    expect(spinner).toHaveClass('w-4');
  });

  it('renders with lg size', () => {
    const { container } = render(<Spinner size="lg" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-12');
    expect(spinner).toHaveClass('w-12');
  });

  it('renders with xl size', () => {
    const { container } = render(<Spinner size="xl" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-16');
    expect(spinner).toHaveClass('w-16');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has animation class', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('animate-spin');
  });
});

describe('PageLoader', () => {
  it('renders a full page loader with spinner', () => {
    const { container, getByText } = render(<PageLoader />);
    const spinner = container.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('uses xl spinner size', () => {
    const { container } = render(<PageLoader />);
    const spinner = container.querySelector('svg');
    expect(spinner).toHaveClass('h-16');
    expect(spinner).toHaveClass('w-16');
  });
});
