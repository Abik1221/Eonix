'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Logo from '@/components/Logo';
import ProBadge from '@/components/ui/ProBadge';
import UpgradeModal from '@/components/modals/UpgradeModal';
import '../../create/project.css';

type AnalysisStep = 'config' | 'analysis';

export default function AnalysisPage() {
    const router = useRouter();
    const params = useParams();
    const [step, setStep] = useState<'scanning' | 'review'>('scanning');
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    // Scanning State
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStatus, setScanStatus] = useState('Initializing...');

    // Scan Simulation
    useEffect(() => {
        if (step === 'scanning') {
            const steps = [
                { time: 500, prog: 10, msg: 'Connecting to repository...' },
                { time: 1500, prog: 30, msg: 'Analyzing codebase structure...' },
                { time: 3000, prog: 55, msg: 'Identifying architectural patterns...' },
                { time: 4500, prog: 80, msg: 'Generating explaining models...' },
                { time: 6000, prog: 100, msg: 'Finalizing analysis...' },
            ];

            let currentStep = 0;

            const timer = setInterval(() => {
                if (currentStep >= steps.length) {
                    clearInterval(timer);
                    setTimeout(() => setStep('review'), 800);
                    return;
                }

                const s = steps[currentStep];
                setScanProgress(s.prog);
                setScanStatus(s.msg);
                currentStep++;
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [step]);

    const handleConfirm = () => {
        router.push(`/projects/${params.id}/dashboard`);
    };

    return (
        <div className="project-container">
            {/* Background Animations */}
            <div className="proj-blur-shape-1" />
            <div className="proj-blur-shape-2" />

            <div className="project-content">
                <div className="proj-brand">
                    <Logo size={40} color="#1a1a1a" />
                </div>

                <div className="proj-card">
                    {step === 'scanning' ? (
                        <div className="analysis-scanning">
                            <div className="cradle-container">
                                <div className="cradle-ball first"></div>
                                <div className="cradle-ball"></div>
                                <div className="cradle-ball"></div>
                                <div className="cradle-ball"></div>
                                <div className="cradle-ball last"></div>
                            </div>

                            <h2 className="scan-status">{scanStatus}</h2>
                            <p className="scan-progress">{Math.round(scanProgress)}% complete</p>
                        </div>
                    ) : (
                        <div className="analysis-results">
                            <div className="success-header">
                                <div className="success-icon">✓</div>
                                <h1 className="proj-title">Analysis Complete</h1>
                                <p className="proj-subtitle">We&apos;ve detected the following architecture. Does this look right?</p>
                            </div>

                            <div className="results-grid">
                                <div className="result-item">
                                    <div className="result-info">
                                        <div className="result-name">FastAPI</div>
                                        <div className="result-type">Backend Framework • Python</div>
                                    </div>
                                    <span className="confidence-badge">98% Confidence</span>
                                </div>

                                <div className="result-item">
                                    <div className="result-info">
                                        <div className="result-name">Next.js</div>
                                        <div className="result-type">Frontend Framework • TypeScript</div>
                                    </div>
                                    <span className="confidence-badge">99% Confidence</span>
                                </div>

                                <div className="result-item">
                                    <div className="result-info">
                                        <div className="result-name">PostgreSQL</div>
                                        <div className="result-type">Database</div>
                                    </div>
                                    <span className="confidence-badge">95% Confidence</span>
                                </div>
                            </div>

                            {/* AI Architecture Insights (Pro Feature) */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        AI Architecture Insights
                                    </h3>
                                    <ProBadge />
                                </div>

                                <div
                                    className="ai-insight-card"
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                >
                                    <div className="ai-blur-overlay">
                                        <button className="btn-generate-ai">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                            </svg>
                                            Generate AI Explanation
                                        </button>
                                    </div>

                                    <div className="ai-placeholder-content">
                                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>Architecture Overview</h4>
                                        <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '16px' }}>
                                            The detected architecture follows a microservices pattern with a clear separation of concerns.
                                        </p>
                                        <div className="placeholder-line" style={{ width: '80%' }}></div>
                                        <div className="placeholder-line" style={{ width: '60%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="proj-actions" style={{ flexDirection: 'row' }}>
                                <button
                                    onClick={handleConfirm}
                                    className="btn-start"
                                    style={{ flex: 1 }}
                                >
                                    View Dashboard
                                </button>
                                <button
                                    className="btn-start"
                                    style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#1a1a1a', flex: 1, boxShadow: 'none' }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    );
}
