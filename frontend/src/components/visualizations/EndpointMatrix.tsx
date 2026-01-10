'use client';

import React from 'react';

interface Endpoint {
    method: string;
    path: string;
    service: string;
    status: 'active' | 'deprecated' | 'missing';
}

interface EndpointMatrixProps {
    endpoints: Endpoint[];
}

export default function EndpointMatrix({ endpoints }: EndpointMatrixProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'deprecated': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'missing': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 font-medium">Method</th>
                            <th className="px-6 py-3 font-medium">Endpoint Path</th>
                            <th className="px-6 py-3 font-medium">Service</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {endpoints.map((ep, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-semibold text-gray-700">{ep.method}</td>
                                <td className="px-6 py-4 font-mono text-gray-600">{ep.path}</td>
                                <td className="px-6 py-4 text-gray-900">{ep.service}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ep.status)}`}>
                                        {ep.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
