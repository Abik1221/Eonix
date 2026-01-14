'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ============================================================================
   PRICING 
   Clean pricing cards with white backgrounds on a light gray section.
   Highlighted plan uses a subtle gradient border.
   ============================================================================ */

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Perfect for solo devs exploring their architecture.',
        features: [
            '1 workspace',
            '1 repository',
            'Basic architecture map',
            'Static analysis only',
            'Community support'
        ],
        buttonText: 'Get started',
        highlight: false
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'For indie founders and early-stage startups.',
        features: [
            '3 workspaces',
            '10 repositories',
            'Full architecture visualization',
            'AI explanations (200/mo)',
            'GitHub integration',
            'Priority support'
        ],
        buttonText: 'Start free trial',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'For large teams needing control and compliance.',
        features: [
            'Unlimited everything',
            'SSO & SAML',
            'On-premise deployment',
            'SOC2 / ISO compliance',
            'Dedicated success manager',
            'Custom SLA'
        ],
        buttonText: 'Contact sales',
        highlight: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" style={{
            backgroundColor: '#ffffff',
            padding: '140px 0',
            position: 'relative'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        color: '#6366f1',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '16px'
                    }}>
                        Pricing
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(36px, 5vw, 52px)',
                        fontWeight: 700,
                        color: '#18181b',
                        letterSpacing: '-0.03em',
                        marginBottom: '16px'
                    }}>
                        Simple, transparent pricing
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '18px',
                        color: '#52525b',
                        maxWidth: '500px',
                        margin: '0 auto'
                    }}>
                        Start for free. Upgrade when you're ready.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    alignItems: 'stretch'
                }}>
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                position: 'relative',
                                padding: plan.highlight ? '2px' : '0',
                                background: plan.highlight
                                    ? '#6366f1'
                                    : 'transparent',
                                borderRadius: '20px'
                            }}
                        >
                            <div style={{
                                padding: '36px',
                                background: '#ffffff',
                                border: plan.highlight ? 'none' : '1px solid #e4e4e7',
                                borderRadius: plan.highlight ? '18px' : '20px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Plan Name */}
                                <div style={{
                                    fontFamily: 'var(--font-heading)',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#18181b',
                                    marginBottom: '8px'
                                }}>
                                    {plan.name}
                                </div>

                                {/* Price */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    marginBottom: '12px'
                                }}>
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '48px',
                                        fontWeight: 700,
                                        color: '#18181b',
                                        letterSpacing: '-2px'
                                    }}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span style={{
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '16px',
                                            color: '#71717a',
                                            marginLeft: '4px'
                                        }}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '15px',
                                    color: '#52525b',
                                    marginBottom: '28px',
                                    lineHeight: 1.5
                                }}>
                                    {plan.description}
                                </p>

                                {/* Features */}
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '0 0 28px 0',
                                    flex: 1
                                }}>
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '14px',
                                            color: '#3f3f46',
                                            marginBottom: '12px'
                                        }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button style={{
                                    width: '100%',
                                    padding: '14px 24px',
                                    background: plan.highlight ? '#18181b' : 'transparent',
                                    color: plan.highlight ? '#ffffff' : '#18181b',
                                    border: plan.highlight ? 'none' : '1px solid #d4d4d8',
                                    borderRadius: '100px',
                                    fontFamily: 'var(--font-body)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {plan.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
