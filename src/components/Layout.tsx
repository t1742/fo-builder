import type { ReactNode } from 'react';

interface LayoutProps {
  buildName: string;
  onNameChange: (name: string) => void;
  onReset: () => void;
  children: ReactNode;
}

export function Layout({ buildName, onNameChange, onReset, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Top Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-pip-dark border-b border-pip-border px-4 py-2 flex items-center gap-4"
        style={{ boxShadow: '0 4px 20px rgba(24, 255, 109, 0.08)' }}>
        <div className="font-display text-xl tracking-[0.2em] text-pip-green text-glow whitespace-nowrap"
          style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}>
          VAULT-TEC BUILD PLANNER
          <span className="text-pip-green-dim ml-2 text-sm tracking-normal">v1.0</span>
        </div>
        <div className="flex-1 flex items-center gap-3 ml-4">
          <span className="text-pip-green-dim text-xs tracking-wider">BUILD:</span>
          <input
            type="text"
            value={buildName}
            onChange={(e) => onNameChange(e.target.value)}
            className="bg-transparent border-b border-pip-border text-pip-green font-mono text-sm px-1 py-0.5 outline-none focus:border-pip-green w-48 transition-colors"
            maxLength={30}
          />
        </div>
        <button onClick={onReset} className="pip-btn text-xs text-pip-amber border-pip-amber/30 hover:border-pip-amber hover:bg-pip-amber/10">
          NEW BUILD
        </button>
      </header>

      {/* ─── Main Content ─────────────────────────────── */}
      <main className="flex-1 px-3 py-3 max-w-[1200px] w-full mx-auto">
        {children}
      </main>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="border-t border-pip-border/30 px-4 py-2 text-center">
        <span className="text-[10px] text-pip-green-dim/40 tracking-wider">
          VAULT-TEC INDUSTRIES © 2161 — ALL RIGHTS RESERVED
        </span>
      </footer>
    </div>
  );
}