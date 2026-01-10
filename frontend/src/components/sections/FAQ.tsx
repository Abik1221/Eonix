'use client';

import React, { useState } from 'react';

const faqs = [
    {
        question: 'Does AI modify my code or guess my architecture?',
        answer: 'No. Our AI never writes, modifies, or discovers new architecture. It only explains the deterministic graph built from your code via static analysis. You always stay in control.'
    },
    {
        question: 'What programming languages and frameworks are supported?',
        answer: 'We currently support Python, Java, Go, TypeScript, and JavaScript. For frameworks, we handle popular ones (e.g., Django, Spring, Node.js) and will extend support over time.'
    },
    {
        question: 'Can I integrate with tools like GitHub, Jira, or Slack?',
        answer: 'Yes. You can link repositories, create tickets, receive notifications, and discuss architecture directly in your workflow.'
    },
    {
        question: 'How secure is my code and data?',
        answer: 'Your code is never sent to third-party AI services. All analysis happens in your environment. We also provide role-based access, secrets scanning, and enterprise-grade compliance features (SOC2 / ISO).'
    },
    {
        question: 'Can I collaborate with my team?',
        answer: 'Absolutely. Invite team members to workspaces, comment on nodes, annotate architecture diagrams, and assign tasks with integrated messaging.'
    },
    {
        question: 'How does the AI help me as a developer or architect?',
        answer: 'AI summarizes complex service flows, explains endpoint connections, highlights architectural risks, and answers “why” questions — always based on verified facts.'
    },
    {
        question: 'Can I export diagrams and reports?',
        answer: 'Yes. Export ERDs, sequence diagrams, and service interaction graphs as PDF or PNG. Enterprise plans offer automated reports.'
    },
    {
        question: 'What if I have a monorepo or multiple microservices?',
        answer: 'We support both single-repo (monolith) and multi-repo (microservices) projects, stitching services together to provide a unified view.'
    },
    {
        question: 'How is this different from other code analysis tools?',
        answer: 'Unlike traditional tools that generate static diagrams, we combine deterministic extraction + semantic graph + AI reasoning. You get a living, queryable architecture map, not just a static picture.'
    },
    {
        question: 'How do I get started?',
        answer: 'Sign up for the free plan, connect your repository via OAuth, and see your architecture mapped instantly. You can invite teammates and connect DevOps tools in minutes.'
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" style={{ backgroundColor: '#ffffff', padding: '120px 0' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                    <h2 style={{
                        fontSize: 'clamp(32px, 5vw, 40px)',
                        fontWeight: 700,
                        color: '#1a1a1a',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em'
                    }}>
                        Frequently Asked Questions
                    </h2>
                    <p style={{ fontSize: '18px', color: '#666666' }}>
                        Everything you need to know about Eonix.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                style={{
                                    borderBottom: '1px solid #eaeaea',
                                }}
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        padding: '24px 0',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                    }}
                                    aria-expanded={isOpen}
                                >
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#1a1a1a',
                                        paddingRight: '24px'
                                    }}>
                                        {faq.question}
                                    </span>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '24px',
                                        height: '24px',
                                        flexShrink: 0,
                                        color: '#1a1a1a',
                                        transition: 'transform 0.2s ease',
                                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'
                                    }}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </button>
                                <div
                                    style={{
                                        height: isOpen ? 'auto' : 0,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        opacity: isOpen ? 1 : 0
                                    }}
                                >
                                    <div style={{
                                        paddingBottom: '24px',
                                        fontSize: '16px',
                                        lineHeight: 1.6,
                                        color: '#4b5563'
                                    }}>
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
