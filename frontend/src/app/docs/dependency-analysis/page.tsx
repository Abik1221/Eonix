import React from 'react';

export const metadata = {
    title: 'Dependency Analysis - Eonix Docs',
    description: 'Understand the relationships and dependencies within your software architecture.',
};

export default function DependencyAnalysisPage() {
    return (
        <div style={{ maxWidth: '800px', padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Dependency Analysis
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333333', marginBottom: '40px' }}>
                Visualize and analyze the complex web of dependencies in your project. Eonix helps you identify tight coupling, circular dependencies, and architectural violations.
            </p>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    Visualizing Dependencies
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    The dependency graph shows how different modules interact.
                </p>
                <ul style={{ paddingLeft: '24px', color: '#444444', lineHeight: 1.8 }}>
                    <li style={{ marginBottom: '8px' }}><strong>Direct Imports:</strong> Explicit file-to-file imports.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Function Calls:</strong> Runtime dependencies between logic blocks.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Infrastructure:</strong> Connections to databases, queues, and external APIs.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    Impact Analysis
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    Before making a change, use Dependency Analysis to see what will be affected.
                </p>
                <div style={{ padding: '16px', backgroundColor: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', color: '#cc0000' }}>
                    <strong>Warning:</strong> Changing a shared utility function might break 15 other services. Eonix warns you about these risks.
                </div>
            </div>
        </div>
    );
}
