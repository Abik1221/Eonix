import React, { useState, useEffect } from 'react';

interface AIChatSVGProps {
    question?: string;
    answer?: string;
}

export const AIChatSVG: React.FC<AIChatSVGProps> = ({
    question = "Why is the checkout process failing?",
    answer = "I've detected a race condition in the PaymentController. The order status update conflicts with the verification callback. Wrapping the update in a transaction will resolve this integrity issue."
}) => {
    const [phase, setPhase] = useState<'idle' | 'typing_q' | 'analyzing' | 'typing_a' | 'done'>('idle');
    const [qText, setQText] = useState('');
    const [aText, setAText] = useState('');

    // Config
    const width = 600;
    const height = 300;
    const padding = 24;

    useEffect(() => {
        let isMounted = true;

        const runSequence = async () => {
            if (!isMounted) return;

            // Reset
            setQText('');
            setAText('');
            setPhase('idle');

            // 1. Idle brief
            await new Promise(r => setTimeout(r, 800));
            if (!isMounted) return;

            // 2. Type Question
            setPhase('typing_q');
            for (let i = 0; i <= question.length; i++) {
                if (!isMounted) return;
                setQText(question.slice(0, i));
                await new Promise(r => setTimeout(r, 40));
            }

            // 3. Analyzing
            setPhase('analyzing');
            await new Promise(r => setTimeout(r, 1500));
            if (!isMounted) return;

            // 4. Stream Answer
            setPhase('typing_a');
            for (let i = 0; i <= answer.length; i++) {
                if (!isMounted) return;
                setAText(answer.slice(0, i));
                await new Promise(r => setTimeout(r, 20));
            }

            // 5. Done
            setPhase('done');
        };

        runSequence();

        return () => { isMounted = false; };
    }, [question, answer]);

    // Text wrapping helper basic
    const wrapText = (text: string, maxChars: number) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            if (currentLine.length + 1 + words[i].length <= maxChars) {
                currentLine += ' ' + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        lines.push(currentLine);
        return lines;
    };

    const answerLines = wrapText(aText, 55);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto drop-shadow-xl rounded-xl bg-black border border-neutral-800">
                {/* Background Grid */}
                <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a1a1a" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="black" />
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

                {/* User Message Bubble (Right) */}
                {qText && (
                    <g transform={`translate(${width - padding - 20}, 60)`}>
                        <path
                            d={`M 0 0 
                               L -${Math.min(qText.length * 9 + 40, 360)} 0 
                               Q -${Math.min(qText.length * 9 + 40, 360) + 10} 0 -${Math.min(qText.length * 9 + 40, 360) + 10} 10
                               L -${Math.min(qText.length * 9 + 40, 360) + 10} 40 
                               Q -${Math.min(qText.length * 9 + 40, 360) + 10} 50 -${Math.min(qText.length * 9 + 40, 360)} 50
                               L -10 50 
                               L 0 50 
                               L 0 0`}
                            fill="#333"
                        />
                        <text
                            x="-20"
                            y="30"
                            textAnchor="end"
                            fill="white"
                            fontFamily="monospace"
                            fontSize="14"
                        >
                            {qText}
                        </text>
                    </g>
                )}

                {/* AI Response Area (Left) */}
                {(phase === 'analyzing' || aText) && (
                    <g transform={`translate(${padding}, 140)`}>
                        {/* Avatar */}
                        <circle cx="16" cy="16" r="16" fill="white" />
                        <path d="M16 8 L16 24 M8 16 L24 16" stroke="black" strokeWidth="2" transform="rotate(45 16 16)" />

                        {/* Connecting Line */}
                        <line x1="16" y1="32" x2="16" y2="50" stroke="#333" strokeDasharray="4 4" />

                        {/* Content */}
                        <g transform="translate(40, 0)">
                            {phase === 'analyzing' ? (
                                <text x="0" y="20" fill="#666" fontFamily="monospace" fontSize="14">
                                    ANALYZING ARCHITECTURE...
                                    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite" />
                                </text>
                            ) : (
                                <g>
                                    {answerLines.map((line, i) => (
                                        <text
                                            key={i}
                                            x="0"
                                            y={20 + (i * 24)}
                                            fill="#ddd"
                                            fontFamily="monospace"
                                            fontSize="14"
                                        >
                                            {line}
                                        </text>
                                    ))}
                                    {/* Cursor */}
                                    {phase === 'typing_a' && (
                                        <rect
                                            x={answerLines[answerLines.length - 1].length * 8.5}
                                            y={((answerLines.length - 1) * 24) + 8}
                                            width="8"
                                            height="14"
                                            fill="white"
                                        >
                                            <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
                                        </rect>
                                    )}
                                </g>
                            )}
                        </g>

                    </g>
                )}
            </svg>
        </div>
    );
};
