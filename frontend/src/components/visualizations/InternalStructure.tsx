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

// Custom node for modules/packages
function ModuleNode({ data }: { data: { label: string; layer: string; files: number } }) {
    const layerColors: Record<string, { bg: string; border: string; text: string }> = {
        core: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.4)', text: '#a855f7' },
        service: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)', text: '#3b82f6' },
        handler: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.4)', text: '#22c55e' },
        util: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.4)', text: '#fbbf24' },
    };

    const colors = layerColors[data.layer] || layerColors.util;

    return (
        <div style={{
            background: '#18181b',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            padding: '12px 16px',
            minWidth: '140px',
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
            }}>
                <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: colors.text,
                }} />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{data.label}</span>
            </div>
            <div style={{
                fontSize: '10px',
                color: '#71717a',
            }}>
                {data.files} files • {data.layer}
            </div>
        </div>
    );
}

const nodeTypes = { module: ModuleNode };

const initialNodes: Node[] = [
    // Core layer
    {
        id: 'config',
        type: 'module',
        position: { x: 200, y: 0 },
        data: { label: 'config', layer: 'core', files: 4 },
    },
    {
        id: 'database',
        type: 'module',
        position: { x: 350, y: 0 },
        data: { label: 'database', layer: 'core', files: 3 },
    },
    // Service layer
    {
        id: 'auth-service',
        type: 'module',
        position: { x: 50, y: 120 },
        data: { label: 'auth', layer: 'service', files: 6 },
    },
    {
        id: 'user-service',
        type: 'module',
        position: { x: 200, y: 120 },
        data: { label: 'users', layer: 'service', files: 8 },
    },
    {
        id: 'order-service',
        type: 'module',
        position: { x: 350, y: 120 },
        data: { label: 'orders', layer: 'service', files: 12 },
    },
    {
        id: 'payment-service',
        type: 'module',
        position: { x: 500, y: 120 },
        data: { label: 'payments', layer: 'service', files: 5 },
    },
    // Handler layer
    {
        id: 'auth-handler',
        type: 'module',
        position: { x: 50, y: 250 },
        data: { label: 'authHandler', layer: 'handler', files: 3 },
    },
    {
        id: 'api-handler',
        type: 'module',
        position: { x: 200, y: 250 },
        data: { label: 'apiHandler', layer: 'handler', files: 7 },
    },
    {
        id: 'webhook-handler',
        type: 'module',
        position: { x: 350, y: 250 },
        data: { label: 'webhooks', layer: 'handler', files: 4 },
    },
    // Utils
    {
        id: 'logger',
        type: 'module',
        position: { x: 500, y: 250 },
        data: { label: 'logger', layer: 'util', files: 2 },
    },
];

const initialEdges: Edge[] = [
    // Core dependencies
    { id: 'e1', source: 'auth-service', target: 'config', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e2', source: 'auth-service', target: 'database', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e3', source: 'user-service', target: 'database', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e4', source: 'order-service', target: 'database', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e5', source: 'payment-service', target: 'config', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    // Service to handler
    { id: 'e6', source: 'auth-handler', target: 'auth-service', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e7', source: 'api-handler', target: 'user-service', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e8', source: 'api-handler', target: 'order-service', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e9', source: 'webhook-handler', target: 'payment-service', style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    // Utils
    { id: 'e10', source: 'auth-service', target: 'logger', style: { stroke: '#52525b', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e11', source: 'order-service', target: 'logger', style: { stroke: '#52525b', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
];

export default function InternalStructure() {
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
                gap: '16px',
                fontSize: '11px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
                    <span style={{ color: '#a1a1aa' }}>Core</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }} />
                    <span style={{ color: '#a1a1aa' }}>Service</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ color: '#a1a1aa' }}>Handler</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                    <span style={{ color: '#a1a1aa' }}>Utility</span>
                </div>
            </div>
        </div>
    );
}
