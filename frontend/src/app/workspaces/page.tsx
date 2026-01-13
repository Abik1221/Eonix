'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import './workspace.css';

interface Workspace {
    id: string;
    name: string;
    role: 'Admin' | 'Member' | 'Viewer';
    members: number;
}

const MOCK_WORKSPACES: Workspace[] = [
    { id: '1', name: 'Eonix Core', role: 'Admin', members: 4 },
    { id: '2', name: 'Payments Platform', role: 'Member', members: 12 },
];

export default function WorkspacesPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    const handleCreateWorkspace = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return;
        console.log('Creating workspace:', newWorkspaceName);
        router.push('/projects/create');
    };

    const handleSelectWorkspace = (id: string) => {
        console.log('Selected workspace:', id);
        router.push('/projects/create');
    };

    return (
        <div className="workspace-container">
            {/* Background Animations */}
            <div className="ws-blur-shape-1" />
            <div className="ws-blur-shape-2" />

            {/* Modal Overlay for Creating Workspace */}
            {isCreating && (
                <div className="modal-overlay" onClick={(e) => {
                    if (e.target === e.currentTarget) setIsCreating(false);
                }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">Create a Workspace</h2>
                            <p className="modal-desc">Workspaces organize your projects and team members.</p>
                        </div>

                        <form onSubmit={handleCreateWorkspace}>
                            <div className="ws-form-group">
                                <label className="ws-label">Workspace Name</label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g. Acme Backend"
                                    autoFocus
                                    className="ws-input"
                                />
                            </div>

                            <div className="ws-form-group">
                                <label className="ws-label">Industry (Optional)</label>
                                <select className="ws-select">
                                    <option value="">Select industry...</option>
                                    <option value="fintech">Fintech</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="saas">SaaS / Tech</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="ws-form-group">
                                <label className="ws-label">Team Size (Optional)</label>
                                <select className="ws-select">
                                    <option value="">Select size...</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="200+">200+</option>
                                </select>
                            </div>

                            <div className="ws-actions">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newWorkspaceName.trim()}
                                    className="btn-create"
                                >
                                    Create Workspace
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="workspace-content">
                {/* Header */}
                <header className="ws-header">
                    <div className="ws-brand">
                        <Logo size={28} color="#1a1a1a" />
                        <span className="ws-brand-text">Eonix</span>
                    </div>
                    <div className="ws-user-profile">
                        <div className="ws-avatar">NK</div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="ws-main">
                    <div className="ws-title-group">
                        <h1 className="ws-title">Select a Workspace</h1>
                        <p className="ws-subtitle">
                            Choose a workspace to view your architecture or start a new one to begin analyzing your repositories.
                        </p>
                    </div>

                    <div className="ws-grid">
                        {/* Create New Card */}
                        <div
                            className="ws-card ws-card-create"
                            onClick={() => setIsCreating(true)}
                        >
                            <div className="ws-create-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                            <span className="ws-create-text">Create new workspace</span>
                        </div>

                        {/* Existing Workspaces */}
                        {MOCK_WORKSPACES.map((workspace) => (
                            <div
                                key={workspace.id}
                                className="ws-card"
                                onClick={() => handleSelectWorkspace(workspace.id)}
                            >
                                <div>
                                    <div className="ws-avatar-initial">
                                        {workspace.name.charAt(0)}
                                    </div>
                                    <h3 className="ws-name">{workspace.name}</h3>
                                    <span className="ws-role-badge">{workspace.role}</span>
                                </div>

                                <div className="ws-meta">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="9" cy="7" r="4"></circle>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    </svg>
                                    {workspace.members} members
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
