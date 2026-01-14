'use client';

import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node for infrastructure components
function InfraNode({ data }: { data: { label: string; type: string; specs?: string } }) {
    const typeIcons: Record<string, { icon: string; color: string }> = {
        lb: { icon: '⚖️', color: '#8b5cf6' },
        server: { icon: '🖥️', color: '#3b82f6' },
        cache: { icon: '⚡', color: '#f59e0b' },
        database: { icon: '🗄️', color: '#22c55e' },
        queue: { icon: '📨', color: '#ec4899' },
        cdn: { icon: '🌐', color: '#06b6d4' },
    };

    const { icon, color } = typeIcons[data.type] || { icon: '📦', color: '#71717a' };

    return (
        <div style={{
            background: '#18181b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '16px',
            minWidth: '140px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#fff', marginBottom: '4px' }}>
                {data.label}
            </div>
            {data.specs && (
                <div style={{
                    fontSize: '10px',
                    color: '#71717a',
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    marginTop: '6px',
                }}>
                    {data.specs}
                </div>
            )}
        </div>
    );
}

// Group node for regions/zones
function RegionNode({ data }: { data: { label: string } }) {
    return (
        <div style={{
            background: 'rgba(59, 130, 246, 0.05)',
            border: '1px dashed rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            width: '380px',
            height: '280px',
        }}>
            <div style={{
                position: 'absolute',
                top: '8px',
                left: '12px',
                fontSize: '10px',
                color: '#3b82f6',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
            }}>
                {data.label}
            </div>
        </div>
    );
}

const nodeTypes = { infra: InfraNode, region: RegionNode };

const initialNodes: Node[] = [
    // CDN
    {
        id: 'cdn',
        type: 'infra',
        position: { x: 280, y: 0 },
        data: { label: 'CDN', type: 'cdn', specs: 'Global Edge' },
    },
    // Load Balancer
    {
        id: 'lb',
        type: 'infra',
        position: { x: 280, y: 100 },
        data: { label: 'Load Balancer', type: 'lb', specs: 'L7 / HTTPS' },
    },
    // API Servers
    {
        id: 'api-1',
        type: 'infra',
        position: { x: 100, y: 220 },
        data: { label: 'API Server 1', type: 'server', specs: '4 vCPU / 8GB' },
    },
    {
        id: 'api-2',
        type: 'infra',
        position: { x: 280, y: 220 },
        data: { label: 'API Server 2', type: 'server', specs: '4 vCPU / 8GB' },
    },
    {
        id: 'api-3',
        type: 'infra',
        position: { x: 460, y: 220 },
        data: { label: 'API Server 3', type: 'server', specs: '4 vCPU / 8GB' },
    },
    // Cache
    {
        id: 'redis',
        type: 'infra',
        position: { x: 100, y: 370 },
        data: { label: 'Redis Cluster', type: 'cache', specs: '3 nodes / 32GB' },
    },
    // Message Queue
    {
        id: 'rabbitmq',
        type: 'infra',
        position: { x: 280, y: 370 },
        data: { label: 'RabbitMQ', type: 'queue', specs: 'HA Cluster' },
    },
    // Database
    {
        id: 'db-primary',
        type: 'infra',
        position: { x: 460, y: 370 },
        data: { label: 'PostgreSQL', type: 'database', specs: 'Primary / 16GB' },
    },
    {
        id: 'db-replica',
        type: 'infra',
        position: { x: 460, y: 490 },
        data: { label: 'PostgreSQL', type: 'database', specs: 'Replica / 16GB' },
    },
];

const initialEdges: Edge[] = [
    { id: 'e-cdn-lb', source: 'cdn', target: 'lb', animated: true, style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e-lb-api1', source: 'lb', target: 'api-1', animated: true, style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e-lb-api2', source: 'lb', target: 'api-2', animated: true, style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e-lb-api3', source: 'lb', target: 'api-3', animated: true, style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e-api1-redis', source: 'api-1', target: 'redis', style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
    { id: 'e-api2-redis', source: 'api-2', target: 'redis', style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
    { id: 'e-api2-queue', source: 'api-2', target: 'rabbitmq', style: { stroke: '#ec4899' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
    { id: 'e-api3-queue', source: 'api-3', target: 'rabbitmq', style: { stroke: '#ec4899' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
    { id: 'e-api1-db', source: 'api-1', target: 'db-primary', style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e-api2-db', source: 'api-2', target: 'db-primary', style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e-api3-db', source: 'api-3', target: 'db-primary', style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e-db-replica', source: 'db-primary', target: 'db-replica', label: 'replication', style: { stroke: '#22c55e', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
];

export default function Infrastructure() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full bg-transparent overflow-hidden relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls className="bg-[#09090b] border-white/10 fill-zinc-400 [&>button]:border-white/5 [&>button:hover]:bg-zinc-800" />
                <MiniMap
                    style={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.05)' }}
                    nodeColor={() => '#52525b'}
                    maskColor="rgba(0,0,0,0.6)"
                />
            </ReactFlow>

            {/* Legend */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(24, 24, 27, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '12px',
                fontSize: '11px',
                flexWrap: 'wrap',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⚖️</span><span style={{ color: '#a1a1aa' }}>Load Balancer</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🖥️</span><span style={{ color: '#a1a1aa' }}>Server</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⚡</span><span style={{ color: '#a1a1aa' }}>Cache</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📨</span><span style={{ color: '#a1a1aa' }}>Queue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🗄️</span><span style={{ color: '#a1a1aa' }}>Database</span>
                </div>
            </div>
        </div>
    );
}
