'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, RefreshCw, GitCommit } from 'lucide-react';
import './dashboard.css';

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
                    icon: <CheckCircle className="w-5 h-5" />,
                    text: 'System Stable',
                    subtext: 'No drift detected',
                };
            case 'modified':
                return {
                    icon: <GitCommit className="w-5 h-5" />,
                    text: 'Changes Detected',
                    subtext: 'Analysis recommended',
                };
            case 'breaking':
                return {
                    icon: <AlertCircle className="w-5 h-5" />,
                    text: 'Breaking Changes',
                    subtext: 'Public API contract violation',
                };
            case 'drift':
                return {
                    icon: <AlertCircle className="w-5 h-5" />,
                    text: 'Architecture Drift',
                    subtext: 'Implementation deviates from design',
                };
            case 'pending':
                return {
                    icon: <RefreshCw className="w-5 h-5 animate-spin" />,
                    text: 'Analyzing...',
                    subtext: 'Scanning repository',
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`status-bar ${status} `}
        >
            <div className="flex items-center">
                <div className="status-icon-wrapper">
                    {config.icon}
                </div>
                <div className="status-content">
                    <h3>{config.text}</h3>
                    <p>{config.subtext}</p>
                </div>
            </div>

            <div className="status-actions">
                <span className="last-check hidden sm:block">
                    Last Check: {lastAnalyzed}
                </span>

                <div className="status-divider hidden sm:block" />

                <button
                    onClick={onViewHistory}
                    className="btn-status-action"
                >
                    View History
                </button>

                <button
                    onClick={onTriggerAnalysis}
                    className="btn-reanalyze"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${status === 'pending' ? 'animate-spin' : ''}`} />
                    {status === 'pending' ? 'Scanning...' : 'Re-Analyze'}
                </button>
            </div>
        </motion.div>
    );
};
