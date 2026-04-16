import { specialData, SPECIAL_MIN, SPECIAL_MAX } from '@/data';
import type { SpecialValues } from '@/types';

interface Props {
  values: SpecialValues;
  effectiveValues: Record<string, number>;
  remaining: number;
  onChange: (key: string, value: number) => void;
}

function SegmentedBar({ value, max = 10 }: { value: number; max?: number }) {
  return (
    <div className="pip-bar-segment">
      {Array.from({ length: max }, (_, i) => (
        <div key={i} className={`segment ${i < value ? 'filled' : ''}`} />
      ))}
    </div>
  );
}

export function SpecialDistributor({ values, effectiveValues, remaining, onChange }: Props) {
  return (
    <section id="special" className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="section-header mb-0 border-0 pb-0">S.P.E.C.I.A.L.</h2>
        <div className="text-sm">
          <span className="text-pip-green-dim">REMAINING: </span>
          <span className={`font-display text-2xl ${remaining > 0 ? 'text-pip-green text-glow' : remaining === 0 ? 'text-pip-green-dim' : 'text-pip-red'}`}
            style={{ fontFamily: 'VT323, monospace' }}>
            {remaining}
          </span>
        </div>
      </div>

      <div className="pip-panel p-4 space-y-3">
        {specialData.attributes.map((attr) => {
          const raw = values[attr.key] ?? attr.default;
          const effective = effectiveValues[attr.key] ?? raw;
          const hasBonus = effective > raw;
          const hasPenalty = effective < raw;

          return (
            <div key={attr.key} className="flex items-center gap-3 group">
              {/* Letter */}
              <div className="w-8 text-center font-display text-xl text-pip-green text-glow"
                style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}>
                {attr.letter}
              </div>

              {/* Name */}
              <div className="w-28 pip-tooltip">
                <span className="text-sm text-pip-green-dim group-hover:text-pip-green transition-colors">
                  {attr.name}
                </span>
                <div className="tooltip-text max-w-[250px] whitespace-normal">{attr.description}</div>
              </div>

              {/* Decrement */}
              <button
                className="pip-btn pip-btn-sm"
                onClick={() => onChange(attr.key, raw - 1)}
                disabled={raw <= SPECIAL_MIN}
              >
                −
              </button>

              {/* Value */}
              <div className="w-8 text-center font-display text-xl"
                style={{ fontFamily: 'VT323, monospace', fontSize: '28px' }}>
                <span className={
                  hasBonus ? 'text-pip-green text-glow' :
                  hasPenalty ? 'text-pip-amber text-glow-amber' :
                  'text-pip-green'
                }>
                  {effective}
                </span>
              </div>

              {/* Increment */}
              <button
                className="pip-btn pip-btn-sm"
                onClick={() => onChange(attr.key, raw + 1)}
                disabled={raw >= SPECIAL_MAX || remaining <= 0}
              >
                +
              </button>

              {/* Bar */}
              <div className="flex-1 ml-2">
                <SegmentedBar value={effective} />
              </div>

              {/* Raw / Effective indicator */}
              {(hasBonus || hasPenalty) && (
                <div className={`text-xs w-12 text-right ${hasBonus ? 'text-pip-green' : 'text-pip-amber'}`}>
                  ({raw}{hasBonus ? `+${effective - raw}` : `${effective - raw}`})
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
