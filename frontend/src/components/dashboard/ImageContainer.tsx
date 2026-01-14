'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZoomIn, FiZoomOut, FiMaximize2, FiMove } from 'react-icons/fi';
import './imagecontainer.css';

interface ImageContainerProps {
    src?: string;
    alt?: string;
    children?: React.ReactNode;
    enableZoom?: boolean;
    enablePan?: boolean;
    minScale?: number;
    maxScale?: number;
    className?: string;
}

export default function ImageContainer({
    src,
    alt = 'Diagram',
    children,
    enableZoom = true,
    enablePan = true,
    minScale = 0.5,
    maxScale = 3,
    className = '',
}: ImageContainerProps) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(!!src);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef({ x: 0, y: 0 });
    const positionStart = useRef({ x: 0, y: 0 });

    // Handle zoom
    const handleZoom = useCallback((delta: number) => {
        setScale(prev => Math.min(maxScale, Math.max(minScale, prev + delta)));
    }, [minScale, maxScale]);

    // Handle fit to screen
    const handleFitToScreen = useCallback(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, []);

    // Handle wheel zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!enableZoom) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        handleZoom(delta);
    }, [enableZoom, handleZoom]);

    // Handle drag start
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!enablePan) return;
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        positionStart.current = { ...position };
    }, [enablePan, position]);

    // Handle drag
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
            x: positionStart.current.x + dx,
            y: positionStart.current.y + dy,
        });
    }, [isDragging]);

    // Handle drag end
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Handle image load
    const handleImageLoad = () => {
        setIsLoading(false);
    };

    // Clean up event listeners
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div
            ref={containerRef}
            className={`image-container-wrapper ${className}`}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isDragging ? 'grabbing' : enablePan ? 'grab' : 'default' }}
        >
            {/* Controls */}
            <div className="image-controls">
                {enableZoom && (
                    <>
                        <button
                            className="image-control-btn"
                            onClick={() => handleZoom(0.2)}
                            title="Zoom In"
                        >
                            <FiZoomIn />
                        </button>
                        <button
                            className="image-control-btn"
                            onClick={() => handleZoom(-0.2)}
                            title="Zoom Out"
                        >
                            <FiZoomOut />
                        </button>
                    </>
                )}
                <button
                    className="image-control-btn"
                    onClick={handleFitToScreen}
                    title="Fit to Screen"
                >
                    <FiMaximize2 />
                </button>
                {enablePan && (
                    <div className="zoom-indicator">
                        <FiMove />
                        <span>{Math.round(scale * 100)}%</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <motion.div
                className="image-content"
                animate={{
                    scale,
                    x: position.x,
                    y: position.y,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Loading Skeleton */}
                {isLoading && (
                    <div className="image-skeleton">
                        <div className="skeleton-shimmer" />
                    </div>
                )}

                {/* Image */}
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        onLoad={handleImageLoad}
                        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
                        draggable={false}
                    />
                )}

                {/* Children (for custom content like diagrams) */}
                {children}
            </motion.div>
        </div>
    );
}
