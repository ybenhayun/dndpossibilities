// skills.js
// Experimental tagged-data schema. This file is not loaded by index.html yet.
// It keeps the tagged data for the default counting engine.

const ATTRIBUTES = [
	{
		"name": "Acrobatics",
		"type": "proficiency",
		"tags": [
			"fighter",
			"monk",
			"rogue",
			"shifter",
			"skill"
		]
	},
	{
		"name": "Animal Handling",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"centaur",
			"druid",
			"fighter",
			"lizardfolk",
			"ranger",
			"skill",
			"tortle"
		]
	},
	{
		"name": "Arcana",
		"type": "proficiency",
		"tags": [
			"druid",
			"koboldCraftiness",
			"skill",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Athletics",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"fighter",
			"monk",
			"paladin",
			"ranger",
			"rogue",
			"shifter",
			"skill"
		]
	},
	{
		"name": "Deception",
		"type": "proficiency",
		"tags": [
			"changeling",
			"rogue",
			"skill",
			"sorcerer",
			"warlock"
		]
	},
	{
		"name": "History",
		"type": "proficiency",
		"tags": [
			"cleric",
			"fighter",
			"monk",
			"skill",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Insight",
		"type": "proficiency",
		"tags": [
			"changeling",
			"cleric",
			"druid",
			"elfDrow",
			"elfHigh",
			"elfWood",
			"fighter",
			"monk",
			"paladin",
			"ranger",
			"rogue",
			"skill",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Intimidation",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"changeling",
			"fighter",
			"paladin",
			"rogue",
			"shifter",
			"skill",
			"sorcerer",
			"warlock"
		]
	},
	{
		"name": "Investigation",
		"type": "proficiency",
		"tags": [
			"koboldCraftiness",
			"ranger",
			"rogue",
			"skill",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Medicine",
		"type": "proficiency",
		"tags": [
			"centaur",
			"cleric",
			"druid",
			"koboldCraftiness",
			"lizardfolk",
			"paladin",
			"skill",
			"tortle",
			"wizard"
		]
	},
	{
		"name": "Nature",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"centaur",
			"druid",
			"lizardfolk",
			"ranger",
			"skill",
			"tortle",
			"warlock"
		]
	},
	{
		"name": "Perception",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"druid",
			"eladrin",
			"elfDrow",
			"elfHigh",
			"elfWood",
			"fighter",
			"harengon",
			"lizardfolk",
			"ranger",
			"rogue",
			"seaElf",
			"shadarKai",
			"skill",
			"tabaxi",
			"tortle"
		]
	},
	{
		"name": "Performance",
		"type": "proficiency",
		"tags": [
			"changeling",
			"rogue",
			"satyr",
			"skill"
		]
	},
	{
		"name": "Persuasion",
		"type": "proficiency",
		"tags": [
			"changeling",
			"cleric",
			"paladin",
			"rogue",
			"satyr",
			"skill",
			"sorcerer"
		]
	},
	{
		"name": "Religion",
		"type": "proficiency",
		"tags": [
			"cleric",
			"druid",
			"monk",
			"paladin",
			"skill",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Sleight of Hand",
		"type": "proficiency",
		"tags": [
			"koboldCraftiness",
			"rogue",
			"skill"
		]
	},
	{
		"name": "Stealth",
		"type": "proficiency",
		"tags": [
			"bugbear",
			"lizardfolk",
			"monk",
			"ranger",
			"rogue",
			"skill",
			"tabaxi",
			"tortle"
		]
	},
	{
		"name": "Survival",
		"type": "proficiency",
		"tags": [
			"barbarian",
			"centaur",
			"druid",
			"elfDrow",
			"elfHigh",
			"elfWood",
			"fighter",
			"koboldCraftiness",
			"lizardfolk",
			"ranger",
			"shifter",
			"skill",
			"tortle"
		]
	},
	{
		"name": "Alchemist's Supplies",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Brewer's Supplies",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Calligrapher's Supplies",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Carpenter's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Cartographer's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Cobbler's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Cook's Utensils",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Glassblower's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Jeweler's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Leatherworker's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Mason's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Painter's Supplies",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Potter's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Smith's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Tinker's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Weaver's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Woodcarver's Tools",
		"type": "proficiency",
		"tags": [
			"artisanTool",
			"tool"
		]
	},
	{
		"name": "Disguise Kit",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Forgery Kit",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Herbalism Kit",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Navigator's Tools",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Poisoner's Kit",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Thieves' Tools",
		"type": "proficiency",
		"tags": [
			"otherTool",
			"tool"
		]
	},
	{
		"name": "Dice Set",
		"type": "proficiency",
		"tags": [
			"gamingSet",
			"tool"
		]
	},
	{
		"name": "Dragonchess Set",
		"type": "proficiency",
		"tags": [
			"gamingSet",
			"tool"
		]
	},
	{
		"name": "Playing Card Set",
		"type": "proficiency",
		"tags": [
			"gamingSet",
			"tool"
		]
	},
	{
		"name": "Three-Dragon Ante Set",
		"type": "proficiency",
		"tags": [
			"gamingSet",
			"tool"
		]
	},
	{
		"name": "Bagpipes",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Drum",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Dulcimer",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Flute",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Horn",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Lute",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Lyre",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Pan Flute",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Shawm",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Viol",
		"type": "proficiency",
		"tags": [
			"instrument"
		]
	},
	{
		"name": "Common",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Sign Language",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Draconic",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Dwarvish",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Elvish",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Giant",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Gnomish",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Goblin",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Halfling",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Orc",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Abyssal",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Celestial",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Deep Speech",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Druidic",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Infernal",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Primordial",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Sylvan",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Thieves' Cant",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Undercommon",
		"type": "language",
		"tags": [
			"language"
		]
	},
	{
		"name": "Alert",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Crafter",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Healer",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Lucky",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Magic Initiate",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Musician",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Savage Attacker",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Skilled",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Tavern Brawler",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Tough",
		"type": "feat",
		"tags": [
			"originFeat"
		]
	},
	{
		"name": "Acid Splash",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Alarm",
		"type": "level1spell",
		"tags": [
			"ranger",
			"wizard"
		]
	},
	{
		"name": "Animal Friendship",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid",
			"ranger"
		]
	},
	{
		"name": "Armor of Agathys",
		"type": "level1spell",
		"tags": [
			"warlock"
		]
	},
	{
		"name": "Arms of Hadar",
		"type": "level1spell",
		"tags": [
			"warlock"
		]
	},
	{
		"name": "Bane",
		"type": "level1spell",
		"tags": [
			"bard",
			"cleric",
			"warlock"
		]
	},
	{
		"name": "Blade Ward",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Bless",
		"type": "level1spell",
		"tags": [
			"cleric",
			"paladin"
		]
	},
	{
		"name": "Burning Hands",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Charm Person",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Chill Touch",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Chromatic Orb",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Color Spray",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Command",
		"type": "level1spell",
		"tags": [
			"bard",
			"cleric",
			"paladin"
		]
	},
	{
		"name": "Compelled Duel",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	},
	{
		"name": "Comprehend Languages",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Create or Destroy Water",
		"type": "level1spell",
		"tags": [
			"cleric",
			"druid"
		]
	},
	{
		"name": "Cure Wounds",
		"type": "level1spell",
		"tags": [
			"bard",
			"cleric",
			"druid",
			"paladin",
			"ranger"
		]
	},
	{
		"name": "Dancing Lights",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Detect Evil and Good",
		"type": "level1spell",
		"tags": [
			"cleric",
			"paladin"
		]
	},
	{
		"name": "Detect Magic",
		"type": "level1spell",
		"tags": [
			"bard",
			"cleric",
			"druid",
			"paladin",
			"ranger",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Detect Poison and Disease",
		"type": "level1spell",
		"tags": [
			"cleric",
			"druid",
			"paladin",
			"ranger"
		]
	},
	{
		"name": "Disguise Self",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Dissonant Whispers",
		"type": "level1spell",
		"tags": [
			"bard"
		]
	},
	{
		"name": "Divine Favor",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	},
	{
		"name": "Divine Smite",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	},
	{
		"name": "Druidcraft",
		"type": "cantrip",
		"tags": [
			"druid"
		]
	},
	{
		"name": "Eldritch Blast",
		"type": "cantrip",
		"tags": [
			"warlock"
		]
	},
	{
		"name": "Elementalism",
		"type": "cantrip",
		"tags": [
			"druid",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Ensnaring Strike",
		"type": "level1spell",
		"tags": [
			"ranger"
		]
	},
	{
		"name": "Entangle",
		"type": "level1spell",
		"tags": [
			"druid",
			"ranger"
		]
	},
	{
		"name": "Expeditious Retreat",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Faerie Fire",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid"
		]
	},
	{
		"name": "False Life",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Feather Fall",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Find Familiar",
		"type": "level1spell",
		"tags": [
			"wizard"
		]
	},
	{
		"name": "Fire Bolt",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Fog Cloud",
		"type": "level1spell",
		"tags": [
			"druid",
			"ranger",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Friends",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Goodberry",
		"type": "level1spell",
		"tags": [
			"druid",
			"ranger"
		]
	},
	{
		"name": "Grease",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Guidance",
		"type": "cantrip",
		"tags": [
			"cleric",
			"druid"
		]
	},
	{
		"name": "Guiding Bolt",
		"type": "level1spell",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Hail of Thorns",
		"type": "level1spell",
		"tags": [
			"ranger"
		]
	},
	{
		"name": "Healing Word",
		"type": "level1spell",
		"tags": [
			"bard",
			"cleric",
			"druid"
		]
	},
	{
		"name": "Hellish Rebuke",
		"type": "level1spell",
		"tags": [
			"warlock"
		]
	},
	{
		"name": "Heroism",
		"type": "level1spell",
		"tags": [
			"bard",
			"paladin"
		]
	},
	{
		"name": "Hex",
		"type": "level1spell",
		"tags": [
			"warlock"
		]
	},
	{
		"name": "Hunter's Mark",
		"type": "level1spell",
		"tags": [
			"ranger"
		]
	},
	{
		"name": "Ice Knife",
		"type": "level1spell",
		"tags": [
			"druid",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Identify",
		"type": "level1spell",
		"tags": [
			"bard",
			"wizard"
		]
	},
	{
		"name": "Illusory Script",
		"type": "level1spell",
		"tags": [
			"bard",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Inflict Wounds",
		"type": "level1spell",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Jump",
		"type": "level1spell",
		"tags": [
			"druid",
			"ranger",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Light",
		"type": "cantrip",
		"tags": [
			"bard",
			"cleric",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Longstrider",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid",
			"ranger",
			"wizard"
		]
	},
	{
		"name": "Mage Armor",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Mage Hand",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Magic Missile",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Mending",
		"type": "cantrip",
		"tags": [
			"bard",
			"cleric",
			"druid",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Message",
		"type": "cantrip",
		"tags": [
			"bard",
			"druid",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Mind Sliver",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Minor Illusion",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Poison Spray",
		"type": "cantrip",
		"tags": [
			"druid",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Prestidigitation",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Produce Flame",
		"type": "cantrip",
		"tags": [
			"druid"
		]
	},
	{
		"name": "Protection from Evil and Good",
		"type": "level1spell",
		"tags": [
			"cleric",
			"druid",
			"paladin",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Purify Food and Drink",
		"type": "level1spell",
		"tags": [
			"cleric",
			"druid",
			"paladin"
		]
	},
	{
		"name": "Ray of Frost",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Ray of Sickness",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Resistance",
		"type": "cantrip",
		"tags": [
			"cleric",
			"druid"
		]
	},
	{
		"name": "Sacred Flame",
		"type": "cantrip",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Sanctuary",
		"type": "level1spell",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Searing Smite",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	},
	{
		"name": "Shield",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Shield of Faith",
		"type": "level1spell",
		"tags": [
			"cleric",
			"paladin"
		]
	},
	{
		"name": "Shillelagh",
		"type": "cantrip",
		"tags": [
			"druid"
		]
	},
	{
		"name": "Shocking Grasp",
		"type": "cantrip",
		"tags": [
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Silent Image",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Sleep",
		"type": "level1spell",
		"tags": [
			"bard",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Sorcerous Burst",
		"type": "cantrip",
		"tags": [
			"sorcerer"
		]
	},
	{
		"name": "Spare the Dying",
		"type": "cantrip",
		"tags": [
			"cleric",
			"druid"
		]
	},
	{
		"name": "Speak with Animals",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid",
			"ranger",
			"warlock"
		]
	},
	{
		"name": "Starry Wisp",
		"type": "cantrip",
		"tags": [
			"bard",
			"druid"
		]
	},
	{
		"name": "Tasha's Hideous Laughter",
		"type": "level1spell",
		"tags": [
			"bard",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Tenser's Floating Disk",
		"type": "level1spell",
		"tags": [
			"wizard"
		]
	},
	{
		"name": "Thaumaturgy",
		"type": "cantrip",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Thorn Whip",
		"type": "cantrip",
		"tags": [
			"druid"
		]
	},
	{
		"name": "Thunderclap",
		"type": "cantrip",
		"tags": [
			"bard",
			"druid",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Thunderous Smite",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	},
	{
		"name": "Thunderwave",
		"type": "level1spell",
		"tags": [
			"bard",
			"druid",
			"sorcerer",
			"wizard"
		]
	},
	{
		"name": "Toll the Dead",
		"type": "cantrip",
		"tags": [
			"cleric",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "True Strike",
		"type": "cantrip",
		"tags": [
			"bard",
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Unseen Servant",
		"type": "level1spell",
		"tags": [
			"bard",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Vicious Mockery",
		"type": "cantrip",
		"tags": [
			"bard"
		]
	},
	{
		"name": "Witch Bolt",
		"type": "level1spell",
		"tags": [
			"sorcerer",
			"warlock",
			"wizard"
		]
	},
	{
		"name": "Word of Radiance",
		"type": "cantrip",
		"tags": [
			"cleric"
		]
	},
	{
		"name": "Wrathful Smite",
		"type": "level1spell",
		"tags": [
			"paladin"
		]
	}
];

const BACKGROUNDS = {
	"Acolyte": {
		"fixed": [
			"Insight",
			"Religion",
			"Calligrapher's Supplies"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Magic Initiate",
		"magicInitiate": {
			"lists": [
				"Cleric"
			]
		}
	},
	"Artisan": {
		"fixed": [
			"Investigation",
			"Persuasion"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"artisanTool"
						]
					}
				}
			}
		],
		"originFeat": "Crafter"
	},
	"Charlatan": {
		"fixed": [
			"Deception",
			"Sleight of Hand",
			"Forgery Kit"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Skilled"
	},
	"Criminal": {
		"fixed": [
			"Stealth",
			"Sleight of Hand",
			"Thieves' Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Alert"
	},
	"Entertainer": {
		"fixed": [
			"Acrobatics",
			"Performance"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"instrument"
						]
					}
				}
			}
		],
		"originFeat": "Musician"
	},
	"Farmer": {
		"fixed": [
			"Animal Handling",
			"Nature",
			"Carpenter's Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Tough"
	},
	"Guard": {
		"fixed": [
			"Athletics",
			"Perception"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"gamingSet"
						]
					}
				}
			}
		],
		"originFeat": "Alert"
	},
	"Guide": {
		"fixed": [
			"Stealth",
			"Survival",
			"Cartographer's Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Magic Initiate",
		"magicInitiate": {
			"lists": [
				"Druid"
			]
		}
	},
	"Hermit": {
		"fixed": [
			"Medicine",
			"Religion",
			"Herbalism Kit"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Healer"
	},
	"Merchant": {
		"fixed": [
			"Animal Handling",
			"Persuasion",
			"Navigator's Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Lucky"
	},
	"Noble": {
		"fixed": [
			"History",
			"Persuasion"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"gamingSet"
						]
					}
				}
			}
		],
		"originFeat": "Skilled"
	},
	"Sage": {
		"fixed": [
			"Arcana",
			"History",
			"Calligrapher's Supplies"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Magic Initiate",
		"magicInitiate": {
			"lists": [
				"Wizard"
			]
		}
	},
	"Sailor": {
		"fixed": [
			"Acrobatics",
			"Perception",
			"Navigator's Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Tavern Brawler"
	},
	"Scribe": {
		"fixed": [
			"Investigation",
			"Perception",
			"Calligrapher's Supplies"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Skilled"
	},
	"Soldier": {
		"fixed": [
			"Athletics",
			"Intimidation"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"gamingSet"
						]
					}
				}
			}
		],
		"originFeat": "Savage Attacker"
	},
	"Wayfarer": {
		"fixed": [
			"Insight",
			"Stealth",
			"Thieves' Tools"
		],
		"modifiers": {
			"startingEquipment": 2,
			"abilityScores": 7
		},
		"originFeat": "Lucky"
	}
};

const RACES = {
	"Aarakocra": {},
	"Aasimar": {
		"fixed": [
			"Light"
		],
		"modifiers": {
			"size": 2
		}
	},
	"Bugbear": {
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"bugbear"
						]
					}
				}
			}
		]
	},
	"Centaur": {
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"centaur"
						]
					}
				}
			}
		]
	},
	"Changeling": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"changeling"
						]
					}
				}
			}
		]
	},
	"Deep Gnome": {},
	"Gnome": {
		"dynamic": {
			"choiceBranches": [
				{
					"name": "Forest",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"fixed": [
						"Minor Illusion",
						"Speak with Animals"
					]
				},
				{
					"name": "Rock",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"fixed": [
						"Mending",
						"Prestidigitation"
					]
				}
			]
		}
	},
	"Dragonborn": {
		"modifiers": {
			"subtype": 10
		}
	},
	"Duergar": {},
	"Dwarf": {},
	"Eladrin": {
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"eladrin"
						]
					}
				}
			}
		]
	},
	"Elf": {
		"modifiers": {
			"spellcastingAbility": 3
		},
		"dynamic": {
			"choiceBranches": [
				{
					"name": "Drow",
					"fixed": [
						"Dancing Lights"
					],
					"choices": [
						{
							"count": 1,
							"from": {
								"type": "proficiency",
								"tags": {
									"all": [
										"skill",
										"elfDrow"
									]
								}
							}
						}
					]
				},
				{
					"name": "High",
					"fixed": [
						"Prestidigitation"
					],
					"choices": [
						{
							"count": 1,
							"from": {
								"type": "proficiency",
								"tags": {
									"all": [
										"skill",
										"elfHigh"
									]
								}
							}
						}
					]
				},
				{
					"name": "Wood",
					"fixed": [
						"Druidcraft"
					],
					"choices": [
						{
							"count": 1,
							"from": {
								"type": "proficiency",
								"tags": {
									"all": [
										"skill",
										"elfWood"
									]
								}
							}
						}
					]
				}
			]
		}
	},
	"Fairy": {
		"fixed": [
			"Druidcraft"
		],
		"modifiers": {
			"spellcastingAbility": 3
		}
	},
	"Firbolg": {
		"fixed": [
			"Detect Magic",
			"Disguise Self"
		],
		"modifiers": {
			"spellcastingAbility": 3
		}
	},
	"Genasi": {
		"modifiers": {
			"size": 2,
			"spellcastingAbility": 3
		},
		"dynamic": {
			"choiceBranches": [
				{
					"name": "Air",
					"fixed": [
						"Shocking Grasp"
					]
				},
				{
					"name": "Earth",
					"fixed": [
						"Blade Ward"
					]
				},
				{
					"name": "Fire",
					"fixed": [
						"Produce Flame"
					]
				},
				{
					"name": "Water",
					"fixed": [
						"Acid Splash"
					]
				}
			]
		}
	},
	"Githyanki": {
		"fixed": [
			"Mage Hand"
		],
		"modifiers": {
			"spellcastingAbility": 3
		}
	},
	"Githzerai": {
		"fixed": [
			"Mage Hand"
		],
		"modifiers": {
			"spellcastingAbility": 3
		}
	},
	"Goblin": {},
	"Goliath": {
		"modifiers": {
			"subtype": 6
		}
	},
	"Halfling": {},
	"Harengon": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"harengon"
						]
					}
				}
			}
		]
	},
	"Hobgoblin": {},
	"Human": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"skill"
						]
					}
				}
			}
		],
		"dynamic": {
			"originFeatChoice": {
				"options": [
					"Alert",
					"Crafter",
					"Healer",
					"Lucky",
					"Magic Initiate",
					"Musician",
					"Savage Attacker",
					"Skilled",
					"Tavern Brawler",
					"Tough"
				],
				"skilledOption": "Skilled",
				"musicianOption": "Musician",
				"crafterOption": "Crafter",
				"magicInitiateOption": "Magic Initiate"
			}
		}
	},
	"Kenku": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"skill"
						]
					}
				}
			}
		]
	},
	"Kobold": {
		"dynamic": {
			"choiceBranches": [
				{
					"name": "Craftiness",
					"choices": [
						{
							"count": 1,
							"from": {
								"type": "proficiency",
								"tags": {
									"all": [
										"skill",
										"koboldCraftiness"
									]
								}
							}
						}
					]
				},
				{
					"name": "Defiance"
				},
				{
					"name": "Sorcery",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"choices": [
						{
							"count": 1,
							"from": {
								"names": [
									"Acid Splash",
									"Blade Ward",
									"Chill Touch",
									"Dancing Lights",
									"Elementalism",
									"Fire Bolt",
									"Friends",
									"Light",
									"Mage Hand",
									"Mending",
									"Message",
									"Mind Sliver",
									"Minor Illusion",
									"Poison Spray",
									"Prestidigitation",
									"Ray of Frost",
									"Shocking Grasp",
									"Sorcerous Burst",
									"Thunderclap",
									"True Strike"
								]
							}
						}
					]
				}
			]
		}
	},
	"Lizardfolk": {
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"lizardfolk"
						]
					}
				}
			}
		]
	},
	"Minotaur": {},
	"Orc": {},
	"Satyr": {
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"satyr"
						]
					}
				}
			},
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"instrument"
						]
					}
				}
			}
		]
	},
	"SeaElf": {
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"seaElf"
						]
					}
				}
			}
		]
	},
	"ShadarKai": {
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"shadarKai"
						]
					}
				}
			}
		]
	},
	"Shifter": {
		"modifiers": {
			"subtype": 4
		},
		"choices": [
			{
				"count": 1,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"shifter"
						]
					}
				}
			}
		]
	},
	"Tabaxi": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"tabaxi"
						]
					}
				}
			}
		]
	},
	"Tiefling": {
		"fixed": [
			"Thaumaturgy"
		],
		"modifiers": {
			"size": 2
		},
		"dynamic": {
			"choiceBranches": [
				{
					"name": "Abyssal",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"fixed": [
						"Poison Spray"
					]
				},
				{
					"name": "Chthonic",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"fixed": [
						"Chill Touch"
					]
				},
				{
					"name": "Infernal",
					"modifiers": {
						"spellcastingAbility": 3
					},
					"fixed": [
						"Fire Bolt"
					]
				}
			]
		}
	},
	"Tortle": {
		"modifiers": {
			"size": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"skill",
							"tortle"
						]
					}
				}
			}
		]
	},
	"Triton": {
		"fixed": [
			"Fog Cloud"
		],
		"modifiers": {
			"spellcastingAbility": 3
		}
	},
	"Yuan-ti": {
		"fixed": [
			"Poison Spray"
		],
		"modifiers": {
			"size": 2,
			"spellcastingAbility": 3
		}
	}
};

