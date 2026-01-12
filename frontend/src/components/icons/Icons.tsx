import React from 'react';

// Navigation Icons
export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#bfbfbf" />
            </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
        <circle cx="20" cy="20" r="6" fill="#bfbfbf" />
        <line x1="20" y1="8" x2="20" y2="14" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="26" x2="20" y2="32" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="20" x2="14" y2="20" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <line x1="26" y1="20" x2="32" y2="20" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="#bfbfbf" strokeWidth="1.5" />
        <circle cx="28" cy="12" r="3" fill="none" stroke="#bfbfbf" strokeWidth="1.5" />
        <circle cx="12" cy="28" r="3" fill="none" stroke="#bfbfbf" strokeWidth="1.5" />
        <circle cx="28" cy="28" r="3" fill="none" stroke="#bfbfbf" strokeWidth="1.5" />
    </svg>
);

export const ArrowRight = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Play = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
    </svg>
);

// Feature Icons
export const CodeAnalysis = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="36" height="32" rx="4" stroke="#bfbfbf" strokeWidth="2" />
        <line x1="6" y1="16" x2="42" y2="16" stroke="#bfbfbf" strokeWidth="2" />
        <circle cx="11" cy="12" r="2" fill="#bfbfbf" />
        <circle cx="17" cy="12" r="2" fill="#bfbfbf" opacity="0.6" />
        <circle cx="23" cy="12" r="2" fill="#bfbfbf" opacity="0.3" />
        <path d="M14 26L18 30L14 34" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="22" y1="34" x2="32" y2="34" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const GraphNetwork = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="6" fill="none" stroke="#bfbfbf" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="#bfbfbf" strokeWidth="2" />
        <circle cx="36" cy="12" r="4" fill="none" stroke="#bfbfbf" strokeWidth="2" />
        <circle cx="12" cy="36" r="4" fill="none" stroke="#bfbfbf" strokeWidth="2" />
        <circle cx="36" cy="36" r="4" fill="none" stroke="#bfbfbf" strokeWidth="2" />
        <line x1="19" y1="20" x2="15" y2="15" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="29" y1="20" x2="33" y2="15" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="19" y1="28" x2="15" y2="33" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="29" y1="28" x2="33" y2="33" stroke="#bfbfbf" strokeWidth="1.5" />
    </svg>
);

export const AiBrain = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 6C16 6 10 12 10 20C10 26 14 32 20 34V40H28V34C34 32 38 26 38 20C38 12 32 6 24 6Z" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <circle cx="18" cy="18" r="2" fill="#bfbfbf" />
        <circle cx="30" cy="18" r="2" fill="#bfbfbf" />
        <circle cx="24" cy="26" r="2" fill="#bfbfbf" />
        <line x1="18" y1="18" x2="24" y2="26" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="30" y1="18" x2="24" y2="26" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="18" y1="18" x2="30" y2="18" stroke="#bfbfbf" strokeWidth="1.5" />
        <line x1="20" y1="44" x2="28" y2="44" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const RealTime = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="14" stroke="#bfbfbf" strokeWidth="1" opacity="0.5" fill="none" />
        <path d="M24 14V24L32 28" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="3" fill="#bfbfbf" />
        <circle cx="24" cy="8" r="2" fill="#bfbfbf" />
        <circle cx="40" cy="24" r="2" fill="#bfbfbf" />
        <circle cx="24" cy="40" r="2" fill="#bfbfbf" />
        <circle cx="8" cy="24" r="2" fill="#bfbfbf" />
    </svg>
);

export const Collaboration = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="14" r="6" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <circle cx="32" cy="14" r="6" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <path d="M6 36C6 28 10 24 16 24C20 24 22 26 24 26C26 26 28 24 32 24C38 24 42 28 42 36" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="34" r="6" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <path d="M18 40L24 34L30 40" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Integration = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="14" height="14" rx="3" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <rect x="28" y="6" width="14" height="14" rx="3" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <rect x="6" y="28" width="14" height="14" rx="3" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <rect x="28" y="28" width="14" height="14" rx="3" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <line x1="20" y1="13" x2="28" y2="13" stroke="#bfbfbf" strokeWidth="2" />
        <line x1="13" y1="20" x2="13" y2="28" stroke="#bfbfbf" strokeWidth="2" />
        <line x1="35" y1="20" x2="35" y2="28" stroke="#bfbfbf" strokeWidth="2" />
        <line x1="20" y1="35" x2="28" y2="35" stroke="#bfbfbf" strokeWidth="2" />
    </svg>
);

// Security Icons
export const Shield = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L6 12V22C6 33 14 42 24 44C34 42 42 33 42 22V12L24 4Z" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <path d="M17 24L22 29L31 20" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Lock = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="28" height="22" rx="4" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <path d="M16 20V14C16 9.58 19.58 6 24 6C28.42 6 32 9.58 32 14V20" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <circle cx="24" cy="31" r="3" fill="#bfbfbf" />
        <line x1="24" y1="34" x2="24" y2="38" stroke="#bfbfbf" strokeWidth="2" />
    </svg>
);

export const Eye = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 24C4 24 12 10 24 10C36 10 44 24 44 24C44 24 36 38 24 38C12 38 4 24 4 24Z" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="6" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <circle cx="24" cy="24" r="2" fill="#bfbfbf" />
    </svg>
);

