'use client';

import React, { useState } from 'react';
import { IntegrationCard } from '@/components/settings/IntegrationCard';
import { Github, Slack, Trello, GitMerge, Webhook } from 'lucide-react'; // Using Lucide icons as placeholders/replacements

const INTEGRATIONS_DATA = [
    {
        id: 'github',
        name: 'GitHub',
        description: 'Automatically analyze code on push and label PRs with architectural changes.',
        icon: <Github className="w-6 h-6 text-white" />,
        connected: true,
    },
    {
        id: 'jira',
        name: 'Jira',
        description: 'Create issues directly from architectural violations and track resolution status.',
        icon: <Trello className="w-6 h-6 text-[#2684FF]" />, // Using Trello icon as generic board icon
        connected: false,
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Receive real-time notifications about system drift and breaking changes.',
        icon: <Slack className="w-6 h-6 text-[#E01E5A]" />,
        connected: false,
    },
    {
        id: 'gitlab',
        name: 'GitLab',
        description: 'Sync with GitLab CI/CD pipelines to block architectural regressions.',
        icon: <GitMerge className="w-6 h-6 text-[#FC6D26]" />,
        connected: false,
    }
];

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState(INTEGRATIONS_DATA);
    const [connectingId, setConnectingId] = useState<string | null>(null);

    const toggleConnection = (id: string) => {
        // Toggle off immediately, but mock delay for connecting
        const target = integrations.find(i => i.id === id);

        if (target?.connected) {
            setIntegrations(prev => prev.map(item =>
                item.id === id ? { ...item, connected: false } : item
            ));
        } else {
            setConnectingId(id);
            setTimeout(() => {
                setIntegrations(prev => prev.map(item =>
                    item.id === id ? { ...item, connected: true } : item
                ));
                setConnectingId(null);
            }, 1500);
        }
    };

    return (
        <div className="min-h-screen bg-[#050507] p-8 md:p-12 font-sans selection:bg-indigo-500/30">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-white mb-2">Integrations</h1>
                    <p className="text-zinc-400">Connect Eonix to your existing workflow tools for seamless architecture governance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {integrations.map((item) => (
                        <IntegrationCard
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            icon={item.icon}
                            connected={item.connected}
                            connecting={connectingId === item.id}
                            onToggle={toggleConnection}
                        />
                    ))}
                </div>

                {/* Webhooks Section */}
                <div className="bg-[#111114] border border-white/[0.04] rounded-xl p-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                            <Webhook className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">Incoming Webhooks</h3>
                            <p className="text-zinc-400 text-sm mb-6">
                                Manually trigger analysis or integrate with custom CI/CD pipelines using webhooks.
                            </p>

                            <div className="flex items-center gap-3">
                                <code className="flex-1 bg-[#08080a] border border-white/[0.06] rounded-lg px-4 py-3 text-sm font-mono text-zinc-300">
                                    https://api.eonix.io/v1/webhooks/trigger/8f7d9a2b-3c4e...
                                </code>
                                <button className="px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium rounded-lg transition-colors border border-white/[0.04]">
                                    Copy
                                </button>
                                <button className="px-4 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-medium rounded-lg transition-colors border border-white/[0.04]">
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
