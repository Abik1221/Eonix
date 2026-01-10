'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { useIssues } from '@/context/IssueContext';

const ServiceNode = ({ id, data, isConnectable }: NodeProps) => {
    const { getIssuesForEntity, openCreateModal } = useIssues();

    const issues = getIssuesForEntity(id);
    const criticalCount = issues.filter(i => i.priority === 'critical' || i.priority === 'high').length;
    const totalCount = issues.length;

    return (
        <div
            className="relative group bg-white border-2 border-slate-200 rounded-lg shadow-sm min-w-[150px] transition-all hover:border-slate-400 hover:shadow-md"
            onContextMenu={(e) => {
                e.preventDefault();
                openCreateModal(id, data.label);
            }}
        >
            {/* Issue Badge */}
            {totalCount > 0 && (
                <div className={`
            absolute -top-3 -right-3 rounded-full flex items-center justify-center w-6 h-6 text-xs font-bold text-white shadow-sm z-10
            ${criticalCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-blue-500'}
          `}>
                    {totalCount}
                </div>
            )}

            {/* Hover Menu Trigger Hint */}
            <div className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    className="text-gray-400 hover:text-blue-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        openCreateModal(id, data.label);
                    }}
                >
                    <span className="text-xs font-bold">⋮</span>
                </button>
            </div>

            <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 rounded-t-lg">
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Service</div>
                <div className="font-bold text-slate-800">{data.label}</div>
            </div>

            <div className="p-3">
                <div className="text-[10px] text-slate-400">Node ID: {id}</div>
                {totalCount > 0 ? (
                    <div className="mt-2 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded inline-block">
                        ⚠️ {totalCount} Active {totalCount === 1 ? 'Issue' : 'Issues'}
                    </div>
                ) : (
                    <div className="mt-2 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded inline-block">
                        ✅ Healthy
                    </div>
                )}
            </div>

            <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-3 h-3 bg-slate-400" />
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-3 h-3 bg-slate-400" />
        </div>
    );
};

export default memo(ServiceNode);
