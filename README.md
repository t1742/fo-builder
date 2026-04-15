# Fallout 1 Build Planner

A frontend application for planning character builds in Fallout 1.

## Features

### Character Creation

#### SPECIAL Attributes
- **S**trength - Physical power and melee damage
- **P**erception - Awareness and accuracy
- **E**ndurance - Health and resistances
- **C**harisma - Social interactions and companion management
- **I**ntelligence - Skill points per level
- **A**gility - Action Points and sequence
- **L**uck - Critical chance and general fortune

**Starting Points:** 5 points per attribute (40 total to distribute)  
**Range:** 1-10 per attribute

#### Traits
- Select up to 2 optional traits at character creation
- Each trait provides advantages and disadvantages
- Examples: Gifted, Fast Shot, Bloody Mess, Small Frame, etc.
- Traits are permanent and cannot be changed

#### Tagged Skills
- Tag 3 skills at character creation
- Tagged skills start with +20% bonus
- Tagged skills improve faster (1 skill point = 2%)
- Choose wisely based on build strategy

#### Starting Skills
All skills start with a base percentage calculated from SPECIAL attributes:
- Small Guns
- Big Guns
- Energy Weapons
- Unarmed
- Melee Weapons
- Throwing
- First Aid
- Doctor
- Sneak
- Lockpick
- Steal
- Traps
- Science
- Repair
- Speech
- Barter

### Derived Stats
Automatically calculated from SPECIAL attributes:
- **Hit Points (HP)** - Based on Endurance + Strength
- **Armor Class (AC)** - Based on Agility
- **Action Points (AP)** - Based on Agility (combat turns)
- **Carry Weight** - Based on Strength
- **Melee Damage** - Based on Strength
- **Damage Resistance** - Based on Endurance
- **Poison Resistance** - Based on Endurance
- **Radiation Resistance** - Based on Endurance
- **Sequence** - Based on Perception (combat turn order)
- **Healing Rate** - Based on Endurance
- **Critical Chance** - Based on Luck

### Level Progression

#### Level Ups (Max Level 21)
- Gain experience to level up
- Each level grants skill points based on Intelligence
  - Base: 5 skill points per level
  - Bonus: Intelligence × 2 additional points
  - Formula: `5 + (Intelligence × 2)` skill points per level
- Distribute skill points among your 18 skills
- Skill maximum: 200%

#### Perks (Every 3 Levels)
- Gain a perk at levels 3, 6, 9, 12, 15, 18, and 21
- Total of 7 perks by max level
- Each perk has requirements:
  - Minimum SPECIAL attribute values
  - Minimum skill percentages
  - Sometimes minimum level or previous perks
- Perks provide permanent bonuses or abilities

### Additional Features

#### Character Details
- Character name
- Age (affects stats in some versions)
- Gender (affects some dialogue options)
- Character description/background

#### Build Export/Import
- Save build configurations
- Share builds with others
- Load pre-made builds

#### Build Validation
- Check if perk requirements are met
- Verify legal SPECIAL distribution
- Ensure skill points are correctly allocated

## What's Missing? Additional Considerations

- **Karma system** - Track good/evil choices (affects reputation)
- **Reputation** - Town-specific reputation values
- **Companions** - Some builds work better with certain companions
- **Equipment planning** - Weapon preferences, armor choices
- **Build templates** - Pre-made builds (Sniper, Diplomat, Melee Tank, etc.)
- **Skill breakpoints** - Important skill thresholds for dialogue/actions
- **Perk recommendations** - Suggest perks based on skill allocation
- **Build calculator** - Final stats preview at max level
- **Print/PDF export** - Physical reference during gameplay

## Technical Stack

Frontend-only application (specify your tech stack here):
- [ ] React / Vue / Angular / Vanilla JS
- [ ] CSS Framework
- [ ] State Management
- [ ] Local Storage for build saves

## Game Mechanics Reference

### SPECIAL System
Fallout 1 uses a balanced point-buy system where players distribute 40 points across 7 attributes, with each starting at 5.

### Skill Formula
```
Base Skill = (Related-SPECIAL × Modifier) + Base%
Tagged Skill = Base Skill + 20%
```

### Skill Point Formula
```
Points Per Level = 5 + (Intelligence × 2)
Tagged Skill Cost = 1 point = 2% increase
Untagged Skill Cost = 1 point = 1% increase
```

## Development Roadmap

- [ ] Character sheet interface
- [ ] SPECIAL point distribution
- [ ] Trait selection
- [ ] Skill tagging interface
- [ ] Level-by-level skill planner
- [ ] Perk selection tree
- [ ] Derived stats calculator
- [ ] Build save/load functionality
- [ ] Build sharing (JSON export/import)
- [ ] Responsive design
- [ ] Dark mode

## Resources

- [Fallout Wiki - Character Creation](https://fallout.fandom.com/wiki/Character_creation)
- [Fallout 1 Perks List](https://fallout.fandom.com/wiki/Fallout_perks)
- [SPECIAL System Details](https://fallout.fandom.com/wiki/SPECIAL)

## License

[Choose your license]

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
