'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import './project.css';

type ArchitectureType = 'monolith' | 'microservices' | 'unknown';

export default function CreateProjectPage() {
    const router = useRouter();
    const [projectName, setProjectName] = useState('');
    const [archType, setArchType] = useState<ArchitectureType>('unknown');

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;
        console.log('Creating project:', { name: projectName, type: archType });
        router.push('/projects/123/connect');
    };

    return (
        <div className="project-container">
            {/* Background Animations */}
            <div className="proj-blur-shape-1" />
            <div className="proj-blur-shape-2" />

            <div className="project-content">
                <div className="proj-brand">
                    <Logo size={48} color="#1a1a1a" />
                </div>

                <div className="proj-card">
                    <div className="proj-header">
                        <h1 className="proj-title">Create a New Project</h1>
                        <p className="proj-subtitle">Set up your project environment to begin analyzing your architecture.</p>
                    </div>

                    <form onSubmit={handleCreateProject}>
                        {/* Project Name */}
                        <div className="proj-form-group">
                            <label className="proj-label">Project Name</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="e.g. Acme Payments Service"
                                autoFocus
                                className="proj-input"
                            />
                        </div>

                        {/* Architecture Type Selection */}
                        <div className="proj-form-group">
                            <label className="proj-label">Architecture Type</label>
                            <div className="arch-grid">
                                <div
                                    className={`arch-card ${archType === 'monolith' ? 'selected' : ''}`}
                                    onClick={() => setArchType('monolith')}
                                >
                                    <div className="arch-icon">🏢</div>
                                    <div className="arch-name">Monolith</div>
                                    <div className="arch-desc">Single codebase</div>
                                </div>

                                <div
                                    className={`arch-card ${archType === 'microservices' ? 'selected' : ''}`}
                                    onClick={() => setArchType('microservices')}
                                >
                                    <div className="arch-icon">🕸️</div>
                                    <div className="arch-name">Microservices</div>
                                    <div className="arch-desc">Distributed systems</div>
                                </div>

                                <div
                                    className={`arch-card ${archType === 'unknown' ? 'selected' : ''}`}
                                    onClick={() => setArchType('unknown')}
                                >
                                    <div className="arch-icon">❓</div>
                                    <div className="arch-name">Not Sure</div>
                                    <div className="arch-desc">Auto-detect later</div>
                                </div>
                            </div>
                        </div>

                        <div className="proj-actions">
                            <button
                                type="submit"
                                disabled={!projectName.trim()}
                                className="btn-start"
                            >
                                Start Project
                            </button>
                            <Link href="/workspaces" className="link-cancel">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
