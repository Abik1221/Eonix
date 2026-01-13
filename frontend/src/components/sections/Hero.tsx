'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

/* ============================================================================
   HERO COMPONENT 
   Split layout with headline on the left and product mockups on the right.
   Features vibrant animated gradient mesh background.
   
   Key design elements:
   - Left-aligned large headline with gradient text
   - Floating product UI cards on the right
   - Subtle announcement banner at top
   - Clean, minimal CTAs
   ============================================================================ */

/* Lazy load the gradient mesh for better performance */
const GradientMesh = dynamic(
    () => import('@/components/visuals/GradientMesh'),
    { ssr: false }
);

/* Memoized Product Card mockup */
const ProductCard = memo(function ProductCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                width: '320px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                transform: 'rotate(2deg)'
            }}
        >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '15px', color: '#18181b' }}>
                        Architecture Map
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#71717a' }}>
                        47 services mapped
                    </div>
                </div>
            </div>

            {/* Service Items */}
            {['Auth Service', 'Payment API', 'User Service'].map((service, i) => (
                <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: i > 0 ? '1px solid #f4f4f5' : 'none'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#f59e0b'
                        }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#18181b' }}>
                            {service}
                        </span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#a1a1aa' }}>
                        {i === 0 ? '12 endpoints' : i === 1 ? '8 endpoints' : '15 endpoints'}
                    </span>
                </div>
            ))}

            {/* Action Button */}
            <button style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px',
                background: '#18181b',
                color: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
            }}>
                View Full Map →
            </button>
        </motion.div>
    );
});

/* Memoized Stats Card */
const StatsCard = memo(function StatsCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                width: '280px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-3deg)',
                position: 'absolute',
                top: '60%',
                right: '10%'
            }}
        >
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#71717a', marginBottom: '8px' }}>
                Analysis Complete
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '28px', fontWeight: 700, color: '#18181b' }}>
                847 <span style={{ fontSize: '16px', color: '#10b981' }}>+12%</span>
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#71717a' }}>
                Code connections mapped
            </div>

            {/* Mini Chart */}
            <div style={{ display: 'flex', alignItems: 'end', gap: '3px', marginTop: '16px', height: '40px' }}>
                {[30, 45, 35, 60, 50, 75, 65, 80, 70, 90].map((h, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: `${h}%`,
                        background: `linear-gradient(to top, #6366f1, #a78bfa)`,
                        borderRadius: '2px',
                        opacity: 0.7 + (i * 0.03)
                    }} />
                ))}
            </div>
        </motion.div>
    );
});

/* Memoized Flow Card - Shows code flow tracing */
const FlowCard = memo(function FlowCard() {
    const flowNodes = [
        { id: 1, label: 'Source', icon: '{ }', color: '#6366f1' },
        { id: 2, label: 'Parse', icon: '⟨⟩', color: '#8b5cf6' },
        { id: 3, label: 'Graph', icon: '◉', color: '#ec4899' },
        { id: 4, label: 'View', icon: '◫', color: '#f59e0b' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: -2 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                width: '300px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                transform: 'rotate(-2deg)',
                position: 'absolute',
                top: '25%',
                right: '-5%'
            }}
        >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #ec4899, #f59e0b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '14px', color: '#18181b' }}>
                        Code Flow Trace
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#71717a' }}>
                        Real-time execution paths
                    </div>
                </div>
            </div>

            {/* Flow Visualization */}
            <div style={{ position: 'relative', padding: '12px 0' }}>
                {/* SVG Connecting Lines with Animation */}
                <svg
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none'
                    }}
                >
                    <defs>
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="50%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                    </defs>
                    {/* Animated connection line */}
                    <motion.line
                        x1="35" y1="28" x2="245" y2="28"
                        stroke="url(#flowGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                    />
                </svg>

                {/* Flow Nodes */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {flowNodes.map((node, i) => (
                        <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 + (i * 0.15) }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <motion.div
                                animate={{
                                    boxShadow: [
                                        `0 0 0 0 ${node.color}40`,
                                        `0 0 0 8px ${node.color}00`,
                                        `0 0 0 0 ${node.color}40`
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${node.color}, ${node.color}cc)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    color: '#fff',
                                    fontWeight: 600
                                }}
                            >
                                {node.icon}
                            </motion.div>
                            <span style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '10px',
                                color: '#71717a',
                                fontWeight: 500
                            }}>
                                {node.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Flow Stats */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
                padding: '12px',
                background: '#fafafa',
                borderRadius: '10px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#18181b' }}>
                        2.3k
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#71717a' }}>
                        Paths traced
                    </div>
                </div>
                <div style={{ width: '1px', background: '#e4e4e7' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#18181b' }}>
                        156
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#71717a' }}>
                        Entry points
                    </div>
                </div>
                <div style={{ width: '1px', background: '#e4e4e7' }} />
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#10b981' }}>
                        <span style={{ fontSize: '12px' }}>▲</span> 99%
                    </div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: '#71717a' }}>
                        Coverage
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

export default function Hero() {
    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#ffffff'
        }}>
            {/* Animated Gradient Mesh Background */}
            <GradientMesh />

            {/* Content Container */}
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '60px',
                    alignItems: 'center',
                    minHeight: '100vh',
                    paddingTop: '80px',
                    paddingBottom: '60px'
                }}>
                    {/* Left Side - Text Content */}
                    <div>
                        {/* Announcement Banner */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link
                                href="#"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px 8px 10px',
                                    background: 'rgba(24, 24, 27, 0.9)',
                                    borderRadius: '100px',
                                    marginBottom: '32px',
                                    transition: 'background 0.2s ease'
                                }}
                            >
                                <span style={{
                                    background: '#6366f1',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    padding: '4px 8px',
                                    borderRadius: '100px',
                                    fontFamily: 'var(--font-body)'
                                }}>
                                    NEW
                                </span>
                                <span style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '14px',
                                    color: '#ffffff'
                                }}>
                                    AI-powered architecture analysis
                                </span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: 'clamp(48px, 6vw, 76px)',
                                fontWeight: 700,
                                lineHeight: 1.05,
                                letterSpacing: '-0.03em',
                                marginBottom: '28px',
                                color: '#18181b'
                            }}
                        >
                            Semantic{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                infrastructure
                            </span>
                            <br />
                            to map your
                            <br />
                            <span style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                codebase
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '18px',
                                color: '#52525b',
                                lineHeight: 1.7,
                                marginBottom: '36px',
                                maxWidth: '480px'
                            }}
                        >
                            Join thousands of engineering teams that use Eonix to understand their architecture,
                            visualize dependencies, and let AI explain complex code flows.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            style={{
                                display: 'flex',
                                gap: '16px',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Link
                                href="/signup"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '14px 28px',
                                    background: '#18181b',
                                    color: '#ffffff',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    borderRadius: '100px',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                Start mapping
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            <Link
                                href="#pricing"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '14px 28px',
                                    background: 'transparent',
                                    color: '#18181b',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    borderRadius: '100px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Contact sales
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Side - Product Mockups */}
                    <div style={{ position: 'relative', height: '600px' }}>
                        <ProductCard />
                        <StatsCard />
                        <FlowCard />
                    </div>
                </div>
            </div>
        </section>
    );
}
