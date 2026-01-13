'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ============================================================================
   FAQ - STRIPE STYLE
   Clean accordion with minimal design.
   Light background with subtle animations.
   ============================================================================ */

const faqs = [
    {
        question: 'Does AI modify my code?',
        answer: 'No. Our AI never writes or modifies code. It only explains the architecture graph built from static analysis.'
    },
    {
        question: 'What languages are supported?',
        answer: 'We support Python, Java, Go, TypeScript, and JavaScript. More languages coming soon.'
    },
    {
        question: 'Is my code secure?',
        answer: 'Absolutely. Your code never leaves your environment. All analysis happens locally or in your VPC.'
    },
    {
        question: 'Can I collaborate with my team?',
        answer: 'Yes. Invite team members, share workspaces, and collaborate on architecture decisions together.'
    },
    {
        question: 'How is this different from other tools?',
        answer: 'We combine deterministic extraction with AI reasoning. You get a living, queryable architecture map, not static diagrams.'
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="faq" style={{
            backgroundColor: '#fafafa',
            padding: '140px 0'
        }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: '64px' }}
                >
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '15px',
                        color: '#6366f1',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '16px'
                    }}>
                        FAQ
                    </p>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(36px, 5vw, 48px)',
                        fontWeight: 700,
                        color: '#18181b',
                        letterSpacing: '-0.03em'
                    }}>
                        Common questions
                    </h2>
                </motion.div>

                {/* FAQ Items */}
                <div>
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    background: '#ffffff',
                                    borderRadius: '12px',
                                    marginBottom: '12px',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                                }}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '20px 24px',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#18181b'
                                    }}>
                                        {faq.question}
                                    </span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#71717a"
                                        strokeWidth="2"
                                        style={{
                                            flexShrink: 0,
                                            transition: 'transform 0.2s ease',
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}
                                    >
                                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{
                                                padding: '0 24px 20px',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '15px',
                                                lineHeight: 1.7,
                                                color: '#52525b'
                                            }}>
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
