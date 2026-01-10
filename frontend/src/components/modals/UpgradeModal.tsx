'use client';

import React from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="grid md:grid-cols-2">
                    {/* Left Side: Value Prop & Free Plan */}
                    <div className="p-8 md:p-12 bg-gray-50 border-r border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade Your Workspace</h2>
                        <p className="text-gray-600 mb-8">Unlock the full power of Eonix with advanced AI insights and unlimited access.</p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Current Plan (Free)</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-600 text-sm">
                                        <CheckIcon className="text-gray-400 mr-2" />
                                        <span>1 Workspace & 1 Project</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 text-sm">
                                        <CheckIcon className="text-gray-400 mr-2" />
                                        <span>Basic Architecture Maps</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 text-sm">
                                        <CheckIcon className="text-gray-400 mr-2" />
                                        <span>Static Code Analysis</span>
                                    </li>
                                    <li className="flex items-center text-gray-400 text-sm">
                                        <XIcon className="mr-2" />
                                        <span className="line-through">AI Architecture Explanations</span>
                                    </li>
                                    <li className="flex items-center text-gray-400 text-sm">
                                        <XIcon className="mr-2" />
                                        <span className="line-through">GitHub Integration</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Pro Plan */}
                    <div className="p-8 md:p-12 bg-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-bl-lg">
                            RECOMMENDED
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="bg-gradient-to-r from-amber-200 to-yellow-400 w-8 h-8 rounded-lg flex items-center justify-center text-yellow-900">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" />
                                    </svg>
                                </span>
                                Pro Plan
                            </h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-gray-900">$29</span>
                                <span className="text-gray-500 ml-2">/ month</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">For startups and small teams</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start text-gray-800 text-sm">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                    <CheckIcon size={12} />
                                </div>
                                <span><strong>AI Explanations</strong> (200/mo)</span>
                            </li>
                            <li className="flex items-start text-gray-800 text-sm">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                    <CheckIcon size={12} />
                                </div>
                                <span><strong>Full Architecture Graph</strong> (Service + DB + API)</span>
                            </li>
                            <li className="flex items-start text-gray-800 text-sm">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                    <CheckIcon size={12} />
                                </div>
                                <span><strong>5 Projects</strong> & 10 Repositories</span>
                            </li>
                            <li className="flex items-start text-gray-800 text-sm">
                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                                    <CheckIcon size={12} />
                                </div>
                                <span><strong>GitHub Integration</strong> & Manual Exports</span>
                            </li>
                        </ul>

                        <button className="w-full py-4 px-6 bg-[#1a1a1a] hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Upgrade to Pro
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Secure payment via Stripe • Cancel anytime
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckIcon({ className = '', size = 16 }: { className?: string, size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}

function XIcon({ className = '', size = 16 }: { className?: string, size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}
