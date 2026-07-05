import React from 'react';

// WaveX BI renderer: converts advisor metrics JSON into charts.
// The LLM never draws anything - it emits numbers, we render them.
// chart hints: progress_ring | gauge | donut -> Ring; bar -> Bars; line | area -> Spark; label -> Chip

const RISK_KEYS = /risk/i;

const fmt = (n) =>
    Math.abs(n) >= 1000 ? `₹${Number(n).toLocaleString('en-IN')}` : `${n}`;

const title = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function Ring({ label, value }) {
    const v = Math.max(0, Math.min(100, value));
    const risky = RISK_KEYS.test(label);
    const color = risky ? (v > 66 ? '#fb7185' : v > 33 ? '#fbbf24' : '#34d399')
                        : (v > 66 ? '#34d399' : v > 33 ? '#fbbf24' : '#fb7185');
    const r = 26, c = 2 * Math.PI * r;
    return (
        <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 min-w-[92px]">
            <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                    cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`}
                    transform="rotate(-90 32 32)"
                />
                <text x="32" y="36" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{Math.round(v)}</text>
            </svg>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center leading-tight">{label}</span>
        </div>
    );
}

function Gauge({ label, value, max = null }) {
    // semicircle gauge for open-ended values (runway months, ROI %, priority)
    const cap = max || (value <= 12 ? 12 : value <= 100 ? 100 : Math.ceil(value / 100) * 100);
    const pct = Math.max(0, Math.min(1, value / cap));
    const angle = Math.PI * (1 - pct);
    const x = 40 + 30 * Math.cos(angle), y = 38 - 30 * Math.sin(angle);
    const color = pct > 0.5 ? '#34d399' : pct > 0.25 ? '#fbbf24' : '#fb7185';
    return (
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/5 min-w-[92px]">
            <svg width="80" height="46" viewBox="0 0 80 46">
                <path d="M 10 38 A 30 30 0 0 1 70 38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" strokeLinecap="round" />
                <path d={`M 10 38 A 30 30 0 0 1 ${x} ${y}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
                <text x="40" y="38" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{value}</text>
            </svg>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center leading-tight">{label}</span>
        </div>
    );
}

function Bars({ items }) {
    const max = Math.max(...items.map((i) => i.value), 1);
    return (
        <div className="flex-1 min-w-[220px] p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
            {items.map(({ key, value }) => (
                <div key={key} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                        <span className="font-semibold text-gray-400">{title(key)}</span>
                        <span className="font-bold text-white">{fmt(value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all duration-700"
                            style={{ width: `${Math.max(3, (value / max) * 100)}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Spark({ label, series }) {
    const w = 220, h = 64, max = Math.max(...series, 1), min = Math.min(...series, 0);
    const span = max - min || 1;
    const pts = series.map((v, i) => `${(i / (series.length - 1)) * w},${h - 8 - ((v - min) / span) * (h - 16)}`);
    return (
        <div className="flex-1 min-w-[220px] p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
            <div className="flex justify-between text-[10px]">
                <span className="font-bold text-gray-400 uppercase tracking-wider">{title(label)}</span>
                <span className="font-bold text-white">{fmt(series[series.length - 1])} end</span>
            </div>
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="overflow-visible">
                <polygon points={`0,${h} ${pts.join(' ')} ${w},${h}`} fill="rgba(139,92,246,0.15)" />
                <polyline points={pts.join(' ')} fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </div>
    );
}

export default function MetricsPanel({ metrics, hints = {} }) {
    if (!metrics || Object.keys(metrics).length === 0) return null;

    const rings = [], gauges = [], bars = [], sparks = [], chips = [];
    for (const [key, value] of Object.entries(metrics)) {
        const hint = hints[key] || (Array.isArray(value) ? 'line' : typeof value === 'string' ? 'label' : 'bar');
        if (Array.isArray(value) && value.length > 1) sparks.push({ key, value });
        else if (typeof value === 'string') chips.push({ key, value });
        else if (hint === 'progress_ring' || hint === 'donut') rings.push({ key, value });
        else if (hint === 'gauge') gauges.push({ key, value });
        else bars.push({ key, value });
    }

    return (
        <div className="mt-3 space-y-2.5">
            <span className="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider">Business intelligence</span>
            {chips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {chips.map(({ key, value }) => (
                        <span key={key} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
                            {title(key)}: {value}
                        </span>
                    ))}
                </div>
            )}
            <div className="flex flex-wrap gap-2.5 items-stretch">
                {gauges.map(({ key, value }) => <Gauge key={key} label={title(key)} value={value} />)}
                {rings.map(({ key, value }) => <Ring key={key} label={title(key)} value={value} />)}
                {bars.length > 0 && <Bars items={bars} />}
                {sparks.map(({ key, value }) => <Spark key={key} label={key} series={value} />)}
            </div>
        </div>
    );
}
