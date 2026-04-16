import { Layout } from '@/components/Layout';
import { SpecialDistributor } from '@/components/SpecialDistributor';
import { TraitSelector } from '@/components/TraitSelector';
import { SkillTagger } from '@/components/SkillTagger';
import { LevelProgression } from '@/components/LevelProgression';
import { PerkSelector } from '@/components/PerkSelector';
import { DerivedStatsPanel } from '@/components/DerivedStatsPanel';
import { BuildSummary } from '@/components/BuildSummary';
import { useCharacterBuild } from '@/hooks/useCharacterBuild';
import { useDerivedStats, getEffectiveSpecial } from '@/hooks/useDerivedStats';
import { useSkillCalculator } from '@/hooks/useSkillCalculator';

function App() {
  const {
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
  } = useCharacterBuild();

  const derivedStats = useDerivedStats(build);
  const computedSkills = useSkillCalculator(build);
  const effectiveSpecial = getEffectiveSpecial(build);

  const sidebar = (
    <DerivedStatsPanel stats={derivedStats} perkRate={derivedStats.perkRate} />
  );

  return (
    <Layout
      buildName={build.name}
      onNameChange={setName}
      onReset={resetBuild}
      sidebar={sidebar}
    >
      <SpecialDistributor
        values={build.special}
        effectiveValues={effectiveSpecial}
        remaining={remainingSpecialPoints()}
        onChange={setSpecial}
      />

      <TraitSelector
        selected={build.selectedTraits}
        onToggle={toggleTrait}
      />

      <SkillTagger
        computedSkills={computedSkills}
        taggedSkills={build.taggedSkills}
        onToggleTag={toggleTaggedSkill}
      />

      <LevelProgression
        build={build}
        computedSkills={computedSkills}
        skillRate={derivedStats.skillRate}
        onAllocate={allocateSkillPoints}
        onSetLevel={setLevel}
      />

      <PerkSelector
        build={build}
        computedSkills={computedSkills}
        onSelectPerk={selectPerk}
        onRemovePerk={removePerk}
      />

      <BuildSummary
        build={build}
        onExport={exportBuild}
        onImport={importBuild}
        onReset={resetBuild}
      />

      {/* Derived stats for mobile/tablet - shown below main content */}
      <div className="xl:hidden mb-10">
        <div className="pip-panel p-4">
          <DerivedStatsPanel stats={derivedStats} perkRate={derivedStats.perkRate} />
        </div>
      </div>
    </Layout>
  );
}

export default App;