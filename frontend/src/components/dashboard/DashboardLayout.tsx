'use client';

import React, { useState } from 'react';
import './dashboard.css';
import {
    LayoutDashboard,
    Sitemap,
    Globe,
    Database,
    Layers,
    Cloud,
    Zap,
    Shield
} from '../icons/Icons';
// Importing visualizations from the previous layout or creating wrappers
import MermaidDiagram from '../visualizations/MermaidDiagram';
import ServiceMap from '../visualizations/ServiceMap';
import EndpointMatrix from '../visualizations/EndpointMatrix';
import { ReactFlowProvider } from 'reactflow';
import IssueSidebar from '../issues/IssueSidebar';
import { IssueProvider } from '@/context/IssueContext';
import { ArchitectureStatusBar, ArchitectureStatus } from './ArchitectureStatusBar';
import { ChangeHistory } from './ChangeHistory';

// Mock Data (Moved from VisualizationLayout)
const MOCK_LAYER_0 = `graph TD\nClient(Client Apps) --> Gateway[API Gateway]\nGateway --> Auth[Auth Service]\nGateway --> Core[Core API]\nCore --> DB[(Primary DB)]\nAuth --> DB`;

const LAYERS = [
    { id: 'layer-0', label: 'Overview', icon: LayoutDashboard },
    { id: 'layer-1', label: 'Service Map', icon: Sitemap },
    { id: 'layer-2', label: 'API Endpoints', icon: Globe },
    { id: 'layer-3', label: 'Data Architecture', icon: Database },
    { id: 'layer-4', label: 'Internal Structure', icon: Layers },
    { id: 'layer-5', label: 'Infrastructure', icon: Cloud },
    { id: 'layer-6', label: 'Async Events', icon: Zap },
    { id: 'layer-7', label: 'Security Flow', icon: Shield },
];

