import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Core Features - Eonix Docs',
    description: 'Explore the powerful features of Eonix: Architectural Mapping, Semantic Search, and more.',
};

export default function FeaturesPage() {
    return (
        <div style={{ maxWidth: '800px', padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Core Features
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333333', marginBottom: '40px' }}>
                Discover how Eonix helps you understand and manage your complex software architecture.
            </p>

            <div id="mapping" style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px', color: '#1a1a1a' }}>
                    Architectural Mapping
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '24px' }}>
                    The core of Eonix is its ability to generate a dynamic, interactive graph of your entire codebase.
                    Unlike simple file explorers, the Architectural Map shows you <strong>relationships</strong>.
                </p>
                <ul style={{ paddingLeft: '24px', color: '#444444', lineHeight: 1.8, marginBottom: '24px' }}>
                    <li style={{ marginBottom: '8px' }}><strong>Visual Nodes:</strong> See files, classes, and functions as distinct nodes.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Dependencies:</strong> Arrows indicate import statements, function calls, and inheritance.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Clustering:</strong> Related modules are automatically grouped together.</li>
                </ul>
            </div>

            <div id="search" style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px', color: '#1a1a1a' }}>
                    Semantic Search
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '24px' }}>
                    Stop grepping for strings. Use natural language to query your codebase.
                </p>
                <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '24px' }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#1a1a1a', marginBottom: '8px' }}>
                        <strong>User:</strong> "Where is user authentication handled?"
                    </p>
                    <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#0066cc' }}>
                        <strong>Eonix:</strong> "Authentication is primarily handled in <code>src/auth/service.ts</code> using the <code>login</code> function. It validates tokens via middleware in <code>src/middleware/auth.ts</code>."
                    </p>
                </div>
            </div>

            <div id="dependency" style={{ marginBottom: '60px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '20px', color: '#1a1a1a' }}>
                    Dependency Analysis
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '24px' }}>
                    Identify spaghetti code and circular dependencies before they become a problem.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444' }}>
                    Eonix highlights tightly coupled components, helping you plan refactors and microservice extractions with confidence.
                </p>
            </div>
        </div>
    );
}
