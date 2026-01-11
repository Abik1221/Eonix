'use client';

import React, { useState } from 'react';
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
            return <MermaidDiagram definition={MOCK_LAYER_0} />;
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
            return <EndpointMatrix endpoints={mockEndpoints} />;
        }

        return (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <div className="mb-4 text-4xl">🚧</div>
                <div>Layer {activeLayer} Under Construction</div>
                <div className="mt-4 flex gap-2">
                    <button onClick={() => setArchStatus('stable')} className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs rounded">Set Stable</button>
                    <button onClick={() => setArchStatus('drift')} className="px-2 py-1 bg-amber-500/10 text-amber-500 text-xs rounded">Set Drift</button>
                    <button onClick={() => setArchStatus('breaking')} className="px-2 py-1 bg-rose-500/10 text-rose-500 text-xs rounded">Set Breaking</button>
                </div>
            </div>
        );
    };

    return (
        <IssueProvider>
            <div className="flex h-screen w-full bg-[#050507] text-zinc-200 overflow-hidden font-sans selection:bg-indigo-500/30">
                {/* Left Sidebar - Navigation */}
                <aside className="w-[260px] h-screen bg-gradient-to-b from-[#0a0a0c] to-[#08080a] border-r border-white/[0.04] flex flex-col shrink-0">
                    {/* Logo Header */}
                    <div className="h-16 flex items-center px-5 border-b border-white/[0.04]">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
                                <Globe className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-bold text-[17px] tracking-tight text-zinc-100">Eonix</span>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 py-5 px-3 overflow-y-auto custom-scrollbar">
                        <div className="px-3 mb-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-[0.15em]">
                            Platform
                        </div>
                        <nav className="space-y-0.5">
                            {LAYERS.map((layer) => (
                                <button
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`group w-full flex items-center h-10 px-3 rounded-lg transition-all duration-150 relative
                                        ${activeLayer === layer.id
                                            ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 text-white border border-indigo-500/20'
                                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                                        }
                                    `}
                                >
                                    {activeLayer === layer.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full" />
                                    )}
                                    <layer.icon className={`w-[18px] h-[18px] mr-3 transition-colors duration-150 ${activeLayer === layer.id ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                                    <span className="text-[13px] font-medium tracking-wide">{layer.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User Profile Footer */}
                    <div className="p-3 border-t border-white/[0.04] bg-[#08080a]">
                        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all group border border-transparent hover:border-white/[0.04]">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center text-xs font-bold text-zinc-300 group-hover:text-white transition-colors shadow-sm">NK</div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-zinc-300 group-hover:text-white truncate">Nahom Keneni</div>
                                <div className="text-[11px] text-zinc-600 group-hover:text-zinc-500 truncate">nahom@eonix.io</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 h-screen">
                    {/* Top Header Bar */}
                    <header className="h-14 border-b border-white/[0.04] flex items-center justify-between px-6 bg-[#0a0a0c]/80 backdrop-blur-xl z-20 shrink-0">
                        <div className="flex items-center text-[13px]">
                            <span className="text-zinc-600 font-medium hover:text-zinc-400 transition-colors cursor-pointer">Projects</span>
                            <span className="mx-2.5 text-zinc-700/50">/</span>
                            <span className="text-zinc-400 font-medium hover:text-zinc-200 transition-colors cursor-pointer">Eonix</span>
                            <span className="mx-2.5 text-zinc-700/50">/</span>
                            <span className="text-zinc-100 font-medium px-2.5 py-1 bg-white/[0.04] rounded-md border border-white/[0.06]">{LAYERS.find(l => l.id === activeLayer)?.label}</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all
                                ${archStatus === 'stable' ? 'bg-emerald-500/[0.08] border-emerald-500/20 text-emerald-400' :
                                        archStatus === 'drift' ? 'bg-amber-500/[0.08] border-amber-500/20 text-amber-400' :
                                            archStatus === 'breaking' ? 'bg-rose-500/[0.08] border-rose-500/20 text-rose-400' :
                                                'bg-zinc-500/[0.08] border-zinc-500/20 text-zinc-400'}
                            `}>
                                <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)] animate-pulse
                                    ${archStatus === 'stable' ? 'bg-emerald-400 shadow-emerald-500/50' :
                                        archStatus === 'drift' ? 'bg-amber-400 shadow-amber-500/50' :
                                            archStatus === 'breaking' ? 'bg-rose-400 shadow-rose-500/50' :
                                                'bg-zinc-400'}
                                `}></div>
                                <span>{archStatus === 'stable' ? 'System Healthy' : archStatus === 'drift' ? 'Drift Detected' : archStatus === 'breaking' ? 'Breaking Changes' : 'Analyzing...'}</span>
                            </button>
                        </div>
                    </header>

                    {/* Canvas Area */}
                    <main className="flex-1 relative bg-[#08080a] overflow-hidden">
                        {/* Dot Grid Background */}
                        <div className="absolute inset-0 z-0 pointer-events-none" style={{
                            backgroundImage: 'radial-gradient(circle, rgba(63, 63, 70, 0.3) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}></div>

                        {/* Content Container */}
                        <div className="relative z-10 w-full h-full overflow-hidden flex flex-col">
                            {/* StatusBar Overlay */}
                            <div className="px-6 pt-6">
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

                            <div className="flex-1 overflow-auto px-6 pb-6">
                                {renderContent()}
                            </div>
                        </div>

                        <ChangeHistory isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
                    </main>
                </div>

                {/* Right Sidebar - Issues Panel */}
                <aside className="w-[320px] h-screen bg-[#0a0a0c] border-l border-white/[0.04] shrink-0 flex flex-col">
                    <IssueSidebar />
                </aside>
            </div>
        </IssueProvider>
    );
}

