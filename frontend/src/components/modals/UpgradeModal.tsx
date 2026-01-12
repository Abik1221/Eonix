'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Shield, GitBranch, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white bg-black/20 hover:bg-white/10 rounded-full transition-all z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Left Side: Current Plan */}
                        <div className="p-8 md:p-10 bg-[#0a0a0c] w-full md:w-5/12 border-r border-white/[0.04] flex flex-col justify-center">
                            <h3 className="text-zinc-500 font-semibold uppercase tracking-wider text-xs mb-2">Current Plan</h3>
                            <h2 className="text-2xl font-bold text-white mb-6">Free Tier</h2>

                            <ul className="space-y-4 mb-8">
                                <ListItem dimmed>1 Workspace & Project</ListItem>
                                <ListItem dimmed>Basic Architecture Maps</ListItem>
                                <ListItem dimmed>Static Code Analysis</ListItem>
                                <ListItem excluded>AI Explanations</ListItem>
                                <ListItem excluded>GitHub Integration</ListItem>
                                <ListItem excluded>Advanced Security Rules</ListItem>
                            </ul>

                            <div className="mt-auto pt-6 border-t border-white/[0.04]">
                                <p className="text-zinc-500 text-sm leading-relaxed">
                                    You are currently on the free plan. Upgrade to unlock the full potential of Eonix.
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Pro Plan (Highlighted) */}
                        <div className="relative p-8 md:p-10 bg-gradient-to-br from-[#111114] to-[#0a0a0c] w-full md:w-7/12 flex flex-col overflow-hidden">
                            {/* Decorative Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                            <Zap className="w-5 h-5 text-indigo-400" fill="currentColor" fillOpacity={0.2} />
                                        </div>
                                        <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Pro Plan</span>
                                    </div>
                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                                        Recommended
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1 mt-4">
                                        <span className="text-5xl font-bold text-white tracking-tight">$29</span>
                                        <span className="text-zinc-500 font-medium">/ month</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mt-2">Perfect for startups and growing teams needing advanced insights.</p>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <FeatureItem icon={<Sparkles className="w-4 h-4 text-indigo-400" />} title="AI Architecture Explanations" desc="200 credits/mo" />
                                    <FeatureItem icon={<GitBranch className="w-4 h-4 text-purple-400" />} title="Full Graph Visualization" desc="Service + DB + API + Infra" />
                                    <FeatureItem icon={<Shield className="w-4 h-4 text-emerald-400" />} title="GitHub Integration" desc="Auto-label PRs & block drift" />
                                </div>

                                <button className="w-full group relative py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02]">
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Upgrade Now
                                        <Zap className="w-4 h-4" fill="currentColor" />
                                    </span>
                                </button>

                                <p className="text-center text-[10px] text-zinc-600 mt-4 font-medium uppercase tracking-wider">
                                    7-day money-back guarantee • Cancel anytime
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function ListItem({ children, excluded = false, dimmed = false }: { children: React.ReactNode, excluded?: boolean, dimmed?: boolean }) {
    return (
        <li className={`flex items-center text-sm ${excluded ? 'text-zinc-600 decoration-zinc-700' : dimmed ? 'text-zinc-400' : 'text-zinc-200'}`}>
            {excluded ? (
                <X className="w-4 h-4 mr-3 text-zinc-700 shrink-0" />
            ) : (
                <Check className={`w-4 h-4 mr-3 shrink-0 ${dimmed ? 'text-zinc-600' : 'text-zinc-400'}`} />
            )}
            <span className={excluded ? 'line-through' : ''}>{children}</span>
        </li>
    );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="flex items-start bg-white/[0.03] border border-white/[0.04] p-3 rounded-xl">
            <div className="mt-0.5 mr-3 p-1.5 bg-[#0a0a0c] rounded-lg border border-white/[0.06]">
                {icon}
            </div>
            <div>
                <div className="text-sm font-semibold text-zinc-200">{title}</div>
                <div className="text-xs text-zinc-500">{desc}</div>
            </div>
        </div>
    );
}
