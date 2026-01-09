import React from 'react';

const plans = [
    {
        name: 'Developer',
        price: 'Free',
        description: 'Perfect for individual developers and open source projects.',
        features: [
            '1 Workspace',
            'Up to 3 Projects',
            'Basic Architecture Graph',
            'Community Support',
            '7-day History'
        ],
        buttonText: 'Get Started',
        highlight: false
    },
    {
        name: 'Team',
        price: '$49',
        period: '/month',
        description: 'For growing teams building complex software systems.',
        features: [
            'Unlimited Workspaces',
            'Unlimited Projects',
            'Advanced Insights & AI',
            'Priority Email Support',
            '90-day History',
            'Team Collaboration'
        ],
        buttonText: 'Start Free Trial',
        highlight: true
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'Security, control, and support for large organizations.',
        features: [
            'SSO & SAML',
            'On-premise Deployment',
            'Custom Integrations',
            'Dedicated Success Manager',
            'Unlimited History',
            'Audit Logs'
        ],
        buttonText: 'Contact Sales',
        highlight: false
    }
];

export default function Pricing() {
    return (
        <section id="pricing" style={{ backgroundColor: '#fafafa', padding: '80px 0' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#888888',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '12px'
                    }}>
                        Pricing
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 36px)',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '12px'
                    }}>
                        Simple, transparent pricing
                    </h2>
                    <p style={{
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        color: '#666666',
                        maxWidth: '480px',
                        margin: '0 auto'
                    }}>
                        Start for free, scale as you grow. No credit card required.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '24px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                flex: '1 1 300px',
                                maxWidth: '380px',
                                padding: '32px',
                                backgroundColor: '#ffffff',
                                border: plan.highlight ? '2px solid #1a1a1a' : '1px solid #eaeaea',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                boxShadow: plan.highlight ? '0 12px 24px rgba(0,0,0,0.08)' : 'none'
                            }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '8px'
                                }}>
                                    {plan.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: 700, color: '#1a1a1a' }}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span style={{ fontSize: '14px', color: '#666666', marginLeft: '4px' }}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <p style={{ fontSize: '14px', color: '#666666', minHeight: '42px' }}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 32px 0',
                                flex: 1
                            }}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#4a4a4a',
                                        marginBottom: '12px'
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '10px', flexShrink: 0 }}>
                                            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button style={{
                                width: '100%',
                                padding: '12px 24px',
                                backgroundColor: plan.highlight ? '#1a1a1a' : '#ffffff',
                                color: plan.highlight ? '#ffffff' : '#1a1a1a',
                                border: '1px solid #1a1a1a',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
