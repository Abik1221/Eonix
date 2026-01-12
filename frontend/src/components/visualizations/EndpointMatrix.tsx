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
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'deprecated': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'missing': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
        }
    };

    return (
        <div className="w-full bg-[#09090b] rounded-lg border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 uppercase bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-3 font-medium">Method</th>
                            <th className="px-6 py-3 font-medium">Endpoint Path</th>
                            <th className="px-6 py-3 font-medium">Service</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {endpoints.map((ep, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-mono font-semibold text-zinc-300">{ep.method}</td>
                                <td className="px-6 py-4 font-mono text-zinc-400">{ep.path}</td>
                                <td className="px-6 py-4 text-zinc-300">{ep.service}</td>
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
