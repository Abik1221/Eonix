'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const navLinks = [
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Docs', href: '/docs' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on resize
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
            backgroundColor: scrolled ? '#ffffff' : 'transparent',
            borderBottom: scrolled ? '1px solid #eaeaea' : '1px solid transparent',
            transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '64px'
                }}>
                    {/* Logo - Flex Item */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, flexShrink: 0 }}>
                        <Logo size={28} color="#1a1a1a" />
                        <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a' }}>Eonix</span>
                    </Link>

                    {/* Desktop Nav - Flex 1 to fill middle space */}
                    <div className="hidden md:flex" style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '32px'
                    }}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA - Flex Item (pushed right by Nav) */}
                    <div className="hidden md:flex" style={{
                        alignItems: 'center',
                        gap: '16px',
                        zIndex: 10,
                        flexShrink: 0
                    }}>
                        <Link href="/login" style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a' }}>
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                backgroundColor: '#1a1a1a',
                                color: '#ffffff',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button - Right Aligned on mobile */}
                    <button
                        className="mobile-only"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            padding: '8px',
                            display: 'flex', // This will be overridden by !important on desktop
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
                            stroke="#1a1a1a"
                            strokeWidth="2"
                            style={{ transition: 'transform 0.2s ease' }}
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
            <div
                className="md:hidden"
                style={{
                    backgroundColor: '#ffffff',
                    borderTop: isOpen ? '1px solid #eaeaea' : 'none',
                    maxHeight: isOpen ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease, opacity 0.3s ease',
                    opacity: isOpen ? 1 : 0
                }}
            >
                <div style={{ padding: '16px 20px' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontSize: '15px',
                                color: '#666666',
                                borderBottom: '1px solid #f5f5f5'
                            }}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eaeaea' }}>
                        <Link
                            href="/login"
                            style={{
                                display: 'block',
                                padding: '12px 0',
                                fontSize: '15px',
                                color: '#666666'
                            }}
                        >
                            Log in
                        </Link>
                        <Link
                            href="/signup"
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontWeight: 500,
                                backgroundColor: '#1a1a1a',
                                color: '#ffffff',
                                padding: '14px 20px',
                                borderRadius: '8px',
                                marginTop: '8px'
                            }}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
