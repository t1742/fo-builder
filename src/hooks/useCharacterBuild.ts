import { useState, useCallback } from 'react';
import type { CharacterBuild, SpecialValues } from '@/types';
import {
  DEFAULT_SPECIAL,
  TOTAL_STARTING_POINTS,
  SPECIAL_MIN,
  SPECIAL_MAX,
  MAX_TRAITS,
  TAG_SLOTS,
} from '@/data';

const initialBuild: CharacterBuild = {
  name: 'Vault Dweller',
  special: { ...DEFAULT_SPECIAL },
  selectedTraits: [],
  taggedSkills: [],
  level: 1,
  skillAllocations: {},
  selectedPerks: {},
  perkRanks: {},
};

export function useCharacterBuild() {
  const [build, setBuild] = useState<CharacterBuild>(initialBuild);

  const setName = useCallback((name: string) => {
    setBuild((b) => ({ ...b, name }));
  }, []);

  const setSpecial = useCallback((key: string, value: number) => {
    setBuild((b) => {
      const clamped = Math.max(SPECIAL_MIN, Math.min(SPECIAL_MAX, value));
      const newSpecial: SpecialValues = { ...b.special, [key]: clamped };
      const total = Object.values(newSpecial).reduce((s, v) => s + v, 0);
      if (total > TOTAL_STARTING_POINTS) return b;
      return { ...b, special: newSpecial };
    });
  }, []);

  const remainingSpecialPoints = useCallback(() => {
    return TOTAL_STARTING_POINTS - Object.values(build.special).reduce((s, v) => s + v, 0);
  }, [build.special]);

  const toggleTrait = useCallback((traitId: string) => {
    setBuild((b) => {
      const idx = b.selectedTraits.indexOf(traitId);
      if (idx >= 0) {
        return { ...b, selectedTraits: b.selectedTraits.filter((t) => t !== traitId) };
      }
      if (b.selectedTraits.length >= MAX_TRAITS) return b;
      return { ...b, selectedTraits: [...b.selectedTraits, traitId] };
    });
  }, []);

  const toggleTaggedSkill = useCallback((skillKey: string) => {
    setBuild((b) => {
      const idx = b.taggedSkills.indexOf(skillKey);
      if (idx >= 0) {
        return { ...b, taggedSkills: b.taggedSkills.filter((s) => s !== skillKey) };
      }
      if (b.taggedSkills.length >= TAG_SLOTS) return b;
      return { ...b, taggedSkills: [...b.taggedSkills, skillKey] };
    });
  }, []);

  const setLevel = useCallback((level: number) => {
    setBuild((b) => ({ ...b, level: Math.max(1, Math.min(21, level)) }));
  }, []);

  const allocateSkillPoints = useCallback(
    (level: number, skillKey: string, points: number) => {
      setBuild((b) => {
        const levelAlloc = { ...(b.skillAllocations[level] || {}) };
        const current = levelAlloc[skillKey] || 0;
        levelAlloc[skillKey] = Math.max(0, current + points);
        return {
          ...b,
          skillAllocations: { ...b.skillAllocations, [level]: levelAlloc },
        };
      });
    },
    []
  );

  const selectPerk = useCallback((level: number, perkId: string) => {
    setBuild((b) => {
      const levelPerks = [...(b.selectedPerks[level] || [])];
      if (levelPerks.includes(perkId)) return b;
      levelPerks.push(perkId);
      const currentRank = b.perkRanks[perkId] || 0;
      return {
        ...b,
        selectedPerks: { ...b.selectedPerks, [level]: levelPerks },
        perkRanks: { ...b.perkRanks, [perkId]: currentRank + 1 },
      };
    });
  }, []);

  const removePerk = useCallback((level: number, perkId: string) => {
    setBuild((b) => {
      const levelPerks = (b.selectedPerks[level] || []).filter((p) => p !== perkId);
      const currentRank = b.perkRanks[perkId] || 0;
      const newRanks = { ...b.perkRanks };
      if (currentRank <= 1) {
        delete newRanks[perkId];
      } else {
        newRanks[perkId] = currentRank - 1;
      }
      return {
        ...b,
        selectedPerks: { ...b.selectedPerks, [level]: levelPerks },
        perkRanks: newRanks,
      };
    });
  }, []);

  const resetBuild = useCallback(() => {
    setBuild({ ...initialBuild, special: { ...DEFAULT_SPECIAL } });
  }, []);

  const exportBuild = useCallback(() => {
    return JSON.stringify(build, null, 2);
  }, [build]);

  const importBuild = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as CharacterBuild;
      if (parsed.special && parsed.selectedTraits && parsed.taggedSkills) {
        setBuild(parsed);
        return true;
      }
    } catch {
      // invalid JSON
    }
    return false;
  }, []);

  return {
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
  };
}
