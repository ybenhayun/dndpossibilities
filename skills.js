// skills.js
// Tagged-data schema for the default counting engine.

const ATTRIBUTES = [
	{
		name: "Acrobatics",
		type: "skill",
		tags: ["fighter", "kender", "monk", "rogue", "shifter"]
	},
	{
		name: "Animal Handling",
		type: "skill",
		tags: ["barbarian", "centaur", "druid", "fighter", "lizardfolk", "ranger", "tortle"]
	},
	{
		name: "Arcana",
		type: "skill",
		tags: ["druid", "koboldCraftiness", "sorcerer", "vedalken", "warlock", "wizard"]
	},
	{
		name: "Athletics",
		type: "skill",
		tags: ["barbarian", "fighter", "locathah", "monk", "paladin", "ranger", "rogue", "shifter"]
	},
	{
		name: "Deception",
		type: "skill",
		tags: ["changeling", "rogue", "sorcerer", "warlock"]
	},
	{
		name: "History",
		type: "skill",
		tags: ["cleric", "fighter", "monk", "vedalken", "warlock", "wizard"]
	},
	{
		name: "Insight",
		type: "skill",
		tags: [
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
			"sorcerer",
			"wizard"
		]
	},
	{
		name: "Intimidation",
		type: "skill",
		tags: ["barbarian", "changeling", "fighter", "paladin", "rogue", "shifter", "sorcerer", "warlock"]
	},
	{
		name: "Investigation",
		type: "skill",
		tags: ["koboldCraftiness", "kender", "ranger", "rogue", "vedalken", "warlock", "wizard"]
	},
	{
		name: "Medicine",
		type: "skill",
		tags: ["centaur", "cleric", "druid", "koboldCraftiness", "lizardfolk", "paladin", "tortle", "vedalken", "wizard"]
	},
	{
		name: "Nature",
		type: "skill",
		tags: ["barbarian", "centaur", "druid", "lizardfolk", "ranger", "tortle", "warlock"]
	},
	{
		name: "Perception",
		type: "skill",
		tags: [
			"astralElf",
			"barbarian",
			"druid",
			"eladrin",
			"elfDrow",
			"elfHigh",
			"elfWood",
			"fighter",
			"harengon",
			"lizardfolk",
			"locathah",
			"ranger",
			"rogue",
			"seaElf",
			"shadarKai",
			"tabaxi",
			"tortle"
		]
	},
	{
		name: "Performance",
		type: "skill",
		tags: ["changeling", "rogue", "satyr", "vedalken"]
	},
	{
		name: "Persuasion",
		type: "skill",
		tags: ["changeling", "cleric", "paladin", "rogue", "satyr", "sorcerer", "verdan"]
	},
	{
		name: "Religion",
		type: "skill",
		tags: ["cleric", "druid", "monk", "paladin", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Sleight of Hand",
		type: "skill",
		tags: ["koboldCraftiness", "kender", "rogue", "vedalken"]
	},
	{
		name: "Stealth",
		type: "skill",
		tags: ["bugbear", "kender", "lizardfolk", "monk", "ranger", "rogue", "tabaxi", "tortle"]
	},
	{
		name: "Survival",
		type: "skill",
		tags: [
			"barbarian",
			"centaur",
			"druid",
			"elfDrow",
			"elfHigh",
			"elfWood",
			"fighter",
			"koboldCraftiness",
			"kender",
			"lizardfolk",
			"ranger",
			"shifter",
			"tortle"
		]
	},
	{
		name: "Alchemist's Supplies",
		type: "artisanTool"
	},
	{
		name: "Brewer's Supplies",
		type: "artisanTool"
	},
	{
		name: "Calligrapher's Supplies",
		type: "artisanTool"
	},
	{
		name: "Carpenter's Tools",
		type: "artisanTool"
	},
	{
		name: "Cartographer's Tools",
		type: "artisanTool"
	},
	{
		name: "Cobbler's Tools",
		type: "artisanTool"
	},
	{
		name: "Cook's Utensils",
		type: "artisanTool"
	},
	{
		name: "Glassblower's Tools",
		type: "artisanTool"
	},
	{
		name: "Jeweler's Tools",
		type: "artisanTool"
	},
	{
		name: "Leatherworker's Tools",
		type: "artisanTool"
	},
	{
		name: "Mason's Tools",
		type: "artisanTool"
	},
	{
		name: "Painter's Supplies",
		type: "artisanTool"
	},
	{
		name: "Potter's Tools",
		type: "artisanTool"
	},
	{
		name: "Smith's Tools",
		type: "artisanTool"
	},
	{
		name: "Tinker's Tools",
		type: "artisanTool"
	},
	{
		name: "Weaver's Tools",
		type: "artisanTool"
	},
	{
		name: "Woodcarver's Tools",
		type: "artisanTool"
	},
	{
		name: "Disguise Kit",
		type: "kit"
	},
	{
		name: "Forgery Kit",
		type: "kit"
	},
	{
		name: "Herbalism Kit",
		type: "kit"
	},
	{
		name: "Navigator's Tools",
		type: "kit"
	},
	{
		name: "Poisoner's Kit",
		type: "kit"
	},
	{
		name: "Thieves' Tools",
		type: "kit"
	},
	{
		name: "Dice Set",
		type: "gamingSet"
	},
	{
		name: "Dragonchess Set",
		type: "gamingSet"
	},
	{
		name: "Playing Card Set",
		type: "gamingSet"
	},
	{
		name: "Three-Dragon Ante Set",
		type: "gamingSet"
	},
	{
		name: "Bagpipes",
		type: "instrument"
	},
	{
		name: "Drum",
		type: "instrument"
	},
	{
		name: "Dulcimer",
		type: "instrument"
	},
	{
		name: "Flute",
		type: "instrument"
	},
	{
		name: "Horn",
		type: "instrument"
	},
	{
		name: "Lute",
		type: "instrument"
	},
	{
		name: "Lyre",
		type: "instrument"
	},
	{
		name: "Pan Flute",
		type: "instrument"
	},
	{
		name: "Shawm",
		type: "instrument"
	},
	{
		name: "Viol",
		type: "instrument"
	},
	{
		name: "Common",
		type: "standardLanguage"
	},
	{
		name: "Sign Language",
		type: "standardLanguage"
	},
	{
		name: "Draconic",
		type: "standardLanguage"
	},
	{
		name: "Dwarvish",
		type: "standardLanguage"
	},
	{
		name: "Elvish",
		type: "standardLanguage"
	},
	{
		name: "Giant",
		type: "standardLanguage"
	},
	{
		name: "Gnomish",
		type: "standardLanguage"
	},
	{
		name: "Goblin",
		type: "standardLanguage"
	},
	{
		name: "Halfling",
		type: "standardLanguage"
	},
	{
		name: "Orc",
		type: "standardLanguage"
	},
	{
		name: "Abyssal",
		type: "rareLanguage"
	},
	{
		name: "Celestial",
		type: "rareLanguage"
	},
	{
		name: "Deep Speech",
		type: "rareLanguage"
	},
	{
		name: "Druidic",
		type: "rareLanguage"
	},
	{
		name: "Infernal",
		type: "rareLanguage"
	},
	{
		name: "Primordial",
		type: "rareLanguage"
	},
	{
		name: "Sylvan",
		type: "rareLanguage"
	},
	{
		name: "Thieves' Cant",
		type: "rareLanguage"
	},
	{
		name: "Undercommon",
		type: "rareLanguage"
	},
	{
		name: "Alert",
		type: "originFeat"
	},
	{
		name: "Crafter",
		type: "originFeat"
	},
	{
		name: "Healer",
		type: "originFeat"
	},
	{
		name: "Lucky",
		type: "originFeat"
	},
	{
		name: "Magic Initiate",
		type: "originFeat"
	},
	{
		name: "Musician",
		type: "originFeat"
	},
	{
		name: "Savage Attacker",
		type: "originFeat"
	},
	{
		name: "Skilled",
		type: "originFeat"
	},
	{
		name: "Tavern Brawler",
		type: "originFeat"
	},
	{
		name: "Tough",
		type: "originFeat"
	},
	{
		name: "Acid Splash",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Alarm",
		type: "level1spell",
		tags: ["ranger", "wizard"]
	},
	{
		name: "Animal Friendship",
		type: "level1spell",
		tags: ["bard", "druid", "ranger"]
	},
	{
		name: "Armor of Agathys",
		type: "level1spell",
		tags: ["warlock"]
	},
	{
		name: "Arms of Hadar",
		type: "level1spell",
		tags: ["warlock"]
	},
	{
		name: "Bane",
		type: "level1spell",
		tags: ["bard", "cleric", "warlock"]
	},
	{
		name: "Blade Ward",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Bless",
		type: "level1spell",
		tags: ["cleric", "paladin"]
	},
	{
		name: "Burning Hands",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Charm Person",
		type: "level1spell",
		tags: ["bard", "druid", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Chill Touch",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Chromatic Orb",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Color Spray",
		type: "level1spell",
		tags: ["bard", "sorcerer", "wizard"]
	},
	{
		name: "Command",
		type: "level1spell",
		tags: ["bard", "cleric", "paladin"]
	},
	{
		name: "Compelled Duel",
		type: "level1spell",
		tags: ["paladin"]
	},
	{
		name: "Comprehend Languages",
		type: "level1spell",
		tags: ["bard", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Create or Destroy Water",
		type: "level1spell",
		tags: ["cleric", "druid"]
	},
	{
		name: "Cure Wounds",
		type: "level1spell",
		tags: ["bard", "cleric", "druid", "paladin", "ranger"]
	},
	{
		name: "Dancing Lights",
		type: "cantrip",
		tags: ["astralElf", "bard", "koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Detect Evil and Good",
		type: "level1spell",
		tags: ["cleric", "paladin"]
	},
	{
		name: "Detect Magic",
		type: "level1spell",
		tags: ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Detect Poison and Disease",
		type: "level1spell",
		tags: ["cleric", "druid", "paladin", "ranger"]
	},
	{
		name: "Disguise Self",
		type: "level1spell",
		tags: ["bard", "sorcerer", "wizard"]
	},
	{
		name: "Dissonant Whispers",
		type: "level1spell",
		tags: ["bard"]
	},
	{
		name: "Divine Favor",
		type: "level1spell",
		tags: ["paladin"]
	},
	{
		name: "Divine Smite",
		type: "level1spell",
		tags: ["paladin"]
	},
	{
		name: "Druidcraft",
		type: "cantrip",
		tags: ["druid"]
	},
	{
		name: "Eldritch Blast",
		type: "cantrip",
		tags: ["warlock"]
	},
	{
		name: "Elementalism",
		type: "cantrip",
		tags: ["druid", "koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Ensnaring Strike",
		type: "level1spell",
		tags: ["ranger"]
	},
	{
		name: "Entangle",
		type: "level1spell",
		tags: ["druid", "ranger"]
	},
	{
		name: "Expeditious Retreat",
		type: "level1spell",
		tags: ["sorcerer", "warlock", "wizard"]
	},
	{
		name: "Faerie Fire",
		type: "level1spell",
		tags: ["bard", "druid"]
	},
	{
		name: "False Life",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Feather Fall",
		type: "level1spell",
		tags: ["bard", "sorcerer", "wizard"]
	},
	{
		name: "Find Familiar",
		type: "level1spell",
		tags: ["wizard"]
	},
	{
		name: "Fire Bolt",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Fog Cloud",
		type: "level1spell",
		tags: ["druid", "ranger", "sorcerer", "wizard"]
	},
	{
		name: "Friends",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Goodberry",
		type: "level1spell",
		tags: ["druid", "ranger"]
	},
	{
		name: "Grease",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Guidance",
		type: "cantrip",
		tags: ["cleric", "druid"]
	},
	{
		name: "Guiding Bolt",
		type: "level1spell",
		tags: ["cleric"]
	},
	{
		name: "Hail of Thorns",
		type: "level1spell",
		tags: ["ranger"]
	},
	{
		name: "Healing Word",
		type: "level1spell",
		tags: ["bard", "cleric", "druid"]
	},
	{
		name: "Hellish Rebuke",
		type: "level1spell",
		tags: ["warlock"]
	},
	{
		name: "Heroism",
		type: "level1spell",
		tags: ["bard", "paladin"]
	},
	{
		name: "Hex",
		type: "level1spell",
		tags: ["warlock"]
	},
	{
		name: "Hunter's Mark",
		type: "level1spell",
		tags: ["ranger"]
	},
	{
		name: "Ice Knife",
		type: "level1spell",
		tags: ["druid", "sorcerer", "wizard"]
	},
	{
		name: "Identify",
		type: "level1spell",
		tags: ["bard", "wizard"]
	},
	{
		name: "Illusory Script",
		type: "level1spell",
		tags: ["bard", "warlock", "wizard"]
	},
	{
		name: "Inflict Wounds",
		type: "level1spell",
		tags: ["cleric"]
	},
	{
		name: "Jump",
		type: "level1spell",
		tags: ["druid", "ranger", "sorcerer", "wizard"]
	},
	{
		name: "Light",
		type: "cantrip",
		tags: ["astralElf", "bard", "cleric", "koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Longstrider",
		type: "level1spell",
		tags: ["bard", "druid", "ranger", "wizard"]
	},
	{
		name: "Mage Armor",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Mage Hand",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Magic Missile",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Mending",
		type: "cantrip",
		tags: ["bard", "cleric", "druid", "koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Message",
		type: "cantrip",
		tags: ["bard", "druid", "koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Mind Sliver",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Minor Illusion",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Poison Spray",
		type: "cantrip",
		tags: ["druid", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Prestidigitation",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Produce Flame",
		type: "cantrip",
		tags: ["druid"]
	},
	{
		name: "Protection from Evil and Good",
		type: "level1spell",
		tags: ["cleric", "druid", "paladin", "warlock", "wizard"]
	},
	{
		name: "Purify Food and Drink",
		type: "level1spell",
		tags: ["cleric", "druid", "paladin"]
	},
	{
		name: "Ray of Frost",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Ray of Sickness",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Resistance",
		type: "cantrip",
		tags: ["cleric", "druid"]
	},
	{
		name: "Sacred Flame",
		type: "cantrip",
		tags: ["astralElf", "cleric"]
	},
	{
		name: "Sanctuary",
		type: "level1spell",
		tags: ["cleric"]
	},
	{
		name: "Searing Smite",
		type: "level1spell",
		tags: ["paladin"]
	},
	{
		name: "Shield",
		type: "level1spell",
		tags: ["sorcerer", "wizard"]
	},
	{
		name: "Shield of Faith",
		type: "level1spell",
		tags: ["cleric", "paladin"]
	},
	{
		name: "Shillelagh",
		type: "cantrip",
		tags: ["druid"]
	},
	{
		name: "Shocking Grasp",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer", "wizard"]
	},
	{
		name: "Silent Image",
		type: "level1spell",
		tags: ["bard", "sorcerer", "wizard"]
	},
	{
		name: "Sleep",
		type: "level1spell",
		tags: ["bard", "sorcerer", "wizard"]
	},
	{
		name: "Sorcerous Burst",
		type: "cantrip",
		tags: ["koboldSorcery", "sorcerer"]
	},
	{
		name: "Spare the Dying",
		type: "cantrip",
		tags: ["cleric", "druid"]
	},
	{
		name: "Speak with Animals",
		type: "level1spell",
		tags: ["bard", "druid", "ranger", "warlock"]
	},
	{
		name: "Starry Wisp",
		type: "cantrip",
		tags: ["bard", "druid"]
	},
	{
		name: "Tasha's Hideous Laughter",
		type: "level1spell",
		tags: ["bard", "warlock", "wizard"]
	},
	{
		name: "Tenser's Floating Disk",
		type: "level1spell",
		tags: ["wizard"]
	},
	{
		name: "Thaumaturgy",
		type: "cantrip",
		tags: ["cleric"]
	},
	{
		name: "Thorn Whip",
		type: "cantrip",
		tags: ["druid"]
	},
	{
		name: "Thunderclap",
		type: "cantrip",
		tags: ["bard", "druid", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Thunderous Smite",
		type: "level1spell",
		tags: ["paladin"]
	},
	{
		name: "Thunderwave",
		type: "level1spell",
		tags: ["bard", "druid", "sorcerer", "wizard"]
	},
	{
		name: "Toll the Dead",
		type: "cantrip",
		tags: ["cleric", "warlock", "wizard"]
	},
	{
		name: "True Strike",
		type: "cantrip",
		tags: ["bard", "koboldSorcery", "sorcerer", "warlock", "wizard"]
	},
	{
		name: "Unseen Servant",
		type: "level1spell",
		tags: ["bard", "warlock", "wizard"]
	},
	{
		name: "Vicious Mockery",
		type: "cantrip",
		tags: ["bard"]
	},
	{
		name: "Witch Bolt",
		type: "level1spell",
		tags: ["sorcerer", "warlock", "wizard"]
	},
	{
		name: "Word of Radiance",
		type: "cantrip",
		tags: ["cleric"]
	},
	{
		name: "Wrathful Smite",
		type: "level1spell",
		tags: ["paladin"]
	}
];

const BACKGROUNDS = {
	"Acolyte": {
		fixed: ["Insight", "Religion", "Calligrapher's Supplies"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7,
			spellcastingAbility: 3
		},
		originFeat: "Magic Initiate:Cleric"
	},
	"Artisan": {
		fixed: ["Investigation", "Persuasion"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		choices: [
			{
				count: 1,
				all: ["artisanTool"]
			}
		],
		originFeat: "Crafter"
	},
	"Charlatan": {
		fixed: ["Deception", "Sleight of Hand", "Forgery Kit"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Skilled"
	},
	"Criminal": {
		fixed: ["Stealth", "Sleight of Hand", "Thieves' Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Alert"
	},
	"Entertainer": {
		fixed: ["Acrobatics", "Performance"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		choices: [
			{
				count: 1,
				all: ["instrument"]
			}
		],
		originFeat: "Musician"
	},
	"Farmer": {
		fixed: ["Animal Handling", "Nature", "Carpenter's Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Tough"
	},
	"Guard": {
		fixed: ["Athletics", "Perception"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		choices: [
			{
				count: 1,
				all: ["gamingSet"]
			}
		],
		originFeat: "Alert"
	},
	"Guide": {
		fixed: ["Stealth", "Survival", "Cartographer's Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7,
			spellcastingAbility: 3
		},
		originFeat: "Magic Initiate:Druid"
	},
	"Hermit": {
		fixed: ["Medicine", "Religion", "Herbalism Kit"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Healer"
	},
	"Merchant": {
		fixed: ["Animal Handling", "Persuasion", "Navigator's Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Lucky"
	},
	"Noble": {
		fixed: ["History", "Persuasion"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		choices: [
			{
				count: 1,
				all: ["gamingSet"]
			}
		],
		originFeat: "Skilled"
	},
	"Sage": {
		fixed: ["Arcana", "History", "Calligrapher's Supplies"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7,
			spellcastingAbility: 3
		},
		originFeat: "Magic Initiate:Wizard"
	},
	"Sailor": {
		fixed: ["Acrobatics", "Perception", "Navigator's Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Tavern Brawler"
	},
	"Scribe": {
		fixed: ["Investigation", "Perception", "Calligrapher's Supplies"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Skilled"
	},
	"Soldier": {
		fixed: ["Athletics", "Intimidation"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		choices: [
			{
				count: 1,
				all: ["gamingSet"]
			}
		],
		originFeat: "Savage Attacker"
	},
	"Wayfarer": {
		fixed: ["Insight", "Stealth", "Thieves' Tools"],
		modifiers: {
			startingEquipment: 2,
			abilityScores: 7
		},
		originFeat: "Lucky"
	}
};

const RACES = {
	"Aarakocra": {},
	"Aasimar": {
		fixed: ["Light"],
		modifiers: {
			size: 2
		}
	},
	"Astral Elf": {
		fixed: ["Perception"],
		modifiers: {
			spellcastingAbility: 3
		},
		choices: [
			{
				count: 1,
				all: ["cantrip", "astralElf"]
			}
		]
	},
	"Autognome": {
		choices: [
			{
				count: 2,
				all: ["skill"]
			}
		]
	},
	"Bugbear": {
		fixed: ["Stealth"]
	},
	"Centaur": {
		choices: [
			{
				count: 1,
				all: ["skill", "centaur"]
			}
		]
	},
	"Changeling": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "changeling"]
			}
		]
	},
	"Deep Gnome": {},
	"Dhampir": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill"]
			}
		]
	},
	"Gnome": {
		modifiers: {
			spellcastingAbility: 3
		},
		branches: [
			{
				name: "Forest",
				fixed: ["Minor Illusion", "Speak with Animals"]
			},
			{
				name: "Rock",
				fixed: ["Mending", "Prestidigitation"]
			}
		]
	},
	"Dragonborn": {
		modifiers: {
			subtype: 10
		}
	},
	"Duergar": {},
	"Dwarf": {},
	"Eladrin": {
		fixed: ["Perception"]
	},
	"Elf": {
		modifiers: {
			spellcastingAbility: 3
		},
		branches: [
			{
				name: "Drow",
				fixed: ["Dancing Lights"],
				choices: [
					{
						count: 1,
						all: ["skill", "elfDrow"]
					}
				]
			},
			{
				name: "High",
				fixed: ["Prestidigitation"],
				choices: [
					{
						count: 1,
						all: ["skill", "elfHigh"]
					}
				]
			},
			{
				name: "Wood",
				fixed: ["Druidcraft"],
				choices: [
					{
						count: 1,
						all: ["skill", "elfWood"]
					}
				]
			}
		]
	},
	"Fairy": {
		fixed: ["Druidcraft"],
		modifiers: {
			spellcastingAbility: 3
		}
	},
	"Firbolg": {
		fixed: ["Detect Magic", "Disguise Self"],
		modifiers: {
			spellcastingAbility: 3
		}
	},
	"Genasi": {
		modifiers: {
			size: 2,
			spellcastingAbility: 3
		},
		branches: [
			{
				name: "Air",
				fixed: ["Shocking Grasp"]
			},
			{
				name: "Earth",
				fixed: ["Blade Ward"]
			},
			{
				name: "Fire",
				fixed: ["Produce Flame"]
			},
			{
				name: "Water",
				fixed: ["Acid Splash"]
			}
		]
	},
	"Githyanki": {
		fixed: ["Mage Hand"],
		modifiers: {
			spellcastingAbility: 3
		}
	},
	"Githzerai": {
		fixed: ["Mage Hand"],
		modifiers: {
			spellcastingAbility: 3
		}
	},
	"Giff": {},
	"Goblin": {},
	"Goliath": {
		modifiers: {
			subtype: 6
		}
	},
	"Hadozee": {
		modifiers: {
			size: 2
		}
	},
	"Halfling": {},
	"Harengon": {
		fixed: ["Perception"],
		modifiers: {
			size: 2
		}
	},
	"Hexblood": {
		fixed: ["Disguise Self", "Hex"],
		modifiers: {
			size: 2,
			spellcastingAbility: 3
		},
		choices: [
			{
				count: 2,
				all: ["skill"]
			}
		]
	},
	"Hobgoblin": {},
	"Human": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 1,
				all: ["skill"]
			}
		],
		originFeatChoice: {
			options: [
				"Alert",
				"Crafter",
				"Healer",
				"Lucky",
				"Magic Initiate:Cleric",
				"Magic Initiate:Druid",
				"Magic Initiate:Wizard",
				"Musician",
				"Savage Attacker",
				"Skilled",
				"Tavern Brawler",
				"Tough"
			]
		}
	},
	"Kalashtar": {},
	"Kender": {
		choices: [
			{
				count: 1,
				all: ["skill", "kender"]
			}
		]
	},
	"Kenku": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill"]
			}
		]
	},
	"Khoravar": {
		fixed: ["Friends"],
		modifiers: {
			size: 2,
			spellcastingAbility: 3
		}
	},
	"Kobold": {
		branches: [
			{
				name: "Craftiness",
				choices: [
					{
						count: 1,
						all: ["skill", "koboldCraftiness"]
					}
				]
			},
			{
				name: "Defiance"
			},
			{
				name: "Sorcery",
				modifiers: {
					spellcastingAbility: 3
				},
				choices: [
					{
						count: 1,
						all: ["cantrip", "koboldSorcery"]
					}
				]
			}
		]
	},
	"Lizardfolk": {
		choices: [
			{
				count: 2,
				all: ["skill", "lizardfolk"]
			}
		]
	},
	"Locathah": {
		fixed: ["Athletics", "Perception"]
	},
	"Loxodon": {},
	"Leonin": {},
	"Minotaur": {},
	"Orc": {},
	"Owlin": {
		fixed: ["Stealth"],
		modifiers: {
			size: 2
		}
	},
	"Plasmoid": {
		modifiers: {
			size: 2
		}
	},
	"Reborn": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill"]
			}
		]
	},
	"Satyr": {
		fixed: ["Performance", "Persuasion"],
		choices: [
			{
				count: 1,
				all: ["instrument"]
			}
		]
	},
	"SeaElf": {
		fixed: ["Perception"]
	},
	"ShadarKai": {
		fixed: ["Perception"]
	},
	"Shifter": {
		modifiers: {
			subtype: 4
		},
		choices: [
			{
				count: 1,
				all: ["skill", "shifter"]
			}
		]
	},
	"Simic Hybrid": {
		modifiers: {
			subtype: 3
		}
	},
	"Tabaxi": {
		fixed: ["Perception", "Stealth"],
		modifiers: {
			size: 2
		}
	},
	"Thri-kreen": {
		modifiers: {
			size: 2
		}
	},
	"Tiefling": {
		fixed: ["Thaumaturgy"],
		modifiers: {
			size: 2,
			spellcastingAbility: 3
		},
		branches: [
			{
				name: "Abyssal",
				fixed: ["Poison Spray"]
			},
			{
				name: "Chthonic",
				fixed: ["Chill Touch"]
			},
			{
				name: "Infernal",
				fixed: ["Fire Bolt"]
			}
		]
	},
	"Tortle": {
		modifiers: {
			size: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "tortle"]
			}
		]
	},
	"Triton": {
		fixed: ["Fog Cloud"],
		modifiers: {
			spellcastingAbility: 3
		}
	},
	"Vedalken": {
		choices: [
			{
				count: 1,
				all: ["skill", "vedalken"]
			},
			{
				count: 1,
				all: ["tool"]
			}
		]
	},
	"Verdan": {
		fixed: ["Persuasion"]
	},
	"Warforged": {
		choices: [
			{
				count: 1,
				all: ["skill"]
			},
			{
				count: 1,
				all: ["tool"]
			}
		]
	},
	"Yuan-ti": {
		fixed: ["Poison Spray"],
		modifiers: {
			size: 2,
			spellcastingAbility: 3
		}
	}
};

const CLASSES = {
	"Barbarian": {
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "barbarian"]
			}
		]
	},
	"Bard": {
		modifiers: {
			startingEquipment: 11
		},
		choices: [
			{
				count: 3,
				all: ["skill"]
			},
			{
				count: 3,
				all: ["instrument"]
			},
			{
				count: 2,
				all: ["cantrip", "bard"]
			},
			{
				count: 4,
				all: ["level1spell", "bard"]
			}
		]
	},
	"Cleric": {
		modifiers: {
			startingEquipment: 4
		},
		choices: [
			{
				count: 2,
				all: ["skill", "cleric"]
			},
			{
				count: 3,
				all: ["cantrip", "cleric"]
			},
			{
				count: 4,
				all: ["level1spell", "cleric"]
			}
		],
		branches: [
			{
				name: "Protector Order"
			},
			{
				name: "Thaumaturge Order",
				choices: [
					{
						count: 1,
						all: ["cantrip", "cleric"]
					}
				]
			}
		]
	},
	"Druid": {
		fixed: ["Herbalism Kit", "Speak with Animals"],
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "druid"]
			},
			{
				count: 2,
				all: ["cantrip", "druid"]
			},
			{
				count: 4,
				all: ["level1spell", "druid"]
			}
		],
		branches: [
			{
				name: "Warden Order"
			},
			{
				name: "Magician Order",
				choices: [
					{
						count: 1,
						all: ["cantrip", "druid"]
					}
				]
			}
		]
	},
	"Fighter": {
		modifiers: {
			startingEquipment: 3,
			primaryAbilities: 2,
			fightingStyles: 10
		},
		choices: [
			{
				count: 2,
				all: ["skill", "fighter"]
			}
		]
	},
	"Monk": {
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "monk"]
			},
			{
				count: 1,
				any: ["artisanTool", "instrument"]
			}
		]
	},
	"Paladin": {
		modifiers: {
			startingEquipment: 4
		},
		choices: [
			{
				count: 2,
				all: ["skill", "paladin"]
			},
			{
				count: 2,
				all: ["level1spell", "paladin"]
			}
		]
	},
	"Ranger": {
		fixed: ["Hunter's Mark"],
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 3,
				all: ["skill", "ranger"]
			},
			{
				count: 2,
				all: ["level1spell", "ranger"]
			}
		]
	},
	"Rogue": {
		modifiers: {
			startingEquipment: 2,
			languages: 15
		},
		choices: [
			{
				count: 4,
				all: ["skill", "rogue"]
			}
		],
		expertise: {
			count: 2
		}
	},
	"Sorcerer": {
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "sorcerer"]
			},
			{
				count: 4,
				all: ["cantrip", "sorcerer"]
			},
			{
				count: 2,
				all: ["level1spell", "sorcerer"]
			}
		]
	},
	"Warlock": {
		modifiers: {
			startingEquipment: 2,
			classOrders: 5
		},
		choices: [
			{
				count: 2,
				all: ["skill", "warlock"]
			},
			{
				count: 2,
				all: ["cantrip", "warlock"]
			},
			{
				count: 2,
				all: ["level1spell", "warlock"]
			}
		]
	},
	"Wizard": {
		modifiers: {
			startingEquipment: 2
		},
		choices: [
			{
				count: 2,
				all: ["skill", "wizard"]
			},
			{
				count: 3,
				all: ["cantrip", "wizard"]
			},
			{
				count: 6,
				all: ["level1spell", "wizard"]
			}
		]
	}
};

