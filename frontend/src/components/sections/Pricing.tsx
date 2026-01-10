import React from 'react';

const plans = [
    {
        name: 'Free',
        price: '$0',
        period: '/month',
        description: 'Explore your architecture. Perfect for solo devs & side projects.',
        features: [
            'Monolithic Architecture Only',
            '1 Workspace',
            '1 Project & 1 Repository',
            '1 Backend Service',
            'Basic Frontend ↔ Backend Mapping',
            'Static Analysis (Read-only)',
            'Service Interaction Graph'
        ],
        excluded: [
            'Microservices Support',
            'AI Explanations',
            'Jira / Slack Integrations',
            'Export (Watermarked Only)'
        ],
        buttonText: 'Get Started',
        highlight: false,
        buttonVariant: 'outline'
    },
    {
        name: 'Pro',
        price: '$29',
        period: '/month',
        description: 'Ship faster. For indie founders & early-stage startups.',
        features: [
            'Monolith & Microservices',
            '3 Workspaces',
            'Up to 2 Projects',
            '10 Repositories per Project',
            'Up to 8 Backend Services',
            'Full Frontend Visualization',
            'AI Explanations (200/mo)',
            'GitHub Integration',
            'Standard Rule Engine',
            'Manual Exports (PNG / Mermaid)'
        ],
        excluded: [
            'Jira / Slack Integrations',
            'Version History'
        ],
        buttonText: 'Start Pro Trial',
        highlight: true,
        buttonVariant: 'primary'
    },
    {
        name: 'Business',
        price: '$199',
        period: '/month',
        description: 'Scale with confidence. For growing teams & scale-ups.',
        features: [
            'Monolith & Microservices',
            '10 Projects',
            '30 Repositories per Project',
            'Up to 40 Backend Services',
            'Unlimited AI Explanations (Fair-use)',
            'Jira & Slack Integration',
            'Version History (Time Travel)',
            'Advanced Rules (AQL)',
            'Role-based Dashboards',
            'Priority Processing Queue'
        ],
        excluded: [],
        buttonText: 'Start Trial',
        highlight: false,
        buttonVariant: 'outline'
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        description: 'Control & compliance. For large orgs & regulated industries.',
        features: [
            'Unlimited Repos & Services',
            'SSO (SAML / Okta / Azure AD)',
            'On-prem / VPC Deployment',
            'SOC2 / ISO27001 Support',
            'Full Audit Logs',
            'Custom Rules Engine',
            'Dedicated Support & SLA',
            'Security Reviews'
        ],
        excluded: [],
        buttonText: 'Contact Sales',
        highlight: false,
        buttonVariant: 'outline'
    }
];

export default function Pricing() {
    return (
        <section id="pricing" style={{ backgroundColor: '#fafafa', padding: '100px 0' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <p style={{
                        fontSize: '13px',
                        color: '#6366f1',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        marginBottom: '16px'
                    }}>
                        Pricing Plans
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 42px)',
                        fontWeight: 800,
                        color: '#1a1a1a',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Choose the right plan for your stack
                    </h2>
                    <p style={{
                        fontSize: 'clamp(16px, 3vw, 18px)',
                        color: '#666666',
                        maxWidth: '540px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Start for free, upgrade when you need more power. No credit card required for free tier.
                    </p>
                </div>

                {/* Pricing Cards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    justifyContent: 'center',
                    alignItems: 'stretch'
                }}>
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '32px',
                                backgroundColor: '#ffffff',
                                border: plan.highlight ? '2px solid #1a1a1a' : '1px solid #eaeaea',
                                borderRadius: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                boxShadow: plan.highlight ? '0 20px 40px -12px rgba(0,0,0,0.12)' : '0 4px 6px -1px rgba(0,0,0,0.02)',
                                transform: plan.highlight ? 'scale(1.02)' : 'none',
                                zIndex: plan.highlight ? 10 : 1,
                                transition: 'transform 0.2s ease'
                            }}
                        >
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-12px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#1a1a1a',
                                    color: '#fff',
                                    padding: '4px 12px',
                                    borderRadius: '100px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    whiteSpace: 'nowrap'
                                }}>
                                    Most Popular
                                </div>
                            )}

                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#1a1a1a',
                                    marginBottom: '8px'
                                }}>
                                    {plan.name}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#666666', minHeight: '42px', marginBottom: '24px', lineHeight: 1.5 }}>
                                    {plan.description}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '42px', fontWeight: 800, color: '#1a1a1a', letterSpacing: '-1px' }}>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span style={{ fontSize: '15px', color: '#666666', marginLeft: '6px', fontWeight: 500 }}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Features List */}
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 32px 0',
                                flex: 1
                            }}>
                                {/* Included Features */}
                                {plan.features.map((feature, idx) => (
                                    <li key={`inc-${idx}`} style={{
                                        display: 'flex',
                                        alignItems: 'start',
                                        fontSize: '14px',
                                        color: '#374151',
                                        marginBottom: '12px',
                                        lineHeight: 1.5
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', flexShrink: 0, marginTop: '2px' }}>
                                            <circle cx="12" cy="12" r="10" fill="#dcfce7" />
                                            <path d="M16 9L10.5 14.5L8 12" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}

                                {/* Excluded Features (dimmed) */}
                                {plan.excluded && plan.excluded.map((feature, idx) => (
                                    <li key={`exc-${idx}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        fontSize: '14px',
                                        color: '#9ca3af',
                                        marginBottom: '12px'
                                    }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '10px', flexShrink: 0 }}>
                                            <path d="M18 6L6 18M6 6l12 12" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button style={{
                                width: '100%',
                                padding: '14px 24px',
                                backgroundColor: plan.buttonVariant === 'primary' ? '#1a1a1a' : '#ffffff',
                                color: plan.buttonVariant === 'primary' ? '#ffffff' : '#1a1a1a',
                                border: '1px solid #1a1a1a',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: plan.buttonVariant === 'primary' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
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
