import { skillsData, TAG_SLOTS } from '@/data';
import type { ComputedSkill } from '@/types';

interface Props {
  computedSkills: ComputedSkill[];
  taggedSkills: string[];
  onToggleTag: (skillKey: string) => void;
}

const CATEGORY_ORDER = ['combat', 'active', 'passive'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  combat: 'COMBAT',
  active: 'ACTIVE',
  passive: 'PASSIVE',
};

export function SkillTagger({ computedSkills, taggedSkills, onToggleTag }: Props) {
  const skillsByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    skills: computedSkills.filter((s) => s.category === cat),
  }));

  return (
    <section id="skills" className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="section-header mb-0 border-0 pb-0">TAG SKILLS</h2>
        <div className="text-sm">
          <span className="text-pip-green-dim">TAGGED: </span>
          <span className={`font-display text-2xl ${taggedSkills.length < TAG_SLOTS ? 'text-pip-green text-glow' : 'text-pip-amber text-glow-amber'}`}
            style={{ fontFamily: 'VT323, monospace' }}>
            {taggedSkills.length}/{TAG_SLOTS}
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {skillsByCategory.map(({ category, label, skills }) => (
          <div key={category}>
            <div className="text-xs tracking-[0.2em] text-pip-green-dim mb-2 pl-1"
              style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
              ── {label} ──
            </div>
            <div className="pip-panel divide-y divide-pip-border/50">
              {skills.map((skill) => {
                const isTagged = taggedSkills.includes(skill.key);
                const isDisabled = !isTagged && taggedSkills.length >= TAG_SLOTS;
                const skillDef = skillsData.skills.find((s) => s.key === skill.key);

                return (
                  <div key={skill.key} className="flex items-center gap-3 px-3 py-2 group hover:bg-pip-green/[0.03] transition-colors">
                    {/* Tag toggle */}
                    <button
                      onClick={() => onToggleTag(skill.key)}
                      disabled={isDisabled}
                      className={`px-2 py-0.5 text-xs border transition-all ${
                        isTagged
                          ? 'border-pip-green bg-pip-green/15 text-pip-green text-glow'
                          : isDisabled
                          ? 'border-pip-border/30 text-pip-border opacity-40 cursor-not-allowed'
                          : 'border-pip-border text-pip-green-dim hover:border-pip-green hover:text-pip-green cursor-pointer'
                      }`}
                      style={{ fontFamily: 'VT323, monospace', fontSize: '14px' }}
                    >
                      TAG
                    </button>

                    {/* Name */}
                    <div className="w-32 pip-tooltip">
                      <span className={`text-sm ${isTagged ? 'text-pip-green text-glow' : 'text-pip-green-dim group-hover:text-pip-green'} transition-colors`}>
                        {skill.name}
                      </span>
                      {skillDef && (
                        <div className="tooltip-text max-w-[300px] whitespace-normal">
                          {skillDef.description}
                          <br /><br />
                          <span className="text-pip-green-dim">Formula: {skillDef.baseFormula}</span>
                        </div>
                      )}
                    </div>

                    {/* Value bar */}
                    <div className="flex-1">
                      <div className="h-2 bg-pip-grid rounded-sm overflow-hidden">
                        <div
                          className="h-full bg-pip-green transition-all duration-300"
                          style={{
                            width: `${Math.min(100, skill.total / 2)}%`,
                            boxShadow: isTagged ? '0 0 6px rgba(24, 255, 109, 0.4)' : 'none',
                          }}
                        />
                      </div>
                    </div>

                    {/* Value */}
                    <div className="w-12 text-right font-display text-lg"
                      style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
                      <span className={isTagged ? 'text-pip-green text-glow' : 'text-pip-green-dim'}>
                        {skill.total}%
                      </span>
                    </div>

                    {/* Breakdown */}
                    <div className="w-24 text-[10px] text-pip-green-dim/60 text-right">
                      {skill.base}
                      {skill.tagged > 0 && <span className="text-pip-green">+{skill.tagged}</span>}
                      {skill.traitBonus !== 0 && (
                        <span className={skill.traitBonus > 0 ? 'text-pip-green' : 'text-pip-amber'}>
                          {skill.traitBonus > 0 ? '+' : ''}{skill.traitBonus}
                        </span>
                      )}
                      {skill.allocated > 0 && <span className="text-pip-green-bright">+{skill.allocated}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
