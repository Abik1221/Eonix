'use client';
import React, { useState } from 'react';

const MOCK_MEMBERS = [
    { id: '1', name: 'Nahom Keneni', email: 'nahom@eonix.com', role: 'Owner', status: 'Active' },
    { id: '2', name: 'Sarah Engineer', email: 'sarah@eonix.com', role: 'Admin', status: 'Active' },
];

export default function TeamSettingsPage() {
    const [emails, setEmails] = useState('');
    const [role, setRole] = useState('Developer');
    const [members, setMembers] = useState(MOCK_MEMBERS);
    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emails.trim()) return;

        // Split by comma or newline and filter empty strings
        const emailList = emails.split(/[\n,]+/).map(e => e.trim()).filter(e => e);

        const newMembers = emailList.map(email => ({
            id: Math.random().toString(),
            name: email.split('@')[0], // Mock name
            email,
            role,
            status: 'Pending'
        }));

        setMembers([...members, ...newMembers]);
        setEmails('');
        setIsInviting(false);
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>Team Members</h1>
                    <p style={{ fontSize: '14px', color: '#666' }}>Manage access to your project.</p>
                </div>
                <button
                    onClick={() => setIsInviting(true)}
                    style={{
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    Invite Members
                </button>
            </div>

            {/* Invite Form (Collapsible) */}
            {isInviting && (
                <div style={{
                    padding: '24px',
                    backgroundColor: '#fff',
                    border: '1px solid #eaeaea',
                    borderRadius: '12px',
                    marginBottom: '32px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Invite new members</h3>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                        Enter multiple email addresses separated by commas or newlines.
                    </p>
                    <form onSubmit={handleInvite} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Email Addresses</label>
                            <textarea
                                value={emails}
                                onChange={(e) => setEmails(e.target.value)}
                                placeholder="colleague@company.com, another@company.com"
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    outline: 'none',
                                    minHeight: '80px',
                                    fontFamily: 'inherit',
                                    resize: 'vertical'
                                }}
                                autoFocus
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', outline: 'none', backgroundColor: '#fff' }}
                            >
                                <option value="Admin">Admin</option>
                                <option value="Developer">Developer</option>
                                <option value="Viewer">Viewer</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '24px' }}>
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer', height: '40px' }}>
                                Send Invites
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsInviting(false)}
                                style={{ padding: '10px 20px', backgroundColor: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0', cursor: 'pointer', height: '40px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Members List */}
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaeaea', textAlign: 'left' }}>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#666' }}>Name</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#666' }}>Role</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#666' }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: 600, color: '#666' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => (
                            <tr key={member.id} style={{ borderBottom: '1px solid #eaeaea' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#666' }}>
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, color: '#1a1a1a' }}>{member.name}</div>
                                            <div style={{ fontSize: '12px', color: '#888' }}>{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        backgroundColor: '#f5f5f5',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        color: '#333'
                                    }}>
                                        {member.role}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        color: member.status === 'Active' ? '#059669' : '#d97706',
                                        fontWeight: 500,
                                        fontSize: '13px'
                                    }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: member.status === 'Active' ? '#059669' : '#d97706' }}></span>
                                        {member.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <button style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
