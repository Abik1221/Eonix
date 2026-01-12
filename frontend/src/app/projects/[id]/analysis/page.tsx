'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Logo from '@/components/Logo';
import ProBadge from '@/components/ui/ProBadge';
import UpgradeModal from '@/components/modals/UpgradeModal';

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
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Logo size={48} color="#1a1a1a" />
                </div>

                {step === 'scanning' ? (
                    <div style={{ textAlign: 'center' }}>
                        {/* Newton's Cradle Animation */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '120px',
                            marginBottom: '32px',
                            gap: '2px'
                        }}>
                            <div className="cradle-ball first"></div>
                            <div className="cradle-ball"></div>
                            <div className="cradle-ball"></div>
                            <div className="cradle-ball"></div>
                            <div className="cradle-ball last"></div>
                        </div>

                        <h2 style={{ fontSize: '18px', fontWeight: 500, color: '#444', marginBottom: '8px' }}>
                            {scanStatus}
                        </h2>

                        <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                            {Math.round(scanProgress)}% complete
                        </p>

                        <style jsx>{`
                            .cradle-ball {
                                width: 24px;
                                height: 24px;
                                background-color: #1a1a1a;
                                border-radius: 50%;
                                position: relative;
                                transform-origin: 50% -60px;
                            }
                            .cradle-ball::before {
                                content: '';
                                position: absolute;
                                top: -60px;
                                left: 11px;
                                width: 2px;
                                height: 60px;
                                background-color: #e0e0e0;
                            }
                            .first {
                                animation: swing-left 1.2s infinite linear;
                            }
                            .last {
                                animation: swing-right 1.2s infinite linear;
                            }
                            @keyframes swing-left {
                                0% { transform: rotate(0deg); }
                                25% { transform: rotate(25deg); }
                                50% { transform: rotate(0deg); }
                                100% { transform: rotate(0deg); }
                            }
                            @keyframes swing-right {
                                0% { transform: rotate(0deg); }
                                50% { transform: rotate(0deg); }
                                75% { transform: rotate(-25deg); }
                                100% { transform: rotate(0deg); }
                            }
                        `}</style>
                    </div>
                ) : (
                    /* Review / Confirmation State */
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #eaeaea',
                        padding: '40px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                marginBottom: '16px',
                                fontSize: '24px'
                            }}>
                                ✓
                            </div>
                            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
                                Analysis Complete
                            </h2>
                            <p style={{ fontSize: '15px', color: '#666' }}>
                                We&apos;ve detected the following architecture. Does this look right?
                            </p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                                Detected Components
                            </h3>

                            <div style={{ display: 'grid', gap: '12px' }}>
                                {/* Detected Item 1 */}
                                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>FastAPI</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>Backend Framework • Python</div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                                        98% Confidence
                                    </div>
                                </div>

                                {/* Detected Item 2 */}
                                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>Next.js</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>Frontend Framework • TypeScript</div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                                        99% Confidence
                                    </div>
                                </div>

                                {/* Detected Item 3 */}
                                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>PostgreSQL</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>Database</div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                                        95% Confidence
                                    </div>
                                </div>

                                {/* Detected Item 4 */}
                                <div style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, color: '#1a1a1a' }}>Redis</div>
                                        <div style={{ fontSize: '13px', color: '#666' }}>Caching</div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px' }}>
                                        90% Confidence
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Architecture Insights (Pro Feature) */}
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    AI Architecture Insights
                                </h3>
                                <ProBadge />
                            </div>

                            <div
                                onClick={() => setIsUpgradeModalOpen(true)}
                                style={{
                                    border: '1px dashed #e0e0e0',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    backgroundColor: '#fafafa',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    transition: 'border-color 0.2s ease'
                                }}
                                className="group hover:border-amber-300"
                            >
                                {/* Blur Effect Overlay */}
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backdropFilter: 'blur(4px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.4)',
                                    zIndex: 10
                                }}>
                                    <button style={{
                                        backgroundColor: '#1a1a1a',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        </svg>
                                        Generate AI Explanation
                                    </button>
                                </div>

                                {/* Placeholder Content (Blurred) */}
                                <div style={{ filter: 'blur(4px)', opacity: 0.5, pointerEvents: 'none' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>Architecture Overview</h4>
                                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '16px' }}>
                                        The detected architecture follows a microservices pattern with a clear separation of concerns between the FastAPI backend and Next.js frontend.
                                        The PostgreSQL database handles persistence, while Redis acts as a high-speed caching layer to optimize read performance.
                                    </p>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ height: '24px', width: '80px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
                                        <div style={{ height: '24px', width: '100px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={handleConfirm}
                                style={{
                                    flex: 1,
                                    padding: '16px',
                                    backgroundColor: '#1a1a1a',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Confirm & View Dashboard
                            </button>
                            <button
                                style={{
                                    padding: '16px 24px',
                                    backgroundColor: '#ffffff',
                                    color: '#1a1a1a',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                )
                }
            </div>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    );
}
