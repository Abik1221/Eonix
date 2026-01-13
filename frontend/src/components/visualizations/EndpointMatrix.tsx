'use client';

import React from 'react';
import '../dashboard/dashboard.css';

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
    // Helper to highlight path params
    const formatPath = (path: string) => {
        return path.split('/').map((part, i) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                return <span key={i} className="path-param">/{part}</span>;
            }
            return i === 0 ? part : <span key={i}>/{part}</span>;
        });
    };

    return (
        <div className="matrix-container">
            <div className="overflow-x-auto">
                <table className="matrix-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Endpoint Path</th>
                            <th>Service</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {endpoints.map((ep, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className={`method-tag method-${ep.method}`}>
                                        <span className="cell-method">{ep.method}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="cell-path">
                                        {formatPath(ep.path)}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#e4e4e7' }}>
                                        {ep.service}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-pill ${ep.status}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-1 ${ep.status === 'active' ? 'bg-emerald-400' :
                                                ep.status === 'deprecated' ? 'bg-amber-400' : 'bg-rose-400'
                                            }`} />
                                        {ep.status}
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
