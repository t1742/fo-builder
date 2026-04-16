import { useRef } from 'react';
import type { CharacterBuild } from '@/types';

interface Props {
  build: CharacterBuild;
  onExport: () => string;
  onImport: (json: string) => boolean;
  onReset: () => void;
}

export function BuildSummary({ build, onExport, onImport, onReset }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${build.name.replace(/[^a-zA-Z0-9]/g, '_')}_build.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      onImport(text);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const json = onExport();
    const saves = JSON.parse(localStorage.getItem('fo-builder-saves') || '{}');
    saves[build.name] = JSON.parse(json);
    localStorage.setItem('fo-builder-saves', JSON.stringify(saves));
  };

  const handleLoad = () => {
    const saves = JSON.parse(localStorage.getItem('fo-builder-saves') || '{}');
    const names = Object.keys(saves);
    if (names.length === 0) return;
    // Load the most recent save
    const name = names[names.length - 1];
    onImport(JSON.stringify(saves[name]));
  };

  const totalSpecial = Object.values(build.special).reduce((s, v) => s + v, 0);
  const totalAllocated = Object.values(build.skillAllocations).reduce((sum, lvl) => {
    return sum + Object.values(lvl).reduce((s, v) => s + v, 0);
  }, 0);
  const totalPerks = Object.values(build.selectedPerks).reduce((s, lvl) => s + lvl.length, 0);

  return (
    <div id="summary" className="pip-panel p-4">
      <div className="text-xs tracking-[0.2em] text-pip-green-dim mb-3"
        style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
        BUILD SUMMARY
      </div>

      <div className="space-y-4">
        {/* Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard label="NAME" value={build.name} />
          <SummaryCard label="LEVEL" value={String(build.level)} />
          <SummaryCard label="SPECIAL" value={`${totalSpecial}/40`} />
          <SummaryCard label="TRAITS" value={`${build.selectedTraits.length}/2`} />
          <SummaryCard label="TAG SKILLS" value={`${build.taggedSkills.length}/3`} />
          <SummaryCard label="SKILL PTS" value={String(totalAllocated)} />
          <SummaryCard label="PERKS" value={String(totalPerks)} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-pip-border/30">
          <button onClick={handleExport} className="pip-btn text-xs">
            ↓ EXPORT JSON
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="pip-btn text-xs">
            ↑ IMPORT JSON
          </button>
          <button onClick={handleSave} className="pip-btn text-xs">
            ▪ SAVE LOCAL
          </button>
          <button onClick={handleLoad} className="pip-btn text-xs">
            ▪ LOAD LOCAL
          </button>
          <button onClick={onReset} className="pip-btn text-xs text-pip-red border-pip-red/30 hover:border-pip-red">
            ✕ RESET ALL
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-pip-grid/30 border border-pip-border/30 px-3 py-2">
      <div className="text-[10px] text-pip-green-dim tracking-wider">{label}</div>
      <div className="font-display text-xl text-pip-green text-glow mt-0.5"
        style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}>
        {value}
      </div>
    </div>
  );
}
