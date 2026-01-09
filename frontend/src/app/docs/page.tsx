import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Documentation - Eonix',
    description: 'Documentation for Eonix - The Semantic Repository Mapping Platform',
};

export default function DocsPage() {
    return (
        <div style={{ maxWidth: '800px', padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Introduction
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333333', marginBottom: '32px' }}>
                Welcome to the Eonix documentation. Eonix is a platform that transforms your codebase into
                living architectural maps, giving you visibility and control over your software ecosystem
                through semantic analysis.
            </p>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px', color: '#1a1a1a' }}>
                    What is Eonix?
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '24px' }}>
                    Eonix connects to your repositories (GitHub, GitLab, etc.) and analyzes the code to build
                    a comprehensive semantic graph. This graph represents not just the files, but the
                    relationships between functions, classes, API endpoints, and database models.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div style={{ padding: '24px', border: '1px solid #eaeaea', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
                        Architectural Mapping
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666666', marginBottom: '16px' }}>
                        Visualize your entire stack, from frontend components to database schemas, in a dynamic graph.
                    </p>
                    <Link href="/docs/features" style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', textDecoration: 'underline' }}>
                        Learn more &rarr;
                    </Link>
                </div>
                <div style={{ padding: '24px', border: '1px solid #eaeaea', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
                        Semantic Search
                    </h3>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#666666', marginBottom: '16px' }}>
                        Ask questions about your code in plain English and get answers based on actual logic.
                    </p>
                    <Link href="/docs/semantic-search" style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', textDecoration: 'underline' }}>
                        Learn more &rarr;
                    </Link>
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px', color: '#1a1a1a' }}>
                    Next Steps
                </h2>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link
                        href="/docs/getting-started"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '15px'
                        }}
                    >
                        Get Started
                    </Link>
                    <Link
                        href="/signup"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#ffffff',
                            color: '#1a1a1a',
                            border: '1px solid #e0e0e0',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            fontWeight: 500,
                            fontSize: '15px'
                        }}
                    >
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
