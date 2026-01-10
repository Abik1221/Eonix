'use client';

import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface ServiceMapProps {
    initialNodes: Node[];
    initialEdges: Edge[];
}

import ServiceNode from './nodes/ServiceNode';

const nodeTypes = {
    default: ServiceNode,
};

export default function ServiceMap({ initialNodes, initialEdges }: ServiceMapProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full bg-slate-50 rounded-lg border border-gray-200 overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-gray-200 text-xs text-gray-500 pointer-events-none">
                💡 Right-click any node to report an issue
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
