'use client';

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    definition: string;
}

export default function MermaidDiagram({ definition }: MermaidDiagramProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            mermaid.initialize({
                startOnLoad: true,
                theme: 'dark', // Changed to dark theme
                securityLevel: 'loose',
            });

            const render = async () => {
                try {
                    const { svg } = await mermaid.render(`mermaid-${Date.now()}`, definition);
                    if (ref.current) {
                        ref.current.innerHTML = svg;
                    }
                } catch (error) {
                    console.error("Mermaid render error:", error);
                    if (ref.current) {
                        ref.current.innerHTML = '<div class="text-red-500 text-sm p-4">Failed to render diagram</div>';
                    }
                }
            };

            render();
        }
    }, [definition]);

    return (
        <div
            className="w-full h-full flex items-center justify-center bg-transparent overflow-auto p-4"
        >
            <div ref={ref} className="mermaid w-full flex justify-center" />
        </div>
    );
}
