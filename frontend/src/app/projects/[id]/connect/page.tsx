'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Logo from '@/components/Logo';

export default function ConnectRepoPage() {
    const router = useRouter();
    const params = useParams();
    const [repoUrl, setRepoUrl] = useState('');
    const [repos, setRepos] = useState<string[]>([]);
    const [isConnecting, setIsConnecting] = useState(false);

    const handleAddRepo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl.trim()) return;
        if (repos.includes(repoUrl.trim())) {
            alert('Repository already added');
            return;
        }
        setRepos([...repos, repoUrl.trim()]);
        setRepoUrl('');
    };

    const handleRemoveRepo = (url: string) => {
        setRepos(repos.filter(r => r !== url));
    };

    const handleAnalyze = () => {
        if (repos.length === 0) return;

        setIsConnecting(true);

        // Simulate connection delay for multiple repos
        setTimeout(() => {
            console.log('Connected to repos:', repos);
            // Redirect to analysis config/progress
            router.push(`/projects/${params.id}/analysis`);
        }, 1500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 20px'
        }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Logo size={32} color="#1a1a1a" />
                        <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>Eonix</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        Step 2 of 3
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>
                        Connect Your Code
                    </h1>
                    <p style={{ fontSize: '16px', color: '#666666' }}>
                        Add one or more repositories to analyze. We&apos;ll clone them securely and build your architecture map.
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #eaeaea',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    {/* Connection Providers */}
                    <div style={{ padding: '32px', borderBottom: '1px solid #eaeaea' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '20px' }}>
                            Import from Git Provider
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                padding: '16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                padding: '16px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 500,
                                color: '#1a1a1a',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color="#FC6D26">
                                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .4.24l3.24 8.52h7.08l3.24-8.52a.43.43 0 0 1 .4-.24.42.42 0 0 1 .11.02h.01a.42.42 0 0 1 .13.12l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                                </svg>
                                GitLab
                            </button>
                        </div>
                    </div>

                    {/* Manual URL Input */}
                    <div style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }} />
                            <span style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>OR IMPORT MANUALLY</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#eaeaea' }} />
                        </div>

                        <form onSubmit={handleAddRepo} style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '8px'
                            }}>
                                Repository URL
                            </label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <input
                                    type="url"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/username/repo.git"
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        outline: 'none'
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={!repoUrl.trim()}
                                    style={{
                                        padding: '12px 24px',
                                        backgroundColor: '#ffffff',
                                        color: '#1a1a1a',
                                        border: '1px solid #1a1a1a',
                                        borderRadius: '10px',
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        cursor: !repoUrl.trim() ? 'not-allowed' : 'pointer',
                                        opacity: !repoUrl.trim() ? 0.7 : 1,
                                    }}
                                >
                                    Add URL
                                </button>
                            </div>
                        </form>

                        {/* Repo List */}
                        {repos.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Selected Repositories ({repos.length})</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {repos.map((repo, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px',
                                            border: '1px solid #eaeaea'
                                        }}>
                                            <span style={{ fontSize: '14px', color: '#333' }}>{repo}</span>
                                            <button
                                                onClick={() => handleRemoveRepo(repo)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '24px', marginTop: '24px' }}>
                            <button
                                onClick={handleAnalyze}
                                disabled={repos.length === 0 || isConnecting}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: '#1a1a1a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    cursor: (repos.length === 0 || isConnecting) ? 'not-allowed' : 'pointer',
                                    opacity: (repos.length === 0 || isConnecting) ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isConnecting ? (
                                    <>
                                        <span style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                                        Starting Analysis...
                                    </>
                                ) : (
                                    `Analyze ${repos.length > 0 ? `(${repos.length}) Repositories` : ''}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