export const Key = ({ className = "w-12 h-12" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="32" r="10" stroke="#bfbfbf" strokeWidth="2" fill="none" />
        <line x1="24" y1="24" x2="42" y2="6" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <line x1="36" y1="12" x2="42" y2="12" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <line x1="32" y1="16" x2="38" y2="16" stroke="#bfbfbf" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="32" r="4" fill="#bfbfbf" />
    </svg>
);

// Footer Social Icons
export const Github = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.839 21.489C9.339 21.581 9.521 21.278 9.521 21.017C9.521 20.782 9.512 20.082 9.508 19.226C6.726 19.829 6.139 17.904 6.139 17.904C5.685 16.763 5.029 16.461 5.029 16.461C4.121 15.842 5.098 15.854 5.098 15.854C6.101 15.924 6.629 16.878 6.629 16.878C7.521 18.394 8.97 17.959 9.539 17.707C9.631 17.066 9.889 16.632 10.175 16.42C7.954 16.205 5.62 15.328 5.62 11.533C5.62 10.453 6.01 9.566 6.649 8.871C6.546 8.656 6.203 7.644 6.747 6.263C6.747 6.263 7.587 6.033 9.497 7.329C10.295 7.14 11.15 7.045 12 7.041C12.85 7.045 13.705 7.14 14.505 7.329C16.413 6.033 17.251 6.263 17.251 6.263C17.797 7.644 17.454 8.656 17.351 8.871C17.992 9.566 18.38 10.453 18.38 11.533C18.38 15.338 16.042 16.202 13.813 16.412C14.172 16.684 14.495 17.224 14.495 18.044C14.495 19.212 14.483 20.553 14.483 21.017C14.483 21.28 14.663 21.586 15.171 21.487C19.138 20.163 22 16.416 22 12C22 6.477 17.523 2 12 2Z" />
    </svg>
);

export const Twitter = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const LinkedIn = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

export const Check = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Star = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
);

export const ChevronDown = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Menu = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const Close = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

// New Dashboard Icons
export const LayoutDashboard = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="12" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="16" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Sitemap = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="3" width="4" height="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7V13" stroke="currentColor" strokeWidth="2" />
        <path d="M4 13C4 13 4 10 12 10C20 10 20 13 20 13" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="13" width="4" height="4" stroke="currentColor" strokeWidth="2" />
        <rect x="18" y="13" width="4" height="4" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="13" width="4" height="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 17V20" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const Globe = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const Database = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="2" />
        <path d="M21 12C21 13.66 16.97 15 12 15C7.03 15 3 13.66 3 12" stroke="currentColor" strokeWidth="2" />
        <path d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export const Layers = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Cloud = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 10H17.74C17.6534 8.79058 17.2001 7.6432 16.4426 6.66667C15.6852 5.69014 14.6611 4.93322 13.5133 4.50285C12.3655 4.07248 11.1508 3.99042 9.97935 4.2682C8.80788 4.54599 7.73887 5.16912 6.92 6.05C5.87707 7.15243 5.37894 8.65751 5.53 10.17C4.19507 10.5186 3.06456 11.3653 2.36442 12.5398C1.66428 13.7142 1.44654 15.129 1.75545 16.4952C2.06437 17.8614 2.87693 19.0792 4.02704 19.9015C5.17715 20.7238 6.57948 21.0903 7.95 20.92H18C19.0609 20.92 20.0783 20.4986 20.8284 19.7485C21.5786 18.9984 22 17.9809 22 16.92C22 15.8591 21.5786 14.8416 20.8284 14.0915C20.0783 13.3414 19.0609 12.92 18 12.92V10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Zap = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Settings = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.22 2H11.78C11.23 2 10.75 2.37 10.61 2.91L10.34 4.09C9.72 4.29 9.14 4.58 8.61 4.95L7.54 4.51C7.03 4.3 6.46 4.45 6.13 4.88L5.27 6.01C4.98 6.39 5.01 6.92 5.34 7.27L6.29 8.21C6.22 8.52 6.18 8.85 6.18 9.19C6.18 9.53 6.22 9.87 6.29 10.18L5.34 11.13C5.01 11.47 4.97 12 5.27 12.39L6.13 13.52C6.46 13.95 7.03 14.1 7.54 13.89L8.61 13.45C9.15 13.82 9.73 14.11 10.35 14.31L10.61 15.49C10.75 16.03 11.23 16.4 11.78 16.4H12.22C12.77 16.4 13.25 16.03 13.39 15.49L13.65 14.31C14.27 14.11 14.85 13.82 15.39 13.45L16.46 13.89C16.97 14.1 17.54 13.95 17.87 13.52L18.73 12.39C19.03 12 18.99 11.47 18.66 11.12L17.71 10.18C17.78 9.87 17.82 9.53 17.82 9.19C17.82 8.85 17.78 8.52 17.71 8.21L18.66 7.27C18.99 6.92 19.03 6.39 18.73 6.01L17.87 4.88C17.54 4.45 16.97 4.3 16.46 4.51L15.39 4.95C14.86 4.58 14.28 4.29 13.66 4.09L13.39 2.91C13.25 2.37 12.77 2 12.22 2ZM12 11.8C10.56 11.8 9.4 10.64 9.4 9.2C9.4 7.76 10.56 6.6 12 6.6C13.44 6.6 14.6 7.76 14.6 9.2C14.6 10.64 13.44 11.8 12 11.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const FileText = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
