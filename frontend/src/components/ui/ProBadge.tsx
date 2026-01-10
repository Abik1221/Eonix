import React from 'react';

interface ProBadgeProps {
    onClick?: () => void;
    className?: string;
}

export default function ProBadge({ onClick, className = '' }: ProBadgeProps) {
    return (
        <div
            onClick={onClick}
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-linear-to-r from-amber-100 to-yellow-100 border border-amber-200 cursor-pointer hover:shadow-sm transition-all ${className}`}
            role="button"
            tabIndex={0}
            title="Pro Feature"
        >
            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-amber-600"
            >
                <path
                    d="M19.07 4.93L17.07 13.07L14.93 18.07L9.07 18.07L6.93 13.07L4.93 4.93L12 2L19.07 4.93Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    display="none" // Hidden simple path
                />
                <path
                    d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                Pro
            </span>
        </div>
    );
}
