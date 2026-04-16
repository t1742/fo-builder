import { useState } from 'react';
import type { CharacterBuild, ComputedSkill } from '@/types';
import { perksData } from '@/data';
import { getEffectiveSpecial } from '@/hooks/useDerivedStats';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  build: CharacterBuild;
  perkLevel: number;
  computedSkills: ComputedSkill[];
  onSelectPerk: (level: number, perkId: string) => void;
}

export function PerkModal({ open, onClose, build, perkLevel, computedSkills, onSelectPerk }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredPerk, setHoveredPerk] = useState<string | null>(null);
  const effectiveSpecial = getEffectiveSpecial(build);

  const eligiblePerks = perksData.perks.filter((perk) => {
    if (perk.levelReq > perkLevel) return false;
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
    return { perk, eligible: meetsSpecial && meetsSkills };
  });

  const eligible = categorized.filter((c) => c.eligible);
  const ineligible = categorized.filter((c) => !c.eligible);
  const displayPerks = showAll ? [...eligible, ...ineligible] : eligible;

  const handleSelect = (perkId: string) => {
    onSelectPerk(perkLevel, perkId);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`SELECT PERK — LEVEL ${perkLevel}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {displayPerks.map(({ perk, eligible: isEligible }) => (
          <button
            key={perk.id}
            onClick={() => isEligible && handleSelect(perk.id)}
            onMouseEnter={() => setHoveredPerk(perk.id)}
            onMouseLeave={() => setHoveredPerk(null)}
            disabled={!isEligible}
            className={`text-left px-3 py-2 border transition-all ${
              isEligible
                ? 'border-pip-border hover:border-pip-green cursor-pointer hover:bg-pip-green/[0.05]'
                : 'border-pip-border/30 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="text-sm text-pip-green">{perk.name}</div>
            <div className="text-[10px] text-pip-green-dim">{perk.benefit}</div>
            {perk.ranks > 1 && (
              <div className="text-[10px] text-pip-amber mt-0.5">
                Rank {(build.perkRanks[perk.id] || 0) + 1}/{perk.ranks}
              </div>
            )}
            {hoveredPerk === perk.id && !isEligible && (
              <div className="text-[10px] text-pip-red mt-1">
                Requires: {Object.entries(perk.requirements.special)
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
      {eligible.length === 0 && !showAll && (
        <div className="text-center text-pip-green-dim text-sm py-4">
          No eligible perks at this level.
        </div>
      )}
      {ineligible.length > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-xs text-pip-green-dim hover:text-pip-green transition-colors cursor-pointer"
        >
          {showAll ? '▲ Hide ineligible perks' : `▼ Show ${ineligible.length} ineligible perks`}
        </button>
      )}
    </Modal>
  );
}
