import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Resources: ['Docs', 'API', 'Blog', 'Community'],
    Company: ['About', 'Careers', 'Contact', 'Privacy'],
};

export default function Footer() {
    return (
        <footer style={{ backgroundColor: '#fafafa', borderTop: '1px solid #eaeaea' }}>
            <div className="container">
                <div style={{ padding: '64px 0' }}>
                    <div className="md:flex" style={{ justifyContent: 'space-between', gap: '48px' }}>
                        {/* Brand - Left Side */}
                        <div style={{ maxWidth: '300px', marginBottom: '40px' }}>
                            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Logo size={28} color="#1a1a1a" />
                                <span style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a1a' }}>Eonix</span>
                            </Link>
                            <p style={{
                                fontSize: '14px',
                                color: '#666666',
                                marginTop: '16px',
                                lineHeight: 1.6
                            }}>
                                Transform your code into living architectural maps. Gain visibility and control with semantic analysis.
                            </p>
                        </div>

                        {/* Links - Right Side */}
                        <div style={{
                            display: 'flex',
                            gap: '64px',
                            flexWrap: 'wrap'
                        }}>
                            {Object.entries(links).map(([category, items]) => (
                                <div key={category}>
                                    <h4 style={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        marginBottom: '16px'
                                    }}>
                                        {category}
                                    </h4>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {items.map((item) => (
                                            <li key={item} style={{ marginBottom: '12px' }}>
                                                <Link
                                                    href="#"
                                                    style={{
                                                        fontSize: '14px',
                                                        color: '#666666',
                                                        transition: 'color 0.2s ease'
                                                    }}
                                                >
                                                    {item}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{
                    borderTop: '1px solid #eaeaea',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                }}>
                    <p style={{ fontSize: '12px', color: '#888888' }}>
                        © {new Date().getFullYear()} Eonix. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Link href="/privacy" style={{ fontSize: '12px', color: '#888888' }}>Privacy</Link>
                        <Link href="/terms" style={{ fontSize: '12px', color: '#888888' }}>Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
