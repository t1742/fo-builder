import { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { SpecialDistributor } from '@/components/SpecialDistributor';
import { SkillTagger } from '@/components/SkillTagger';
import { DerivedStatsPanel } from '@/components/DerivedStatsPanel';
import { TraitModal } from '@/components/TraitModal';
import { PerkModal } from '@/components/PerkModal';
import { useCharacterBuild } from '@/hooks/useCharacterBuild';
import { useDerivedStats, getEffectiveSpecial } from '@/hooks/useDerivedStats';
import { useSkillCalculator } from '@/hooks/useSkillCalculator';
import { traitsData, perksData, skillsData } from '@/data';

function App() {
  const {
    build,
    setName,
    setSpecial,
    remainingSpecialPoints,
    toggleTrait,
    toggleTaggedSkill,
    setLevel,
    allocateSkillPoints,
    selectPerk,
    removePerk,
    resetBuild,
    exportBuild,
    importBuild,
  } = useCharacterBuild();

  const derivedStats = useDerivedStats(build);
  const computedSkills = useSkillCalculator(build);
  const effectiveSpecial = getEffectiveSpecial(build);

  const [traitModalOpen, setTraitModalOpen] = useState(false);
  const [perkModalOpen, setPerkModalOpen] = useState(false);
  const [perkModalLevel, setPerkModalLevel] = useState(3);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Perk schedule
  const hasSkilledTrait = build.selectedTraits.includes('skilled');
  const perkRate = hasSkilledTrait ? 4 : 3;
  const perkLevels: number[] = [];
  for (let lvl = perkRate; lvl <= Math.min(build.level, 21); lvl += perkRate) {
    perkLevels.push(lvl);
  }

  const openPerkModal = (level: number) => {
    setPerkModalLevel(level);
    setPerkModalOpen(true);
  };

  // Export/Import/Save/Load helpers
  const handleExport = () => {
    const json = exportBuild();
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
    reader.onload = () => importBuild(reader.result as string);
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    const json = exportBuild();
    const saves = JSON.parse(localStorage.getItem('fo-builder-saves') || '{}');
    saves[build.name] = JSON.parse(json);
    localStorage.setItem('fo-builder-saves', JSON.stringify(saves));
  };

  const handleLoad = () => {
    const saves = JSON.parse(localStorage.getItem('fo-builder-saves') || '{}');
    const names = Object.keys(saves);
    if (names.length === 0) return;
    const name = names[names.length - 1];
    importBuild(JSON.stringify(saves[name]));
  };

  return (
    <Layout buildName={build.name} onNameChange={setName} onReset={resetBuild}>
      {/* ═══════════════════════════════════════════════════
          CHARACTER SHEET — 3-column like original Fallout 1
          ═══════════════════════════════════════════════════ */}
      <section className="pip-panel p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-0">

          {/* ─── Left: SPECIAL ─── */}
          <div className="lg:border-r border-pip-border/30 lg:pr-4 pb-4 lg:pb-0">
            <SpecialDistributor
              values={build.special}
              effectiveValues={effectiveSpecial}
              remaining={remainingSpecialPoints()}
              onChange={setSpecial}
            />
          </div>

          {/* ─── Center: Derived Stats ─── */}
          <div className="lg:border-r border-pip-border/30 lg:px-4 pb-4 lg:pb-0">
            <DerivedStatsPanel
              stats={derivedStats}
              hitPointsMax={derivedStats.hitPoints}
              level={build.level}
            />
          </div>

          {/* ─── Right: Skills ─── */}
          <div className="lg:pl-4">
            <SkillTagger
              computedSkills={computedSkills}
              taggedSkills={build.taggedSkills}
              onToggleTag={toggleTaggedSkill}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BOTTOM SECTION: Traits | Perks | Level
          ═══════════════════════════════════════════════════ */}
      <section className="mt-2 grid grid-cols-1 lg:grid-cols-[220px_1fr_1fr] gap-2">

        {/* ─── Traits (compact list + select button) ─── */}
        <div className="pip-panel p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-[0.2em] text-pip-green-dim"
              style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
              TRAITS
            </span>
            <span className="text-xs text-pip-green-dim"
              style={{ fontFamily: 'VT323, monospace' }}>
              {build.selectedTraits.length}/2
            </span>
          </div>

          <div className="space-y-1 mb-3 min-h-[40px]">
            {build.selectedTraits.length === 0 ? (
              <div className="text-xs text-pip-green-dim/50 italic">None selected</div>
            ) : (
              build.selectedTraits.map((id) => {
                const trait = traitsData.traits.find((t) => t.id === id);
                if (!trait) return null;
                return (
                  <div key={id} className="flex items-center gap-2 text-xs">
                    <span className="text-pip-green text-glow">▸</span>
                    <span className="text-pip-green">{trait.name}</span>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={() => setTraitModalOpen(true)}
            className="pip-btn text-xs w-full"
          >
            SELECT TRAITS
          </button>
        </div>

        {/* ─── Perks (compact list + select per level) ─── */}
        <div className="pip-panel p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-[0.2em] text-pip-green-dim"
              style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
              PERKS
            </span>
            <span className="text-xs text-pip-green-dim"
              style={{ fontFamily: 'VT323, monospace' }}>
              Rate: every {perkRate} lvls
            </span>
          </div>

          <div className="space-y-1 mb-3 min-h-[40px]">
            {perkLevels.length === 0 ? (
              <div className="text-xs text-pip-green-dim/50 italic">
                Reach level {perkRate} for first perk
              </div>
            ) : (
              perkLevels.map((lvl) => {
                const selectedAtLevel = build.selectedPerks[lvl] || [];
                return (
                  <div key={lvl} className="flex items-center gap-2 text-xs">
                    <span className="text-pip-amber w-8"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
                      L{lvl}
                    </span>
                    {selectedAtLevel.length > 0 ? (
                      <div className="flex-1 flex items-center gap-1">
                        {selectedAtLevel.map((perkId) => {
                          const perk = perksData.perks.find((p) => p.id === perkId);
                          return (
                            <span key={perkId} className="flex items-center gap-1">
                              <span className="text-pip-green">{perk?.name}</span>
                              <button
                                onClick={() => removePerk(lvl, perkId)}
                                className="text-pip-red/60 hover:text-pip-red text-[10px] cursor-pointer"
                              >✕</button>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <button
                        onClick={() => openPerkModal(lvl)}
                        className="text-pip-green-dim hover:text-pip-green cursor-pointer transition-colors"
                      >
                        [select]
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Level Progression (compact) ─── */}
        <div className="pip-panel p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs tracking-[0.2em] text-pip-green-dim"
              style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
              LEVEL PROGRESSION
            </span>
            <div className="flex items-center gap-2">
              <button className="pip-btn pip-btn-sm text-[14px]"
                onClick={() => setLevel(build.level - 1)} disabled={build.level <= 1}>−</button>
              <span className="font-display text-xl text-pip-green text-glow w-6 text-center"
                style={{ fontFamily: 'VT323, monospace' }}>
                {build.level}
              </span>
              <button className="pip-btn pip-btn-sm text-[14px]"
                onClick={() => setLevel(build.level + 1)} disabled={build.level >= 21}>+</button>
            </div>
          </div>

          <div className="max-h-[200px] overflow-y-auto">
            {build.level <= 1 ? (
              <div className="text-xs text-pip-green-dim/50 italic text-center py-2">
                Increase level to allocate skill points
              </div>
            ) : (
              Array.from({ length: build.level - 1 }, (_, i) => i + 2).map((lvl) => {
                const isExpanded = expandedLevel === lvl;
                const levelAlloc = build.skillAllocations[lvl] || {};
                const pointsSpent = Object.values(levelAlloc).reduce((s, v) => s + v, 0);
                const isPerkLevel = perkLevels.includes(lvl);

                return (
                  <div key={lvl} className="border-b border-pip-border/20 last:border-0">
                    <button
                      onClick={() => setExpandedLevel(isExpanded ? null : lvl)}
                      className="w-full flex items-center justify-between px-1 py-1 hover:bg-pip-green/[0.03] transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-pip-green-dim w-10"
                          style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
                          LVL {lvl}
                        </span>
                        {isPerkLevel && (
                          <span className="text-[9px] px-1 border border-pip-amber/40 text-pip-amber tracking-wider">
                            PERK
                          </span>
                        )}
                      </div>
                      <span className="text-pip-green-dim">
                        {pointsSpent}/{derivedStats.skillRate} pts {isExpanded ? '▼' : '▶'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-1 pb-2 animate-fade-in">
                        <div className="text-[10px] text-pip-green-dim/50 mb-1">
                          Available: {derivedStats.skillRate - pointsSpent}
                        </div>
                        {skillsData.skills.map((skill) => {
                          const allocated = levelAlloc[skill.key] || 0;
                          return (
                            <div key={skill.key} className="flex items-center gap-1 text-[11px] py-px">
                              <span className="w-24 text-pip-green-dim truncate">{skill.name}</span>
                              <button className="pip-btn pip-btn-sm text-[10px] px-1 py-0"
                                onClick={() => allocateSkillPoints(lvl, skill.key, -1)}
                                disabled={allocated <= 0}>−</button>
                              <span className="w-4 text-center text-pip-green"
                                style={{ fontFamily: 'VT323, monospace', fontSize: '14px' }}>
                                {allocated}
                              </span>
                              <button className="pip-btn pip-btn-sm text-[10px] px-1 py-0"
                                onClick={() => allocateSkillPoints(lvl, skill.key, 1)}
                                disabled={pointsSpent >= derivedStats.skillRate}>+</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ACTION BAR — like PRINT/DONE/CANCEL in original
          ═══════════════════════════════════════════════════ */}
      <section className="mt-2 pip-panel px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExport} className="pip-btn text-xs">↓ EXPORT</button>
          <button onClick={() => fileInputRef.current?.click()} className="pip-btn text-xs">↑ IMPORT</button>
          <button onClick={handleSave} className="pip-btn text-xs">▪ SAVE</button>
          <button onClick={handleLoad} className="pip-btn text-xs">▪ LOAD</button>
        </div>
        <button onClick={resetBuild} className="pip-btn text-xs text-pip-red border-pip-red/30 hover:border-pip-red">
          ✕ RESET
        </button>
        <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </section>

      {/* ── Modals ── */}
      <TraitModal
        open={traitModalOpen}
        onClose={() => setTraitModalOpen(false)}
        selected={build.selectedTraits}
        onToggle={toggleTrait}
      />
      <PerkModal
        open={perkModalOpen}
        onClose={() => setPerkModalOpen(false)}
        build={build}
        perkLevel={perkModalLevel}
        computedSkills={computedSkills}
        onSelectPerk={selectPerk}
      />
    </Layout>
  );
}

export default App;