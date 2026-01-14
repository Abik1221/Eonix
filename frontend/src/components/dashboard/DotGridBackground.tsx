'use client';

import React from 'react';
import './dotgrid.css';

interface DotGridBackgroundProps {
    dotSize?: number;
    spacing?: number;
    opacity?: number;
    color?: string;
}

export default function DotGridBackground({
    dotSize = 1.5,
    spacing = 24,
    opacity = 0.3,
    color = 'rgba(255, 255, 255, 0.4)',
}: DotGridBackgroundProps) {
    return (
        <div className="dot-grid-background">
            {/* SVG Pattern for crisp dots */}
            <svg
                className="dot-grid-svg"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="dotGrid"
                        x="0"
                        y="0"
                        width={spacing}
                        height={spacing}
                        patternUnits="userSpaceOnUse"
                    >
                        <circle
                            cx={spacing / 2}
                            cy={spacing / 2}
                            r={dotSize}
                            fill={color}
                        />
                    </pattern>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#dotGrid)"
                    style={{ opacity }}
                />
            </svg>

            {/* Radial Gradient Overlay for depth */}
            <div className="dot-grid-overlay" />
        </div>
    );
}
