import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DocsSidebar from '@/components/docs/DocsSidebar';

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, paddingTop: '64px' }}>
                <div className="md:flex" style={{ position: 'relative' }}>
                    <DocsSidebar />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
