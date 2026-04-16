import { specialData, SPECIAL_MIN, SPECIAL_MAX } from '@/data';
import type { SpecialValues } from '@/types';

interface Props {
  values: SpecialValues;
  effectiveValues: Record<string, number>;
  remaining: number;
  onChange: (key: string, value: number) => void;
}

const DESCRIPTORS = ['Terrible', 'Bad', 'Poor', 'Fair', 'Average', 'Good', 'V. Good', 'Great', 'Excellent', 'Heroic'];

export function SpecialDistributor({ values, effectiveValues, remaining, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs tracking-[0.2em] text-pip-green-dim"
          style={{ fontFamily: 'VT323, monospace', fontSize: '16px' }}>
          S.P.E.C.I.A.L.
        </div>
        <div className="text-xs">
          <span className="text-pip-green-dim">PTS: </span>
          <span className={`font-display text-lg ${remaining > 0 ? 'text-pip-green text-glow' : 'text-pip-green-dim'}`}
            style={{ fontFamily: 'VT323, monospace' }}>
            {remaining}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {specialData.attributes.map((attr) => {
          const raw = values[attr.key] ?? attr.default;
          const effective = effectiveValues[attr.key] ?? raw;
          const hasBonus = effective > raw;
          const hasPenalty = effective < raw;
          const descriptor = DESCRIPTORS[Math.min(effective - 1, 9)];

          return (
            <div key={attr.key} className="flex items-center gap-2 group pip-tooltip">
              {/* Key */}
              <span className="text-pip-green text-glow font-display w-6 text-right"
                style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
                {attr.key}
              </span>

              {/* Decrement */}
              <button
                className="pip-btn pip-btn-sm text-[14px] leading-none"
                onClick={() => onChange(attr.key, raw - 1)}
                disabled={raw <= SPECIAL_MIN}
              >−</button>

              {/* Value */}
              <span className={`font-display w-6 text-center ${
                hasBonus ? 'text-pip-green text-glow' :
                hasPenalty ? 'text-pip-amber text-glow-amber' :
                'text-pip-green'
              }`} style={{ fontFamily: 'VT323, monospace', fontSize: '24px' }}>
                {effective}
              </span>

              {/* Increment */}
              <button
                className="pip-btn pip-btn-sm text-[14px] leading-none"
                onClick={() => onChange(attr.key, raw + 1)}
                disabled={raw >= SPECIAL_MAX || remaining <= 0}
              >+</button>

              {/* Descriptor */}
              <span className="text-xs text-pip-green-dim w-16">{descriptor}</span>

              {/* Modifier indicator */}
              {(hasBonus || hasPenalty) && (
                <span className={`text-[10px] ${hasBonus ? 'text-pip-green' : 'text-pip-amber'}`}>
                  ({raw}{hasBonus ? `+${effective - raw}` : `${effective - raw}`})
                </span>
              )}

              {/* Tooltip */}
              <div className="tooltip-text max-w-[200px] whitespace-normal !bottom-auto !top-[calc(100%+4px)]">
                <span className="text-pip-green">{attr.name}</span>: {attr.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}