export default function DashboardLayout({ projectId }: { projectId: string }) {
    const [activeLayer, setActiveLayer] = useState('layer-0');
    const [archStatus, setArchStatus] = useState<ArchitectureStatus>('stable');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [lastAnalyzed, setLastAnalyzed] = useState('Just now');

    // Quick helper to render content based on active layer
    const renderContent = () => {
        // This logic mimics the old VisualizationLayout but we will improve the container
        if (activeLayer === 'layer-0') {
            return (
                <div style={{ padding: '40px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MermaidDiagram definition={MOCK_LAYER_0} />
                </div>
            )
        }
        // Add other layers as needed
        if (activeLayer === 'layer-1') {
            // Mock ReactFlow Data
            const mockData = {
                nodes: [
                    { id: "gateway", type: "default", data: { label: "API Gateway" }, position: { x: 250, y: 50 }, style: { background: '#18181b', color: '#fff', border: '1px solid #333' } },
                    { id: "auth", type: "default", data: { label: "Auth Service" }, position: { x: 100, y: 200 }, style: { background: '#18181b', color: '#fff', border: '1px solid #333' } },
                    { id: "core", type: "default", data: { label: "Core Service" }, position: { x: 400, y: 200 }, style: { background: '#18181b', color: '#fff', border: '1px solid #333' } },
                    { id: "db", type: "output", data: { label: "PostgreSQL" }, position: { x: 250, y: 350 }, style: { background: '#18181b', color: '#fff', border: '1px solid #333' } },
                ],
                edges: [
                    { id: "e1", source: "gateway", target: "auth", animated: true, label: "HTTP", style: { stroke: '#52525b' } },
                    { id: "e2", source: "gateway", target: "core", animated: true, label: "HTTP", style: { stroke: '#52525b' } },
                    { id: "e3", source: "auth", target: "db", label: "SQL", style: { stroke: '#52525b' } },
                    { id: "e4", source: "core", target: "db", label: "SQL", style: { stroke: '#52525b' } },
                ]
            };
            return (
                <div className="h-full w-full">
                    <ReactFlowProvider>
                        <ServiceMap initialNodes={mockData.nodes} initialEdges={mockData.edges} />
                    </ReactFlowProvider>
                </div>
            );
        }

        if (activeLayer === 'layer-2') {
            const mockEndpoints = [
                { method: "POST", path: "/api/v1/auth/login", service: "Auth Service", status: "active" as const },
                { method: "GET", path: "/api/v1/users/me", service: "Auth Service", status: "active" as const },
                { method: "POST", path: "/api/v1/orders", service: "Core Service", "status": "active" as const },
                { method: "DELETE", path: "/api/v1/orders/{id}", service: "Core Service", "status": "deprecated" as const },
            ];
            return (
                <div style={{ padding: '24px' }}>
                    <EndpointMatrix endpoints={mockEndpoints} />
                </div>
            );
        }

        return (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <div className="mb-4 text-4xl opacity-50">🚧</div>
                <div className="text-sm font-medium">Layer {activeLayer} Under Construction</div>
                <div className="mt-8 flex gap-2">
                    <button onClick={() => setArchStatus('stable')} className="status-indicator stable">Set Stable</button>
                    <button onClick={() => setArchStatus('drift')} className="status-indicator drift">Set Drift</button>
                    <button onClick={() => setArchStatus('breaking')} className="status-indicator breaking">Set Breaking</button>
                </div>
            </div>
        );
    };

    return (
        <IssueProvider>
            <div className="dashboard-container">
                {/* Left Sidebar - Navigation */}
                <aside className="sidebar-nav">
                    {/* Logo Header */}
                    <div className="sidebar-header">
                        <div className="brand-wrapper">
                            <div className="brand-icon">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <span className="brand-text">Eonix</span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="nav-section custom-scrollbar">
                        <div className="nav-label">Platform</div>
                        <nav>
                            {LAYERS.map((layer) => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`nav-item ${activeLayer === layer.id ? 'active' : ''}`}
                                >
                                    <layer.icon className="nav-icon w-[18px] h-[18px]" />
                                    <span>{layer.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User Profile Footer */}
                    <div className="sidebar-footer">
                        <div className="user-profile">
                            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300">NK</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div className="text-sm font-medium text-zinc-200 truncate">Nahom Keneni</div>
                                <div className="text-[11px] text-zinc-500 truncate">nahom@eonix.io</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="main-wrapper">
                    {/* Top Header Bar */}
                    <header className="top-header glass-heavy">
                        <div className="breadcrumb">
                            <span className="hover:text-white cursor-pointer transition-colors">Projects</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="hover:text-white cursor-pointer transition-colors">Eonix</span>
                            <span className="breadcrumb-separator">/</span>
                            <span className="breadcrumb-active">{LAYERS.find(l => l.id === activeLayer)?.label}</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className={`status-indicator ${archStatus}`}
                            >
                                <div className="status-dot"></div>
                                <span>
                                    {archStatus === 'stable' ? 'System Healthy' :
                                        archStatus === 'drift' ? 'Drift Detected' :
                                            archStatus === 'breaking' ? 'Breaking Changes' : 'Analyzing...'}
                                </span>
                            </button>
                        </div>
                    </header>

                    {/* Canvas Area */}
                    <main className="canvas-area">
                        {/* Dot Grid Background */}
                        <div className="grid-background"></div>

                        {/* Content Container */}
                        <div className="content-container">
                            {/* StatusBar Overlay */}
                            <div className="status-overlay">
                                <ArchitectureStatusBar
                                    status={archStatus}
                                    lastAnalyzed={lastAnalyzed}
                                    onViewHistory={() => setIsHistoryOpen(true)}
                                    onTriggerAnalysis={() => {
                                        setArchStatus('pending');
                                        setTimeout(() => {
                                            setArchStatus('stable');
                                            setLastAnalyzed('Just now');
                                        }, 2000);
                                    }}
                                />
                            </div>

                            <div className="visualization-wrapper">
                                {renderContent()}
                            </div>
                        </div>

                        <ChangeHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
                    </main>
                </div>

                {/* Right Sidebar - Issues Panel */}
                <aside className="right-panel">
                    <IssueSidebar />
                </aside>
            </div>
        </IssueProvider>
    );
}
