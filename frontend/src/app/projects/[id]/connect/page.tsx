'use client';
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Logo from '@/components/Logo';
import '../../create/project.css';

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

        setTimeout(() => {
            console.log('Connected to repos:', repos);
            router.push(`/projects/${params.id}/analysis`);
        }, 1500);
    };

    return (
        <div className="project-container">
            {/* Background Animations */}
            <div className="proj-blur-shape-1" />
            <div className="proj-blur-shape-2" />

            <div className="project-content">
                <div className="proj-brand">
                    <Logo size={40} color="#1a1a1a" />
                </div>

                <div className="proj-card">
                    <div className="proj-header">
                        <div className="proj-step">Step 2 of 3</div>
                        <h1 className="proj-title" style={{ marginTop: '16px' }}>Connect Your Code</h1>
                        <p className="proj-subtitle">Add one or more repositories to analyze. We&apos;ll clone them securely and build your architecture map.</p>
                    </div>

                    <div className="provider-section">
                        <h3 className="section-title">Import from Git Provider</h3>
                        <div className="provider-grid">
                            <button className="btn-provider">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                GitHub
                            </button>
                            <button className="btn-provider">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" color="#FC6D26">
                                    <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .4.24l3.24 8.52h7.08l3.24-8.52a.43.43 0 0 1 .4-.24.42.42 0 0 1 .11.02h.01a.42.42 0 0 1 .13.12l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                                </svg>
                                GitLab
                            </button>
                        </div>
                    </div>

                    <div className="manual-section">
                        <div className="divider">
                            <div className="divider-line" />
                            <span className="divider-text">OR IMPORT MANUALLY</span>
                            <div className="divider-line" />
                        </div>

                        <form onSubmit={handleAddRepo}>
                            <label className="proj-label">Repository URL</label>
                            <div className="input-group">
                                <input
                                    type="url"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                    placeholder="https://github.com/username/repo.git"
                                    className="proj-input"
                                />
                                <button
                                    type="submit"
                                    disabled={!repoUrl.trim()}
                                    className="btn-add"
                                >
                                    Add 
                                </button>
                            </div>
                        </form>

                        {/* Repo List */}
                        {repos.length > 0 && (
                            <div className="repo-list">
                                <h4 className="section-title" style={{ fontSize: '14px', marginBottom: '8px' }}>
                                    Selected Repositories ({repos.length})
                                </h4>
                                {repos.map((repo, index) => (
                                    <div key={index} className="repo-item">
                                        <div className="repo-name">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                            </svg>
                                            {repo}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveRepo(repo)}
                                            className="btn-remove"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="analyze-section">
                            <button
                                onClick={handleAnalyze}
                                disabled={repos.length === 0 || isConnecting}
                                className="btn-start"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                {isConnecting ? (
                                    <>
                                        <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                        </svg>
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
        </div>
    );
}
