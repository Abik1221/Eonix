'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCommit, ArrowRight, AlertTriangle } from 'lucide-react';

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

export const ChangeHistory: React.FC<ChangeHistoryProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Architecture History</h2>
                                <p className="text-sm text-zinc-400">Timeline of detected changes</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {MOCK_HISTORY.map((event, index) => (
                                <div key={event.id} className="relative pl-8">
                                    {/* Timeline Line */}
                                    {index !== MOCK_HISTORY.length - 1 && (
                                        <div className="absolute top-2 left-[11px] bottom-[-24px] w-px bg-white/10" />
                                    )}

                                    {/* Icon */}
                                    <div className={`absolute top-0 left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-zinc-900 z-10
                    ${event.type === 'violation' ? 'border-rose-500 text-rose-500' :
                                            event.type === 'feature' ? 'border-emerald-500 text-emerald-500' :
                                                'border-blue-500 text-blue-500'}`}
                                    >
                                        {event.type === 'violation' ? <AlertTriangle className="w-3 h-3" /> : <GitCommit className="w-3 h-3" />}
                                    </div>

                                    {/* Content */}
                                    <div className="group rounded-lg border border-white/5 bg-white/5 p-4 hover:border-white/10 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-sm font-medium text-white">{event.title}</h3>
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">
                                                {event.type}
                                            </span>
                                        </div>

                                        <p className="text-sm text-zinc-400 mb-3 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-zinc-500">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                                    {event.author.charAt(0)}
                                                </div>
                                                <span>{event.author}</span>
                                            </div>
                                            <span className="font-mono">{event.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-zinc-900/50 backdrop-blur-md">
                            <button className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2">
                                View Full Changelog <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
