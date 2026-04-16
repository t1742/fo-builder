import type { ReactNode } from 'react';

interface LayoutProps {
  buildName: string;
  onNameChange: (name: string) => void;
  onReset: () => void;
  sidebar: ReactNode;
  children: ReactNode;
}

const NAV_ITEMS = [
  { id: 'special', label: 'SPECIAL' },
  { id: 'traits', label: 'TRAITS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'leveling', label: 'LEVELING' },
  { id: 'perks', label: 'PERKS' },
  { id: 'summary', label: 'SUMMARY' },
];

export function Layout({ buildName, onNameChange, onReset, sidebar, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── Top Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-pip-dark border-b border-pip-border px-4 py-3 flex items-center gap-4"
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

      <div className="flex flex-1">
        {/* ─── Left Nav ─────────────────────────────────── */}
        <nav className="sticky top-[53px] self-start w-36 border-r border-pip-border bg-pip-dark flex-shrink-0 hidden lg:block"
          style={{ height: 'calc(100vh - 53px)' }}>
          <div className="py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block px-4 py-2 text-xs tracking-[0.15em] text-pip-green-dim hover:text-pip-green hover:bg-pip-green/5 border-l-2 border-transparent hover:border-pip-green transition-all"
                style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="text-[10px] text-pip-green-dim/50 tracking-wider leading-relaxed">
              VAULT-TEC<br />INDUSTRIES<br />©2161
            </div>
          </div>
        </nav>

        {/* ─── Main Content ─────────────────────────────── */}
        <main className="flex-1 min-w-0 px-6 py-6">
          {children}
        </main>

        {/* ─── Right Sidebar (Derived Stats) ────────────── */}
        <aside className="sticky top-[53px] self-start w-64 border-l border-pip-border bg-pip-dark flex-shrink-0 hidden xl:block"
          style={{ height: 'calc(100vh - 53px)' }}>
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 53px)' }}>
            {sidebar}
          </div>
        </aside>
      </div>
    </div>
  );
}
