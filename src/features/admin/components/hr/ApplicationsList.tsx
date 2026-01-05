/**
 * ApplicationsList Component
 * Displays applications with review action
 */

import { ApplicationsListProps, Application } from './types';

function getStatusClass(status: string) {
    const styles: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        UNDER_REVIEW: 'bg-blue-100 text-blue-700',
        ACCEPTED: 'bg-green-100 text-green-700',
        REJECTED: 'bg-red-100 text-red-700',
        SHORTLISTED: 'bg-purple-100 text-purple-700',
        INTERVIEWED: 'bg-indigo-100 text-indigo-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
}

export function ApplicationsList({ applications, onReview }: ApplicationsListProps) {
    if (applications.length === 0) {
        return <div className="p-12 text-center text-gray-400 italic">No applications found in this category.</div>;
    }

    return (
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-100">
                <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Position</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
                {applications.map((app: Application) => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{app.firstName} {app.lastName}</div>
                            <div className="text-xs text-gray-500">{app.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700">
                            {app.career?.title || app.opportunity?.title || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                            {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(app.status)}`}>
                                {app.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button onClick={() => onReview(app)} className="bg-wiria-blue-dark text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800 transition-all shadow-sm">Review</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