const CLASSES = {
	"Barbarian": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"barbarian"
						]
					}
				}
			}
		]
	},
	"Bard": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 3,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"skill"
						]
					}
				}
			},
			{
				"count": 3,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"instrument"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"bard"
						]
					}
				}
			},
			{
				"count": 4,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"bard"
						]
					}
				}
			}
		]
	},
	"Cleric": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"cleric"
						]
					}
				}
			},
			{
				"count": 3,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"cleric"
						]
					}
				}
			},
			{
				"count": 4,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"cleric"
						]
					}
				}
			}
		],
		"dynamic": {
			"spellChoiceBranches": [
				{
					"name": "Protector Order"
				},
				{
					"name": "Thaumaturge Order",
					"extraCantrips": {
						"count": 1
					}
				}
			]
		}
	},
	"Druid": {
		"fixed": [
			"Herbalism Kit",
			"Speak with Animals"
		],
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"druid"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"druid"
						]
					}
				}
			},
			{
				"count": 4,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"druid"
						]
					}
				}
			}
		],
		"dynamic": {
			"spellChoiceBranches": [
				{
					"name": "Warden Order"
				},
				{
					"name": "Magician Order",
					"extraCantrips": {
						"count": 1
					}
				}
			]
		}
	},
	"Fighter": {
		"modifiers": {
			"startingEquipment": 3,
			"primaryAbilities": 2,
			"fightingStyles": 10
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"fighter"
						]
					}
				}
			}
		]
	},
	"Monk": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
							"monk"
						]
					}
				}
			},
			{
				"count": 1,
				"from": {
					"tags": {
						"any": [
							"artisanTool",
							"instrument"
						]
					}
				}
			}
		]
	},
	"Paladin": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"paladin"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"paladin"
						]
					}
				}
			}
		]
	},
	"Ranger": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 3,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"ranger"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"ranger"
						]
					}
				}
			}
		]
	},
	"Rogue": {
		"modifiers": {
			"startingEquipment": 2,
			"languages": 15
		},
		"choices": [
			{
				"count": 4,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"rogue"
						]
					}
				}
			}
		],
		"dynamic": {
			"expertise": {
				"count": 2
			}
		}
	},
	"Sorcerer": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"sorcerer"
						]
					}
				}
			},
			{
				"count": 4,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"sorcerer"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"sorcerer"
						]
					}
				}
			}
		]
	},
	"Warlock": {
		"modifiers": {
			"startingEquipment": 2,
			"classOrders": 5
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"warlock"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"warlock"
						]
					}
				}
			},
			{
				"count": 2,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"warlock"
						]
					}
				}
			}
		],
	},
	"Wizard": {
		"modifiers": {
			"startingEquipment": 2
		},
		"choices": [
			{
				"count": 2,
				"from": {
					"type": "proficiency",
					"tags": {
						"all": [
						"wizard"
						]
					}
				}
			},
			{
				"count": 3,
				"from": {
					"type": "cantrip",
					"tags": {
						"all": [
							"wizard"
						]
					}
				}
			},
			{
				"count": 6,
				"from": {
					"type": "level1spell",
					"tags": {
						"all": [
							"wizard"
						]
					}
				}
			}
		]
	}
};

