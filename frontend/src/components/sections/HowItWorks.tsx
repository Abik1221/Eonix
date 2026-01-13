'use client';

import React from 'react';
import { FlickeringGrid } from '@/components/ui/FlickeringGrid';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Github, GitBranch, BookOpen, FileText, Bot, Database, Cloud, Slack, Send, LayoutGrid, Server, Cpu } from 'lucide-react';

/* ============================================================================
   HOW IT WORKS SECTION
   Uses shadcn Carousel with Stripe-style cards
   ============================================================================ */

/* Logo component */
const LogoIcon = ({ name }: { name: string }) => {
    const iconMap: Record<string, React.ReactNode> = {
        GitHub: <Github size={14} />,
        GitLab: <GitBranch size={14} />,
        Bitbucket: <Database size={14} />,
        Notion: <BookOpen size={14} />,
        Confluence: <FileText size={14} />,
        OpenAI: <Bot size={14} />,
        Anthropic: <Cpu size={14} />,
        Cursor: <Bot size={14} />,
        Slack: <Slack size={14} />,
        Twilio: <Send size={14} />,
        Linear: <LayoutGrid size={14} />,
        AWS: <Cloud size={14} />,
        Azure: <Cloud size={14} />,
        GCP: <Server size={14} />,
    };

    return (
        <span style={{ color: '#71717a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {iconMap[name] || <Database size={14} />}
            <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase'
            }}>
                {name}
            </span>
        </span>
    );
};

/* Card data */
const carouselCards = [
    {
        id: 'ai',
        title: 'AI',
        description: 'Eonix supports businesses across the AI ecosystem—from code analysis for AI assistants to infrastructure documentation for providers.',
        color: '#6366f1',
        logos: ['OpenAI', 'Cursor', 'Anthropic'],
    },
    {
        id: 'saas',
        title: 'SaaS',
        description: 'Quickly understand and document your codebase with a unified platform for architecture visualization, dependency tracking, and more.',
        color: '#8b5cf6',
        logos: ['Slack', 'Twilio', 'Linear'],
    },
    {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Get everything you need for multi-team codebases, manage contributors, track dependencies, all in one place.',
        color: '#ec4899',
        logos: ['GitHub', 'GitLab', 'Bitbucket'],
    },
    {
        id: 'enterprise',
        title: 'Enterprise',
        description: 'Enterprise-grade architecture intelligence with compliance, governance, and SSO integration for large organizations.',
        color: '#10b981',
        logos: ['AWS', 'Azure', 'GCP'],
    },
    {
        id: 'startup',
        title: 'Startup',
        description: 'Move fast without breaking things. Onboard developers quickly and maintain code quality as you scale.',
        color: '#f59e0b',
        logos: ['Notion', 'Linear', 'Slack'],
    },
];

export default function HowItWorks() {
    return (
        <section
            style={{
                backgroundColor: '#ffffff',
                padding: '120px 0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Flickering Grid Background */}
            <FlickeringGrid
                color="rgb(139, 92, 246)"
                maxOpacity={0.08}
                squareSize={3}
                gridGap={8}
                flickerChance={0.2}
            />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <div style={{ maxWidth: '600px', marginBottom: '64px' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(32px, 4vw, 48px)',
                        fontWeight: 700,
                        color: '#18181b',
                        letterSpacing: '-0.03em',
                        lineHeight: 1.15,
                        marginBottom: '16px'
                    }}>
                        Support for any business type
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '17px',
                        color: '#52525b',
                        lineHeight: 1.7
                    }}>
                        From global AI companies to category-defining startups,
                        successful businesses across industries grow and scale with Eonix.
                    </p>
                </div>

                {/* Carousel */}
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                        slidesToScroll: 1,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="ml-0">
                        {carouselCards.map((card) => (
                            <CarouselItem key={card.id} className="pl-0 md:basis-1/2 lg:basis-1/3">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        background: '#ffffff',
                                        height: '100%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderLeft: '1px solid #e5e7eb',
                                    }}
                                    className="hover:bg-gray-50/50"
                                >
                                    {/* Gradient Top Border */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: `linear-gradient(90deg, ${card.color}, ${card.color}88)`,
                                    }} />

                                    {/* Card Content */}
                                    <div style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '32px 28px 24px'
                                    }}>
                                        <h3 style={{
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '20px',
                                            fontWeight: 700,
                                            color: '#0a2540',
                                            marginBottom: '12px',
                                        }}>
                                            {card.title}
                                        </h3>
                                        <p style={{
                                            flex: 1,
                                            fontFamily: 'var(--font-body)',
                                            fontSize: '15px',
                                            color: '#425466',
                                            lineHeight: 1.65,
                                            marginBottom: '20px',
                                        }}>
                                            {card.description}
                                        </p>

                                        {/* Learn More CTA */}
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontFamily: 'var(--font-body)',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                color: card.color,
                                                transition: 'gap 0.2s ease',
                                            }}
                                            className="hover:gap-2"
                                        >
                                            Learn more
                                            <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                                                <path d="M1 5h6" stroke={card.color} strokeWidth="1.5" />
                                                <path d="M5 1l4 4-4 4" stroke={card.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Logo Grid */}
                                    <div style={{
                                        padding: '16px 28px',
                                        borderTop: '1px solid #f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '24px',
                                        background: '#fafafa',
                                    }}>
                                        {card.logos.map((logo, i) => (
                                            <LogoIcon key={i} name={logo} />
                                        ))}
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </div>
        </section>
    );
}
