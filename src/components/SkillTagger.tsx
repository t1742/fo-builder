import { TAG_SLOTS } from '@/data';
import type { ComputedSkill } from '@/types';

interface Props {
  computedSkills: ComputedSkill[];
  taggedSkills: string[];
  onToggleTag: (skillKey: string) => void;
}

export function SkillTagger({ computedSkills, taggedSkills, onToggleTag }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs tracking-[0.2em] text-pip-green-dim"
          style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
          SKILLS
        </div>
        <div className="text-xs">
          <span className="text-pip-green-dim">TAG: </span>
          <span className={`font-display text-lg ${taggedSkills.length < TAG_SLOTS ? 'text-pip-green text-glow' : 'text-pip-amber text-glow-amber'}`}
            style={{ fontFamily: 'VT323, monospace' }}>
            {taggedSkills.length}/{TAG_SLOTS}
          </span>
        </div>
      </div>

      <div className="space-y-0.5">
        {computedSkills.map((skill) => {
          const isTagged = taggedSkills.includes(skill.key);
          const isDisabled = !isTagged && taggedSkills.length >= TAG_SLOTS;

          return (
            <div key={skill.key}
              className="flex items-center gap-2 py-px group hover:bg-pip-green/[0.03] cursor-pointer transition-colors"
              onClick={() => !isDisabled && onToggleTag(skill.key)}
            >
              {/* Tag indicator */}
              <span className={`text-[10px] w-4 text-center ${
                isTagged ? 'text-pip-green text-glow' : 'text-pip-green-dim/30'
              }`}>
                {isTagged ? '▸' : ''}
              </span>

              {/* Name */}
              <span className={`text-xs flex-1 ${
                isTagged ? 'text-pip-green text-glow' : 'text-pip-green-dim group-hover:text-pip-green'
              } transition-colors`}>
                {skill.name}
              </span>

              {/* Value */}
              <span className={`font-display w-10 text-right ${
                isTagged ? 'text-pip-green text-glow' : 'text-pip-green-dim'
              }`} style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
                {skill.total}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}