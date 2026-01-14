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

// Custom node for security components
function SecurityNode({ data }: { data: { label: string; type: string; details?: string[] } }) {
    const typeStyles: Record<string, { icon: string; color: string; bg: string }> = {
        client: { icon: '👤', color: '#71717a', bg: 'rgba(113, 113, 122, 0.1)' },
        gateway: { icon: '🚪', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
        waf: { icon: '🛡️', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
        ratelimit: { icon: '⏱️', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        auth: { icon: '🔐', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
        token: { icon: '🎫', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
        rbac: { icon: '👥', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
        resource: { icon: '📦', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
        audit: { icon: '📋', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    };

    const { icon, color, bg } = typeStyles[data.type] || typeStyles.gateway;

    return (
        <div style={{
            background: '#18181b',
            border: `1px solid ${color}40`,
            borderRadius: '10px',
            minWidth: '140px',
            overflow: 'hidden',
        }}>
            <div style={{
                padding: '12px 14px',
                background: bg,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <div>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: '#fff' }}>{data.label}</div>
                    {data.details && (
                        <div style={{ fontSize: '10px', color: '#71717a', marginTop: '2px' }}>
                            {data.details.join(' • ')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const nodeTypes = { security: SecurityNode };

const initialNodes: Node[] = [
    // Entry points
    {
        id: 'client',
        type: 'security',
        position: { x: 250, y: 0 },
        data: { label: 'Client Request', type: 'client' },
    },
    // Security layers
    {
        id: 'waf',
        type: 'security',
        position: { x: 250, y: 80 },
        data: { label: 'WAF', type: 'waf', details: ['XSS', 'SQLi', 'CSRF'] },
    },
    {
        id: 'rate-limiter',
        type: 'security',
        position: { x: 250, y: 160 },
        data: { label: 'Rate Limiter', type: 'ratelimit', details: ['100 req/min'] },
    },
    {
        id: 'api-gateway',
        type: 'security',
        position: { x: 250, y: 240 },
        data: { label: 'API Gateway', type: 'gateway', details: ['TLS 1.3'] },
    },
    // Auth flow
    {
        id: 'auth-service',
        type: 'security',
        position: { x: 100, y: 340 },
        data: { label: 'Auth Service', type: 'auth', details: ['OAuth 2.0'] },
    },
    {
        id: 'token-service',
        type: 'security',
        position: { x: 100, y: 440 },
        data: { label: 'Token Service', type: 'token', details: ['JWT', 'RS256'] },
    },
    {
        id: 'identity-provider',
        type: 'security',
        position: { x: 100, y: 540 },
        data: { label: 'Identity Provider', type: 'auth', details: ['SSO', 'SAML'] },
    },
    // Access control
    {
        id: 'rbac',
        type: 'security',
        position: { x: 400, y: 340 },
        data: { label: 'RBAC Engine', type: 'rbac', details: ['Roles', 'Permissions'] },
    },
    // Protected resources
    {
        id: 'api-resource',
        type: 'security',
        position: { x: 250, y: 440 },
        data: { label: 'Protected API', type: 'resource' },
    },
    {
        id: 'data-resource',
        type: 'security',
        position: { x: 400, y: 440 },
        data: { label: 'Data Layer', type: 'resource', details: ['Encrypted'] },
    },
    // Audit
    {
        id: 'audit-log',
        type: 'security',
        position: { x: 400, y: 540 },
        data: { label: 'Audit Logs', type: 'audit', details: ['Immutable'] },
    },
];

const initialEdges: Edge[] = [
    // Entry flow
    { id: 'e1', source: 'client', target: 'waf', animated: true, style: { stroke: '#52525b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#52525b' } },
    { id: 'e2', source: 'waf', target: 'rate-limiter', label: '✓ safe', style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e3', source: 'rate-limiter', target: 'api-gateway', label: '✓ allowed', style: { stroke: '#22c55e' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    // Auth flow
    { id: 'e4', source: 'api-gateway', target: 'auth-service', label: 'authenticate', style: { stroke: '#8b5cf6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' } },
    { id: 'e5', source: 'auth-service', target: 'token-service', style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
    { id: 'e6', source: 'auth-service', target: 'identity-provider', style: { stroke: '#22c55e', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: 'e7', source: 'token-service', target: 'api-gateway', label: 'JWT', style: { stroke: '#3b82f6' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' } },
    // Authorization
    { id: 'e8', source: 'api-gateway', target: 'rbac', label: 'authorize', style: { stroke: '#ec4899' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
    // Resource access
    { id: 'e9', source: 'api-gateway', target: 'api-resource', label: '✓ verified', style: { stroke: '#06b6d4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#06b6d4' } },
    { id: 'e10', source: 'rbac', target: 'data-resource', label: '✓ permitted', style: { stroke: '#ec4899' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' } },
    // Audit
    { id: 'e11', source: 'api-resource', target: 'audit-log', style: { stroke: '#a855f7', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
    { id: 'e12', source: 'data-resource', target: 'audit-log', style: { stroke: '#a855f7', strokeDasharray: '4' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } },
];

export default function SecurityFlow() {
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
                    <span>🛡️</span><span style={{ color: '#a1a1aa' }}>Firewall</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🔐</span><span style={{ color: '#a1a1aa' }}>Auth</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>🎫</span><span style={{ color: '#a1a1aa' }}>Token</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>👥</span><span style={{ color: '#a1a1aa' }}>RBAC</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>📋</span><span style={{ color: '#a1a1aa' }}>Audit</span>
                </div>
            </div>
        </div>
    );
}
