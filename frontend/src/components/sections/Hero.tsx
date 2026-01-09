import React from 'react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section style={{
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: '64px', // Offset for navbar
        }}>
            <div className="container">
                <div style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '0 16px'
                }}>
                    {/* Headline - Responsive */}
                    <h1 style={{
                        fontSize: 'clamp(32px, 8vw, 56px)',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: '#1a1a1a',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em'
                    }}>
                        Map Your Architecture.
                        <br />
                        <span style={{ color: '#404040' }}>Understand Your Code.</span>
                    </h1>

                    {/* Subheadline */}
                    <p style={{
                        fontSize: 'clamp(16px, 3vw, 18px)',
                        color: '#333333',
                        lineHeight: 1.7,
                        marginBottom: '36px',
                        maxWidth: '540px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        Transform your code into living architectural maps. Gain visibility and
                        control over your software ecosystem with semantic analysis.
                    </p>

                    {/* CTA Buttons - Responsive */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            href="/signup"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                backgroundColor: '#1a1a1a',
                                color: '#ffffff',
                                fontSize: '15px',
                                fontWeight: 500,
                                borderRadius: '8px',
                                minWidth: '160px',
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            Start Mapping
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link
                            href="#demo"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 28px',
                                backgroundColor: '#ffffff',
                                color: '#1a1a1a',
                                fontSize: '15px',
                                fontWeight: 500,
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                minWidth: '160px',
                                transition: 'border-color 0.2s ease'
                            }}
                        >
                            Watch Demo
                        </Link>
                    </div>


                </div>
            </div>
        </section>
    );
}
