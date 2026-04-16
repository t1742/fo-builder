import { traitsData, MAX_TRAITS } from '@/data';

interface Props {
  selected: string[];
  onToggle: (traitId: string) => void;
}

export function TraitSelector({ selected, onToggle }: Props) {
  return (
    <section id="traits" className="mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="section-header mb-0 border-0 pb-0">TRAITS</h2>
        <div className="text-sm">
          <span className="text-pip-green-dim">SELECTED: </span>
          <span className={`font-display text-2xl ${selected.length < MAX_TRAITS ? 'text-pip-green text-glow' : 'text-pip-amber text-glow-amber'}`}
            style={{ fontFamily: 'VT323, monospace' }}>
            {selected.length}/{MAX_TRAITS}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {traitsData.traits.map((trait) => {
          const isSelected = selected.includes(trait.id);
          const isDisabled = !isSelected && selected.length >= MAX_TRAITS;

          return (
            <button
              key={trait.id}
              onClick={() => onToggle(trait.id)}
              disabled={isDisabled}
              className={`pip-panel p-3 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-pip-green shadow-[0_0_10px_rgba(24,255,109,0.15),inset_0_0_20px_rgba(24,255,109,0.03)]'
                  : isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:border-pip-green/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 border ${isSelected ? 'border-pip-green bg-pip-green' : 'border-pip-border'} transition-all`} />
                <span className="font-display text-lg tracking-wider"
                  style={{ fontFamily: 'VT323, monospace', fontSize: '22px' }}>
                  {trait.name}
                </span>
              </div>
              <div className="text-xs space-y-1 pl-5">
                <div className="text-pip-green">
                  <span className="text-pip-green-dim mr-1">+</span>
                  {trait.benefit}
                </div>
                <div className="text-pip-amber">
                  <span className="text-pip-red mr-1">−</span>
                  {trait.penalty}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
