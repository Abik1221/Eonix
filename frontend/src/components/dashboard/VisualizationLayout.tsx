'use client';

import React, { useState, useEffect } from 'react';
import MermaidDiagram from '../visualizations/MermaidDiagram';
import ServiceMap from '../visualizations/ServiceMap';
import EndpointMatrix from '../visualizations/EndpointMatrix';
import { ReactFlowProvider } from 'reactflow';
import { IssueProvider } from '@/context/IssueContext';
import IssueSidebar from '../issues/IssueSidebar';
import IssueModal from '../issues/IssueModal';

// Initial Mock Data (Fallback if API fails)
const MOCK_LAYER_0 = `graph TD\nClient(Client Apps) --> Gateway[API Gateway]\nGateway --> Auth[Auth Service]\nGateway --> Core[Core API]\nCore --> DB[(Primary DB)]\nAuth --> DB`;

const LAYERS = [
    { id: 'layer-0', label: 'Executive Overview', icon: '📊' },
    { id: 'layer-1', label: 'Service Map', icon: '🕸️' },
    { id: 'layer-2', label: 'API Endpoints', icon: '🔗' },
    { id: 'layer-3', label: 'Data Architecture', icon: '🗄️' },
    { id: 'layer-4', label: 'Internal Structure', icon: '🧩' },
    { id: 'layer-5', label: 'Infrastructure', icon: '☁️' },
    { id: 'layer-6', label: 'Async Events', icon: '⚡' },
    { id: 'layer-7', label: 'Security Flow', icon: '🛡️' },
];

export default function VisualizationLayout({ projectId }: { projectId: string }) {
    const [activeLayer, setActiveLayer] = useState('layer-0');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // In a real app, fetch from /api/projects/{projectId}/layers/{activeLayer}
        // For now, we simulate the fetch or use the mock data directly here if endpoint isn't ready
        const fetchData = async () => {
            setLoading(true);
            try {
                // Simulate API latency
                await new Promise(r => setTimeout(r, 600));

                // This would be replaced by actual fetch
                // const res = await fetch(`/api/projects/${projectId}/layers/${activeLayer}`);
                // const json = await res.json();

                // FALLBACK MOCK DATA (Matching Backend Logic)
                let mockData;
                if (activeLayer === 'layer-0') {
                    mockData = { type: 'mermaid', definition: MOCK_LAYER_0 };
                } else if (activeLayer === 'layer-1') {
                    mockData = {
                        type: 'reactflow',
                        nodes: [
                            { id: "gateway", type: "default", data: { label: "API Gateway" }, position: { x: 250, y: 50 } },
                            { id: "auth", type: "default", data: { label: "Auth Service" }, position: { x: 100, y: 200 } },
                            { id: "core", type: "default", data: { label: "Core Service" }, position: { x: 400, y: 200 } },
                            { id: "db", type: "output", data: { label: "PostgreSQL" }, position: { x: 250, y: 350 } },
                        ],
                        edges: [
                            { id: "e1", source: "gateway", target: "auth", animated: true, label: "HTTP" },
                            { id: "e2", source: "gateway", target: "core", animated: true, label: "HTTP" },
                            { id: "e3", source: "auth", target: "db", label: "SQL" },
                            { id: "e4", source: "core", target: "db", label: "SQL" },
                        ]
                    };
                } else if (activeLayer === 'layer-2') {
                    mockData = {
                        type: 'json',
                        data: [
                            { method: "POST", path: "/api/v1/auth/login", service: "Auth Service", status: "active" },
                            { method: "GET", path: "/api/v1/users/me", service: "Auth Service", status: "active" },
                            { method: "POST", path: "/api/v1/orders", service: "Core Service", "status": "active" },
                            { method: "DELETE", path: "/api/v1/orders/{id}", service: "Core Service", "status": "deprecated" },
                        ]
                    };
                } else if (activeLayer === 'layer-7') {
                    mockData = {
                        type: 'mermaid',
                        definition: `sequenceDiagram\nparticipant User\nparticipant FE as Frontend\nparticipant GW as API Gateway\nparticipant Auth as Auth Service\nUser->>FE: Click Login\nFE->>GW: POST /login\nGW->>Auth: Forward Credentials\nAuth-->>GW: Return JWT\nGW-->>FE: Return JWT\nFE->>GW: Request + Bearer Token\nGW->>GW: Validate Token`
                    };
                } else {
                    mockData = { type: 'empty' };
                }

                setData(mockData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeLayer, projectId]);


    const renderContent = () => {
        if (loading) {
            return (
                <div className="h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-500">Analysing architecture...</p>
                    </div>
                </div>
            );
        }

        if (!data) return null;

        if (data.type === 'mermaid') {
            return <MermaidDiagram definition={data.definition} />;
        }
        if (data.type === 'reactflow') {
            return (
                <div className="h-full w-full">
                    <ReactFlowProvider>
                        <ServiceMap initialNodes={data.nodes} initialEdges={data.edges} />
                    </ReactFlowProvider>
                </div>
            );
        }
        if (data.type === 'json' && activeLayer === 'layer-2') {
            return <EndpointMatrix endpoints={data.data} />;
        }

        return (
            <div className="h-full flex flex-col items-center justify-center pb-20">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                    <span className="text-3xl">🚧</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Visualization Layer Under Construction</h3>
                <p className="text-slate-500 max-w-md text-center">
                    Our AI is currently mapping this specific layer of your architecture. Please check back shortly.
                </p>
            </div>
        );
    };

    return (
        <IssueProvider>
            <div className="flex w-full h-full overflow-hidden bg-slate-50/50">
                <div className="flex flex-col flex-1 h-full min-w-0">
                    {/* Top Navigation Bar */}
                    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-5 shrink-0 z-20 sticky top-0">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Architecture Overview</h1>
                                    <p className="text-sm text-slate-500 font-medium mt-1">Real-time analysis of Eonix Core Services</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                                {LAYERS.map(layer => {
                                    const isActive = activeLayer === layer.id;
                                    return (
                                        <button
                                            key={layer.id}
                                            onClick={() => setActiveLayer(layer.id)}
                                            className={`
                                                relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border
                                                ${isActive
                                                    ? 'bg-white border-slate-300 text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                                }
                                            `}
                                        >
                                            <span className={`${isActive ? 'text-indigo-600' : 'opacity-70 grayscale group-hover:grayscale-0'}`}>{layer.icon}</span>
                                            {layer.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area - Workspace Look */}
                    <div className="flex-1 p-6 overflow-hidden relative bg-slate-50/50">
                        <div className="absolute inset-0 opacity-[0.4]" style={{
                            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}></div>

                        <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden relative z-10">
                            {renderContent()}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar for Issues */}
                <IssueSidebar />

                {/* Global Modals */}
                <IssueModal />
            </div>
        </IssueProvider>
    );
}
