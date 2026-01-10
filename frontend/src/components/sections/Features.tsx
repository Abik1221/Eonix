import React from 'react';

const features = [
    {
        title: 'Explain Endpoints',
        question: 'What does this service do?',
        value: 'AI generates a context-aware summary of the service’s role and dependencies.',
        icon: '🔍',
        color: 'bg-blue-50 text-blue-600'
    },
    {
        title: 'Assess Risks',
        question: 'Why is this shared DB dangerous?',
        value: 'AI highlights coupling, points of failure, and violation of 12-factor principles.',
        icon: '⚠️',
        color: 'bg-orange-50 text-orange-600'
    },
    {
        title: 'System Summary',
        question: 'Summarize this ecosystem.',
        value: 'Instant high-level overview of microservices, events, and data flow.',
        icon: '🧠',
        color: 'bg-purple-50 text-purple-600'
    },
    {
        title: 'Grounded QA',
        question: 'What breaks if I change this?',
        value: 'Answers referenced directly from your verified architecture graph.',
        icon: '💬',
        color: 'bg-green-50 text-green-600'
    },
];

export default function Features() {
    return (
        <section id="features" style={{ backgroundColor: '#ffffff', padding: '120px 0' }}>
            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 48px)',
                        fontWeight: 800,
                        color: '#1a1a1a',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                    }}>
                        AI That Understands Your Architecture
                        <br />
                        <span style={{ color: '#6366f1' }}>Not Just Your Code</span>
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: '#4b5563',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Get instant, architecturally-aware answers without hallucination risk.
                    </p>
                </div>

                {/* Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '40px',
                    alignItems: 'stretch'
                }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '32px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #f1f5f9',
                                borderRadius: '24px',
                                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                height: '100%'
                            }}
                            className="group hover:translate-y-[-4px] hover:shadow-xl hover:border-indigo-100"
                        >
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    backgroundColor: '#f8fafc'
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}>
                                    {feature.title}
                                </h3>
                            </div>

                            {/* Chat interaction simulation */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* User Question styling */}
                                <div style={{
                                    alignSelf: 'flex-end',
                                    backgroundColor: '#f1f5f9',
                                    color: '#475569',
                                    padding: '12px 18px',
                                    borderRadius: '16px 16px 0 16px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    maxWidth: '90%',
                                    position: 'relative'
                                }}>
                                    "{feature.question}"
                                </div>

                                {/* AI Answer styling */}
                                <div style={{
                                    alignSelf: 'flex-start',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#ffffff',
                                    padding: '16px 20px',
                                    borderRadius: '16px 16px 16px 0',
                                    fontSize: '15px',
                                    lineHeight: 1.5,
                                    fontWeight: 500,
                                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                                }}>
                                    {feature.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
