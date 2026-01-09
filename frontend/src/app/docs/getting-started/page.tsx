import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Getting Started - Eonix Docs',
    description: 'Learn how to set up your first Eonix project and start mapping your repository.',
};

export default function GettingStartedPage() {
    return (
        <div style={{ maxWidth: '800px', padding: '48px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '24px', color: '#1a1a1a' }}>
                Getting Started
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#333333', marginBottom: '40px' }}>
                Follow this guide to connect your first repository and generate your architectural map.
            </p>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    1. Create an Account
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    To use Eonix, you need an account. You can sign up using your GitHub or Google account.
                </p>
                <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '6px', border: '1px solid #eaeaea' }}>
                    <p style={{ fontSize: '14px', color: '#666666', marginBottom: '8px' }}>
                        <strong>Note:</strong> We recommend signing up with <strong>GitHub</strong> if you plan to analyze private repositories.
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    2. Connect a Repository
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    Once logged in, navigate to your Dashboard. You will see an option to "Add Repository".
                </p>
                <ol style={{ paddingLeft: '24px', color: '#444444', lineHeight: 1.8 }}>
                    <li style={{ marginBottom: '8px' }}>Click the <strong>Add Repository</strong> button.</li>
                    <li style={{ marginBottom: '8px' }}>Enter the URL of your Git repository (e.g., <code>https://github.com/username/repo</code>).</li>
                    <li style={{ marginBottom: '8px' }}>If the repository is private, you will need to provide an Access Token.</li>
                    <li>Click <strong>Start Analysis</strong>.</li>
                </ol>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '16px', color: '#1a1a1a' }}>
                    3. Wait for Analysis
                </h2>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444', marginBottom: '16px' }}>
                    Eonix will clone your repository and perform deep semantic analysis. This process can take a few minutes depending on the size of your codebase.
                </p>
                <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444444' }}>
                    You will be notified when the analysis is complete and your architectural graph is ready to view.
                </p>
            </div>

            <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid #eaeaea' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: '#1a1a1a' }}>
                    What's Next?
                </h3>
                <Link
                    href="/docs/features"
                    style={{ fontSize: '15px', color: '#1a1a1a', textDecoration: 'underline' }}
                >
                    Explore Core Features &rarr;
                </Link>
            </div>
        </div>
    );
}
