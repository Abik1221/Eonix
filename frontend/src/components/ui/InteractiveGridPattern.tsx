'use client'

import React, { useState } from 'react'

/**
 * InteractiveGridPattern Props
 */
interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number
    height?: number
    squares?: [number, number] // [horizontal, vertical]
    className?: string
    squaresClassName?: string
}

/**
 * InteractiveGridPattern Component
 * 
 * Renders a grid pattern with interactive hover effects on squares.
 * Perfect for adding dynamic backgrounds to sections.
 */
export function InteractiveGridPattern({
    width = 40,
    height = 40,
    squares = [24, 24],
    className = '',
    squaresClassName = '',
    ...props
}: InteractiveGridPatternProps) {
    const [horizontal, vertical] = squares
    const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)

    return (
        <svg
            width={width * horizontal}
            height={height * vertical}
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                border: '1px solid rgba(156, 163, 175, 0.2)',
                ...props.style
            }}
            {...props}
        >
            {Array.from({ length: horizontal * vertical }).map((_, index) => {
                const x = (index % horizontal) * width
                const y = Math.floor(index / horizontal) * height
                return (
                    <rect
                        key={index}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        style={{
                            stroke: 'rgba(156, 163, 175, 0.2)',
                            strokeWidth: 1,
                            fill: hoveredSquare === index ? 'rgba(209, 213, 219, 0.2)' : 'transparent',
                            transition: hoveredSquare === index
                                ? 'all 0.1s ease-in-out'
                                : 'all 1s ease-in-out'
                        }}
                        onMouseEnter={() => setHoveredSquare(index)}
                        onMouseLeave={() => setHoveredSquare(null)}
                    />
                )
            })}
        </svg>
    )
}
