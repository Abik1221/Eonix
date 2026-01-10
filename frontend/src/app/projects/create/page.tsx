'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

type ArchitectureType = 'monolith' | 'microservices' | 'unknown';

export default function CreateProjectPage() {
    const router = useRouter();
    const [projectName, setProjectName] = useState('');
    const [archType, setArchType] = useState<ArchitectureType>('unknown');

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectName.trim()) return;

        // Simulate project creation API call
        console.log('Creating project:', { name: projectName, type: archType });

        // Redirect to connect repository page with a mock project ID
        router.push('/projects/123/connect');
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <Logo size={40} color="#1a1a1a" />
                </div>

                <div style={{
                    padding: '40px',
                    border: '1px solid #eaeaea',
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '8px',
                        textAlign: 'center'
                    }}>
                        Create a New Project
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#666666',
                        marginBottom: '32px',
                        textAlign: 'center'
                    }}>
                        Set up your project environment to begin analyzing your architecture.
                    </p>

                    <form onSubmit={handleCreateProject}>
                        {/* Project Name */}
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '8px'
                            }}>
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="e.g. Acme Payments Service"
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                    backgroundColor: '#fafafa'
                                }}
                                onFocus={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fff';
                                    e.currentTarget.style.borderColor = '#1a1a1a';
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.backgroundColor = '#fafafa';
                                    e.currentTarget.style.borderColor = '#e0e0e0';
                                }}
                            />
                        </div>

                        {/* Architecture Type Selection */}
                        <div style={{ marginBottom: '40px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#1a1a1a',
                                marginBottom: '12px'
                            }}>
                                Architecture Type
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setArchType('monolith')}
                                    style={{
                                        padding: '20px 16px',
                                        border: `2px solid ${archType === 'monolith' ? '#1a1a1a' : '#eaeaea'}`,
                                        borderRadius: '12px',
                                        backgroundColor: archType === 'monolith' ? '#fafafa' : '#ffffff',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏢</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Monolith</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Single codebase</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setArchType('microservices')}
                                    style={{
                                        padding: '20px 16px',
                                        border: `2px solid ${archType === 'microservices' ? '#1a1a1a' : '#eaeaea'}`,
                                        borderRadius: '12px',
                                        backgroundColor: archType === 'microservices' ? '#fafafa' : '#ffffff',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕸️</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Microservices</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Distributed systems</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setArchType('unknown')}
                                    style={{
                                        padding: '20px 16px',
                                        border: `2px solid ${archType === 'unknown' ? '#1a1a1a' : '#eaeaea'}`,
                                        borderRadius: '12px',
                                        backgroundColor: archType === 'unknown' ? '#fafafa' : '#ffffff',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>❓</div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a' }}>Not Sure</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Auto-detect later</div>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!projectName.trim()}
                            style={{
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#1a1a1a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: 600,
                                cursor: projectName.trim() ? 'pointer' : 'not-allowed',
                                opacity: projectName.trim() ? 1 : 0.7,
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            Start Project
                        </button>
                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Link href="/workspaces" style={{ fontSize: '14px', color: '#666666', textDecoration: 'none' }}>
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
