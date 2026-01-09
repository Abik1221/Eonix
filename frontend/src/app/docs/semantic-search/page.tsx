import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Semantic Search - Eonix Docs',
    description: 'Learn how to use Eonix Semantic Search to query your codebase using natural language.',
};

export default function SemanticSearchPage() {
    return (
        <div style={{ maxWidth: '800px', padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Semantic Search
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333333', marginBottom: '40px' }}>
                Eonix allows you to ask questions about your codebase in plain English. Our advanced semantic search engine understands the intent behind your query and retrieves relevant code snippets, functions, and documentation.
            </p>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    How it Works
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    Unlike traditional text search (grep), Eonix converts your code and your queries into vector embeddings. This allows us to match concepts rather than just keywords.
                </p>
                <ul style={{ paddingLeft: '24px', color: '#444444', lineHeight: 1.8 }}>
                    <li style={{ marginBottom: '8px' }}><strong>Concept Matching:</strong> Searching for "login" will also find "authentication" and "sign in" logic.</li>
                    <li style={{ marginBottom: '8px' }}><strong>Context Aware:</strong> The search understands the structure of classes and functions.</li>
                </ul>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    Example Queries
                </h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                    {[
                        "How is user authentication implemented?",
                        "Where are API rate limits defined?",
                        "Show me the schema for the User model.",
                        "What happens when a payment fails?"
                    ].map((query) => (
                        <div key={query} style={{ padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px', fontFamily: 'monospace', color: '#1a1a1a' }}>
                            {query}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
