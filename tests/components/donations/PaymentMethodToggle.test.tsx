/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
/**
 * PaymentMethodToggle Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaymentMethodToggle } from '@/features/donations/components/PaymentMethodToggle';

describe('PaymentMethodToggle', () => {
    it('should render both payment methods', () => {
        const onChange = vi.fn();
        render(<PaymentMethodToggle selected="STK_PUSH" onChange={onChange} />);

        expect(screen.getByText('M-Pesa STK Push')).toBeInTheDocument();
        expect(screen.getByText('Manual Paybill')).toBeInTheDocument();
    });

    it('should highlight selected method', () => {
        const onChange = vi.fn();
        render(<PaymentMethodToggle selected="STK_PUSH" onChange={onChange} />);

        const stkButton = screen.getByText('M-Pesa STK Push').closest('button');
        expect(stkButton).toHaveClass('border-wiria-yellow');
    });

    it('should call onChange when clicking STK Push', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<PaymentMethodToggle selected="MANUAL" onChange={onChange} />);

        const stkButton = screen.getByText('M-Pesa STK Push').closest('button');
        await user.click(stkButton!);

        expect(onChange).toHaveBeenCalledWith('STK_PUSH');
    });

    it('should call onChange when clicking Manual', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<PaymentMethodToggle selected="STK_PUSH" onChange={onChange} />);

        const manualButton = screen.getByText('Manual Paybill').closest('button');
        await user.click(manualButton!);

        expect(onChange).toHaveBeenCalledWith('MANUAL');
    });

    it('should disable buttons when disabled prop is true', () => {
        const onChange = vi.fn();
        render(<PaymentMethodToggle selected="STK_PUSH" onChange={onChange} disabled />);

        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
            expect(button).toBeDisabled();
        });
    });
});
