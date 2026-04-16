// ─── SPECIAL ─────────────────────────────────────────────
export interface SpecialAttribute {
  id: number;
  key: string;
  name: string;
  letter: string;
  description: string;
  default: number;
  min: number;
  max: number;
  derivedStats: string[];
  associatedSkills: string[];
}

export interface SpecialData {
  meta: {
    game: string;
    source: string;
    startingPointsPerAttribute: number;
    totalStartingPoints: number;
    min: number;
    max: number;
  };
  attributes: SpecialAttribute[];
}

export type SpecialValues = Record<string, number>;

// ─── Skills ──────────────────────────────────────────────
export interface Skill {
  id: number;
  key: string;
  name: string;
  category: 'combat' | 'active' | 'passive';
  description: string;
  governingAttributes: string[];
  baseFormula: string;
  base: number;
  multiplier: number;
  statCalc: string;
  book: string | null;
}

export interface SkillData {
  meta: {
    game: string;
    source: string;
    totalSkills: number;
    tagSlots: number;
    tagBonus: number;
    tagRateMultiplier: number;
    skillMin: number;
    skillMax: number;
    skillPointsPerLevel: string;
  };
  skills: Skill[];
}

// ─── Traits ──────────────────────────────────────────────
export interface TraitEffect {
  type: 'special' | 'derivedStat' | 'skill' | 'combat';
  stat: string;
  value?: number;
  override?: number;
  formulaOverride?: string;
  disabled?: boolean;
  condition?: string;
  description?: string;
}

export interface Trait {
  id: string;
  name: string;
  benefit: string;
  penalty: string;
  effects: {
    bonuses: TraitEffect[];
    penalties: TraitEffect[];
  };
}

export interface TraitData {
  meta: {
    game: string;
    source: string;
    maxTraits: number;
    totalTraits: number;
  };
  traits: Trait[];
}

// ─── Perks ───────────────────────────────────────────────
export interface PerkEffect {
  stat: string;
  valuePerRank: number;
}

export interface Perk {
  id: string;
  name: string;
  category: string;
  levelReq: number;
  requirements: {
    special: Record<string, number>;
    skills: Record<string, number>;
  };
  ranks: number;
  benefit: string;
  effects: PerkEffect[];
  notes: string | null;
}

export interface PerkData {
  meta: {
    game: string;
    source: string;
    defaultPerkRate: number;
    skilledPerkRate: number;
    firstPerkLevel: number;
    maxLevel: number;
    maxPerks: number;
    maxPerksWithSkilled: number;
    totalRegularPerks: number;
  };
  perks: Perk[];
}

// ─── Derived Stats ───────────────────────────────────────
export interface DerivedStat {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  derivedFrom: string[];
  formula: string;
  smallFrameFormula?: string;
  skilledFormula?: string;
  hpPerLevel?: string;
  min: number | null;
  max: number | null;
  unit?: string;
}

export interface DerivedStatsData {
  meta: {
    game: string;
    source: string;
  };
  derivedStats: DerivedStat[];
}

// ─── Character Build State ───────────────────────────────
export interface CharacterBuild {
  name: string;
  special: SpecialValues;
  selectedTraits: string[];
  taggedSkills: string[];
  level: number;
  skillAllocations: Record<number, Record<string, number>>; // level -> skill -> points
  selectedPerks: Record<number, string[]>; // level -> perk ids
  perkRanks: Record<string, number>; // perk id -> current rank
}

export interface ComputedDerivedStats {
  actionPoints: number;
  armorClass: number;
  carryWeight: number;
  criticalChance: number;
  damageResistance: number;
  healingRate: number;
  hitPoints: number;
  meleeDamage: number;
  perkRate: number;
  poisonResistance: number;
  radiationResistance: number;
  sequence: number;
  skillRate: number;
}

export interface ComputedSkill {
  key: string;
  name: string;
  category: string;
  base: number;
  tagged: number;
  traitBonus: number;
  allocated: number;
  perkBonus: number;
  total: number;
}
