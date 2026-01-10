import React from 'react';

const steps = [
    {
        number: '01',
        title: 'We Extract (No Guessing)',
        description: 'Your code is parsed using compilers and ASTs to build a verified architecture graph.'
    },
    {
        number: '02',
        title: 'We Visualize (Pure Data)',
        description: 'Services, APIs, databases, events, and dependencies are rendered as interactive diagrams.'
    },
    {
        number: '03',
        title: 'AI Explains (Zero Hallucinations)',
        description: 'AI summarizes flows, explains risks, and answers architectural questions — without inventing anything.'
    },
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
                        Three simple steps
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
