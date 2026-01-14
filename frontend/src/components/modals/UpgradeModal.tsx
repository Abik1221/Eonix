'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiZap, FiShield, FiGitBranch } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import './modal.css';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="modal-overlay-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="upgrade-modal-container"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        {/* Close Button */}
                        <button className="btn-close-modal" onClick={onClose}>
                            <FiX size={18} />
                        </button>

                        {/* Left Side - Current Plan */}
                        <div className="modal-left">
                            <span className="plan-label">Current Plan</span>
                            <h2 className="plan-title">Free Tier</h2>

                            <ul className="feature-list">
                                <li className="feature-li">
                                    <FiCheck className="icon-check" />
                                    <span>1 Workspace & Project</span>
                                </li>
                                <li className="feature-li">
                                    <FiCheck className="icon-check" />
                                    <span>Basic Architecture Maps</span>
                                </li>
                                <li className="feature-li">
                                    <FiCheck className="icon-check" />
                                    <span>Static Code Analysis</span>
                                </li>
                                <li className="feature-li excluded">
                                    <FiX className="icon-x" />
                                    <span>AI Explanations</span>
                                </li>
                                <li className="feature-li excluded">
                                    <FiX className="icon-x" />
                                    <span>GitHub Integration</span>
                                </li>
                                <li className="feature-li excluded">
                                    <FiX className="icon-x" />
                                    <span>Advanced Security Rules</span>
                                </li>
                            </ul>

                            <p className="upgrade-message">
                                You're on the free plan. Upgrade to unlock the full potential of Eonix.
                            </p>
                        </div>

                        {/* Right Side - Pro Plan */}
                        <div className="modal-right">
                            {/* Decorative Glows */}
                            <div className="glow-shape-1" />
                            <div className="glow-shape-2" />

                            {/* Header */}
                            <div className="pro-header">
                                <div className="pro-badge">
                                    <div className="pro-icon-box">
                                        <FiZap size={16} />
                                    </div>
                                    <span className="pro-title">Pro Plan</span>
                                </div>
                                <span className="rec-badge">Recommended</span>
                            </div>

                            {/* Price */}
                            <div className="price-block">
                                <span className="price-amount">$29</span>
                                <span className="price-period">/ month</span>
                                <p className="price-desc">
                                    Perfect for startups and growing teams needing advanced insights.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="pro-features">
                                <div className="pro-feat-item">
                                    <div className="feat-icon-box">
                                        <HiSparkles size={14} color="#818cf8" />
                                    </div>
                                    <div className="feat-content">
                                        <h4>AI Architecture Explanations</h4>
                                        <p>200 credits/mo</p>
                                    </div>
                                </div>

                                <div className="pro-feat-item">
                                    <div className="feat-icon-box">
                                        <FiGitBranch size={14} color="#a78bfa" />
                                    </div>
                                    <div className="feat-content">
                                        <h4>Full Graph Visualization</h4>
                                        <p>Service + DB + API + Infra</p>
                                    </div>
                                </div>

                                <div className="pro-feat-item">
                                    <div className="feat-icon-box">
                                        <FiShield size={14} color="#34d399" />
                                    </div>
                                    <div className="feat-content">
                                        <h4>GitHub Integration</h4>
                                        <p>Auto-label PRs & block drift</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button className="btn-upgrade-pro">
                                Upgrade Now
                                <FiZap size={16} />
                            </button>

                            <p className="guarantee-text">
                                7-day money-back guarantee • Cancel anytime
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
