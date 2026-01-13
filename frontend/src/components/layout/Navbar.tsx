'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    FileText,
    Bot,
    Zap,
    Users,
    Building2,
    Rocket,
    BookOpen,
    Code2,
    MessageSquare,
    HelpCircle,
    Video,
    Newspaper,
    GraduationCap,
    Github
} from 'lucide-react';

/* ============================================================================
   NAVBAR COMPONENT - STRIPE STYLE WITH ANIMATED DROPDOWNS
   Modern mega-menu dropdowns with smooth animations
   ============================================================================ */

/* Dropdown content for each menu */
const dropdownContent = {
    Products: {
        sections: [
            {
                title: 'Core Features',
                items: [
                    { name: 'Architecture Visualization', description: 'Interactive codebase diagrams', icon: LayoutGrid, color: '#6366f1' },
                    { name: 'AI Analysis', description: 'Intelligent code insights', icon: Bot, color: '#8b5cf6' },
                    { name: 'Documentation', description: 'Auto-generated docs', icon: FileText, color: '#ec4899' },
                    { name: 'Flow Tracing', description: 'Track code execution paths', icon: Zap, color: '#f59e0b' },
                ]
            }
        ]
    },
    Solutions: {
        sections: [
            {
                title: 'By Team Size',
                items: [
                    { name: 'Startups', description: 'Move fast, stay organized', icon: Rocket, color: '#10b981' },
                    { name: 'Enterprise', description: 'Scale with confidence', icon: Building2, color: '#6366f1' },
                    { name: 'Teams', description: 'Collaborate effectively', icon: Users, color: '#8b5cf6' },
                ]
            }
        ]
    },
    Developers: {
        sections: [
            {
                title: 'Documentation',
                items: [
                    { name: 'API Reference', description: 'Complete API docs', icon: Code2, color: '#6366f1' },
                    { name: 'Guides', description: 'Step-by-step tutorials', icon: BookOpen, color: '#10b981' },
                    { name: 'Examples', description: 'Sample projects', icon: Github, color: '#18181b' },
                ]
            }
        ]
    },
    Resources: {
        sections: [
            {
                title: 'Learn',
                items: [
                    { name: 'Blog', description: 'Latest updates and tips', icon: Newspaper, color: '#6366f1' },
                    { name: 'Webinars', description: 'Live learning sessions', icon: Video, color: '#ec4899' },
                    { name: 'Academy', description: 'Free courses', icon: GraduationCap, color: '#f59e0b' },
                    { name: 'Community', description: 'Join the discussion', icon: MessageSquare, color: '#10b981' },
                    { name: 'Support', description: 'Get help', icon: HelpCircle, color: '#8b5cf6' },
                ]
            }
        ]
    }
};

const navLinks = [
    { name: 'Products', href: '#', hasDropdown: true },
    { name: 'Solutions', href: '#', hasDropdown: true },
    { name: 'Developers', href: '/docs', hasDropdown: true },
    { name: 'Resources', href: '#', hasDropdown: true },
    { name: 'Pricing', href: '/#pricing', hasDropdown: false },
];

/* Dropdown Panel Component */
const DropdownPanel = ({ content, isOpen }: { content: typeof dropdownContent.Products, isOpen: boolean }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        paddingTop: '12px',
                    }}
                >
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        padding: '20px',
                        minWidth: '320px',
                    }}>
                        {content.sections.map((section, sIdx) => (
                            <div key={sIdx}>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: '#71717a',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '12px',
                                    paddingLeft: '12px',
                                }}>
                                    {section.title}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {section.items.map((item, iIdx) => (
                                        <Link
                                            key={iIdx}
                                            href="#"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '10px 12px',
                                                borderRadius: '8px',
                                                transition: 'background 0.15s ease',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '8px',
                                                background: `${item.color}15`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: item.color,
                                            }}>
                                                <item.icon size={18} />
                                            </div>
                                            <div>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: '#18181b',
                                                }}>
                                                    {item.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '13px',
                                                    color: '#71717a',
                                                }}>
                                                    {item.description}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

/* Nav Item with Dropdown */
const NavItem = ({ link }: { link: typeof navLinks[0] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
    };

    const content = dropdownContent[link.name as keyof typeof dropdownContent];

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={link.href}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: isOpen ? '#6366f1' : '#18181b',
                    padding: '8px 14px',
                    borderRadius: '100px',
                    transition: 'all 0.2s ease',
                    background: isOpen ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                }}
            >
                {link.name}
                {link.hasDropdown && (
                    <motion.svg
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                )}
            </Link>
            {link.hasDropdown && content && (
                <DropdownPanel content={content} isOpen={isOpen} />
            )}
        </div>
    );
};

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid transparent',
            transition: 'all 0.3s ease'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '72px'
                }}>
                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
                        <Logo size={32} color="#6366f1" />
                        <span style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#18181b',
                            letterSpacing: '-0.02em'
                        }}>
                            Eonix
                        </span>
                    </Link>

                    {/* Desktop Navigation with Dropdowns */}
                    <div className="hidden md:flex" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                    }}>
                        {navLinks.map((link) => (
                            <NavItem key={link.name} link={link} />
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex" style={{
                        alignItems: 'center',
                        gap: '20px',
                        zIndex: 10
                    }}>
                        <Link
                            href="/login"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontFamily: 'var(--font-body)',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#18181b',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Sign in
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link
                            href="/signup"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 18px',
                                background: '#18181b',
                                color: '#ffffff',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                fontWeight: 600,
                                borderRadius: '100px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#3f3f46'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#18181b'}
                        >
                            Contact sales
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            marginLeft: 'auto'
                        }}
                        aria-label="Toggle menu"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#18181b"
                            strokeWidth="2"
                        >
                            {isOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                            ) : (
                                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden"
                        style={{
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                            overflow: 'hidden',
                        }}
                    >
                        <div style={{ padding: '16px 20px' }}>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    style={{
                                        display: 'block',
                                        padding: '14px 0',
                                        fontSize: '15px',
                                        color: '#52525b',
                                        borderBottom: '1px solid #f4f4f5'
                                    }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e4e4e7' }}>
                                <Link
                                    href="/login"
                                    style={{
                                        display: 'block',
                                        padding: '14px 0',
                                        fontSize: '15px',
                                        color: '#52525b'
                                    }}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        background: '#18181b',
                                        color: '#ffffff',
                                        padding: '14px 20px',
                                        borderRadius: '100px',
                                        marginTop: '8px'
                                    }}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
