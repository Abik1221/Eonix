'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

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

        // In a real app, this would be an API call
        console.log('Creating workspace:', newWorkspaceName);
        // Redirect to project creation or dashboard
        // For now, let's assume we go to project creation for the new workspace
        router.push('/projects/create');
    };

    const handleSelectWorkspace = (id: string) => {
        // In a real app, this would set the active workspace context
        console.log('Selected workspace:', id);
        router.push('/projects/create'); // Or dashboard if projects exist
    };

    if (isCreating) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                        <Logo size={40} color="#1a1a1a" />
                    </div>

                    <div style={{
                        padding: '32px',
                        border: '1px solid #eaeaea',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff'
                    }}>
                        <h1 style={{
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            marginBottom: '8px',
                            textAlign: 'center'
                        }}>
                            Create a Workspace
                        </h1>
                        <p style={{
                            fontSize: '14px',
                            color: '#888888',
                            marginBottom: '24px',
                            textAlign: 'center'
                        }}>
                            Workspaces organize your projects and team members.
                        </p>

                        <form onSubmit={handleCreateWorkspace}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#1a1a1a',
                                    marginBottom: '6px'
                                }}>
                                    Workspace Name
                                </label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g. Acme Backend"
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#1a1a1a',
                                    marginBottom: '6px'
                                }}>
                                    Industry (Optional)
                                </label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: '#fff',
                                        color: '#1a1a1a'
                                    }}
                                >
                                    <option value="">Select industry...</option>
                                    <option value="fintech">Fintech</option>
                                    <option value="ecommerce">E-commerce</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="saas">SaaS / Tech</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#1a1a1a',
                                    marginBottom: '6px'
                                }}>
                                    Team Size (Optional)
                                </label>
                                <select
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        outline: 'none',
                                        backgroundColor: '#fff',
                                        color: '#1a1a1a'
                                    }}
                                >
                                    <option value="">Select size...</option>
                                    <option value="1-10">1-10</option>
                                    <option value="11-50">11-50</option>
                                    <option value="51-200">51-200</option>
                                    <option value="200+">200+</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#1a1a1a',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newWorkspaceName.trim()}
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: '#1a1a1a',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        cursor: newWorkspaceName.trim() ? 'pointer' : 'not-allowed',
                                        opacity: newWorkspaceName.trim() ? 1 : 0.7
                                    }}
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '40px 20px'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Logo size={32} color="#1a1a1a" />
                        <span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>Eonix</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {/* User Avatar Placeholder */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#666'
                        }}>
                            NK
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '12px',
                        letterSpacing: '-0.02em'
                    }}>
                        Select a Workspace
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: '#666666'
                    }}>
                        Choose a workspace to view your architecture or start a new one.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {/* New Workspace Card */}
                    <button
                        onClick={() => setIsCreating(true)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '180px',
                            border: '2px dashed #e0e0e0',
                            borderRadius: '12px',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s ease, background-color 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#1a1a1a';
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e0e0e0';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '20px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '12px',
                            color: '#1a1a1a'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#1a1a1a' }}>Create Workspace</span>
                    </button>

                    {/* Existing Workspaces */}
                    {MOCK_WORKSPACES.map((workspace) => (
                        <div
                            key={workspace.id}
                            onClick={() => handleSelectWorkspace(workspace.id)}
                            style={{
                                padding: '24px',
                                border: '1px solid #eaeaea',
                                borderRadius: '12px',
                                backgroundColor: '#ffffff',
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '180px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#1a1a1a',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    marginBottom: '16px'
                                }}>
                                    {workspace.name.charAt(0)}
                                </div>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#1a1a1a',
                                    marginBottom: '4px'
                                }}>
                                    {workspace.name}
                                </h3>
                                <p style={{
                                    fontSize: '13px',
                                    color: '#888888'
                                }}>
                                    {workspace.role}
                                </p>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                color: '#666666'
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                {workspace.members} members
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
