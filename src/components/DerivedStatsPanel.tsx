import type { ComputedDerivedStats } from '@/types';

interface Props {
  stats: ComputedDerivedStats;
  hitPointsMax: number;
  level: number;
}

export function DerivedStatsPanel({ stats, hitPointsMax, level }: Props) {
  return (
    <div>
      {/* Hit Points - prominent like original */}
      <div className="mb-3 pb-2 border-b border-pip-border/40">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-pip-green-dim">Hit Points</span>
          <span className="font-display text-pip-green text-glow"
            style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}>
            {hitPointsMax}/{hitPointsMax}
          </span>
        </div>
        <div className="h-2 bg-pip-grid rounded-sm overflow-hidden mt-1">
          <div className="h-full bg-pip-green rounded-sm" style={{ width: '100%' }} />
        </div>
      </div>

      {/* Level info */}
      <div className="mb-3 pb-2 border-b border-pip-border/40 space-y-0.5">
        <StatRow label="Level" value={level} />
      </div>

      {/* Core derived stats - like original layout */}
      <div className="space-y-0.5">
        <StatRow label="Armor Class" value={stats.armorClass} />
        <StatRow label="Action Points" value={stats.actionPoints} />
        <StatRow label="Carry Weight" value={stats.carryWeight} />
        <StatRow label="Melee Damage" value={stats.meleeDamage} />
        <StatRow label="Damage Res." value={stats.damageResistance} unit="%" />
        <StatRow label="Poison Res." value={stats.poisonResistance} unit="%" />
        <StatRow label="Radiation Res." value={stats.radiationResistance} unit="%" />
        <StatRow label="Sequence" value={stats.sequence} />
        <StatRow label="Healing Rate" value={stats.healingRate} />
        <StatRow label="Critical Chance" value={stats.criticalChance} unit="%" />
      </div>

      {/* Skill/Perk rates */}
      <div className="mt-3 pt-2 border-t border-pip-border/40 space-y-0.5">
        <StatRow label="Skill Rate" value={stats.skillRate} />
        <StatRow label="Perk Rate" value={stats.perkRate} />
      </div>
    </div>
  );
}

function StatRow({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  return (
    <div className="flex items-center justify-between py-px group">
      <span className="text-xs text-pip-green-dim group-hover:text-pip-green transition-colors">{label}</span>
      <span className="font-display text-pip-green"
        style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
        {value}{unit}
      </span>
    </div>
  );
}