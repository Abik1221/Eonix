'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * FlickeringGrid Props
 */
interface FlickeringGridProps {
    squareSize?: number
    gridGap?: number
    flickerChance?: number
    color?: string
    maxOpacity?: number
    width?: number
    height?: number
    className?: string
    style?: React.CSSProperties
}

/**
 * FlickeringGrid Component
 * 
 * Creates a mesmerizing flickering grid background using canvas.
 * Squares randomly fade in and out for a subtle, living effect.
 */
export function FlickeringGrid({
    squareSize = 4,
    gridGap = 6,
    flickerChance = 0.3,
    color = 'rgb(99, 102, 241)',
    maxOpacity = 0.3,
    width,
    height,
    className = '',
    style
}: FlickeringGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

    // Parse color to RGB
    const memoizedColor = useMemo(() => {
        const toRGBA = (colorStr: string): string => {
            if (colorStr.startsWith('rgb')) {
                const match = colorStr.match(/\d+/g)
                if (match && match.length >= 3) {
                    return `${match[0]}, ${match[1]}, ${match[2]}`
                }
            }
            return '99, 102, 241' // default indigo
        }
        return toRGBA(color)
    }, [color])

    // Update container size
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setContainerSize({
                    width: width || rect.width,
                    height: height || rect.height
                })
            }
        }
        updateSize()
        window.addEventListener('resize', updateSize)
        return () => window.removeEventListener('resize', updateSize)
    }, [width, height])

    // Animation setup
    const setupCanvas = useCallback(
        (canvas: HTMLCanvasElement) => {
            const canvasWidth = containerSize.width
            const canvasHeight = containerSize.height
            const dpr = window.devicePixelRatio || 1

            canvas.width = canvasWidth * dpr
            canvas.height = canvasHeight * dpr
            canvas.style.width = `${canvasWidth}px`
            canvas.style.height = `${canvasHeight}px`

            const cols = Math.ceil(canvasWidth / (squareSize + gridGap))
            const rows = Math.ceil(canvasHeight / (squareSize + gridGap))

            const squares = new Float32Array(cols * rows)
            for (let i = 0; i < squares.length; i++) {
                squares[i] = Math.random() * maxOpacity
            }

            return { ctx: canvas.getContext('2d')!, dpr, cols, rows, squares }
        },
        [containerSize.width, containerSize.height, squareSize, gridGap, maxOpacity]
    )

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas || containerSize.width === 0) return

        const { ctx, dpr, cols, rows, squares } = setupCanvas(canvas)
        let animationId: number

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const index = i * rows + j

                    // Random flicker
                    if (Math.random() < flickerChance * 0.1) {
                        squares[index] = Math.random() * maxOpacity
                    }

                    // Smooth fade
                    const targetOpacity = Math.random() < 0.5 ? maxOpacity : 0
                    squares[index] += (targetOpacity - squares[index]) * 0.02

                    ctx.fillStyle = `rgba(${memoizedColor}, ${squares[index]})`
                    ctx.fillRect(
                        (i * (squareSize + gridGap)) * dpr,
                        (j * (squareSize + gridGap)) * dpr,
                        squareSize * dpr,
                        squareSize * dpr
                    )
                }
            }

            animationId = requestAnimationFrame(animate)
        }

        animate()
        return () => cancelAnimationFrame(animationId)
    }, [containerSize, setupCanvas, flickerChance, maxOpacity, memoizedColor, squareSize, gridGap])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                pointerEvents: 'none',
                ...style
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    inset: 0
                }}
            />
        </div>
    )
}
