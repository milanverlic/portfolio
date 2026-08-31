'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseX: number;
    baseY: number;
    radius: number;
    label: string;
    pulse: number;
}

export default function ConstellationGrid() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
    const [reducedMotion, setReducedMotion] = useState<boolean>(false);

    // Sync theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Sync motion preference. Defaults to false so the animation is the norm and
    // only opting out changes behaviour.
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        // 0 = no frame queued.
        let animationFrameId = 0;
        // Assigned once `render` exists; lets handleResize repaint when the
        // continuous loop isn't running.
        let paintStaticFrame: (() => void) | null = null;
        // Reduced motion runs the loop on demand rather than continuously, so
        // these track whether a burst is currently in flight.
        let lastInputAt = 0;
        let loopRunning = false;
        const IDLE_STOP_MS = 900;
        let width = 0;
        let height = 0;

        // Mouse velocity & inertial tracking
        const mouse = {
            x: -1000,
            y: -1000,
            prevX: -1000,
            prevY: -1000,
            vx: 0,
            vy: 0,
            radius: 220,
        };

        let nodes: Node[] = [];

        const handleResize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
            initNodes();
            // Resizing clears the canvas. With the loop running the next frame
            // repaints it anyway; under reduced motion nothing would, so the
            // grid would vanish on resize unless we repaint here.
            paintStaticFrame?.();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            lastInputAt = performance.now();
            // Under reduced motion nothing is looping at rest, so pointer input
            // has to wake the renderer. Without this the grid would be inert.
            if (reducedMotion && !loopRunning) {
                loopRunning = true;
                animationFrameId = requestAnimationFrame(render);
            }
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
            lastInputAt = performance.now();
        };

        const initNodes = () => {
            nodes = [];
            const spacing = 55; // Tighter grid density for richer visual connections
            const cols = Math.ceil(width / spacing) + 1;
            const rows = Math.ceil(height / spacing) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing;
                    const y = j * spacing;
                    nodes.push({
                        x,
                        y,
                        vx: 0,
                        vy: 0,
                        baseX: x,
                        baseY: y,
                        radius: Math.random() * 1.2 + 1.2,
                        label: `${(i * 7).toString(16).toUpperCase()}:${(j * 11).toString(16).toUpperCase()}`,
                        pulse: Math.random() * Math.PI * 2,
                    });
                }
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        let lastTime = performance.now();

        // `oneShot` draws a single frame and never schedules another. Without it,
        // any out-of-band call (e.g. from handleResize) would start a second
        // concurrent rAF loop on top of the running one.
        const render = (now: number, oneShot = false) => {
            // Normalize dt across high-refresh displays
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;

            // Mouse velocity calculation
            // The cursor parks at the -1000 sentinel when it is outside the
            // window, so the frame it re-enters on shows a jump of over a
            // thousand pixels. Fed into the velocity term that produced a force
            // of ~18,600 and threw nodes 256px in a single frame — straight past
            // the cursor, which reads as attraction rather than repulsion.
            // A jump this large is never real pointer movement, so treat it as
            // a fresh contact with no inherited velocity.
            const jumpX = mouse.x - mouse.prevX;
            const jumpY = mouse.y - mouse.prevY;
            const teleported = Math.hypot(jumpX, jumpY) > 300;

            mouse.vx = teleported ? 0 : jumpX / (dt * 1000 || 1);
            mouse.vy = teleported ? 0 : jumpY / (dt * 1000 || 1);
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;

            // Clamped so a fast flick can't spike the impulse. A quick human
            // sweep is roughly 3 px/ms, so 10 leaves plenty of headroom while
            // capping the force term at 1500 + 1500 instead of ~18,600.
            const MAX_POINTER_SPEED = 10;
            const speed = Math.min(
                Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy),
                MAX_POINTER_SPEED
            );

            // Color paletting for dark/light seamlessness
            const bgColor = isDarkMode ? '#030407' : '#f8fafc';
            const nodeColor = isDarkMode ? '255, 255, 255' : '15, 23, 42';
            const accentColor = isDarkMode ? '56, 189, 248' : '2, 132, 199'; // Sky Cyan Accent

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            // Node Physics Engine (Hooke's Law Spring-Mass-Damping system)
            const SPRING_K = 18; // Spring stiffness
            const DAMPING = 0.82; // Velocity resistance

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                // The idle shimmer is ambient, unsolicited motion — the exact
                // thing reduced motion asks us to drop. Cursor response is
                // user-initiated, so that stays.
                if (!reducedMotion) n.pulse += dt * 3;

                // Mouse distance vectors
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Dynamic shockwave repulsion based on cursor speed
                if (dist < mouse.radius && dist > 0) {
                    const power = (1 - dist / mouse.radius);
                    const force = power * (1500 + speed * 150);
                    const angle = Math.atan2(dy, dx);

                    // Impulse force pushing node away from cursor
                    n.vx -= Math.cos(angle) * force * dt;
                    n.vy -= Math.sin(angle) * force * dt;
                }

                // Calculate restoring force back to home anchor point (baseX, baseY)
                const homeDx = n.baseX - n.x;
                const homeDy = n.baseY - n.y;

                n.vx += homeDx * SPRING_K * dt;
                n.vy += homeDy * SPRING_K * dt;

                // Apply Damping
                n.vx *= DAMPING;
                n.vy *= DAMPING;

                // Integrate position
                n.x += n.vx * dt * 60;
                n.y += n.vy * dt * 60;
            }

            // Draw Connections (Optimized Distance Culling)
            const MAX_CONN_DIST = 75;
            const MAX_CONN_DIST_SQ = MAX_CONN_DIST * MAX_CONN_DIST;

            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];

                for (let j = i + 1; j < nodes.length; j++) {
                    const n2 = nodes[j];
                    const ndx = n.x - n2.x;
                    const ndy = n.y - n2.y;
                    const distSq = ndx * ndx + ndy * ndy;

                    if (distSq < MAX_CONN_DIST_SQ) {
                        const nDist = Math.sqrt(distSq);
                        const alpha = (1 - nDist / MAX_CONN_DIST) * (isDarkMode ? 0.18 : 0.08);

                        ctx.strokeStyle = `rgba(${nodeColor}, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(n2.x, n2.y);
                        ctx.stroke();
                    }
                }
            }

            // Render Node Points & Interactive Highlights
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                const dx = mouse.x - n.x;
                const dy = mouse.y - n.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const isNear = dist < mouse.radius;

                // Node base opacity pulse
                const baseAlpha = isNear ? 0.95 : 0.25 + Math.sin(n.pulse) * 0.1;

                ctx.fillStyle = isNear
                    ? `rgba(${accentColor}, ${baseAlpha})`
                    : `rgba(${nodeColor}, ${baseAlpha})`;

                const currentRadius = isNear
                    ? n.radius * 2.2
                    : n.radius + Math.sin(n.pulse) * 0.3;

                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
                ctx.fill();

                // High-tech Spatial Radar Rings on active proximity
                if (dist < 90) {
                    const pulseRing = ((n.pulse * 20) % 30) + 4;
                    const ringAlpha = (1 - pulseRing / 34) * 0.4;

                    ctx.strokeStyle = `rgba(${accentColor}, ${ringAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(n.x, n.y, pulseRing, 0, Math.PI * 2);
                    ctx.stroke();

                    // Hex Coordinate Readout
                    ctx.font = '8px ui-monospace, SFMono-Regular, Consolas, monospace';
                    ctx.fillStyle = `rgba(${accentColor}, 0.85)`;
                    ctx.fillText(n.label, n.x + 10, n.y - 10);
                }
            }

            if (oneShot) return;

            if (!reducedMotion) {
                // Normal path: continuous loop.
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Reduced motion: keep rendering while the pointer is active, then
            // stop once it has been idle long enough for the springs to settle.
            // The grid stays fully interactive; only the ambient loop is gone.
            if (now - lastInputAt < IDLE_STOP_MS) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                loopRunning = false;
                animationFrameId = 0;
            }
        };

        paintStaticFrame = () => render(performance.now(), true);

        if (reducedMotion) {
            // Paint the resting grid once. dt is ~0 on this call, so the spring
            // integrator leaves every node on its anchor. Pointer movement wakes
            // the loop from handleMouseMove.
            paintStaticFrame();
        } else {
            animationFrameId = requestAnimationFrame(render);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isDarkMode, reducedMotion]);

    return (
        <div className="relative w-full h-screen overflow-hidden select-none bg-slate-950 dark:bg-slate-950 light:bg-slate-50">
            <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair" />

            {/* Seamless overlay title */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pointer-events-none mix-blend-difference text-white">
                <h1 className="font-mono text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                    Constellation
                </h1>
                <p className="mt-4 font-mono text-xs md:text-sm max-w-lg opacity-70">
                    High-velocity dynamic mesh. Sweep your cursor quickly across the grid to unleash kinetic shockwaves.
                </p>
            </div>
        </div>
    );
}
