/**
 * OpportunitiesTab Component
 * Displays volunteer/program opportunities with actions
 */

import { memo, useMemo } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { OpportunitiesTabProps, Opportunity, Application } from './types';

export const OpportunitiesTab = memo(function OpportunitiesTab({ opportunities, applications, onEdit, onDelete, onCreate }: OpportunitiesTabProps) {
    // Memoize application counts by opportunity ID
    const applicationCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        applications.forEach((app: Application) => {
            if (app.opportunityId) {
                counts[app.opportunityId] = (counts[app.opportunityId] || 0) + 1;
            }
        });
        return counts;
    }, [applications]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800">Active Opportunities</h3>
                <Button onClick={onCreate} size="sm">+ Add Opportunity</Button>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                    <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-center">Applications</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {opportunities.map((opp: Opportunity) => (
                        <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">{opp.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                                    {opp.type.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="font-bold text-wiria-blue-dark">
                                    {applicationCounts[opp.id] || 0}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${opp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {opp.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button onClick={() => onEdit(opp)} className="text-wiria-blue-dark hover:text-blue-800 font-bold text-sm mr-4 transition-colors">Edit</button>
                                <button onClick={() => onDelete(opp.id)} className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors">Delete</button>
                            </td>
                        </tr>
                    ))}
                    {opportunities.length === 0 && (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No opportunities found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
});

