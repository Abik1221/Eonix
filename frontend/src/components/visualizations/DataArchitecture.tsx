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

// Custom node component for database entities
function EntityNode({ data }: { data: { label: string; type: string; fields: string[] } }) {
    const typeColors: Record<string, { bg: string; border: string; badge: string }> = {
        pii: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.4)', badge: '#ef4444' },
        internal: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)', badge: '#3b82f6' },
        public: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.4)', badge: '#22c55e' },
    };

    const colors = typeColors[data.type] || typeColors.internal;

    return (
        <div style={{
            background: '#18181b',
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            minWidth: '180px',
            overflow: 'hidden',
        }}>
            <div style={{
                padding: '10px 12px',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: colors.bg,
            }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#fff' }}>{data.label}</span>
                <span style={{
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: colors.badge,
                    color: '#fff',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                }}>{data.type}</span>
            </div>
            <div style={{ padding: '8px 12px' }}>
                {data.fields.map((field, i) => (
                    <div key={i} style={{
                        fontSize: '11px',
                        color: '#a1a1aa',
                        padding: '3px 0',
                        fontFamily: 'monospace',
                    }}>
                        {field}
                    </div>
                ))}
            </div>
        </div>
    );
}

const nodeTypes = { entity: EntityNode };

const initialNodes: Node[] = [
    {
        id: 'users',
        type: 'entity',
        position: { x: 50, y: 50 },
        data: {
            label: 'Users',
            type: 'pii',
            fields: ['id: UUID PK', 'email: VARCHAR', 'password_hash: VARCHAR', 'created_at: TIMESTAMP'],
        },
    },
    {
        id: 'sessions',
        type: 'entity',
        position: { x: 300, y: 50 },
        data: {
            label: 'Sessions',
            type: 'internal',
            fields: ['id: UUID PK', 'user_id: UUID FK', 'token: VARCHAR', 'expires_at: TIMESTAMP'],
        },
    },
    {
        id: 'orders',
        type: 'entity',
        position: { x: 50, y: 280 },
        data: {
            label: 'Orders',
            type: 'internal',
            fields: ['id: UUID PK', 'user_id: UUID FK', 'total: DECIMAL', 'status: ENUM'],
        },
    },
    {
        id: 'products',
        type: 'entity',
        position: { x: 300, y: 280 },
        data: {
            label: 'Products',
            type: 'public',
            fields: ['id: UUID PK', 'name: VARCHAR', 'price: DECIMAL', 'stock: INTEGER'],
        },
    },
    {
        id: 'order_items',
        type: 'entity',
        position: { x: 175, y: 480 },
        data: {
            label: 'Order Items',
            type: 'internal',
            fields: ['id: UUID PK', 'order_id: UUID FK', 'product_id: UUID FK', 'quantity: INTEGER'],
        },
    },
];

const initialEdges: Edge[] = [
    {
        id: 'users-sessions',
        source: 'users',
        target: 'sessions',
        label: '1:N',
        style: { stroke: '#52525b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
    },
    {
        id: 'users-orders',
        source: 'users',
        target: 'orders',
        label: '1:N',
        style: { stroke: '#52525b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
    },
    {
        id: 'orders-order_items',
        source: 'orders',
        target: 'order_items',
        label: '1:N',
        style: { stroke: '#52525b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
    },
    {
        id: 'products-order_items',
        source: 'products',
        target: 'order_items',
        label: '1:N',
        style: { stroke: '#52525b' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' },
    },
];

export default function DataArchitecture() {
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
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#ef4444' }} />
                    <span style={{ color: '#a1a1aa' }}>PII Data</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6' }} />
                    <span style={{ color: '#a1a1aa' }}>Internal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#22c55e' }} />
                    <span style={{ color: '#a1a1aa' }}>Public</span>
                </div>
            </div>
        </div>
    );
}
