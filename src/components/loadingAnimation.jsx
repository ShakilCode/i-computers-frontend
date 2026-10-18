export default function LoadingAnimation() {
    const scanLines = [
        { width: "65%", delay: "0s" },
        { width: "90%", delay: "0.2s" },
        { width: "48%", delay: "0.4s" },
    ];

    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-secondary/10 bg-white/95 px-7 py-6 shadow-xl shadow-accent/10">

            <style>{`
                @keyframes ic-monitor {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-4px);
                    }
                }

                @keyframes ic-screen-glow {
                    0%, 100% {
                        opacity: 0.15;
                    }
                    50% {
                        opacity: 0.4;
                    }
                }

                @keyframes ic-scan {
                    0% {
                        top: 5%;
                        opacity: 0;
                    }
                    15% {
                        opacity: 1;
                    }
                    85% {
                        opacity: 1;
                    }
                    100% {
                        top: 95%;
                        opacity: 0;
                    }
                }

                @keyframes ic-progress {
                    0% {
                        width: 0%;
                    }
                    65% {
                        width: 75%;
                    }
                    90%, 100% {
                        width: 92%;
                    }
                }

                @keyframes ic-light {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(0.85);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes ic-dot {
                    0%, 60%, 100% {
                        opacity: 0.25;
                        transform: translateY(0);
                    }
                    30% {
                        opacity: 1;
                        transform: translateY(-2px);
                    }
                }

                @keyframes ic-keyboard {
                    0%, 100% {
                        opacity: 0.65;
                    }
                    50% {
                        opacity: 1;
                    }
                }
            `}</style>

            {/* Animated desktop computer */}
            <div
                className="flex flex-col items-center"
                style={{
                    animation: "ic-monitor 2.5s ease-in-out infinite",
                }}
            >
                {/* Monitor frame */}
                <div className="relative w-[112px] h-[80px] overflow-hidden rounded-xl border-[4px] border-secondary/80 bg-secondary p-1.5 shadow-md">

                    {/* Monitor screen */}
                    <div className="relative flex h-full flex-col overflow-hidden rounded-md bg-slate-950 p-2">

                        {/* Screen glow */}
                        <div
                            className="pointer-events-none absolute inset-0 bg-accent/20"
                            style={{
                                animation: "ic-screen-glow 2s ease-in-out infinite",
                            }}
                        />

                        {/* Header / system indicator */}
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                <span className="text-[6px] font-bold tracking-widest text-white/80">
                                    I COMPUTERS
                                </span>
                            </div>

                            <span
                                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                                style={{
                                    animation: "ic-light 1.2s ease-in-out infinite",
                                }}
                            />
                        </div>

                        {/* Scanning area */}
                        <div className="relative mt-2 flex flex-1 flex-col justify-center gap-1.5 overflow-hidden px-0.5">

                            {scanLines.map((line, index) => (
                                <div
                                    key={index}
                                    className="h-1 rounded-full bg-white/10"
                                    style={{
                                        width: line.width,
                                    }}
                                >
                                    <div
                                        className="h-full rounded-full bg-accent/80"
                                        style={{
                                            width: "100%",
                                            transformOrigin: "left",
                                            animation: `ic-progress 2s ease-in-out ${line.delay} infinite alternate`,
                                        }}
                                    />
                                </div>
                            ))}

                            {/* Moving scanner */}
                            <div
                                className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_8px_var(--color-accent)]"
                                style={{
                                    animation: "ic-scan 2s linear infinite",
                                }}
                            />
                        </div>

                        {/* Bottom status */}
                        <div className="relative z-10 mt-1 flex items-center justify-between">
                            <span className="text-[6px] tracking-wider text-white/50">
                                SYSTEM LOADING
                            </span>
                            <span className="text-[6px] font-bold text-accent">
                                ...
                            </span>
                        </div>
                    </div>
                </div>

                {/* Monitor stand */}
                <div className="flex flex-col items-center">
                    <div className="h-2.5 w-5 bg-secondary/60" />
                    <div className="h-1.5 w-10 rounded-t-md bg-secondary/80" />
                </div>

                {/* Keyboard */}
                <div
                    className="mt-1 flex h-3 w-[94px] items-center justify-center gap-[3px] rounded-b-md rounded-t-sm border border-secondary/10 bg-secondary/15 px-2"
                    style={{
                        animation: "ic-keyboard 1.5s ease-in-out infinite",
                    }}
                >
                    {Array.from({ length: 10 }, (_, index) => (
                        <span
                            key={index}
                            className="h-1 w-1.5 rounded-[1px] bg-accent/70"
                        />
                    ))}
                </div>
            </div>

            {/* Loading status */}
            <div className="flex flex-col items-center gap-2">
                <p className="flex items-center gap-1.5 text-sm font-bold tracking-wide text-secondary">
                    Loading

                    <span className="flex items-center gap-1">
                        {[0, 1, 2].map((dot) => (
                            <span
                                key={dot}
                                className="h-1 w-1 rounded-full bg-accent"
                                style={{
                                    animation: "ic-dot 1.2s ease-in-out infinite",
                                    animationDelay: `${dot * 0.2}s`,
                                }}
                            />
                        ))}
                    </span>
                </p>
            </div>
        </div>
    );
}