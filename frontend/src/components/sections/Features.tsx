import React from 'react';

const features = [
    {
        title: 'Static Analysis',
        description: 'Uses compilers and parsers to extract accurate facts. Supports Python, TypeScript, Java, and Go.',
    },
    {
        title: 'Architecture Graph',
        description: 'Neo4j-powered graph database representing your architecture with Services, Endpoints, and Databases.',
    },
    {
        title: 'AI Insights',
        description: 'LangGraph pipeline that explains violations and suggests improvements based on your actual code.',
    },
    {
        title: 'Visualization',
        description: 'Interactive diagrams with semantic zoom. Filter by type, team, or violations.',
    },
    {
        title: 'Collaboration',
        description: 'Workspaces, projects, and roles. Comment threads on nodes with real-time sync.',
    },
    {
        title: 'CI/CD Integration',
        description: 'GitHub Actions for incremental parsing. Content hashing to cache unchanged files.',
    },
];

export default function Features() {
    return (
        <section id="features" style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
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
                        Features
                    </p>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 36px)',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '12px'
                    }}>
                        Everything you need
                    </h2>
                    <p style={{
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        color: '#666666',
                        maxWidth: '480px',
                        margin: '0 auto'
                    }}>
                        Complete toolkit for mapping, visualizing, and governing your software architecture.
                    </p>
                </div>

                {/* Grid - Responsive */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '28px',
                                border: '1px solid #eaeaea',
                                borderRadius: '12px',
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                            }}
                        >
                            <h3 style={{
                                fontSize: '17px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '10px'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: '#666666',
                                lineHeight: 1.6
                            }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
