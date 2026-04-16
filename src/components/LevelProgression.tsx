import { useState } from 'react';
import type { CharacterBuild, ComputedSkill } from '@/types';
import { skillsData } from '@/data';

interface Props {
  build: CharacterBuild;
  computedSkills: ComputedSkill[];
  skillRate: number;
  onAllocate: (level: number, skillKey: string, points: number) => void;
  onSetLevel: (level: number) => void;
}

export function LevelProgression({ build, computedSkills, skillRate, onAllocate, onSetLevel }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const perkLevels = getPerkLevels(build);

  return (
    <div id="leveling" className="pip-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs tracking-[0.2em] text-pip-green-dim"
          style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
          LEVEL PROGRESSION
        </div>
        <div className="flex items-center gap-3">
          <span className="text-pip-green-dim text-sm">LEVEL</span>
          <button className="pip-btn pip-btn-sm" onClick={() => onSetLevel(build.level - 1)} disabled={build.level <= 1}>−</button>
          <span className="font-display text-2xl text-pip-green text-glow w-8 text-center"
            style={{ fontFamily: 'VT323, monospace' }}>
            {build.level}
          </span>
          <button className="pip-btn pip-btn-sm" onClick={() => onSetLevel(build.level + 1)} disabled={build.level >= 21}>+</button>
        </div>
      </div>

      <div>
        {Array.from({ length: build.level }, (_, i) => i + 1).map((lvl) => {
          if (lvl === 1) return null; // Level 1 is character creation
          const isExpanded = expandedLevel === lvl;
          const levelAlloc = build.skillAllocations[lvl] || {};
          const pointsSpent = Object.values(levelAlloc).reduce((s, v) => s + v, 0);
          const isPerkLevel = perkLevels.includes(lvl);

          return (
            <div key={lvl} className="border-b border-pip-border/30 last:border-0">
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : lvl)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-pip-green/[0.03] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-pip-green-dim w-16"
                    style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
                    LVL {lvl}
                  </span>
                  {isPerkLevel && (
                    <span className="text-[10px] px-1.5 py-0.5 border border-pip-amber/40 text-pip-amber tracking-wider">
                      PERK
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-pip-green-dim">
                    {pointsSpent}/{skillRate} pts
                  </span>
                  <span className="text-pip-green-dim text-xs">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-1 animate-fade-in">
                  <div className="text-[10px] text-pip-green-dim/60 mb-2">
                    Skill points available: {skillRate - pointsSpent}
                  </div>
                  {skillsData.skills.map((skill) => {
                    const computed = computedSkills.find((s) => s.key === skill.key);
                    const allocated = levelAlloc[skill.key] || 0;

                    return (
                      <div key={skill.key} className="flex items-center gap-2 text-xs">
                        <span className="w-28 text-pip-green-dim truncate">{skill.name}</span>
                        <button
                          className="pip-btn pip-btn-sm text-[12px]"
                          onClick={() => onAllocate(lvl, skill.key, -1)}
                          disabled={allocated <= 0}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display"
                          style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
                          {allocated}
                        </span>
                        <button
                          className="pip-btn pip-btn-sm text-[12px]"
                          onClick={() => onAllocate(lvl, skill.key, 1)}
                          disabled={pointsSpent >= skillRate}
                        >
                          +
                        </button>
                        <div className="flex-1 h-1 bg-pip-grid rounded-sm overflow-hidden">
                          <div
                            className="h-full bg-pip-green/40 transition-all"
                            style={{ width: `${Math.min(100, (computed?.total || 0) / 2)}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-pip-green-dim">
                          {computed?.total || 0}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
        {build.level === 1 && (
          <div className="px-4 py-6 text-center text-pip-green-dim text-sm">
            Increase your level to allocate skill points.
          </div>
        )}
      </div>
    </div>
  );
}

function getPerkLevels(build: CharacterBuild): number[] {
  const hasSkilledTrait = build.selectedTraits.includes('skilled');
  const rate = hasSkilledTrait ? 4 : 3;
  const levels: number[] = [];
  for (let lvl = rate; lvl <= 21; lvl += rate) {
    levels.push(lvl);
  }
  return levels;
}
