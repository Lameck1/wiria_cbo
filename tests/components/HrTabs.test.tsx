import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';


import { HRTabs, type HRTab } from '@/features/admin/components/hr/HrTabs';

describe('HRTabs', () => {
  it('renders all HR tabs', () => {
    const setActiveTab = vi.fn();
    render(<HRTabs activeTab="CAREERS" setActiveTab={setActiveTab} />);

    expect(screen.getByRole('button', { name: 'Careers' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Opportunities' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Applications' })).toBeInTheDocument();
  });

  it('calls setActiveTab with correct value when a tab is clicked', () => {
    const setActiveTab = vi.fn();
    render(<HRTabs activeTab="CAREERS" setActiveTab={setActiveTab} />);

    fireEvent.click(screen.getByRole('button', { name: 'Opportunities' }));

    expect(setActiveTab).toHaveBeenCalledWith<'OPPORTUNITIES'>('OPPORTUNITIES');
  });

  it('applies active styles to the selected tab', () => {
    const setActiveTab = vi.fn();
    const { rerender } = render(<HRTabs activeTab="CAREERS" setActiveTab={setActiveTab} />);

    const careersTab = screen.getByRole('button', { name: 'Careers' });
    expect(careersTab.className).toContain('bg-wiria-blue-dark');

    rerender(<HRTabs activeTab="APPLICATIONS" setActiveTab={setActiveTab} />);
    const applicationsTab = screen.getByRole('button', { name: 'Applications' });
    expect(applicationsTab.className).toContain('bg-wiria-blue-dark');
  });
});

