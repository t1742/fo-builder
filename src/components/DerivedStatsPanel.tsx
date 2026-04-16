import type { ComputedDerivedStats } from '@/types';
import { derivedStatsData } from '@/data';

interface Props {
  stats: ComputedDerivedStats;
  perkRate: number;
}

const STAT_KEY_MAP: Record<string, keyof ComputedDerivedStats> = {
  actionPoints: 'actionPoints',
  armorClass: 'armorClass',
  carryWeight: 'carryWeight',
  criticalChance: 'criticalChance',
  damageResistance: 'damageResistance',
  healingRate: 'healingRate',
  hitPoints: 'hitPoints',
  meleeDamage: 'meleeDamage',
  perkRate: 'perkRate',
  poisonResistance: 'poisonResistance',
  radiationResistance: 'radiationResistance',
  sequence: 'sequence',
  skillRate: 'skillRate',
};

export function DerivedStatsPanel({ stats }: Props) {
  return (
    <div>
      <div className="text-xs tracking-[0.2em] text-pip-green-dim mb-3"
        style={{ fontFamily: 'VT323, monospace', fontSize: '18px' }}>
        DERIVED STATISTICS
      </div>

      <div className="space-y-2">
        {derivedStatsData.derivedStats.map((ds) => {
          const key = STAT_KEY_MAP[ds.id];
          const value = key ? stats[key] : 0;
          const unit = ds.unit || '';

          return (
            <div key={ds.id} className="pip-tooltip group">
              <div className="flex items-center justify-between py-1 border-b border-pip-border/30 hover:border-pip-border/60 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-pip-green-dim text-[10px] tracking-wider w-8">
                    {ds.abbreviation}
                  </span>
                  <span className="text-xs text-pip-green-dim group-hover:text-pip-green transition-colors">
                    {ds.name}
                  </span>
                </div>
                <span className="font-display text-lg text-pip-green text-glow"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
                  {value}{unit}
                </span>
              </div>
              <div className="tooltip-text !left-0 !transform-none max-w-[250px] whitespace-normal">
                {ds.description}
                <br />
                <span className="text-pip-green-dim">Formula: {ds.formula}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
