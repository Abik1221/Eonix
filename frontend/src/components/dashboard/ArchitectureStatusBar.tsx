'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, RefreshCw, GitCommit } from 'lucide-react';

export type ArchitectureStatus = 'stable' | 'modified' | 'breaking' | 'drift' | 'pending';

interface ArchitectureStatusBarProps {
    status: ArchitectureStatus;
    lastAnalyzed: string;
    onViewHistory: () => void;
    onTriggerAnalysis: () => void;
}

export const ArchitectureStatusBar: React.FC<ArchitectureStatusBarProps> = ({
    status,
    lastAnalyzed,
    onViewHistory,
    onTriggerAnalysis,
}) => {
    const getStatusConfig = (s: ArchitectureStatus) => {
        switch (s) {
            case 'stable':
                return {
                    icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
                    text: 'System Stable',
                    subtext: 'No drift detected',
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/20',
                };
            case 'modified':
                return {
                    icon: <GitCommit className="w-4 h-4 text-blue-400" />,
                    text: 'Changes Detected',
                    subtext: 'Analysis recommended',
                    bg: 'bg-blue-500/10',
                    border: 'border-blue-500/20',
                };
            case 'breaking':
                return {
                    icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
                    text: 'Breaking Changes',
                    subtext: 'Public API contract violation',
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/20',
                };
            case 'drift':
                return {
                    icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
                    text: 'Architecture Drift',
                    subtext: 'Implementation deviates from design',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/20',
                };
            case 'pending':
                return {
                    icon: <RefreshCw className="w-4 h-4 text-zinc-400 animate-spin" />,
                    text: 'Analyzing...',
                    subtext: 'Scanning repository',
                    bg: 'bg-zinc-500/10',
                    border: 'border-zinc-500/20',
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between w-full px-4 py-3 mb-6 border rounded-lg backdrop-blur-sm ${config.bg} ${config.border}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full bg-white/5`}>{config.icon}</div>
                <div>
                    <h3 className="text-sm font-medium text-white">{config.text}</h3>
                    <p className="text-xs text-zinc-400">{config.subtext}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500 font-mono hidden sm:block">
                    Last Check: {lastAnalyzed}
                </span>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <button
                    onClick={onViewHistory}
                    className="text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                >
                    View History
                </button>
                <button
                    onClick={onTriggerAnalysis}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-all active:scale-95"
                >
                    <RefreshCw className={`w-3 h-3 ${status === 'pending' ? 'animate-spin' : ''}`} />
                    {status === 'pending' ? 'Scanning...' : 'Re-Analyze'}
                </button>
            </div>
        </motion.div>
    );
};
