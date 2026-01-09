import React from 'react';

const steps = [
    { number: '01', title: 'Connect', description: 'Link your GitHub, GitLab, or Bitbucket repositories via OAuth.' },
    { number: '02', title: 'Extract', description: 'Our parsers analyze your code to extract services, endpoints, and databases.' },
    { number: '03', title: 'Visualize', description: 'Interactive diagrams render your architecture with semantic zoom.' },
    { number: '04', title: 'Insights', description: 'AI explains violations and suggests improvements based on your code.' },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" style={{ backgroundColor: '#fafafa', padding: '80px 0' }}>
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
                        How It Works
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 36px)',
                        fontWeight: 700,
                        color: '#1a1a1a'
                    }}>
                        Four simple steps
                    </h2>
                </div>

                {/* Steps - Responsive Grid */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '32px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {steps.map((step, index) => (
                        <div key={index} style={{
                            flex: '1 1 240px',
                            textAlign: 'center',
                            padding: '16px'
                        }}>
                            <div style={{
                                fontSize: '28px',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                marginBottom: '16px'
                            }}>
                                {step.number}
                            </div>
                            <h3 style={{
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '8px'
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#666666',
                                lineHeight: 1.6
                            }}>
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
