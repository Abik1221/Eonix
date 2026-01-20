'use client';

import React, { useState, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    MarkerType,
    ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { api, GraphData, ProjectStats } from '@/utils/api';
import { Button } from '@/components/ui/button';
import DotPattern from '@/components/ui/DotPattern';
import { Search, Github, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [repoUrl, setRepoUrl] = useState('');
    const [projectId, setProjectId] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'processing' | 'ready' | 'error'>('idle');
    const [stats, setStats] = useState<ProjectStats | null>(null);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // DEBOUNCED SEARCH
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                setIsSearching(true);
                const results = await api.searchGithub(searchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleIngest = async () => {
        if (!repoUrl) return;
        setStatus('processing');
        try {
            const res = await api.ingestRepo(repoUrl);
            setProjectId(res.project_id);
            setTimeout(() => fetchGraph(res.project_id), 3000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    const fetchGraph = async (id: string) => {
        try {
            const graphData = await api.getGraph(id);
            const statsData = await api.getStats(id);
            transformAndSetGraph(graphData);
            setStats(statsData);
            setStatus('ready');
        } catch (e) {
            console.error(e);
            setTimeout(() => fetchGraph(id), 2000);
        }
    };

    const transformAndSetGraph = (data: GraphData) => {
        const rfNodes: Node[] = data.nodes.map((n) => ({
            id: n.id,
            position: { x: Math.random() * 800, y: Math.random() * 600 },
            data: { label: n.label },
            style: {
                background: n.color || '#1e293b',
                color: 'white',
                border: '1px solid #475569',
                width: 180,
                padding: 10,
                borderRadius: 8,
                fontSize: 12
            },
            type: 'default'
        }));

        const rfEdges: Edge[] = data.edges.map((e, i) => ({
            id: `e${i}`,
            source: e.from,
            target: e.to,
            label: e.label,
            animated: true,
            style: { stroke: '#94a3b8' },
            markerEnd: { type: MarkerType.ArrowClosed },
            type: ConnectionLineType.SmoothStep
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
    };

    const selectRepo = (url: string) => {
        setRepoUrl(url);
        setIsSearchOpen(false);
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden font-sans">
            <DotPattern width={20} height={20} cx={1} cy={1} cr={1} className="absolute inset-0 opacity-20" />

            <div className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center">

                {/* HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block px-3 py-1 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
                        AI-Powered Architecture Analysis
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4 tracking-tight">
                        Eonix Analyst
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Visualize your codebase architecture instantly.
                    </p>
                </motion.div>

                {/* INPUT */}
                <AnimatePresence mode="wait">
                    {status === 'idle' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-xl relative"
                        >
                            <div className="flex gap-2 p-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl relative z-20">
                                <div className="flex items-center pl-3">
                                    <Github className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="https://github.com/username/repo"
                                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 px-4 py-3 outline-none"
                                    value={repoUrl}
                                    onChange={(e) => setRepoUrl(e.target.value)}
                                />

                                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-white">
                                    <Search className="w-5 h-5" />
                                </Button>

                                <Button onClick={handleIngest} className="bg-indigo-600 hover:bg-indigo-700">
                                    Analyze
                                </Button>
                            </div>

                            {/* SEARCH DROPDOWN */}
                            {isSearchOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 p-2"
                                >
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search public repos..."
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-2"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />

                                    <div className="max-h-64 overflow-y-auto space-y-1">
                                        {isSearching && (
                                            <div className="flex justify-center py-4">
                                                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                                            </div>
                                        )}
                                        {!isSearching && searchResults.map((repo) => (
                                            <div
                                                key={repo.id}
                                                onClick={() => selectRepo(repo.clone_url)}
                                                className="p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <div className="font-medium text-sm text-indigo-300">{repo.full_name}</div>
                                                <div className="text-xs text-gray-500 truncate">{repo.description}</div>
                                            </div>
                                        ))}
                                        {!isSearching && searchQuery.length > 2 && searchResults.length === 0 && (
                                            <div className="text-center text-xs text-gray-500 py-2">No results found</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {status === 'processing' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
                        >
                            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <h3 className="text-xl font-semibold">Analyzing Repository...</h3>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* DASHBOARD */}
                {status === 'ready' && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]"
                    >
                        <div className="lg:col-span-1 space-y-4">
                            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-4">Stats</h3>
                                <div className="space-y-4">
                                    {stats && Object.entries(stats).map(([key, val]) => (
                                        <div key={key} className="flex justify-between items-center">
                                            <span className="text-gray-300 capitalize">{key}</span>
                                            <span className="font-mono text-xl font-bold">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Button onClick={() => setStatus('idle')} variant="outline" className="w-full border-white/10 text-gray-400 hover:bg-white/5">
                                Analyze Another
                            </Button>
                        </div>

                        <div className="lg:col-span-3 h-full rounded-2xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-sm relative shadow-2xl">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                fitView
                            >
                                <Background color="#333" gap={20} />
                                <Controls className="bg-white/10 border-white/10 fill-white text-white" />
                                <MiniMap style={{ background: '#1e1e1e' }} nodeColor={() => '#6366f1'} />
                            </ReactFlow>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
