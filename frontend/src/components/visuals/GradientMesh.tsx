'use client';

import React, { useRef, useEffect, useCallback } from 'react';

/* ============================================================================
   GRADIENT MESH BACKGROUND
   Animated gradient mesh with vibrant colors (pink, purple, orange, cyan).
   Creates a flowing, organic gradient effect using Canvas 2D.
   
   Performance optimized with requestAnimationFrame and proper cleanup.
   ============================================================================ */

interface GradientBlob {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
}

export default function GradientMesh() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const blobsRef = useRef<GradientBlob[]>([]);

    /* Initialize blobs with random positions and velocities */
    const initBlobs = useCallback((width: number, height: number) => {
        const colors = [
            'rgba(236, 72, 153, 0.7)',
            'rgba(168, 85, 247, 0.6)',
            'rgba(251, 146, 60, 0.65)',
            'rgba(250, 204, 21, 0.5)',
            'rgba(99, 102, 241, 0.55)',
            'rgba(6, 182, 212, 0.5)',
        ];

        blobsRef.current = colors.map((color, i) => ({
            x: width * (0.2 + (i % 3) * 0.3),
            y: height * (0.2 + Math.floor(i / 3) * 0.4),
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            radius: Math.min(width, height) * (0.25 + Math.random() * 0.15),
            color
        }));
    }, []);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const { width, height } = canvas;

        /* Clear canvas with white base */
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        /* Update and draw each blob */
        blobsRef.current.forEach((blob) => {
            /* Update position with smooth motion */
            blob.x += blob.vx;
            blob.y += blob.vy;

            /* Bounce off edges with some padding */
            const padding = blob.radius * 0.3;
            if (blob.x < -padding || blob.x > width + padding) {
                blob.vx *= -1;
                blob.x = Math.max(-padding, Math.min(width + padding, blob.x));
            }
            if (blob.y < -padding || blob.y > height + padding) {
                blob.vy *= -1;
                blob.y = Math.max(-padding, Math.min(height + padding, blob.y));
            }

            /* Add slight random drift for organic movement */
            blob.vx += (Math.random() - 0.5) * 0.1;
            blob.vy += (Math.random() - 0.5) * 0.1;

            /* Clamp velocity to prevent too fast movement */
            const maxVel = 2;
            blob.vx = Math.max(-maxVel, Math.min(maxVel, blob.vx));
            blob.vy = Math.max(-maxVel, Math.min(maxVel, blob.vy));

            /* Draw radial gradient blob */
            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius
            );
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });

        /* Add overlay for depth */
        ctx.globalCompositeOperation = 'overlay';
        const overlayGradient = ctx.createLinearGradient(0, 0, width, height);
        overlayGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        overlayGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        overlayGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        ctx.fillStyle = overlayGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'source-over';

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
        }

        /* Reinitialize blobs on resize */
        initBlobs(rect.width, rect.height);
    }, [initBlobs]);

    useEffect(() => {
        handleResize();
        animate();

        window.addEventListener('resize', handleResize);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize, animate]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                filter: 'blur(60px)'
            }}
        />
    );
}
