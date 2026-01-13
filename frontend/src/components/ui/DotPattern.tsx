'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * DotPattern Component Props
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number
    height?: number
    x?: number
    y?: number
    cx?: number
    cy?: number
    cr?: number
    className?: string
    glow?: boolean
}

/**
 * DotPattern Component
 * 
 * Creates an animated or static dot pattern background using SVG.
 * Perfect for section backgrounds with optional glowing effects.
 */
export function DotPattern({
    width = 16,
    height = 16,
    x = 0,
    y = 0,
    cx = 1,
    cy = 1,
    cr = 1,
    className = '',
    glow = false,
    ...props
}: DotPatternProps) {
    const id = useId()
    const containerRef = useRef<SVGSVGElement>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setDimensions({ width: rect.width, height: rect.height })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    const dots = Array.from(
        {
            length:
                Math.ceil(dimensions.width / width) *
                Math.ceil(dimensions.height / height),
        },
        (_, i) => {
            const col = i % Math.ceil(dimensions.width / width)
            const row = Math.floor(i / Math.ceil(dimensions.width / width))
            return {
                x: col * width + cx,
                y: row * height + cy,
                delay: Math.random() * 5,
                duration: Math.random() * 3 + 2,
            }
        }
    )

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={className}
            style={{
                pointerEvents: 'none',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                color: 'rgba(163, 163, 163, 0.5)',
                ...props.style
            }}
            {...props}
        >
            <defs>
                <radialGradient id={`${id}-gradient`}>
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            {dots.map((dot, index) => (
                <motion.circle
                    key={`${dot.x}-${dot.y}`}
                    cx={dot.x}
                    cy={dot.y}
                    r={cr}
                    fill={glow ? `url(#${id}-gradient)` : 'currentColor'}
                    initial={glow ? { opacity: 0.4, scale: 1 } : {}}
                    animate={
                        glow
                            ? {
                                opacity: [0.4, 1, 0.4],
                                scale: [1, 1.5, 1],
                            }
                            : {}
                    }
                    transition={
                        glow
                            ? {
                                duration: dot.duration,
                                repeat: Infinity,
                                repeatType: 'reverse' as const,
                                delay: dot.delay,
                                ease: 'easeInOut',
                            }
                            : {}
                    }
                />
            ))}
        </svg>
    )
}
