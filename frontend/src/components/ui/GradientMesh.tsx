'use client'

import React from 'react'
import { motion } from 'framer-motion'

/**
 * GradientMesh Props
 */
interface GradientMeshProps {
    className?: string
    colors?: string[]
    blur?: number
    animate?: boolean
    style?: React.CSSProperties
}

/**
 * GradientMesh Component
 * 
 * Creates a beautiful animated gradient mesh background.
 * Perfect for hero sections and premium-looking backgrounds.
 */
export function GradientMesh({
    className = '',
    colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
    blur = 100,
    animate = true,
    style
}: GradientMeshProps) {
    return (
        <div
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                ...style
            }}
        >
            {colors.map((color, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '50%',
                        height: '50%',
                        borderRadius: '50%',
                        background: color,
                        opacity: 0.4,
                        filter: `blur(${blur}px)`,
                        left: `${(i % 2) * 30 + 10}%`,
                        top: `${Math.floor(i / 2) * 30 + 10}%`,
                    }}
                    animate={animate ? {
                        x: [0, 30, -20, 0],
                        y: [0, -30, 20, 0],
                        scale: [1, 1.1, 0.95, 1],
                    } : {}}
                    transition={{
                        duration: 15 + i * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}
