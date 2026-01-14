'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi2';
import './ai.css';

interface ExplainWithAIButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    className?: string;
}

export default function ExplainWithAIButton({
    onClick,
    isLoading = false,
    className = '',
}: ExplainWithAIButtonProps) {
    return (
        <motion.button
            className={`ai-explain-btn ${isLoading ? 'loading' : ''} ${className}`}
            onClick={onClick}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated Glow Background */}
            <div className="ai-btn-glow" />

            {/* Button Content */}
            <div className="ai-btn-content">
                <div className="ai-btn-icon">
                    {isLoading ? (
                        <motion.div
                            className="ai-loading-spinner"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />
                    ) : (
                        <HiSparkles />
                    )}
                </div>
                <span className="ai-btn-text">
                    {isLoading ? 'Analyzing...' : 'Explain with AI'}
                </span>
            </div>

            {/* Shimmer Effect */}
            <div className="ai-btn-shimmer" />
        </motion.button>
    );
}
