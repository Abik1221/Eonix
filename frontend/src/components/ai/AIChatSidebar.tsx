'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiZap, FiCpu, FiTrendingUp, FiPaperclip } from 'react-icons/fi';
import './ai.css';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

interface QuickInsight {
    id: string;
    icon: React.ReactNode;
    title: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
}

interface AIChatSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    contextData?: {
        activeLayer?: string;
        selectedNode?: string;
    };
}

// Mock quick insights
const MOCK_INSIGHTS: QuickInsight[] = [
    {
        id: '1',
        icon: <FiCpu />,
        title: 'System Health',
        value: '98.5%',
        trend: 'up',
    },
    {
        id: '2',
        icon: <FiZap />,
        title: 'Active Issues',
        value: '2',
        trend: 'neutral',
    },
    {
        id: '3',
        icon: <FiTrendingUp />,
        title: 'API Latency',
        value: '45ms',
        trend: 'down',
    },
];

// Mock AI responses
const AI_RESPONSES = [
    "Based on the current architecture, I can see that your **Auth Service** is experiencing higher than normal latency. This could be due to the connection pooling configuration with PostgreSQL.",
    "The service map shows a potential single point of failure at the **API Gateway**. Consider implementing a redundant gateway or load balancer for improved reliability.",
    "I've analyzed your API endpoints and noticed that the `/api/v1/orders/{id}` DELETE endpoint is marked as deprecated. You may want to update dependent services before removing it.",
    "Your infrastructure looks healthy overall. The current setup supports approximately 10,000 concurrent connections based on the resource allocation I can observe.",
];

export default function AIChatSidebar({ isOpen, onClose, contextData }: AIChatSidebarProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Focus input when sidebar opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Handle send message
    const handleSendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        const aiMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'ai',
            content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
    };

    // Handle key press
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Quick action prompts
    const quickPrompts = [
        "Explain this architecture",
        "Find potential issues",
        "Optimize performance",
        "Security analysis",
    ];

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
        setTimeout(() => handleSendMessage(), 100);
    };

    // Auto-resize textarea
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Reset height to auto to get the correct scrollHeight
        e.target.style.height = 'auto';
        // Set to scrollHeight but cap at max height
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="ai-sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        className="ai-chat-sidebar"
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="ai-sidebar-header">
                            <div className="ai-header-title">
                                <div className="ai-header-logo">E</div>
                                <div>
                                    <h2>AI Assistant</h2>
                                    <span className="ai-powered-by">Powered by Eonix AI</span>
                                </div>
                            </div>
                            <button className="ai-close-btn" onClick={onClose}>
                                <FiX />
                            </button>
                        </div>

                        {/* Quick Insights */}
                        <div className="ai-quick-insights">
                            <h3 className="insights-title">
                                <FiZap className="insights-icon" />
                                Quick Insights
                            </h3>
                            <div className="insights-grid">
                                {MOCK_INSIGHTS.map(insight => (
                                    <div key={insight.id} className="insight-card">
                                        <div className="insight-icon">{insight.icon}</div>
                                        <div className="insight-content">
                                            <span className="insight-label">{insight.title}</span>
                                            <span className={`insight-value ${insight.trend}`}>
                                                {insight.value}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="ai-chat-messages">
                            {messages.length === 0 ? (
                                <div className="ai-welcome">
                                    <div className="welcome-icon">
                                        <span>✦</span>
                                    </div>
                                    <h4>How can I help you?</h4>
                                    <p>Ask me anything about your architecture, services, or infrastructure.</p>

                                    <div className="quick-prompts">
                                        {quickPrompts.map((prompt, index) => (
                                            <button
                                                key={index}
                                                className="quick-prompt-btn"
                                                onClick={() => handleQuickPrompt(prompt)}
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map(message => (
                                        <motion.div
                                            key={message.id}
                                            className={`chat-message ${message.role}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {message.role === 'ai' && (
                                                <div className="message-avatar">E</div>
                                            )}
                                            <div className="message-bubble">
                                                <p dangerouslySetInnerHTML={{
                                                    __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                }} />
                                                <span className="message-time">
                                                    {message.timestamp.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Typing Indicator */}
                                    {isTyping && (
                                        <motion.div
                                            className="chat-message ai"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <div className="message-avatar">E</div>
                                            <div className="message-bubble typing">
                                                <div className="typing-indicator">
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Enterprise-Style Input Box */}
                        <div className="ai-input-box">
                            {/* Header Bar */}
                            <div className="input-box-header">
                                <div className="powered-badge">
                                    <span className="badge-logo">E</span>
                                    <span>Powered by Eonix</span>
                                </div>
                                <span className="enter-hint">Press Enter to send</span>
                            </div>

                            {/* Main Input Area */}
                            <div className="input-box-main">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask me anything..."
                                    disabled={isTyping}
                                    rows={1}
                                />
                            </div>

                            {/* Footer Bar */}
                            <div className="input-box-footer">
                                <div className="footer-left">
                                    <button className="model-badge">
                                        <span className="model-logo">E</span>
                                        <span>Eonix AI</span>
                                    </button>
                                    <button className="attach-btn" title="Attach file">
                                        <FiPaperclip />
                                    </button>
                                </div>
                                <button
                                    className="enterprise-send-btn"
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isTyping}
                                >
                                    <FiSend />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