const GLOBALS = {
	"languageChoices": {
		"count": 2,
		"from": {
			"type": "language",
			"exclude": [
				"Common"
			]
		}
	},
	"pointBuyWeight": 12282,
	"rolledAbilityScoreWeight": 16 ** 6
};

function hasEveryTag(attribute, tags) {
	return (tags || []).every(tag => attribute.tags.includes(tag));
}

function hasAnyTag(attribute, tags) {
	return !tags?.length || tags.some(tag => attribute.tags.includes(tag));
}

function matchesFilter(attribute, filter) {
	if (!filter) return true;
	if (filter.names && !filter.names.includes(attribute.name)) return false;
	if (filter.exclude && filter.exclude.includes(attribute.name)) return false;
	if (filter.type && attribute.type !== filter.type) return false;
	if (filter.types && !filter.types.includes(attribute.type)) return false;
	if (Array.isArray(filter.tags) && !hasEveryTag(attribute, filter.tags)) return false;
	if (filter.tags?.all && !hasEveryTag(attribute, filter.tags.all)) return false;
	if (filter.tags?.any && !hasAnyTag(attribute, filter.tags.any)) return false;
	if (filter.tagsAny && !hasAnyTag(attribute, filter.tagsAny)) return false;
	return true;
}

function getAttributes(filter) {
	return ATTRIBUTES.filter(attribute => matchesFilter(attribute, filter));
}
