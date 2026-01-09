import React from 'react';

interface LogoProps {
    size?: number;
    color?: string;
}

export default function Logo({ size = 32, color = '#1a1a1a' }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Rounded square frame */}
            <rect
                x="8"
                y="8"
                width="24"
                height="24"
                rx="6"
                stroke={color}
                strokeWidth="2.5"
                fill="none"
            />
            {/* Stylized 'E' - three horizontal lines */}
            <line x1="14" y1="14" x2="26" y2="14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="14" y1="20" x2="22" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="14" y1="26" x2="26" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}
