import type { SpecialData, SkillData, TraitData, PerkData, DerivedStatsData } from '@/types';

import specialJson from '../../data/special.json';
import skillsJson from '../../data/skills.json';
import traitsJson from '../../data/traits.json';
import perksJson from '../../data/perks.json';
import derivedStatsJson from '../../data/derived-stats.json';

export const specialData = specialJson as SpecialData;
export const skillsData = skillsJson as SkillData;
export const traitsData = traitsJson as TraitData;
export const perksData = perksJson as PerkData;
export const derivedStatsData = derivedStatsJson as DerivedStatsData;

export const TOTAL_STARTING_POINTS = specialData.meta.totalStartingPoints;
export const SPECIAL_MIN = specialData.meta.min;
export const SPECIAL_MAX = specialData.meta.max;
export const TAG_SLOTS = skillsData.meta.tagSlots;
export const TAG_BONUS = skillsData.meta.tagBonus;
export const MAX_TRAITS = traitsData.meta.maxTraits;
export const MAX_LEVEL = perksData.meta.maxLevel;
export const DEFAULT_PERK_RATE = perksData.meta.defaultPerkRate;
export const SKILLED_PERK_RATE = perksData.meta.skilledPerkRate;

export const DEFAULT_SPECIAL: Record<string, number> = {};
for (const attr of specialData.attributes) {
  DEFAULT_SPECIAL[attr.key] = attr.default;
}
