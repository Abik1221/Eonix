'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2 } from 'lucide-react';

interface IntegrationCardProps {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    connected: boolean;
    connecting?: boolean;
    onToggle: (id: string) => void;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
    id,
    name,
    description,
    icon,
    connected,
    connecting = false,
    onToggle
}) => {
    return (
        <div className="group relative bg-[#111114] border border-white/[0.04] hover:border-indigo-500/20 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                {connected && (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-medium text-emerald-400">Connected</span>
                    </div>
                )}
            </div>

            <div className="mb-6">
                <h3 className="text-base font-semibold text-zinc-100 mb-2">{name}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed min-h-[40px]">{description}</p>
            </div>

            <button
                onClick={() => onToggle(id)}
                disabled={connecting}
                className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                    ${connected
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-white/[0.04]'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                    }
                    disabled:opacity-70 disabled:cursor-not-allowed
                `}
            >
                {connecting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting...</span>
                    </>
                ) : connected ? (
                    'Configure'
                ) : (
                    <>
                        Connect
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </div>
    );
};
