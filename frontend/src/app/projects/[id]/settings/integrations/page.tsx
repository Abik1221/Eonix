'use client';
import React, { useState } from 'react';

const INTEGRATIONS = [
    {
        id: 'jira',
        name: 'Jira',
        description: 'Create issues from architecture violations.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#0052CC">
                <path d="M11.53 2C6.45 2.04 2.12 6.06 2 11.13V12h9.53V2z" />
                <path d="M12.9 22c5.08-.04 9.41-4.06 9.53-9.13V12H12.9v10z" />
                <path d="M2 13.47V22h9.53v-9.13c-.12-5.07-4.45-9.09-9.53-8.4z" fillOpacity=".8" />
            </svg>
        ),
        connected: false,
    },
    {
        id: 'github',
        name: 'GitHub',
        description: 'Link code to services and PR comments.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#181717">
                <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.74.08-.73.08-.73 1.2.09 1.83 1.24 1.83 1.24 1.08 1.83 2.81 1.3 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.46-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.44.38.81 1.1.81 2.22l-.02 3.29c0 .31.22.7.82.57A12 12 0 0 0 12 .3" />
            </svg>
        ),
        connected: true,
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Get alerts for architecture drift.',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24">
                <path fill="#E01E5A" d="M5.04 15.17a2.53 2.53 0 1 0 2.53-2.5 2.53 2.53 0 0 0-2.53 2.5zm.9 1.91a2.53 2.53 0 1 0 2.53 2.52v-2.52H5.94z" />
                <path fill="#36C5F0" d="M8.47 5.04a2.53 2.53 0 1 0-2.53 2.53 2.53 2.53 0 0 0 2.53-2.53zm-1.91.9a2.53 2.53 0 1 0-2.52 2.53h2.52V5.94z" />
                <path fill="#2EB67D" d="M18.96 8.83a2.53 2.53 0 1 0-2.53 2.5 2.53 2.53 0 0 0 2.53-2.5zm-.9-1.91a2.53 2.53 0 1 0-2.53-2.52v2.52h2.53z" />
                <path fill="#ECB22E" d="M15.53 18.96a2.53 2.53 0 1 0 2.53-2.53 2.53 2.53 0 0 0-2.53 2.53zm1.91-.9a2.53 2.53 0 1 0 2.52-2.53h-2.52v2.53z" />
            </svg>
        ),
        connected: false,
    },
];

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(INTEGRATIONS);

    const toggleConnection = (id: string) => {
        setIntegrations(prev => prev.map(item =>
            item.id === id ? { ...item, connected: !item.connected } : item
        ));
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>Integrations</h1>
                <p style={{ fontSize: '14px', color: '#666' }}>Connect Eonix to your existing workflow tools.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {integrations.map((item) => (
                    <div key={item.id} style={{
                        backgroundColor: '#fff',
                        border: item.connected ? '1px solid #1a1a1a' : '1px solid #eaeaea',
                        borderRadius: '12px',
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '240px',
                        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        boxShadow: item.connected ? '0 4px 6px -1px rgba(0,0,0,0.05)' : 'none'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {item.icon}
                                </div>
                                {item.connected && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#059669',
                                        backgroundColor: '#ecfdf5',
                                        padding: '4px 8px',
                                        borderRadius: '20px'
                                    }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                                        Connected
                                    </div>
                                )}
                            </div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{item.name}</h3>
                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{item.description}</p>
                        </div>

                        <button
                            onClick={() => toggleConnection(item.id)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                marginTop: '20px',
                                border: item.connected ? '1px solid #e0e0e0' : 'none',
                                backgroundColor: item.connected ? '#fff' : '#1a1a1a',
                                color: item.connected ? '#1a1a1a' : '#fff'
                            }}
                        >
                            {item.connected ? 'Configure' : 'Connect'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
