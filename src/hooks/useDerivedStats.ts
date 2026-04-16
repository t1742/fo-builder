import { useMemo } from 'react';
import type { CharacterBuild, ComputedDerivedStats } from '@/types';
import { traitsData } from '@/data';

export function useDerivedStats(build: CharacterBuild): ComputedDerivedStats {
  return useMemo(() => {
    const s = getEffectiveSpecial(build);

    // Base derived stats from SPECIAL
    let actionPoints = Math.floor(s.AG / 2) + 5;
    let armorClass = s.AG;
    let carryWeight = (s.ST + 1) * 25;
    let criticalChance = s.LK;
    const damageResistance = 0;
    let healingRate = Math.max(Math.floor(s.EN / 3), 1);
    let hitPoints = 15 + 2 * s.EN + s.ST;
    let meleeDamage = Math.max(s.ST - 5, 1);
    let perkRate = 3;
    let poisonResistance = s.EN * 5;
    let radiationResistance = s.EN * 2;
    let sequence = s.PE * 2;
    let skillRate = s.IN * 2 + 5;

    // Apply trait effects to derived stats
    for (const traitId of build.selectedTraits) {
      const trait = traitsData.traits.find((t) => t.id === traitId);
      if (!trait) continue;

      for (const effect of [...trait.effects.bonuses, ...trait.effects.penalties]) {
        if (effect.type !== 'derivedStat') continue;

        if (effect.override !== undefined) {
          switch (effect.stat) {
            case 'armorClass': armorClass = effect.override; break;
            case 'poisonResistance': poisonResistance = effect.override; break;
            case 'radiationResistance': radiationResistance = effect.override; break;
            case 'perkRate': perkRate = effect.override; break;
          }
        } else if (effect.value !== undefined) {
          switch (effect.stat) {
            case 'actionPoints': actionPoints += effect.value; break;
            case 'healingRate': healingRate += effect.value; break;
            case 'criticalChance': criticalChance += effect.value; break;
            case 'meleeDamage': meleeDamage += effect.value; break;
            case 'sequence': sequence += effect.value; break;
            case 'skillRate': skillRate += effect.value; break;
          }
        } else if (effect.formulaOverride) {
          if (effect.stat === 'carryWeight') {
            carryWeight = 25 + 15 * s.ST;
          }
        }
      }
    }

    // Apply perk effects
    for (const [, perksAtLevel] of Object.entries(build.selectedPerks)) {
      for (const perkId of perksAtLevel) {
        const rank = build.perkRanks[perkId] || 1;
        if (perkId === 'actionBoy') actionPoints += rank;
        if (perkId === 'bonusHtHDamage') meleeDamage += 2 * rank;
      }
    }

    return {
      actionPoints,
      armorClass,
      carryWeight,
      criticalChance: Math.min(100, Math.max(0, criticalChance)),
      damageResistance,
      healingRate,
      hitPoints,
      meleeDamage: Math.max(1, meleeDamage),
      perkRate,
      poisonResistance: Math.min(100, Math.max(0, poisonResistance)),
      radiationResistance: Math.min(100, Math.max(0, radiationResistance)),
      sequence,
      skillRate: Math.max(0, skillRate),
    };
  }, [build]);
}

/** Get SPECIAL values after trait modifiers */
export function getEffectiveSpecial(build: CharacterBuild): Record<string, number> {
  const s = { ...build.special };

  for (const traitId of build.selectedTraits) {
    const trait = traitsData.traits.find((t) => t.id === traitId);
    if (!trait) continue;

    for (const effect of [...trait.effects.bonuses, ...trait.effects.penalties]) {
      if (effect.type !== 'special') continue;
      if (!effect.value) continue;
      if (effect.condition) continue; // Skip conditional effects (Night Person)

      if (effect.stat === 'all') {
        for (const key of Object.keys(s)) {
          if (['ST', 'PE', 'EN', 'CH', 'IN', 'AG', 'LK'].includes(key)) {
            s[key] = Math.min(10, Math.max(1, s[key] + effect.value));
          }
        }
      } else if (s[effect.stat] !== undefined) {
        s[effect.stat] = Math.min(10, Math.max(1, s[effect.stat] + effect.value));
      }
    }
  }

  return s;
}
