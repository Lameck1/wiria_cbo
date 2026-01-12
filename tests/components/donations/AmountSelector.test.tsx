/**
 * AmountSelector Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountSelector } from '@/features/donations/components/AmountSelector';
import { useState } from 'react';

describe('AmountSelector', () => {
  it('should render suggested amounts', () => {
    const onAmountChange = vi.fn();
    render(<AmountSelector selectedAmount={1000} onAmountChange={onAmountChange} />);

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('2,000')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
  });

  it('should highlight selected amount', () => {
    const onAmountChange = vi.fn();
    render(<AmountSelector selectedAmount={2000} onAmountChange={onAmountChange} />);

    const button2000 = screen.getByRole('button', { name: '2,000' });
    expect(button2000).toHaveClass('border-wiria-yellow');
  });

  it('should call onAmountChange when clicking suggested amount', async () => {
    const user = userEvent.setup();
    const onAmountChange = vi.fn();

    render(<AmountSelector selectedAmount={1000} onAmountChange={onAmountChange} />);

    const button5000 = screen.getByRole('button', { name: '5,000' });
    await user.click(button5000);

    expect(onAmountChange).toHaveBeenCalledWith(5000);
  });

  it('should call onAmountChange when typing custom amount', async () => {
    const user = userEvent.setup();
    const onAmountChange = vi.fn();

    function Harness() {
      const [amount, setAmount] = useState(1000);
      return (
        <AmountSelector
          selectedAmount={amount}
          onAmountChange={(next) => {
            onAmountChange(next);
            setAmount(next);
          }}
        />
      );
    }

    render(<Harness />);

    const input = screen.getByLabelText(/or enter a custom amount/i);
    await user.clear(input);
    await user.type(input, '3500');

    expect(onAmountChange).toHaveBeenCalled();
    expect(onAmountChange.mock.calls.length).toBeGreaterThan(0);
    const lastCall = onAmountChange.mock.calls[onAmountChange.mock.calls.length - 1];
    if (!lastCall) throw new Error('Expected onAmountChange to have been called');
    expect(lastCall[0]).toBe(3500);
  });

  it('should disable all inputs when disabled prop is true', () => {
    const onAmountChange = vi.fn();
    render(<AmountSelector selectedAmount={1000} onAmountChange={onAmountChange} disabled />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });

    const input = screen.getByLabelText(/or enter a custom amount/i);
    expect(input).toBeDisabled();
  });

  it('should display minimum donation message', () => {
    const onAmountChange = vi.fn();
    render(<AmountSelector selectedAmount={1000} onAmountChange={onAmountChange} />);

    expect(screen.getByText('Minimum donation: KES 100')).toBeInTheDocument();
  });
});
