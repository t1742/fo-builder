import { useMemo } from 'react';
import type { CharacterBuild, ComputedSkill } from '@/types';
import { skillsData, traitsData, TAG_BONUS } from '@/data';
import { getEffectiveSpecial } from './useDerivedStats';

export function useSkillCalculator(build: CharacterBuild): ComputedSkill[] {
  return useMemo(() => {
    const s = getEffectiveSpecial(build);

    return skillsData.skills.map((skill) => {
      // Compute base value from SPECIAL
      let base = skill.base;
      if (skill.governingAttributes.length === 1) {
        const attr = skill.governingAttributes[0];
        base += skill.multiplier * (s[attr] || 0);
      } else if (skill.governingAttributes.length === 2) {
        const [a1, a2] = skill.governingAttributes;
        base += Math.floor(((s[a1] || 0) + (s[a2] || 0)) / 2);
      }

      // Tag bonus
      const isTagged = build.taggedSkills.includes(skill.key);
      const tagged = isTagged ? TAG_BONUS : 0;

      // Trait bonuses/penalties to skills
      let traitBonus = 0;
      for (const traitId of build.selectedTraits) {
        const trait = traitsData.traits.find((t) => t.id === traitId);
        if (!trait) continue;

        for (const effect of [...trait.effects.bonuses, ...trait.effects.penalties]) {
          if (effect.type !== 'skill') continue;
          if (effect.value === undefined) continue;

          if (effect.stat === 'all') {
            traitBonus += effect.value;
          } else if (effect.stat === skill.key) {
            traitBonus += effect.value;
          }
        }
      }

      // Allocated points across all levels up to current
      let allocated = 0;
      for (let lvl = 1; lvl <= build.level; lvl++) {
        const levelAlloc = build.skillAllocations[lvl];
        if (levelAlloc && levelAlloc[skill.key]) {
          allocated += levelAlloc[skill.key];
        }
      }

      const total = Math.max(0, Math.min(200, base + tagged + traitBonus + allocated));

      return {
        key: skill.key,
        name: skill.name,
        category: skill.category,
        base,
        tagged,
        traitBonus,
        allocated,
        perkBonus: 0,
        total,
      };
    });
  }, [build]);
}
