'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCommit, ArrowRight, AlertTriangle, Zap, CheckCircle, Database } from 'lucide-react';
import './dashboard.css';

interface ChangeEvent {
    id: string;
    type: 'feature' | 'refactor' | 'violation' | 'fix';
    title: string;
    timestamp: string;
    author: string;
    description: string;
    impactLevel: 'low' | 'medium' | 'high';
}

interface ChangeHistoryProps {
    isOpen: boolean;
    onClose: () => void;
}

const MOCK_HISTORY: ChangeEvent[] = [
    {
        id: 'evt-1',
        type: 'violation',
        title: 'New Service Dependency',
        timestamp: '2 mins ago',
        author: 'CI/CD Bot',
        description: 'Auth Service now directly calls Payment Service, violating separation of concerns.',
        impactLevel: 'high',
    },
    {
        id: 'evt-2',
        type: 'feature',
        title: 'Added User Profile Endpoint',
        timestamp: '1 hour ago',
        author: 'Sarah Chen',
        description: 'GET /api/v1/user/profile endpoint added to Auth Service.',
        impactLevel: 'low',
    },
    {
        id: 'evt-3',
        type: 'fix',
        title: 'Resolved Circular Dependency',
        timestamp: 'Yesterday',
        author: 'Mike Ross',
        description: 'Removed circular reference between Order and Inventory services.',
        impactLevel: 'medium',
    },
    {
        id: 'evt-4',
        type: 'refactor',
        title: 'Database Schema Migration',
        timestamp: '2 days ago',
        author: 'System',
        description: 'Added index on user_email column in Users table.',
        impactLevel: 'medium',
    },
];

const TypeIcon = ({ type }: { type: ChangeEvent['type'] }) => {
    switch (type) {
        case 'violation': return <AlertTriangle className="w-3 h-3" />;
        case 'feature': return <Zap className="w-3 h-3" />;
        case 'fix': return <CheckCircle className="w-3 h-3" />;
        case 'refactor': return <Database className="w-3 h-3" />;
        default: return <GitCommit className="w-3 h-3" />;
    }
};

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="history-backdrop" onClick={onClose} />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="history-sidebar"
                    >
                        <div className="history-header">
                            <div className="history-title">
                                <h2>Architecture History</h2>
                                <p>Timeline of detected changes</p>
                            </div>
                            <button onClick={onClose} className="btn-close-history">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="history-content custom-scrollbar">
                            {MOCK_HISTORY.map((event, index) => (
                                <div key={event.id} className="timeline-item">
                                    <div className="timeline-line" />

                                    <div className={`timeline-icon ${event.type}`}>
                                        <TypeIcon type={event.type} />
                                    </div>

                                    <div className="timeline-card">
                                        <div className="timeline-header">
                                            <span className="timeline-title">{event.title}</span>
                                            <span className="timeline-tag">{event.type}</span>
                                        </div>

                                        <p className="timeline-desc">
                                            {event.description}
                                        </p>

                                        <div className="timeline-meta">
                                            <div className="meta-author">
                                                <div className="author-avatar">
                                                    {event.author.charAt(0)}
                                                </div>
                                                <span>{event.author}</span>
                                            </div>
                                            <span style={{ fontFamily: 'monospace' }}>{event.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="history-footer">
                            <button className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 active:scale-98">
                                View Full Changelog <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