const GLOBALS = {
	languageChoices: {
		count: 2,
		all: ["standardLanguage"],
		exclude: ["Common"]
	},
	standardAbilityScoreWeight: 720,
	pointBuyWeight: 12282,
	rolledAbilityScoreWeight: 16777216
};
const TYPE_PARENTS = {
	skill: ["proficiency"],
	instrument: ["tool"],
	artisanTool: ["tool"],
	gamingSet: ["tool"],
	kit: ["tool"],
	tool: ["proficiency"],
	standardLanguage: ["language"],
	rareLanguage: ["language"],
	originFeat: ["feat"]
};

function attributeTypes(attribute) {
	if (!attribute) return [];
	let directTypes = attribute.types || (attribute.type ? [attribute.type] : []);
	let out = [];
	function add(type) {
		if (out.includes(type)) return;
		out.push(type);
		for (let parent of TYPE_PARENTS[type] || []) add(parent);
	}
	for (let type of directTypes) add(type);
	return out;
}

function attributeHasTag(attribute, tag) {
	return attributeTypes(attribute).includes(tag) || (attribute.tags || []).includes(tag);
}

function filterAllTags(filter) {
	return Array.isArray(filter?.tags) ? filter.tags : filter?.tags?.all || filter?.all || [];
}

function filterAnyTags(filter) {
	return filter?.tags?.any || filter?.tagsAny || filter?.any || [];
}

function hasEveryTag(attribute, tags) {
	return (tags || []).every(tag => attributeHasTag(attribute, tag));
}

function hasAnyTag(attribute, tags) {
	return !tags?.length || tags.some(tag => attributeHasTag(attribute, tag));
}

function matchesFilter(attribute, filter) {
	if (!filter) return true;
	if (filter.names && !filter.names.includes(attribute.name)) return false;
	if (filter.exclude && filter.exclude.includes(attribute.name)) return false;
	if (filter.type && !attributeHasTag(attribute, filter.type)) return false;
	if (filter.types && !filter.types.every(type => attributeHasTag(attribute, type))) return false;
	if (!hasEveryTag(attribute, filterAllTags(filter))) return false;
	if (!hasAnyTag(attribute, filterAnyTags(filter))) return false;
	return true;
}

function getAttributes(filter) {
	return ATTRIBUTES.filter(attribute => matchesFilter(attribute, filter));
}
