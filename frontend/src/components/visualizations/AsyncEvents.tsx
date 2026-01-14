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

// Custom node for event/queue components
function EventNode({ data }: { data: { label: string; type: string; events?: string[] } }) {
    const typeStyles: Record<string, { icon: string; bg: string; border: string }> = {
        publisher: { icon: '📤', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.4)' },
        subscriber: { icon: '📥', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)' },
        queue: { icon: '📬', bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.4)' },
        topic: { icon: '📢', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.4)' },
        worker: { icon: '⚙️', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.4)' },
    };

    const { icon, bg, border } = typeStyles[data.type] || typeStyles.queue;

    return (
        <div style={{
            background: '#18181b',
            border: `1px solid ${border}`,
            borderRadius: '10px',
            minWidth: '150px',
            overflow: 'hidden',
        }}>
            <div style={{
                padding: '10px 14px',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderBottom: `1px solid ${border}`,
            }}>
                <span style={{ fontSize: '16px' }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: '12px', color: '#fff' }}>{data.label}</span>
            </div>
            {data.events && data.events.length > 0 && (
                <div style={{ padding: '8px 14px' }}>
                    {data.events.map((event, i) => (
                        <div key={i} style={{
                            fontSize: '10px',
                            color: '#a1a1aa',
                            padding: '2px 0',
                            fontFamily: 'monospace',
                        }}>
                            → {event}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const nodeTypes = { event: EventNode };

const initialNodes: Node[] = [
    // Publishers
    {
        id: 'order-service',
        type: 'event',
        position: { x: 0, y: 50 },
        data: { label: 'Order Service', type: 'publisher', events: ['order.created', 'order.updated'] },
    },
    {
        id: 'payment-service',
        type: 'event',
        position: { x: 0, y: 200 },
        data: { label: 'Payment Service', type: 'publisher', events: ['payment.success', 'payment.failed'] },
    },
    {
        id: 'user-service',
        type: 'event',
        position: { x: 0, y: 350 },
        data: { label: 'User Service', type: 'publisher', events: ['user.registered'] },
    },
    // Queues / Topics
    {
        id: 'order-queue',
        type: 'event',
        position: { x: 220, y: 0 },
        data: { label: 'orders.queue', type: 'queue' },
    },
    {
        id: 'events-topic',
        type: 'event',
        position: { x: 220, y: 130 },
        data: { label: 'events.topic', type: 'topic' },
    },
    {
        id: 'notifications-queue',
        type: 'event',
        position: { x: 220, y: 260 },
        data: { label: 'notifications.queue', type: 'queue' },
    },
    {
        id: 'analytics-queue',
        type: 'event',
        position: { x: 220, y: 380 },
        data: { label: 'analytics.queue', type: 'queue' },
    },
    // Workers / Subscribers
    {
        id: 'fulfillment-worker',
        type: 'event',
        position: { x: 440, y: 0 },
        data: { label: 'Fulfillment Worker', type: 'worker' },
    },
    {
        id: 'inventory-subscriber',
        type: 'event',
        position: { x: 440, y: 100 },
        data: { label: 'Inventory Service', type: 'subscriber' },
    },
    {
        id: 'notification-worker',
        type: 'event',
        position: { x: 440, y: 220 },
        data: { label: 'Notification Worker', type: 'worker' },
    },
    {
        id: 'email-subscriber',
        type: 'event',
        position: { x: 440, y: 320 },
        data: { label: 'Email Service', type: 'subscriber' },
    },
    {
        id: 'analytics-worker',
        type: 'event',
        position: { x: 440, y: 420 },
        data: { label: 'Analytics Worker', type: 'worker' },
    },
];

const initialEdges: Edge[] = [
    // Publishers to queues
    { id: 'e1', source: 'order-service', target: 'order-queue', label: 'order.*', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e2', source: 'order-service', target: 'events-topic', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e3', source: 'payment-service', target: 'events-topic', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e4', source: 'payment-service', target: 'notifications-queue', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e5', source: 'user-service', target: 'notifications-queue', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e6', source: 'user-service', target: 'analytics-queue', animated: true, style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    // Queues to consumers
    { id: 'e7', source: 'order-queue', target: 'fulfillment-worker', animated: true, style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
    { id: 'e8', source: 'events-topic', target: 'inventory-subscriber', animated: true, style: { stroke: '#a855f7' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e9', source: 'events-topic', target: 'analytics-worker', animated: true, style: { stroke: '#a855f7' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e10', source: 'notifications-queue', target: 'notification-worker', animated: true, style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
    { id: 'e11', source: 'notification-worker', target: 'email-subscriber', style: { stroke: '#ec4899' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
    { id: 'e12', source: 'analytics-queue', target: 'analytics-worker', animated: true, style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
];

export default function AsyncEvents() {
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
                    <span>📤</span><span style={{ color: '#a1a1aa' }}>Publisher</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📬</span><span style={{ color: '#a1a1aa' }}>Queue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📢</span><span style={{ color: '#a1a1aa' }}>Topic</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⚙️</span><span style={{ color: '#a1a1aa' }}>Worker</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📥</span><span style={{ color: '#a1a1aa' }}>Subscriber</span>
                </div>
            </div>
        </div>
    );
}
