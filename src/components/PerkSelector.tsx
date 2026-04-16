import { useState } from 'react';
import type { CharacterBuild, ComputedSkill } from '@/types';
import { perksData } from '@/data';
import { getEffectiveSpecial } from '@/hooks/useDerivedStats';

interface Props {
  build: CharacterBuild;
  computedSkills: ComputedSkill[];
  onSelectPerk: (level: number, perkId: string) => void;
  onRemovePerk: (level: number, perkId: string) => void;
}

export function PerkSelector({ build, computedSkills, onSelectPerk, onRemovePerk }: Props) {
  const [hoveredPerk, setHoveredPerk] = useState<string | null>(null);

  const hasSkilledTrait = build.selectedTraits.includes('skilled');
  const rate = hasSkilledTrait ? 4 : 3;
  const perkLevels: number[] = [];
  for (let lvl = rate; lvl <= Math.min(build.level, 21); lvl += rate) {
    perkLevels.push(lvl);
  }

  const effectiveSpecial = getEffectiveSpecial(build);

  return (
    <section id="perks" className="mb-10">
      <h2 className="section-header">PERKS</h2>

      {perkLevels.length === 0 ? (
        <div className="pip-panel p-6 text-center text-pip-green-dim text-sm">
          Reach level {rate} to select your first perk.
        </div>
      ) : (
        <div className="space-y-4">
          {perkLevels.map((lvl) => {
            const selectedAtLevel = build.selectedPerks[lvl] || [];
            const hasSelected = selectedAtLevel.length > 0;

            return (
              <div key={lvl} className="pip-panel p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-lg text-pip-amber text-glow-amber"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
                    LEVEL {lvl}
                  </span>
                  {hasSelected && (
                    <span className="text-xs text-pip-green-dim">
                      — {selectedAtLevel.map((id) => perksData.perks.find((p) => p.id === id)?.name).join(', ')}
                    </span>
                  )}
                </div>

                {hasSelected ? (
                  <div className="space-y-2">
                    {selectedAtLevel.map((perkId) => {
                      const perk = perksData.perks.find((p) => p.id === perkId);
                      if (!perk) return null;
                      return (
                        <div key={perkId} className="flex items-center justify-between bg-pip-green/[0.05] border border-pip-green/20 px-3 py-2">
                          <div>
                            <span className="text-sm text-pip-green text-glow">{perk.name}</span>
                            {perk.ranks > 1 && (
                              <span className="text-xs text-pip-green-dim ml-2">
                                Rank {build.perkRanks[perkId] || 1}/{perk.ranks}
                              </span>
                            )}
                            <div className="text-xs text-pip-green-dim mt-0.5">{perk.benefit}</div>
                          </div>
                          <button
                            onClick={() => onRemovePerk(lvl, perkId)}
                            className="pip-btn text-xs text-pip-red border-pip-red/30 hover:border-pip-red"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <PerkList
                    level={lvl}
                    effectiveSpecial={effectiveSpecial}
                    computedSkills={computedSkills}
                    build={build}
                    hoveredPerk={hoveredPerk}
                    onHover={setHoveredPerk}
                    onSelect={onSelectPerk}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function PerkList({
  level,
  effectiveSpecial,
  computedSkills,
  build,
  hoveredPerk,
  onHover,
  onSelect,
}: {
  level: number;
  effectiveSpecial: Record<string, number>;
  computedSkills: ComputedSkill[];
  build: CharacterBuild;
  hoveredPerk: string | null;
  onHover: (id: string | null) => void;
  onSelect: (level: number, perkId: string) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const eligiblePerks = perksData.perks.filter((perk) => {
    if (perk.levelReq > level) return false;
    const currentRank = build.perkRanks[perk.id] || 0;
    if (currentRank >= perk.ranks) return false;
    return true;
  });

  const categorized = eligiblePerks.map((perk) => {
    const meetsSpecial = Object.entries(perk.requirements.special).every(
      ([stat, req]) => (effectiveSpecial[stat] || 0) >= req
    );
    const meetsSkills = Object.entries(perk.requirements.skills).every(
      ([skill, req]) => {
        const cs = computedSkills.find((s) => s.key === skill);
        return (cs?.total || 0) >= req;
      }
    );
    return { perk, eligible: meetsSpecial && meetsSkills, meetsSpecial, meetsSkills };
  });

  const eligible = categorized.filter((c) => c.eligible);
  const ineligible = categorized.filter((c) => !c.eligible);
  const displayPerks = showAll ? [...eligible, ...ineligible] : eligible;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
        {displayPerks.map(({ perk, eligible: isEligible }) => (
          <button
            key={perk.id}
            onClick={() => isEligible && onSelect(level, perk.id)}
            onMouseEnter={() => onHover(perk.id)}
            onMouseLeave={() => onHover(null)}
            disabled={!isEligible}
            className={`text-left px-3 py-2 border transition-all ${
              isEligible
                ? 'border-pip-border hover:border-pip-green cursor-pointer hover:bg-pip-green/[0.05]'
                : 'border-pip-border/30 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="text-sm text-pip-green">{perk.name}</div>
            <div className="text-[10px] text-pip-green-dim truncate">{perk.benefit}</div>
            {hoveredPerk === perk.id && !isEligible && (
              <div className="text-[10px] text-pip-red mt-1">
                {Object.entries(perk.requirements.special)
                  .filter(([stat, req]) => (effectiveSpecial[stat] || 0) < req)
                  .map(([stat, req]) => `${stat} ${req}`)
                  .join(', ')}
                {Object.entries(perk.requirements.skills)
                  .filter(([skill, req]) => {
                    const cs = computedSkills.find((s) => s.key === skill);
                    return (cs?.total || 0) < req;
                  })
                  .map(([skill, req]) => `${skill} ${req}%`)
                  .join(', ')}
              </div>
            )}
          </button>
        ))}
      </div>
      {ineligible.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-[10px] text-pip-green-dim hover:text-pip-green transition-colors cursor-pointer"
        >
          {showAll ? 'Hide ineligible perks' : `Show ${ineligible.length} ineligible perks`}
        </button>
      )}
      {eligible.length === 0 && !showAll && (
        <div className="text-center text-pip-green-dim text-sm py-4">
          No eligible perks at this level. 
          <button onClick={() => setShowAll(true)} className="text-pip-green ml-1 cursor-pointer hover:underline">
            Show all
          </button>
        </div>
      )}
    </div>
  );
}
