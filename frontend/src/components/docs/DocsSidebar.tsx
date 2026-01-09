'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
    {
        title: 'Overview',
        items: [
            { name: 'Introduction', href: '/docs' },
            { name: 'Getting Started', href: '/docs/getting-started' },
        ]
    },
    {
        title: 'Core Features',
        items: [
            { name: 'Architectural Mapping', href: '/docs/features' },
            { name: 'Semantic Search', href: '/docs/semantic-search' },
            { name: 'Dependency Analysis', href: '/docs/dependency-analysis' },
        ]
    }
];

export default function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside style={{
            width: '240px',
            flexShrink: 0,
            borderRight: '1px solid #eaeaea',
            height: 'calc(100vh - 64px)',
            position: 'sticky',
            top: '64px', // Below navbar
            overflowY: 'auto',
            padding: '32px 0'
        }} className="hidden md:block">
            {sidebarLinks.map((section) => (
                <div key={section.title} style={{ marginBottom: '32px' }}>
                    <h5 style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1a1a1a',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {section.title}
                    </h5>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {section.items.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.name} style={{ marginBottom: '12px' }}>
                                    <Link
                                        href={item.href}
                                        style={{
                                            fontSize: '14px',
                                            color: isActive ? '#1a1a1a' : '#666666',
                                            fontWeight: isActive ? 600 : 400,
                                            display: 'block',
                                            transition: 'color 0.2s ease',
                                            borderLeft: isActive ? '2px solid #1a1a1a' : '2px solid transparent',
                                            paddingLeft: '14px',
                                            marginLeft: '-16px'
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </aside>
    );
}
