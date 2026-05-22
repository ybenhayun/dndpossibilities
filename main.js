// main.js
// Calculator for skills.js. Counts distinct final character option sets
// from tagged attributes instead of enumerating every row.

const GLOBAL_LANGUAGE_WEIGHT = 36n;
const ORIGIN_FEATS = [
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
];
const REPEATABLE_FEATS = new Set(["Skilled", "Magic Initiate"]);
const MAGIC_INITIATE_LISTS = ["cleric", "druid", "wizard"];

const attributeByName = new Map(ATTRIBUTES.map(attribute => [attribute.name, attribute]));

// SECTION: Shared Constants And Basic Helpers
// Normalizes a Magic Initiate spell-list name for comparisons.
function normalizeMagicInitiateList(list) {
	return String(list).toLowerCase();
}

// Returns the Magic Initiate lists available from a source.
function magicInitiateListsFromSource(source) {
	return (source?.magicInitiate?.lists || MAGIC_INITIATE_LISTS)
		.map(normalizeMagicInitiateList);
}

// Calculates n choose k using BigInt arithmetic.
function choose(n, k) {
	n = BigInt(n);
	k = BigInt(k);
	if (k < 0n || n < 0n || k > n) return 0n;
	if (k > n - k) k = n - k;
	let result = 1n;
	for (let i = 1n; i <= k; i++) {
		result = (result * (n - k + i)) / i;
	}
	return result;
}

// Formats a BigInt-like value with commas.
function format(value) {
	return BigInt(value).toLocaleString("en-US");
}

// Converts a class name into its data tag.
function classTagFor(className) {
	return className ? className.toLowerCase() : "";
}

// Returns a source modifier list with BigInt values.
function modifierEntries(source) {
	return Object.entries(source?.modifiers || {}).map(([label, value]) => ({
		label,
		value: BigInt(value)
	}));
}

// Looks up a selected background, race, or class object.
function sourceByName(collection, name) { return name !== "None" ? collection[name] : null; }

// Checks whether an attribute name is a skill proficiency.
function isSkill(name) {
	let attribute = attributeByName.get(name);
	return attribute?.type === "proficiency" && attribute.tags.includes("skill");
}

// Checks whether an attribute name has a data tag.
function hasTag(name, tag) { return attributeByName.get(name)?.tags.includes(tag); }

// Returns available attribute names matching a filter after fixed exclusions.
function poolNames(filter, fixed = new Set()) {
	return getAttributes(filter).map(attribute => attribute.name).filter(name => !fixed.has(name));
}

// Builds the remaining option pool for a choice after fixed selections.
function choicePool(choice, fixed = new Set()) {
	let rawNames = getAttributes(choice.from).map(attribute => attribute.name);
	let pool = rawNames.filter(name => !fixed.has(name));
	let fixedSkillOverlaps = rawNames.filter(name => fixed.has(name) && isSkill(name)).length;

	if (fixedSkillOverlaps && choice.count === 1 && pool.length === 0) {
		return poolNames({ type: "proficiency", tags: { all: ["skill"] } }, fixed);
	}

	return pool;
}

// SECTION: Choice-Set Counting Core
// Normalizes choice features and removes empty choices.
function activeFeatures(features) {
	return features
		.map(feature => ({
			...feature,
			count: feature.count || 0,
			options: [...new Set(feature.options || [])].sort()
		}))
		.filter(feature => feature.count > 0);
}

// Builds a stable cache key for a set of choice features.
function featureKey(features) {
	return JSON.stringify(
		features.map(feature => ({
			count: feature.count,
			options: [...new Set(feature.options)].sort()
		}))
	);
}

const distinctChoiceCache = new Map();

// Counts distinct final sets produced by overlapping choice features.
function countDistinctChoiceSets(features) {
	let active = activeFeatures(features);

	if (!active.length) return 1n;
	if (active.some(feature => feature.options.length < feature.count)) return 0n;

	let cacheKey = featureKey(active);
	if (distinctChoiceCache.has(cacheKey)) return distinctChoiceCache.get(cacheKey);

	let components = featureComponents(active);
	if (components.length > 1) {
		let product = components.reduce(
			(total, component) => total * countDistinctChoiceSets(component),
			1n
		);
		distinctChoiceCache.set(cacheKey, product);
		return product;
	}

	let total = countDistinctChoiceSetsConnected(active);
	distinctChoiceCache.set(cacheKey, total);
	return total;
}

// Counts one connected overlap component by region masks.
function countDistinctChoiceSetsConnected(active) {
	let totalPickCount = active.reduce((sum, feature) => sum + feature.count, 0);
	let optionMasks = new Map();
	active.forEach((feature, featureIndex) => {
		for (let option of feature.options) {
			optionMasks.set(option, (optionMasks.get(option) || 0) | (1 << featureIndex));
		}
	});

	let regionCounts = new Map();
	for (let mask of optionMasks.values()) {
		regionCounts.set(mask, (regionCounts.get(mask) || 0) + 1);
	}

	let regions = [...regionCounts.entries()];
	let chosenByRegion = [];
	let total = 0n;

	function canAssign(regionIndex, remaining) {
		if (regionIndex === regions.length) return remaining.every(count => count === 0);

		let [mask] = regions[regionIndex];
		let chosen = chosenByRegion[regionIndex] || 0;
		let featureIndexes = active
			.map((_, index) => index)
			.filter(index => mask & (1 << index));

		function distribute(featureOffset, left, nextRemaining) {
			if (featureOffset === featureIndexes.length) {
				return left === 0 && canAssign(regionIndex + 1, nextRemaining);
			}

			let featureIndex = featureIndexes[featureOffset];
			let maxUse = Math.min(left, nextRemaining[featureIndex]);
			for (let use = 0; use <= maxUse; use++) {
				let after = [...nextRemaining];
				after[featureIndex] -= use;
				if (distribute(featureOffset + 1, left - use, after)) return true;
			}
			return false;
		}

		return distribute(0, chosen, [...remaining]);
	}

	function visitRegion(index, picked, ways) {
		if (index === regions.length) {
			if (picked === totalPickCount && canAssign(0, active.map(feature => feature.count))) {
				total += ways;
			}
			return;
		}

		let [, regionSize] = regions[index];
		let maxPick = Math.min(regionSize, totalPickCount - picked);
		for (let pick = 0; pick <= maxPick; pick++) {
			chosenByRegion[index] = pick;
			visitRegion(index + 1, picked + pick, ways * choose(regionSize, pick));
		}
	}

	visitRegion(0, 0, 1n);
	return total;
}

// Counts distinct choices grouped by how many selected items are skills.
function countDistinctChoicesBySkillCount(features) {
	let active = activeFeatures(features);

	if (!active.length) return new Map([[0, 1n]]);
	if (active.some(feature => feature.options.length < feature.count)) return new Map();

	let components = featureComponents(active);
	if (components.length > 1) {
		return components
			.map(component => countDistinctChoicesBySkillCount(component))
			.reduce(convolveSkillCountMaps, new Map([[0, 1n]]));
	}

	let totalPickCount = active.reduce((sum, feature) => sum + feature.count, 0);
	let universe = [...new Set(active.flatMap(feature => feature.options))].sort();
	let regionCounts = new Map();
	for (let name of universe) {
		let mask = 0;
		for (let i = 0; i < active.length; i++) {
			if (active[i].options.includes(name)) mask |= 1 << i;
		}
		let current = regionCounts.get(mask) || { skills: 0, other: 0 };
		if (isSkill(name)) current.skills++;
		else current.other++;
		regionCounts.set(mask, current);
	}

	let regions = [...regionCounts.entries()];
	let chosenByRegion = [];
	let totals = new Map();

	function addTotal(skillCount, ways) {
		totals.set(skillCount, (totals.get(skillCount) || 0n) + ways);
	}

	function canAssign(regionIndex, remaining) {
		if (regionIndex === regions.length) return remaining.every(count => count === 0);

		let [mask] = regions[regionIndex];
		let chosen = chosenByRegion[regionIndex] || 0;
		let featureIndexes = active
			.map((_, index) => index)
			.filter(index => mask & (1 << index));

		function distribute(featureOffset, left, nextRemaining) {
			if (featureOffset === featureIndexes.length) {
				return left === 0 && canAssign(regionIndex + 1, nextRemaining);
			}

			let featureIndex = featureIndexes[featureOffset];
			let maxUse = Math.min(left, nextRemaining[featureIndex]);
			for (let use = 0; use <= maxUse; use++) {
				let after = [...nextRemaining];
				after[featureIndex] -= use;
				if (distribute(featureOffset + 1, left - use, after)) return true;
			}
			return false;
		}

		return distribute(0, chosen, [...remaining]);
	}

	function visitRegion(index, picked, skillPicked, ways) {
		if (index === regions.length) {
			if (picked === totalPickCount && canAssign(0, active.map(feature => feature.count))) {
				addTotal(skillPicked, ways);
			}
			return;
		}

		let [, region] = regions[index];
		let regionSize = region.skills + region.other;
		let maxPick = Math.min(regionSize, totalPickCount - picked);

		for (let skillPick = 0; skillPick <= Math.min(region.skills, maxPick); skillPick++) {
			let remainingPick = maxPick - skillPick;
			let maxOtherPick = Math.min(region.other, remainingPick);
			for (let otherPick = 0; otherPick <= maxOtherPick; otherPick++) {
				let pick = skillPick + otherPick;
				chosenByRegion[index] = pick;
				visitRegion(
					index + 1,
					picked + pick,
					skillPicked + skillPick,
					ways * choose(region.skills, skillPick) * choose(region.other, otherPick)
				);
			}
		}
	}

	visitRegion(0, 0, 0, 1n);
	return totals;
}

// Splits choice features into independent overlap components.
function featureComponents(features) {
	let optionToFeatures = new Map();
	features.forEach((feature, index) => {
		for (let option of feature.options) {
			if (!optionToFeatures.has(option)) optionToFeatures.set(option, []);
			optionToFeatures.get(option).push(index);
		}
	});

	let visited = new Set();
	let components = [];
	for (let i = 0; i < features.length; i++) {
		if (visited.has(i)) continue;
		let queue = [i];
		let component = [];
		visited.add(i);

		for (let cursor = 0; cursor < queue.length; cursor++) {
			let featureIndex = queue[cursor];
			component.push(features[featureIndex]);
			for (let option of features[featureIndex].options) {
				for (let neighbor of optionToFeatures.get(option) || []) {
					if (visited.has(neighbor)) continue;
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}

		components.push(component);
	}

	return components;
}

// Combines skill-count distributions from independent components.
function convolveSkillCountMaps(left, right) {
	let out = new Map();
	for (let [leftSkills, leftWays] of left.entries()) {
		for (let [rightSkills, rightWays] of right.entries()) {
			let skills = leftSkills + rightSkills;
			out.set(skills, (out.get(skills) || 0n) + leftWays * rightWays);
		}
	}
	return out;
}

// SECTION: Choice Expansion And Feat Branching
// Expands raw choices into alternative feature sets.
function featureAlternativesFromChoices(choices, fixed) {
	return choices.reduce((branches, choice) => {
		let alternatives = featureAlternativesForChoice(choice, fixed);
		return branches.flatMap(branch =>
			alternatives.map(alternative => branch.concat(alternative))
		);
	}, [[]]);
}

// Converts one source choice into countable feature alternatives.
function featureAlternativesForChoice(choice, fixed) {
	let rawNames = getAttributes(choice.from).map(attribute => attribute.name);
	let rawSkills = rawNames.filter(isSkill);
	let fixedSkillOverlaps = rawSkills.filter(name => fixed.has(name)).length;
	let listedPool = rawNames.filter(name => !fixed.has(name));

	if (
		!fixedSkillOverlaps ||
		rawSkills.length !== rawNames.length ||
		listedPool.length >= choice.count
	) {
		return [[{
			label: choiceDisplayLabel(choice),
			count: choice.count,
			options: choicePool(choice, fixed),
			source: choice.source || "Choice",
			from: choice.from
		}]];
	}

	let replacementPool = poolNames(
		{ type: "proficiency", tags: { all: ["skill"] } },
		fixed
	).filter(name => !listedPool.includes(name));
	let replacementCount = choice.count - listedPool.length;
	let features = [];

	if (listedPool.length > 0) {
			features.push({
				label: `${choiceDisplayLabel(choice)} listed skills`,
				count: listedPool.length,
				options: listedPool,
				source: choice.source || "Choice",
				from: choice.from,
				forceListed: true
			});
		}
		if (replacementCount > 0) {
			features.push({
				label: `${choiceDisplayLabel(choice)} replacement skills`,
				count: replacementCount,
				options: replacementPool,
				source: choice.source || "Choice",
				from: { type: "proficiency", tags: { all: ["skill"] } }
			});
		}

	return [features];
}

// Builds Magic Initiate cantrip and spell choices for one list.
function magicInitiateChoices(list) {
	let tag = normalizeMagicInitiateList(list);
	return [
		{
			label: `Magic Initiate ${titleCase(tag)} cantrips`,
			count: 2,
			from: { type: "cantrip", tags: { all: [tag] } }
		},
		{
			label: `Magic Initiate ${titleCase(tag)} level 1 spell`,
			count: 1,
			from: { type: "level1spell", tags: { all: [tag] } }
		}
	];
}

// Creates a readable summary for one source choice.
function choiceSummary(choice, fixed, forcedItems = []) {
	if (choice.replacementOnly) {
		return `${titleCase(choiceDisplayLabel(choice))}: ${choice.count} replacement ${pluralizeChoiceLabel("skills", choice.count)}`;
	}
	let rawNames = getAttributes(choice.from).map(attribute => attribute.name);
	let rawSkills = rawNames.filter(isSkill);
	let forcedSet = new Set(forcedItems);
	let fixedSkillOverlaps = rawSkills.filter(name => fixed.has(name) && !forcedSet.has(name)).length;
	let forcedListedSkills = rawSkills.filter(name => forcedSet.has(name)).length;
	if (fixedSkillOverlaps && forcedListedSkills && rawSkills.length === rawNames.length) {
		return `${titleCase(choiceDisplayLabel(choice))}: ${fixedSkillOverlaps} replacement ${pluralizeChoiceLabel("skills", fixedSkillOverlaps)}`;
	}
	let choiceLabel = choiceDisplayLabel(choice);
	let alternatives = featureAlternativesForChoice(choice, fixed);
	if (
		alternatives.length === 1 &&
		alternatives[0].length === 1 &&
		alternatives[0][0].label.includes("replacement")
	) {
		let feature = alternatives[0][0];
		return `${titleCase(choiceLabel)}: ${feature.count} ${pluralizeChoiceLabel(feature.label.replace(`${choiceLabel} `, ""), feature.count)}`;
	}
	if (alternatives.length === 1 && alternatives[0].length > 1) {
		let parts = alternatives[0]
			.filter(feature => feature.options.length !== feature.count)
			.map(feature => `${feature.count} ${pluralizeChoiceLabel(feature.label.replace(`${choiceLabel} `, ""), feature.count)}`)
			.join(" + ");
		if (parts) return `${titleCase(choiceLabel)}: ${parts}`;
		return "";
	}
	let pool = choicePool(choice, fixed);
	if (choice.from?.names && pool.length === choice.count) {
		return `${titleCase(choiceLabel)}: ${pool.join(", ")}`;
	}
	let spellType = spellChoiceType(pool);
	if (spellType) {
		let feature = {
			label: choiceLabel,
			count: choice.count,
			options: pool,
			from: choice.from
		};
		let tag = inferSpellListTag(feature, spellType);
		let spellLabel = spellType === "cantrip" ? "cantrips" : "level 1 spells";
		return `${tag ? `${titleCase(tag)} ` : ""}${pluralizeChoiceLabel(spellLabel, choice.count)}: ${countPoolLabel(choice.count, pool.length)}`;
	}
	return `${titleCase(choiceLabel)}: ${countPoolLabel(choice.count, pool.length)}`;
}

// Chooses the display label for a source choice.
function choiceDisplayLabel(choice) {
	if (choice.label) return choice.label;
	let attributes = getAttributes(choice.from);
	let types = new Set(attributes.map(attribute => attribute.type));
	let allHaveTag = tag => attributes.length > 0 && attributes.every(attribute => attribute.tags.includes(tag));
	let anyTags = choice.from?.tags?.any || [];

	if (types.size === 1 && types.has("cantrip")) return "cantrips";
	if (types.size === 1 && types.has("level1spell")) return "level 1 spells";
	if (types.size === 1 && types.has("language")) return "languages";
	if (types.size === 1 && types.has("proficiency")) {
		if (allHaveTag("skill")) return "skills";
		if (allHaveTag("instrument")) return "instruments";
		if (allHaveTag("artisanTool")) return "artisan tools";
		if (allHaveTag("gamingSet")) return "gaming sets";
		if (anyTags.includes("artisanTool") && anyTags.includes("instrument")) {
			return "artisan tool or instrument";
		}
		return "proficiencies";
	}
	return "choices";
}

// Determines whether a spell choice is cantrips or level 1 spells.
function spellChoiceType(options) {
	let types = new Set(options.map(name => attributeByName.get(name)?.type));
	types.delete(undefined);
	if (types.size !== 1) return null;
	let type = [...types][0];
	return type === "cantrip" || type === "level1spell" ? type : null;
}

// Checks whether a choice selects cantrips or level 1 spells.
function choiceIsSpellChoice(choice) {
	let types = new Set(getAttributes(choice.from).map(attribute => attribute.type));
	types.delete(undefined);
	return types.size === 1 && (types.has("cantrip") || types.has("level1spell"));
}

// Pluralizes a display label based on a count.
function pluralizeChoiceLabel(label, count) {
	if (count !== 1) return label;
	return label
		.replace(/skills$/, "skill")
		.replace(/tools$/, "tool")
		.replace(/instruments$/, "instrument")
		.replace(/gaming sets$/, "gaming set")
		.replace(/spells$/, "spell")
		.replace(/cantrips$/, "cantrip");
}

// Formats a picked-count and pool-size pair for source summaries.
function countPoolLabel(count, poolSize) {
	return `${count}/${poolSize}`;
}

// Returns fixed names granted by a choice that are not already fixed.
function choiceFixedNames(choice, fixed) {
	let alternatives = featureAlternativesForChoice(choice, fixed);
	if (alternatives.length !== 1) return [];
	return alternatives[0]
		.filter(feature => feature.count === feature.options.length)
		.flatMap(feature => feature.options)
		.filter(name => !fixed.has(name));
}

// Returns the extra choices granted by special origin feats.
function specialFeatChoices(feat) {
	if (feat === "Skilled") {
		return [{ label: "proficiencies", count: 3, from: { type: "proficiency" } }];
	}
	if (feat === "Musician") {
		return [{ label: "instruments", count: 3, from: { type: "proficiency", tags: { all: ["instrument"] } } }];
	}
	if (feat === "Crafter") {
		return [{ label: "artisan tools", count: 3, from: { type: "proficiency", tags: { all: ["artisanTool"] } } }];
	}
	return [];
}

// Checks whether a feat can be selected from the current source state.
function featIsAvailable(feat, grantedFeats) {
	return REPEATABLE_FEATS.has(feat) || !grantedFeats.has(feat);
}

// Builds class spell-choice branches including class-order variants.
function classSpellBranches(className, source, baseChoices) {
	let branches = source?.dynamic?.spellChoiceBranches;
	if (!branches?.length) return [{ label: "Class spell choices", choices: [] }];

	return branches.map(branch => {
		let choices = [];
		if (branch.extraCantrips) {
			choices.push({
				label: `${branch.name} extra cantrip`,
				count: branch.extraCantrips.count,
				from: branch.extraCantrips.options
					? { names: branch.extraCantrips.options }
					: { type: "cantrip", tags: { all: [classTagFor(className)] } },
				source: `Class: ${className}`
			});
		}
		return { label: branch.name, choices };
	});
}

// Creates the visible label for a calculation branch.
function branchDisplayLabel(branch) {
	let parts = branch.displayParts || [];
	if (parts.length) return parts.join("; ");
	return branch.displayLabel || "";
}

// Adds one label part to a branch without mutating it.
function branchWithDisplayPart(branch, part) {
	if (!part) return branch;
	return {
		...branch,
		displayParts: [...(branch.displayParts || []), part],
		displayLabel: [...(branch.displayParts || []), part].join("; ")
	};
}

// Adds a branch-scoped modifier without mutating the branch.
function branchWithDisplayModifier(branch, sourceKey, modifier) {
	if (!sourceKey) return branch;
	let existingSourceModifiers = branch.sourceBranchModifiers || {};
	return {
		...branch,
		sourceBranchModifiers: {
			...existingSourceModifiers,
			[sourceKey]: [
				...(existingSourceModifiers[sourceKey] || []),
				modifier
			]
		}
	};
}

// Applies a granted feat to every branch.
function applyGrantedFeatToBranches(branches, feat, source, labelPrefix) {
	let sourceName = labelPrefix.replace(/^(Background|Race|Class):\s*/, "");
	if (feat === "Magic Initiate") {
		let lists = magicInitiateListsFromSource(source);
		return branches.flatMap(branch => lists
			.filter(list => !branch.magicInitiateLists.has(list))
			.map(list => {
				let magicInitiateBranch = branchWithDisplayPart({
						...branch,
						label: `${branch.label}; ${labelPrefix} Magic Initiate ${list}`,
						choices: branch.choices.concat(magicInitiateChoices(list)),
						spellcastingAbility: branch.spellcastingAbility * 3n,
						magicInitiateLists: new Set([...branch.magicInitiateLists, list])
					},
					`${sourceName} Magic Initiate ${titleCase(list)}`
				);
				return branchWithDisplayModifier(magicInitiateBranch, labelPrefix, {
					label: "spellcasting ability",
					value: 3n,
					displayOnly: true
				});
			})
		);
	}

	let choices = specialFeatChoices(feat);
	if (!choices.length) return branches;
	return branches.map(branch => branchWithDisplayPart({
			...branch,
			label: `${branch.label}; ${labelPrefix} ${feat}`,
			choices: branch.choices.concat(choices)
		},
		`${sourceName} ${feat}`
	));
}

// Expands branches for source choices that create variants.
function applySourceChoiceBranches(branches, source, sourceKey) {
	let choiceBranches = source?.dynamic?.choiceBranches;
	if (!choiceBranches?.length) return branches;
	let sourceName = sourceKey.replace(/^(Background|Race|Class):\s*/, "");

	return branches.flatMap(branch => choiceBranches.map(choiceBranch => {
		let choices = (choiceBranch.choices || []).map(choice => ({
			...choice,
			source: sourceKey
		}));
		let fixed = choiceBranch.fixed || [];
		let modifierEntries = Object.entries(choiceBranch.modifiers || {})
			.map(([label, value]) => ({ label, value: BigInt(value) }));
		let modifierWeight = modifierEntries.reduce((total, modifier) => total * modifier.value, 1n);
		let existingSourceChoices = branch.sourceBranchChoices || {};
		let existingSourceFixed = branch.sourceBranchFixed || {};
		let existingSourceModifiers = branch.sourceBranchModifiers || {};
		let branched = branchWithDisplayPart({
				...branch,
				label: `${branch.label}; ${sourceKey} ${choiceBranch.name}`
			},
			choiceBranch.displayLabel || `${sourceName}, ${choiceBranch.name}`
		);
		return {
			...branched,
			choices: branch.choices.concat(choices),
			magicInitiateLists: new Set(branch.magicInitiateLists),
			sourceBranchChoices: {
				...existingSourceChoices,
				[sourceKey]: [
					...(existingSourceChoices[sourceKey] || []),
					...choices
				]
			},
			sourceBranchFixed: {
				...existingSourceFixed,
				[sourceKey]: [
					...(existingSourceFixed[sourceKey] || []),
					...fixed
				]
			},
			sourceBranchModifiers: {
				...existingSourceModifiers,
				[sourceKey]: [
					...(existingSourceModifiers[sourceKey] || []),
					...modifierEntries
				]
			},
			sourceBranchModifierWeight: (branch.sourceBranchModifierWeight || 1n) * modifierWeight
		};
	}));
}

// Builds branches for one human origin feat choice.
function originFeatBranches(baseBranch, feat, labelPrefix, choices, displayParts = [], originSourceKey = null) {
	if (feat === "Magic Initiate") {
		return MAGIC_INITIATE_LISTS
			.map(normalizeMagicInitiateList)
			.filter(list => !baseBranch.magicInitiateLists.has(list))
			.map(list => {
				let originFeatChoices = magicInitiateChoices(list);
					let branch = {
						label: `${labelPrefix}; Origin feat: Magic Initiate ${list}`,
						displayParts: displayParts.concat(`Origin Feat: Magic Initiate ${titleCase(list)}`),
						displayLabel: displayParts.concat(`Origin Feat: Magic Initiate ${titleCase(list)}`).join("; "),
						choices: choices.concat(originFeatChoices),
						originFeatChoices,
						spellcastingAbility: baseBranch.spellcastingAbility * 3n,
						magicInitiateLists: new Set([...baseBranch.magicInitiateLists, list]),
						sourceBranchChoices: baseBranch.sourceBranchChoices || {},
						sourceBranchFixed: baseBranch.sourceBranchFixed || {},
						sourceBranchModifiers: baseBranch.sourceBranchModifiers || {},
						sourceBranchModifierWeight: baseBranch.sourceBranchModifierWeight || 1n
					};
					return branchWithDisplayModifier(branch, originSourceKey, {
						label: "spellcasting ability",
						value: 3n,
						displayOnly: true
					});
				});
	}

	let originFeatChoices = specialFeatChoices(feat);
	return [{
		label: `${labelPrefix}; Origin feat: ${feat}`,
		displayParts: displayParts.concat(`Origin Feat: ${feat}`),
		displayLabel: displayParts.concat(`Origin Feat: ${feat}`).join("; "),
		choices: choices.concat(originFeatChoices),
		originFeatChoices,
		spellcastingAbility: baseBranch.spellcastingAbility,
		magicInitiateLists: new Set(baseBranch.magicInitiateLists),
		sourceBranchChoices: baseBranch.sourceBranchChoices || {},
		sourceBranchFixed: baseBranch.sourceBranchFixed || {},
		sourceBranchModifiers: baseBranch.sourceBranchModifiers || {},
		sourceBranchModifierWeight: baseBranch.sourceBranchModifierWeight || 1n
	}];
}

// Checks whether an origin feat has no special counted choices.
function isPlainOriginFeat(feat) {
	return feat !== "Magic Initiate" && specialFeatChoices(feat).length === 0;
}

// Builds the summarized normal-origin-feat branch.
function plainOriginFeatBranch(baseBranch, count, labelPrefix, choices, displayParts = []) {
	return {
		label: `${labelPrefix}; ${count} normal origin feats`,
		displayParts: displayParts.concat(`${count} Normal Origin Feats`),
		displayLabel: displayParts.concat(`${count} Normal Origin Feats`).join("; "),
		choices,
		originFeatChoices: [],
		spellcastingAbility: baseBranch.spellcastingAbility,
		magicInitiateLists: new Set(baseBranch.magicInitiateLists),
		branchMultiplier: BigInt(count),
		sourceBranchChoices: baseBranch.sourceBranchChoices || {},
		sourceBranchFixed: baseBranch.sourceBranchFixed || {},
		sourceBranchModifiers: baseBranch.sourceBranchModifiers || {},
		sourceBranchModifierWeight: baseBranch.sourceBranchModifierWeight || 1n
	};
}

// Moves choices with only one possible outcome into fixed selections.
function promoteForcedChoices(choices, fixed) {
	let forcedBySource = new Map();
	let changed = true;

	while (changed) {
		changed = false;
		for (let choice of choices) {
			if (choice.forcePromoted) continue;
			let alternatives = featureAlternativesForChoice(choice, fixed);
			if (alternatives.length === 1 && alternatives[0].some(feature => feature.forceListed)) {
				let listedFeatures = alternatives[0].filter(feature => feature.forceListed);
				let replacementFeatures = alternatives[0].filter(feature => !feature.forceListed);
				let sourceKey = choice.source || "Choice";
				if (!forcedBySource.has(sourceKey)) forcedBySource.set(sourceKey, []);
				for (let feature of listedFeatures) {
					if (feature.options.length !== feature.count) continue;
					for (let option of feature.options) {
						if (fixed.has(option)) continue;
						fixed.add(option);
						forcedBySource.get(sourceKey).push(option);
						changed = true;
					}
				}
				if (changed && replacementFeatures.length === 1) {
					let replacement = replacementFeatures[0];
					choice.count = replacement.count;
					choice.from = replacement.from;
					choice.label = choiceDisplayLabel(choice);
					choice.replacementOnly = true;
				}
				continue;
			}
			if (alternatives.length !== 1 || alternatives[0].length !== 1) continue;

			let feature = alternatives[0][0];
			if (feature.options.length !== feature.count) continue;

			choice.forcePromoted = true;
			let sourceKey = choice.source || "Choice";
			if (!forcedBySource.has(sourceKey)) forcedBySource.set(sourceKey, []);
			for (let option of feature.options) {
				if (fixed.has(option)) continue;
				fixed.add(option);
				forcedBySource.get(sourceKey).push(option);
				changed = true;
			}
		}
	}

	return forcedBySource;
}

// SECTION: Main Calculation Pipeline
// Calculates all branch rows and total weights for one selection.
function calculate(backgroundName, raceName, className) {
	let sources = [
		{ kind: "Background", name: backgroundName, source: sourceByName(BACKGROUNDS, backgroundName) },
		{ kind: "Race", name: raceName, source: sourceByName(RACES, raceName) },
		{ kind: "Class", name: className, source: sourceByName(CLASSES, className) }
	].filter(entry => entry.source);

	let fixed = new Set();
	let grantedFeats = new Set();
	let baseChoices = [];
	let suppressedFixedBySource = new Map();
	let staticWeight = 1n;
	let baseBranches = [{
		label: "Base",
		choices: [],
		spellcastingAbility: 1n,
		magicInitiateLists: new Set(),
		displayParts: [],
		sourceBranchChoices: {},
		sourceBranchFixed: {},
		sourceBranchModifiers: {},
		sourceBranchModifierWeight: 1n
	}];

	for (let entry of sources) {
		let sourceKey = `${entry.kind}: ${entry.name}`;
		for (let name of entry.source.fixed || []) {
			if (fixed.has(name) && isSkill(name)) {
				if (!suppressedFixedBySource.has(sourceKey)) suppressedFixedBySource.set(sourceKey, []);
				suppressedFixedBySource.get(sourceKey).push(name);
				baseChoices.push({
					count: 1,
					from: { type: "proficiency", tags: { all: ["skill"] } },
					source: sourceKey
				});
				continue;
			}
			fixed.add(name);
		}
		for (let feat of featsFromSource(entry.source)) grantedFeats.add(feat);
		for (let choice of entry.source.choices || []) {
			baseChoices.push({
				...choice,
				source: sourceKey
			});
		}
		staticWeight *= modifierEntries(entry.source)
			.reduce((total, modifier) => total * modifier.value, 1n);
	}

	let forcedBySource = promoteForcedChoices(baseChoices, fixed);
	baseChoices = baseChoices.filter(choice => !choice.forcePromoted);

	for (let entry of sources) {
		for (let feat of featsFromSource(entry.source)) {
			baseBranches = applyGrantedFeatToBranches(
				baseBranches,
				feat,
				entry.source,
				`${entry.kind}: ${entry.name}`
			);
		}
		baseBranches = applySourceChoiceBranches(
			baseBranches,
			entry.source,
			`${entry.kind}: ${entry.name}`
		);
	}

	let classSource = sourceByName(CLASSES, className);
	let classSourceKey = `Class: ${className}`;
	let classSpellChoices = baseChoices.filter(choice =>
		choice.source === classSourceKey && choiceIsSpellChoice(choice)
	);
	let spellBranches = classSpellBranches(className, classSource, classSpellChoices);
	let originEntry = sources.find(entry => entry.source.dynamic?.originFeatChoice);
	let originChoice = originEntry?.source.dynamic.originFeatChoice;
	let originSourceKey = originEntry ? `${originEntry.kind}: ${originEntry.name}` : null;

	let branches = [];
	for (let baseBranch of baseBranches) {
		for (let spellBranch of spellBranches) {
			let choices = baseChoices.concat(baseBranch.choices, spellBranch.choices);
			let spellLabel = `${baseBranch.label}; ${spellBranch.label}`;
			let displayParts = [
				...(baseBranch.displayParts || []),
				...(spellBranch.label !== "Class spell choices" ? [spellBranch.label] : [])
			];
			let displayLabel = displayParts.join("; ");
			if (originChoice) {
				let availableOriginFeats = (originChoice.options || ORIGIN_FEATS)
					.filter(feat => featIsAvailable(feat, grantedFeats));
				let plainOriginFeats = availableOriginFeats.filter(isPlainOriginFeat);
				if (plainOriginFeats.length) {
					branches.push({
							...plainOriginFeatBranch(baseBranch, plainOriginFeats.length, spellLabel, choices, displayParts),
							classSpellChoices: classSpellChoices.concat(spellBranch.choices)
						});
				}
				for (let feat of availableOriginFeats.filter(feat => !isPlainOriginFeat(feat))) {
					if (!featIsAvailable(feat, grantedFeats)) continue;
					branches.push(...originFeatBranches(
						baseBranch,
						feat,
						spellLabel,
						choices,
						displayParts,
						originSourceKey
					).map(branch => ({
						...branch,
						classSpellChoices: classSpellChoices.concat(spellBranch.choices)
					})));
				}
			} else {
				branches.push({
					label: spellLabel,
					displayParts,
					displayLabel: displayLabel || undefined,
					choices,
					classSpellChoices: classSpellChoices.concat(spellBranch.choices),
					spellcastingAbility: baseBranch.spellcastingAbility,
					magicInitiateLists: new Set(baseBranch.magicInitiateLists),
					branchMultiplier: 1n,
					sourceBranchChoices: baseBranch.sourceBranchChoices || {},
					sourceBranchFixed: baseBranch.sourceBranchFixed || {},
					sourceBranchModifiers: baseBranch.sourceBranchModifiers || {},
					sourceBranchModifierWeight: baseBranch.sourceBranchModifierWeight || 1n
				});
			}
		}
	}

	let expertiseCount = classSource?.dynamic?.expertise?.count || 0;
	let branchRows = [];
	let branchTotal = 0n;

	for (let branch of branches) {
		let branchFixedNames = Object.values(branch.sourceBranchFixed || {}).flat();
		let branchFixed = new Set([...fixed, ...branchFixedNames]);
		let branchFixedSkillCount = [...branchFixed].filter(isSkill).length;
		let featureAlternatives = featureAlternativesFromChoices(branch.choices, branchFixed);
		let branchMultiplier = branch.branchMultiplier || 1n;
		let sourceBranchModifierWeight = branch.sourceBranchModifierWeight || 1n;
		let sourceRowsForBranch = sources.map(entry =>
			describeSource(
				entry,
					branchFixed,
					[
						...(forcedBySource.get(`${entry.kind}: ${entry.name}`) || []),
						...((branch.sourceBranchFixed || {})[`${entry.kind}: ${entry.name}`] || [])
					],
					entry.kind === "Class" ? branch.classSpellChoices : null,
					suppressedFixedBySource.get(`${entry.kind}: ${entry.name}`) || [],
					[
						...((branch.sourceBranchChoices || {})[`${entry.kind}: ${entry.name}`] || []),
						...(entry.source.dynamic?.originFeatChoice ? (branch.originFeatChoices || []) : [])
					],
					(branch.sourceBranchModifiers || {})[`${entry.kind}: ${entry.name}`] || []
				)
			);

			if (expertiseCount && featureAlternatives.length === 1) {
				let expertiseBuckets = [...countDistinctChoicesBySkillCount(featureAlternatives[0]).entries()]
				.filter(([, ways]) => ways > 0n)
				.sort(([left], [right]) => left - right);
				if (expertiseBuckets.length > 1) {
					for (let [addedSkills, ways] of expertiseBuckets) {
					let possibleSkills = branchFixedSkillCount + addedSkills;
					let expertiseChoices = choose(possibleSkills, expertiseCount);
					let choiceWeight = ways * expertiseChoices;
					let weight = choiceWeight * branch.spellcastingAbility * branchMultiplier * sourceBranchModifierWeight;
					let baseWeight = weight * staticWeight;
						branchTotal += weight;
						let components = featureComponents(featureAlternatives[0]);
						let bucketData = expertiseBucketDisplayData(components, branchFixedSkillCount, addedSkills);
					let choiceFactors = [...bucketData.factors, expertiseChoices];
					if (branchMultiplier !== 1n) choiceFactors.push(branchMultiplier);
					branchRows.push({
						label: expertiseBucketLabel(branch, possibleSkills),
						spellcastingAbility: branch.spellcastingAbility,
						branchMultiplier,
						sourceBranchModifierWeight,
						baseWeight,
						mathHtml: choiceMathHTMLForExpertiseBucket(featureAlternatives[0], branchFixedSkillCount, expertiseCount, addedSkills),
						choiceFactors,
						staticWeight,
						sourceRows: sourceRowsForBranch
					});
				}
				continue;
			}
		}

		let choiceWeight = featureAlternatives.reduce(
			(total, features) => total + choiceWeightWithExpertise(features, branchFixedSkillCount, expertiseCount),
			0n
		);
		let weight = choiceWeight * branch.spellcastingAbility * branchMultiplier * sourceBranchModifierWeight;
		let baseWeight = weight * staticWeight;
		branchTotal += weight;
		let choiceFactors = alternativeChoiceFactors(featureAlternatives, branchFixedSkillCount, expertiseCount);
		if (branchMultiplier !== 1n) choiceFactors.push(branchMultiplier);
		branchRows.push({
			label: branchDisplayLabel(branch) || branch.label,
			spellcastingAbility: branch.spellcastingAbility,
			branchMultiplier,
			sourceBranchModifierWeight,
			baseWeight,
			mathHtml: alternativeMathHTML(featureAlternatives, branchFixedSkillCount, expertiseCount),
			choiceFactors,
			staticWeight,
			sourceRows: sourceRowsForBranch
		});
	}

	let baseWeight = staticWeight * branchTotal;
	let globalWeight = GLOBAL_LANGUAGE_WEIGHT * BigInt(GLOBALS.pointBuyWeight);
	let finalWeight = baseWeight * globalWeight;

	return {
		backgroundName,
		raceName,
		className,
		branchRows,
		baseWeight,
		globalWeight,
		finalWeight,
		globalLanguageWeight: GLOBAL_LANGUAGE_WEIGHT,
		pointBuyWeight: BigInt(GLOBALS.pointBuyWeight)
	};
}

// SECTION: Choice Weights And Expertise Buckets
// Counts choice weight including expertise choices when present.
function choiceWeightWithExpertise(features, fixedSkillCount, expertiseCount) {
	if (!expertiseCount) return countDistinctChoiceSets(features);

	let bySkillCount = countDistinctChoicesBySkillCount(features);
	let total = 0n;
	for (let [addedSkills, ways] of bySkillCount.entries()) {
		total += ways * choose(fixedSkillCount + addedSkills, expertiseCount);
	}
	return total;
}

// Builds the label for an expertise skill-count branch.
function expertiseBucketLabel(branch, possibleSkills) {
	let parentLabel = branchDisplayLabel(branch);
	if (parentLabel) return `${parentLabel}, ${possibleSkills} Expertise Skills`;
	return `${possibleSkills} Expertise Skills`;
}

// Renders math for all alternative feature sets in a branch.
function alternativeMathHTML(featureAlternatives, fixedSkillCount, expertiseCount) {
	if (featureAlternatives.length === 1) {
		return choiceMathHTML(featureAlternatives[0], fixedSkillCount, expertiseCount);
	}

	let cases = featureAlternatives.map((features, index) => {
		let value = choiceWeightWithExpertise(features, fixedSkillCount, expertiseCount);
		return `
			<div class="mathBlock">
				<div class="mathTitle">Overlap Case ${index + 1}</div>
				${choiceMathHTML(features, fixedSkillCount, expertiseCount)}
				<div class="mathResult">case total = ${format(value)}</div>
			</div>
		`;
	}).join("");
	let total = featureAlternatives.reduce(
		(sum, features) => sum + choiceWeightWithExpertise(features, fixedSkillCount, expertiseCount),
		0n
	);
	return `${cases}<div class="mathResult">choice total = ${format(total)}</div>`;
}

// Builds the numeric factors for all alternative feature sets.
function alternativeChoiceFactors(featureAlternatives, fixedSkillCount, expertiseCount) {
	if (featureAlternatives.length !== 1) {
		return [featureAlternatives.reduce(
			(sum, features) => sum + choiceWeightWithExpertise(features, fixedSkillCount, expertiseCount),
			0n
		)];
	}
	return choiceFactors(featureAlternatives[0], fixedSkillCount, expertiseCount);
}

// Builds numeric choice factors for one feature set.
function choiceFactors(features, fixedSkillCount, expertiseCount) {
	let active = activeFeatures(features);
	let factors = [];

	for (let component of featureComponents(active)) {
		factors.push(componentChoiceFactor(component, fixedSkillCount));
	}

	if (expertiseCount) {
		let bySkillCount = countDistinctChoicesBySkillCount(active);
		let entries = [...bySkillCount.entries()].filter(([, ways]) => ways > 0n);
		if (entries.length === 1) {
			let [addedSkills] = entries[0];
			factors.push(choose(fixedSkillCount + addedSkills, expertiseCount));
		}
		else {
			factors = [choiceWeightWithExpertise(active, fixedSkillCount, expertiseCount)];
		}
	}

	return factors.filter(value => value !== 1n);
}

// Counts one independent choice component.
function componentChoiceFactor(component, fixedSkillCount = 0) {
	let specialData =
		skillRequirementData(component, fixedSkillCount) ||
		toolRequirementData(component) ||
		spellRequirementData(component);
	if (specialData) return specialData.total;

	if (component.length === 1) {
		let feature = component[0];
		return choose(feature.options.length, feature.count);
	}

	let firstOptions = component[0].options.join("\u0000");
	let samePool = component.every(feature => feature.options.join("\u0000") === firstOptions);
	if (samePool) {
		let totalCount = component.reduce((sum, feature) => sum + feature.count, 0);
		return choose(component[0].options.length, totalCount);
	}

	return countDistinctChoiceSets(component);
}

// Renders the math explanation for branch choices.
function choiceMathHTML(features, fixedSkillCount, expertiseCount) {
	let active = activeFeatures(features);

	if (!active.length) {
		return `<div class="mathLine"><span>No choices</span><strong>1</strong></div>`;
	}

	let components = featureComponents(active);
	let html = choiceOverviewHTML(components, fixedSkillCount);
	let skillComponents = components.filter(componentIsSkill);
	let nonSkillComponents = components.filter(component => !componentIsSkill(component));

	html += skillComponentsMathHTML(skillComponents, fixedSkillCount);
	html += nonSkillComponents
		.map(component =>
			toolRequirementMathHTML(component) ||
			spellRequirementMathHTML(component) ||
			componentMathHTML(component)
		)
		.join("");

	if (!expertiseCount) return html;

	let bySkillCount = countDistinctChoicesBySkillCount(active);
	let skillCountEntries = [...bySkillCount.entries()]
		.filter(([, ways]) => ways > 0n)
		.sort(([left], [right]) => left - right);
	let bucketBreakdown = skillCountBucketBreakdown(active, fixedSkillCount);
	let bucketBreakdownHtml = bucketBreakdown
		? bucketBreakdown.map(bucket => skillBucketBreakdownHTML(bucket)).join("")
		: "";
	let terms = skillCountEntries
		.map(([addedSkills, ways]) => {
			let expertiseChoices = choose(fixedSkillCount + addedSkills, expertiseCount);
			return `
			<li>
				<span>${fixedSkillCount + addedSkills}-skill bucket</span>
				${renderFormula(`C(${fixedSkillCount + addedSkills}, ${expertiseCount})`, expertiseChoices)}
			</li>
		`;
		});
	let skillBucketTotal = [...bySkillCount.values()].reduce((sum, ways) => sum + ways, 0n);
	let expertiseTotal = choiceWeightWithExpertise(active, fixedSkillCount, expertiseCount);

	return html + `
		<div class="mathBlock">
			<div class="mathTitle">Expertise</div>
			${skillCountEntries.length > 1 ? `<ul class="mathList">
				${renderMathTotalRow("skill/proficiency sets by skill count", skillBucketTotal)}
			</ul>` : ""}
			${bucketBreakdownHtml ? `<div class="mathSubhead">Bucket Math</div>${bucketBreakdownHtml}` : ""}
			<ul class="mathList">${terms.join("")}</ul>
			${skillCountEntries.length > 1 ? `<ul class="mathList">
				${renderMathTotalRow("skill/proficiency sets with expertise", expertiseTotal)}
			</ul>` : ""}
		</div>
	`;
}

// Renders math for a fixed expertise skill-count bucket.
function choiceMathHTMLForExpertiseBucket(features, fixedSkillCount, expertiseCount, addedSkills) {
	let active = activeFeatures(features);
	let components = featureComponents(active);
	let bucketData = expertiseBucketDisplayData(components, fixedSkillCount, addedSkills);
	let possibleSkills = fixedSkillCount + addedSkills;
	let expertiseChoices = choose(possibleSkills, expertiseCount);
	return choiceOverviewHTML(components, fixedSkillCount, fixedSkillCount) + `
		${bucketData.mathHtml}
		<div class="mathBlock">
			<div class="mathTitle">Expertise</div>
			<ul class="mathList">
				<li>
					<span>expertise choices</span>
					${renderFormula(`C(${possibleSkills}, ${expertiseCount})`, expertiseChoices)}
				</li>
			</ul>
		</div>
	`;
}

// Computes displayed totals for one expertise bucket.
function expertiseBucketDisplayData(components, fixedSkillCount, addedSkills) {
	let mathParts = [];
	let factors = [];

	for (let component of components) {
		let bucket = skillCountBucketBreakdown(component, fixedSkillCount)
			?.find(entry => entry.addedSkills === addedSkills);
		if (bucket) {
			let meta = bucketSkillMathMeta(component);
			mathParts.push(`
				<div class="mathBlock">
					<div class="mathTitle">Skill Math${meta ? ` <span class="mathMeta">${escape(meta)}</span>` : ""}</div>
					${skillBucketBreakdownHTML(bucket, false)}
				</div>
			`);
			factors.push(bucket.total);
			continue;
		}

		let factor = countDistinctChoiceSets(component);
		if (factor !== 1n) {
			mathParts.push(
				toolRequirementMathHTML(component) ||
				spellRequirementMathHTML(component) ||
				componentMathHTML(component)
			);
			factors.push(factor);
		}
	}

	let total = factors.reduce((product, factor) => product * factor, 1n);
	return {
		total,
		factors,
		mathHtml: mathParts.join("")
	};
}

// Renders the rows inside a skill-count bucket.
function skillBucketBreakdownHTML(bucket, includeSubhead = true) {
	return `
		${includeSubhead ? `<div class="mathSubhead">${bucket.totalSkills} Possible Proficient Skills</div>` : ""}
		<ul class="mathList">
			${bucket.terms.map(term => `
				<li>
					${renderMathTermLabel(term.label)}
					${renderFormula(term.formula, term.value)}
				</li>
			`).join("")}
			${renderMathTotalRow(`${bucket.totalSkills}-skill bucket`, bucket.total)}
		</ul>
	`;
}

// Builds the pool summary for bucketed skill math.
function bucketSkillMathMeta(component) {
	let allOptions = [...new Set(component.flatMap(feature => feature.options || []))];
	if (!allOptions.length) return "";
	if (allOptions.every(isSkill)) {
		return skillRegionSummary(
			skillRegionsForComponent(component),
			component
		);
	}
	return generalRegionMeta(component);
}

// Groups skill options by overlapping requirement regions.
function skillRegionsForComponent(component) {
	let optionMasks = new Map();
	component.forEach((feature, featureIndex) => {
		for (let option of feature.options || []) {
			optionMasks.set(option, (optionMasks.get(option) || 0) | (1 << featureIndex));
		}
	});
	let regionsByMask = new Map();
	for (let [option, mask] of optionMasks.entries()) {
		if (!regionsByMask.has(mask)) regionsByMask.set(mask, []);
		regionsByMask.get(mask).push(option);
	}
	return [...regionsByMask.entries()]
		.sort(([left], [right]) => left - right)
		.map(([mask, options]) => ({
			mask,
			options: options.sort(),
			label: skillRegionLabel(mask, component)
		}))
		.sort((left, right) => compareMathLabels(left.label, right.label));
}

// Builds non-skill overlap-region metadata.
function generalRegionMeta(component) {
	let optionMasks = new Map();
	component.forEach((feature, featureIndex) => {
		for (let option of feature.options || []) {
			optionMasks.set(option, (optionMasks.get(option) || 0) | (1 << featureIndex));
		}
	});
	let regionsByMask = new Map();
	for (let mask of optionMasks.values()) {
		regionsByMask.set(mask, (regionsByMask.get(mask) || 0) + 1);
	}
	return [...regionsByMask.entries()]
		.sort(([left], [right]) => left - right)
		.sort(([left], [right]) => compareMathLabels(
			generalRegionSummaryLabel(left, component),
			generalRegionSummaryLabel(right, component)
		))
		.map(([mask, count]) => `${generalRegionSummaryLabel(mask, component)}: ${count}`)
		.join(", ");
}

// Builds terms grouped by possible skill counts.
function skillCountBucketBreakdown(features, fixedSkillCount) {
	let active = activeFeatures(features);
	if (!active.length || active.some(feature => feature.options.length < feature.count)) return null;

	let components = featureComponents(active);
	if (components.length !== 1) return null;

	let component = components[0];
	let totalPickCount = component.reduce((sum, feature) => sum + feature.count, 0);
	let optionMasks = new Map();
	component.forEach((feature, featureIndex) => {
		for (let option of feature.options) {
			optionMasks.set(option, (optionMasks.get(option) || 0) | (1 << featureIndex));
		}
	});

	let regionsByMask = new Map();
	for (let [option, mask] of optionMasks.entries()) {
		if (!regionsByMask.has(mask)) {
			regionsByMask.set(mask, { mask, skills: [], others: [] });
		}
		let region = regionsByMask.get(mask);
		if (isSkill(option)) region.skills.push(option);
		else region.others.push(option);
	}

	let regions = [...regionsByMask.values()]
		.sort((left, right) => left.mask - right.mask)
		.map(region => ({
			...region,
			...bucketRegionLabel(region.mask, component)
		}))
		.sort((left, right) => compareMathLabels(left.baseLabel, right.baseLabel));
	let picked = new Map();
	let chosenParts = [];
	let buckets = new Map();

	function addBucket(skillCount, term) {
		if (!buckets.has(skillCount)) buckets.set(skillCount, []);
		buckets.get(skillCount).push(term);
	}

	function visit(index, pickedCount, skillPicked, ways) {
		if (index === regions.length) {
			if (pickedCount !== totalPickCount || !regionPicksCanAssign(picked, regions, component)) return;
			let activeParts = sortedMathParts(chosenParts.filter(part => part.count > 0));
			addBucket(skillPicked, {
				value: ways,
				formula: activeParts
					.map(part => `C(${part.poolSize}, ${part.count})`)
					.join(" x "),
				label: activeParts
					.map(part => countedRegionLabel(part.count, part.label))
					.join(", ")
			});
			return;
		}

		let region = regions[index];
		let regionSize = region.skills.length + region.others.length;
		let maxPick = Math.min(regionSize, totalPickCount - pickedCount);
		for (let skillPick = 0; skillPick <= Math.min(region.skills.length, maxPick); skillPick++) {
			let maxOtherPick = Math.min(region.others.length, maxPick - skillPick);
			for (let otherPick = 0; otherPick <= maxOtherPick; otherPick++) {
				let pick = skillPick + otherPick;
				picked.set(region.mask, pick);
				chosenParts.push(
					{ count: skillPick, poolSize: region.skills.length, label: region.skillLabel },
					{ count: otherPick, poolSize: region.others.length, label: region.otherLabel }
				);
				visit(
					index + 1,
					pickedCount + pick,
					skillPicked + skillPick,
					ways * choose(region.skills.length, skillPick) * choose(region.others.length, otherPick)
				);
				chosenParts.pop();
				chosenParts.pop();
			}
		}
		picked.delete(region.mask);
	}

	visit(0, 0, 0, 1n);

	return [...buckets.entries()]
		.sort(([left], [right]) => left - right)
		.map(([addedSkills, terms]) => ({
			addedSkills,
			totalSkills: fixedSkillCount + addedSkills,
			terms,
			total: terms.reduce((sum, term) => sum + term.value, 0n)
		}));
}

// Formats a region label inside skill-count buckets.
function bucketRegionLabel(mask, component) {
	let baseLabel = componentIsProficiency(component)
		? generalRegionLabel(mask, component)
		: skillRegionLabel(mask, component);
	let genericSkillLabel = genericSkillRegionLabel(component);
	return {
		baseLabel,
		skillLabel: baseLabel === "proficiencies" || baseLabel === "skills"
			? genericSkillLabel
			: baseLabel,
		otherLabel: baseLabel === "proficiencies"
			? "other proficiencies"
			: baseLabel
	};
}

// Returns the generic label for unconstrained skill regions.
function genericSkillRegionLabel(component) {
	let constrainedSkillNames = constrainedSkillRegionNames(component);
	if (!constrainedSkillNames.length) return "skills";
	return "other";
}

// Lists named skill constraints in a component.
function constrainedSkillRegionNames(component) {
	let names = component
		.map(featureRegionDescriptor)
		.filter(descriptor =>
			descriptor.kind === "skill" &&
			descriptor.key !== "general-skills"
		)
		.map(descriptor => descriptor.summary)
		.filter(Boolean);
	return [...new Set(names)].sort();
}

// Assigns display priority to math labels.
function mathLabelPriority(label) {
	let normalized = String(label || "").toLowerCase();
	if (normalized === "shared") return 10;
	if (normalized.endsWith(" skills") && normalized !== "other skills") return 10;
	if (normalized === "skills") return 10;
	if (normalized === "other" || normalized === "other skills" || normalized === "general") return 15;
	if (normalized === "other proficiencies" || normalized === "proficiencies") return 40;
	return 20;
}

// Sorts math labels by priority and text.
function compareMathLabels(left, right) {
	let priority = mathLabelPriority(left) - mathLabelPriority(right);
	return priority || String(left).localeCompare(String(right));
}

// Sorts math term parts into a readable order.
function sortedMathParts(parts) {
	return [...parts].sort((left, right) =>
		compareMathLabels(left.label, right.label)
	);
}

// SECTION: Requirement Overview Rendering
// Renders the remaining-requirements overview box.
function choiceOverviewHTML(components, fixedSkillCount, baseFixedSkillCount = 0) {
	let remainingLines = [];
	for (let line of skillOverviewLines(components, fixedSkillCount)) {
		remainingLines.push({ group: "skills", line });
	}

	for (let component of components) {
		if (componentIsSkill(component)) continue;
		let skillData = skillRequirementData(component);
		if (skillData) {
			remainingLines.push({ group: "skills", line: `${skillData.atLeastClass} ${skillData.className} ${pluralizeChoiceLabel("skills", skillData.atLeastClass)}` });
			continue;
		}
		let toolData = toolRequirementData(component);
		if (toolData) {
			if (toolData.artisanCount) {
				remainingLines.push({ group: "tools", line: `${toolData.artisanCount} artisan ${pluralizeChoiceLabel("tools", toolData.artisanCount)}` });
			}
			if (toolData.instrumentCount) {
				remainingLines.push({ group: "tools", line: `${toolData.instrumentCount} ${pluralizeChoiceLabel("instruments", toolData.instrumentCount)}` });
			}
			if (toolData.mixedCount) {
				remainingLines.push({ group: "tools", line: `${toolData.mixedCount} artisan ${pluralizeChoiceLabel("tools", toolData.mixedCount)} or ${pluralizeChoiceLabel("instruments", toolData.mixedCount)}` });
			}
			continue;
		}
		let spellData = spellRequirementData(component);
		if (spellData) {
			for (let req of mergedSpellRequirements(spellData)) {
				remainingLines.push({ group: spellData.typeLabelPlural, line: `${req.count} ${req.listName} ${pluralizeChoiceLabel(spellData.typeLabelPlural, req.count)}` });
			}
			continue;
		}
	let proficiencyData = proficiencyRequirementData(component);
	if (proficiencyData) {
		remainingLines.push(...proficiencyData.lines.map(line => ({ group: overviewRequirementGroup(line), line })));
		continue;
	}

		let firstOptions = component[0].options.join("\u0000");
		let samePool = component.every(feature => feature.options.join("\u0000") === firstOptions);
		let count = component.reduce((sum, feature) => sum + feature.count, 0);
		if (samePool) {
			remainingLines.push({ group: overviewFeatureGroup(component[0]), line: `${count} ${overviewFeatureLabel(component[0], count)}` });
		}
		else {
			for (let feature of component) {
				remainingLines.push({ group: overviewFeatureGroup(feature), line: `${feature.count} ${overviewFeatureLabel(feature, feature.count)}` });
			}
		}
	}

	return `
		<div class="mathBlock">
			<div class="mathTitle">Remaining Requirements</div>
			${overviewSection(sortOverviewLines(remainingLines))}
		</div>
	`;
}

// Checks whether a component contains only skill choices.
function componentIsSkill(component) {
	return component.every(feature => feature.options.every(isSkill));
}

// Summarizes skill requirements for the overview box.
function skillOverviewLines(components, fixedSkillCount) {
	let skillComponents = components.filter(componentIsSkill);
	if (!skillComponents.length) return [];

	let mandatoryNames = new Set();
	let lines = [];

	for (let component of skillComponents) {
		for (let feature of component) {
			if (feature.options.length === feature.count) {
				for (let option of feature.options) mandatoryNames.add(option);
				continue;
			}
			let constraint = skillFeatureConstraint(feature);
			if (constraint) lines.push(constraint.replace(/^at least /, ""));
			else lines.push(`${feature.count} ${pluralizeChoiceLabel("skills", feature.count)}`);
		}
	}

	return lines;
}

// Extracts a short source name from a feature label.
function featureSourceName(feature) {
	let source = feature.source || "";
	let match = source.match(/^(Background|Race|Class):\s*(.+)$/);
	return match?.[2] || "";
}

// Returns required tags from a choice filter.
function filterAllTags(filter) {
	return Array.isArray(filter?.tags) ? filter.tags : filter?.tags?.all || [];
}

// Returns non-generic skill tags required by a feature.
function specificSkillTags(feature) {
	return filterAllTags(feature.from).filter(tag => tag !== "skill");
}

// Checks whether a feature chooses any skill.
function featureIsAnySkillChoice(feature) {
	let tags = filterAllTags(feature.from);
	return feature.from?.type === "proficiency" &&
		tags.length === 1 &&
		tags[0] === "skill";
}

// Finds the named skill constraint for a feature.
function skillFeatureConstraint(feature) {
	if (featureIsAnySkillChoice(feature)) return "";
	let sourceName = featureSourceName(feature);
	if ((feature.source || "").startsWith("Class: ")) {
		let classTag = classTagFor(sourceName);
		if (specificSkillTags(feature).includes(classTag)) {
			return `at least ${feature.count} ${sourceName} ${pluralizeChoiceLabel("skills", feature.count)}`;
		}
		return "";
	}
	let specificTags = specificSkillTags(feature);
	if (sourceName && specificTags.length) {
		return `at least ${feature.count} ${sourceName} ${pluralizeChoiceLabel("skills", feature.count)}`;
	}
	return "";
}

// Combines spell requirements with matching spell lists.
function mergedSpellRequirements(spellData) {
	let byKey = new Map();
	for (let requirement of spellData.requirements) {
		let key = `${requirement.listName}|${spellData.typeLabelPlural}`;
		let current = byKey.get(key) || {
			listName: requirement.listName,
			count: 0
		};
		current.count += requirement.count;
		byKey.set(key, current);
	}
	return [...byKey.values()];
}

// Renders one overview section from text lines.
function overviewSection(lines) {
	let items = lines.length ? lines : ["none"];
	let lastGroup = null;
	return `
		<ul class="overviewList">
			${items.map(line => {
				if (typeof line === "string") return `<li><span>${escape(line)}</span></li>`;
				let startsGroup = line.group && lastGroup && line.group !== lastGroup;
				lastGroup = line.group || lastGroup;
				return `<li${startsGroup ? ` class="overviewGroupStart"` : ""}><span>${escape(line.line)}</span></li>`;
			}).join("")}
		</ul>
	`;
}

// Chooses the overview group for a feature line.
function overviewFeatureGroup(feature) {
	let label = feature.label.toLowerCase();
	if (label.includes("cantrip")) return "cantrips";
	if (label.includes("level 1")) return "level 1 spells";
	if (label.includes("instrument") || label.includes("gamingset") || label.includes("artisan")) return "tools";
	if (label.includes("skill")) return "skills";
	return "other";
}

// Formats one feature line for the overview.
function overviewFeatureLabel(feature, count) {
	let label = feature.label.toLowerCase();
	let source = feature.source?.startsWith("Class: ")
		? `${feature.source.replace("Class: ", "")} `
		: "";

	if (label.includes("cantrip")) return `${source}${pluralizeChoiceLabel("cantrips", count)}`;
	if (label.includes("level 1")) return `${source}level 1 ${pluralizeChoiceLabel("spells", count)}`;
	if (label.includes("instrument")) return `${pluralizeChoiceLabel("instruments", count)}`;
	if (label.includes("gamingset")) return `${pluralizeChoiceLabel("gaming sets", count)}`;
	if (label.includes("artisan")) return `artisan ${pluralizeChoiceLabel("tools", count)}`;
	if (label.includes("skill")) return `${pluralizeChoiceLabel("skills", count)}`;
	return pluralizeChoiceLabel(label, count);
}

// Checks whether a component contains only proficiencies.
function componentIsProficiency(component) {
	return component.every(feature =>
		feature.options.every(name => attributeByName.get(name)?.type === "proficiency")
	);
}

// Builds overview data for proficiency requirements.
function proficiencyRequirementData(component) {
	if (!componentIsProficiency(component) || !component.some(feature => feature.options.some(isSkill))) {
		return null;
	}
	let totalCount = component.reduce((sum, feature) => sum + feature.count, 0);
	let lines = [];
	let skillFeatures = component.filter(feature => feature.options.every(isSkill));
	lines.push(...mergeRequirementLines(
		skillFeatures.flatMap(feature => proficiencyFeatureRequirementParts(feature))
	));
	lines.push(...mergeRequirementLines(
		component
			.filter(feature => !feature.options.every(isSkill))
			.flatMap(feature => proficiencyFeatureRequirementParts(feature))
	));
	return {
		line: `${totalCount} ${pluralizeChoiceLabel("proficiencies", totalCount)}`,
		lines: lines.length ? lines : [`${totalCount} ${pluralizeChoiceLabel("proficiencies", totalCount)}`]
	};
}

// Formats requirement lines for one proficiency feature.
function proficiencyFeatureRequirementLines(feature) {
	return proficiencyFeatureRequirementParts(feature).map(part => requirementPartLine(part));
}

// Builds requirement parts for one proficiency feature.
function proficiencyFeatureRequirementParts(feature) {
	if (feature.options.every(isSkill)) {
		let constraint = skillFeatureConstraint(feature);
		return [{
			key: constraint || "skills",
			count: feature.count,
			label: count => constraint
				? constraint.replace(/^at least /, "")
				: `${count} ${pluralizeChoiceLabel("skills", count)}`
		}];
	}
	if (feature.options.every(name => hasTag(name, "artisanTool"))) {
		return [{ key: "artisan tools", count: feature.count, label: count => `${count} artisan ${pluralizeChoiceLabel("tools", count)}` }];
	}
	if (feature.options.every(name => hasTag(name, "instrument"))) {
		return [{ key: "instruments", count: feature.count, label: count => `${count} ${pluralizeChoiceLabel("instruments", count)}` }];
	}
	if (feature.options.every(name => hasTag(name, "gamingSet"))) {
		return [{ key: "gaming sets", count: feature.count, label: count => `${count} ${pluralizeChoiceLabel("gaming sets", count)}` }];
	}
	return [{ key: "proficiencies", count: feature.count, label: count => `${count} ${pluralizeChoiceLabel("proficiencies", count)}` }];
}

// Merges matching requirement parts into readable lines.
function mergeRequirementLines(parts) {
	let byKey = new Map();
	for (let part of parts) {
		let current = byKey.get(part.key) || { ...part, count: 0 };
		current.count += part.count;
		byKey.set(part.key, current);
	}
	return [...byKey.values()].map(requirementPartLine);
}

// Formats one requirement part line.
function requirementPartLine(part) {
	return part.label(part.count);
}

// Chooses the overview group for an already formatted requirement line.
function overviewRequirementGroup(line) {
	if (/\bskill\b|\bskills\b/.test(line)) return "skills";
	if (/\btool\b|\btools\b|\binstrument\b|\binstruments\b|\bgaming set\b|\bgaming sets\b/.test(line)) return "tools";
	if (/\bcantrip\b|\bcantrips\b/.test(line)) return "cantrips";
	if (/\bspell\b|\bspells\b/.test(line)) return "level 1 spells";
	return "proficiencies";
}

// Sorts overview lines by type and puts specific requirements before generic ones.
function sortOverviewLines(lines) {
	let groupOrder = {
		skills: 0,
		tools: 1,
		proficiencies: 2,
		cantrips: 3,
		"level 1 spells": 4,
		other: 5
	};
	return [...lines].sort((left, right) => {
		let leftGroup = typeof left === "string" ? "other" : left.group || "other";
		let rightGroup = typeof right === "string" ? "other" : right.group || "other";
		let groupDiff = (groupOrder[leftGroup] ?? 99) - (groupOrder[rightGroup] ?? 99);
		if (groupDiff) return groupDiff;
		return overviewLineSpecificity(right) - overviewLineSpecificity(left);
	});
}

// Scores whether an overview line names a specific source or only a generic pool.
function overviewLineSpecificity(line) {
	let text = typeof line === "string" ? line : line.line || "";
	if (/\b(skill|skills|proficiency|proficiencies)\b/.test(text) && /^\d+\s+(skill|skills|proficiency|proficiencies)$/.test(text)) {
		return 0;
	}
	if (/artisan tool or instrument/.test(text)) return 0;
	return 1;
}

// SECTION: Reusable Math Rendering Helpers
// Renders the left label column of a math row.
function renderMathTermLabel(label) {
	let parts = String(label)
		.split(/\s*,\s*/g)
		.map(part => part.trim())
		.filter(Boolean);
	if (!parts.length) parts = [label];
	return `
		<span class="mathTermLabel">
			${parts.map(part => `<span>${escape(part)}</span>`).join("")}
		</span>
	`;
}

// Renders a formula and its product value.
function renderFormula(formula, value) {
	let factors = String(formula || "")
		.split(/\s+x\s+/)
		.map(part => part.trim())
		.filter(Boolean);
	if (factors.length <= 1) {
		return `
			<code class="stackedFormula"><span>${escape(formula)}</span></code>
			<span class="formulaProduct">${format(value)}</span>
		`;
	}
	return `
		<code class="stackedFormula">
			${factors.map((factor, index) => `
				<span>${escape(factor)}${index < factors.length - 1 ? " x" : ""}</span>
			`).join("")}
		</code>
		<span class="formulaProduct">${format(value)}</span>
	`;
}

// Builds a combination formula while omitting zero-pick factors.
function combinationFormula(parts) {
	let formula = parts
		.filter(part => part.count > 0)
		.map(part => `C(${part.poolSize}, ${part.count})`)
		.join(" x ");
	return formula || "1";
}

// Renders a highlighted formula product.
function renderFormulaProduct(value) {
	return `<span class="formulaProduct">${format(value)}</span>`;
}

// Renders a total row in a math block.
function renderMathTotalRow(label, value) {
	return `
		<li>
			<span>${escape(label)}</span>
			<span class="formulaSpacer"></span>
			${renderFormulaProduct(value)}
		</li>
	`;
}

// Renders a one-row math block.
function renderSingleMathBlock(title, meta, label, formula, value) {
	return `
		<div class="mathBlock">
			<div class="mathTitle">${escape(title)}${meta ? ` <span class="mathMeta">${escape(meta)}</span>` : ""}</div>
			<ul class="mathList">
				<li>
					${renderMathTermLabel(label)}
					${renderFormula(formula, value)}
				</li>
			</ul>
		</div>
	`;
}

// SECTION: Math Block Routing And Region Math
// Formats one simple skill requirement term.
function skillRequirementTermLabel(data, term) {
	return term.label;
}

// Routes a component to the best math renderer.
function componentMathHTML(component) {
	if (component.length === 1) {
		let feature = component[0];
		let title = mathCategoryTitle(feature);
		return renderSingleMathBlock(
			title,
			singleFeatureMathMeta(feature),
			title === "Tool Math"
				? proficiencyFeatureRequirementLines(feature).join(", ")
				: featureMathLabel(feature),
			`C(${feature.options.length}, ${feature.count})`,
			choose(feature.options.length, feature.count)
		);
	}

	let firstOptions = component[0].options.join("\u0000");
	let samePool = component.every(feature => feature.options.join("\u0000") === firstOptions);
	if (samePool) {
		let totalCount = component.reduce((sum, feature) => sum + feature.count, 0);
		let title = mathCategoryTitle(component[0]);
		let combinedFeature = { ...component[0], count: totalCount };
		return renderSingleMathBlock(
			title,
			singleFeatureMathMeta(component[0]),
			title === "Tool Math"
				? proficiencyFeatureRequirementLines(combinedFeature).join(", ")
				: `${totalCount} ${pluralizeChoiceLabel("choices", totalCount)}`,
			`C(${component[0].options.length}, ${totalCount})`,
			choose(component[0].options.length, totalCount)
		);
	}

	let regionData = generalRegionMathData(component);
	let title = componentIsProficiency(component) && component.some(feature => feature.options.some(isSkill))
		? "Skill Math"
		: "Choice Math";
	let termHtml = regionData.terms.map(term => `
		<li>
			${renderMathTermLabel(term.label)}
			${renderFormula(term.formula, term.value)}
		</li>
	`).join("");
	return `
		<div class="mathBlock">
			<div class="mathTitle">${title} <span class="mathMeta">${escape(regionData.meta)}</span></div>
			<ul class="mathList">${termHtml}</ul>
			${regionData.terms.length > 1 ? `<ul class="mathList">
				${renderMathTotalRow(title === "Skill Math" ? "skill/proficiency sets" : "choice sets", regionData.total)}
			</ul>` : ""}
		</div>
	`;
}

// Chooses the title for a single-feature math block.
function mathCategoryTitle(feature) {
	let label = feature.label.toLowerCase();
	if (label.includes("cantrip")) return "Cantrip Math";
	if (label.includes("level 1")) return "Level 1 Spell Math";
	if (
		label.includes("instrument") ||
		label.includes("tool") ||
		(feature.options || []).every(name => hasTag(name, "tool"))
	) return "Tool Math";
	if (label.includes("skill")) return "Skill Math";
	return featureMathLabel(feature);
}

// Builds pool metadata for a single-feature math block.
function singleFeatureMathMeta(feature) {
	let options = feature.options || [];
	if (options.length && options.every(name => hasTag(name, "instrument"))) return `instruments: ${options.length}`;
	if (options.length && options.every(name => hasTag(name, "artisanTool"))) return `artisan tools: ${options.length}`;
	if (options.length && options.every(name => hasTag(name, "gamingSet"))) return `gaming sets: ${options.length}`;
	return "";
}

// Renders combined skill math across components.
function skillComponentsMathHTML(components, fixedSkillCount) {
	let displayComponents = components.filter(component => countDistinctChoiceSets(component) !== 1n);
	if (!displayComponents.length) return "";
	if (displayComponents.length === 1) {
		let specialized = skillRequirementMathHTML(displayComponents[0], fixedSkillCount);
		if (specialized) return specialized;
		if (displayComponents[0].length === 1) return componentMathHTML(displayComponents[0]);
	}

	let sections = displayComponents.map(component => skillComponentMathParts(component, fixedSkillCount));
	let total = sections.reduce((product, section) => product * section.total, 1n);
	let termCount = sections.reduce((sum, section) => sum + section.terms.length, 0);
	let termHtml = sections.length > 1 && sections.every(section => section.simple)
		? combinedSimpleSkillTermHTML(sections, total)
		: sections.flatMap(section => section.terms).join("");
	let showSummary = termCount > 1 && !(sections.length > 1 && sections.every(section => section.simple));
	let meta = skillMathMeta(sections);

	return `
		<div class="mathBlock">
			<div class="mathTitle">Skill Math${meta ? ` <span class="mathMeta">${escape(meta)}</span>` : ""}</div>
			<ul class="mathList">${termHtml}</ul>
			${showSummary ? `<ul class="mathList">
				${renderMathTotalRow("skill sets", total)}
			</ul>` : ""}
		</div>
	`;
}

// Builds skill math sections and factors for a component.
function skillComponentMathParts(component, fixedSkillCount) {
	let data = skillRequirementData(component, fixedSkillCount);
	if (data) {
		let terms = data.terms.map(term => `
			<li>
				${renderMathTermLabel(skillRequirementTermLabel(data, term))}
				${renderFormula(term.formula, term.value)}
			</li>
		`);
		if (
			data.otherPool.length === 0 &&
			data.terms.length === 1
		) {
			let label = `${data.remainingPicks} ${data.className}`;
			terms = [`
				<li>
					${renderMathTermLabel(label)}
					${renderFormula(`C(${data.classPool.length}, ${data.remainingPicks})`, data.total)}
				</li>
			`];
			return {
				terms,
				total: data.total,
				simple: {
					label,
					poolSize: data.classPool.length,
					count: data.remainingPicks
				}
			};
		}
		return { terms, total: data.total };
	}

	if (component.length === 1) {
		let feature = component[0];
		let total = choose(feature.options.length, feature.count);
		return {
			total,
			simple: {
				label: skillFeatureTermLabel(feature),
				poolSize: feature.options.length,
				count: feature.count
			},
			terms: [`
				<li>
					${renderMathTermLabel(skillFeatureTermLabel(feature))}
					${renderFormula(`C(${feature.options.length}, ${feature.count})`, total)}
				</li>
			`]
		};
	}

	let firstOptions = component[0].options.join("\u0000");
	let samePool = component.every(feature => feature.options.join("\u0000") === firstOptions);
	if (samePool) {
		let totalCount = component.reduce((sum, feature) => sum + feature.count, 0);
		let total = choose(component[0].options.length, totalCount);
		return {
			total,
			terms: [`
				<li>
					${renderMathTermLabel(`${totalCount} ${pluralizeChoiceLabel("skills", totalCount)}`)}
					${renderFormula(`C(${component[0].options.length}, ${totalCount})`, total)}
				</li>
			`]
		};
	}

	let regionData = skillRegionMathData(component);
	return {
		total: regionData.total,
		meta: regionData.meta,
		formula: regionData.terms.map(term => format(term.value)).join(" + "),
		terms: regionData.terms.map(term => `
			<li>
				${renderMathTermLabel(term.label)}
				${renderFormula(term.formula, term.value)}
			</li>
		`)
	};
}

// Builds the combined skill math pool summary.
function skillMathMeta(sections) {
	return sections
		.map(section => section.meta)
		.filter(Boolean)
		.join("; ");
}

// Enumerates count allocations across mutually exclusive overlap regions.
function overlapRegionTerms(regions, totalPickCount, isValidPicked) {
	let picked = new Map();
	let terms = [];
	let total = 0n;

	function regionKey(region) {
		return region.id ?? region.mask ?? region.key;
	}

	function visit(index, remaining, ways) {
		if (index === regions.length) {
			if (remaining !== 0 || !isValidPicked(picked, regions)) return;
			let formulaParts = [];
			let labelParts = [];
			for (let region of regions) {
				let count = picked.get(regionKey(region)) || 0;
				if (!count) continue;
				formulaParts.push({ poolSize: region.options.length, count });
				labelParts.push(countedRegionLabel(count, region.label));
			}
			terms.push({
				label: labelParts.join(", "),
				formula: combinationFormula(formulaParts),
				value: ways
			});
			total += ways;
			return;
		}

		let region = regions[index];
		let key = regionKey(region);
		let max = Math.min(region.options.length, remaining);
		for (let count = 0; count <= max; count++) {
			picked.set(key, count);
			visit(index + 1, remaining - count, ways * choose(region.options.length, count));
		}
		picked.delete(key);
	}

	visit(0, totalPickCount, 1n);
	return {
		total,
		terms: terms.filter(term => term.value > 0n)
	};
}

// Builds overlap-region combinatorics terms for a component.
function regionMathData(component, labelForMask, metaForRegions) {
	let totalPickCount = component.reduce((sum, feature) => sum + feature.count, 0);
	let optionMasks = new Map();
	component.forEach((feature, featureIndex) => {
		for (let option of feature.options) {
			optionMasks.set(option, (optionMasks.get(option) || 0) | (1 << featureIndex));
		}
	});

	let regionsByMask = new Map();
	for (let [option, mask] of optionMasks.entries()) {
		if (!regionsByMask.has(mask)) regionsByMask.set(mask, []);
		regionsByMask.get(mask).push(option);
	}

	let regions = [...regionsByMask.entries()]
		.sort(([left], [right]) => left - right)
		.map(([mask, options]) => ({
			mask,
			id: mask,
			options: options.sort(),
			label: labelForMask(mask, component)
		}))
		.sort((left, right) => compareMathLabels(left.label, right.label));

	let result = overlapRegionTerms(
		regions,
		totalPickCount,
		picked => regionPicksCanAssign(picked, regions, component)
	);
	return {
		total: result.total,
		terms: result.terms,
		meta: metaForRegions(regions, component)
	};
}

// Builds overlap-region data for skill components.
function skillRegionMathData(component) {
	return regionMathData(
		component,
		skillRegionLabel,
		skillRegionSummary
	);
}

// Summarizes skill-region pool sizes.
function skillRegionSummary(regions, component) {
	return regions
		.slice()
		.sort((left, right) => compareMathLabels(
			skillRegionSummaryLabel(left.mask, component),
			skillRegionSummaryLabel(right.mask, component)
		))
		.map(region => `${skillRegionSummaryLabel(region.mask, component)}: ${region.options.length}`)
		.join(", ");
}

// Labels one skill-region pool summary.
function skillRegionSummaryLabel(mask, component) {
	let names = component
		.map((feature, index) => (mask & (1 << index) && !featureIsAnySkillChoice(feature) ? featureSourceName(feature) : null))
		.filter(Boolean);
	if (!names.length) return constrainedSkillRegionNames(component).length ? "other" : "general";
	return names.join("/");
}

// Checks whether region picks can satisfy feature counts.
function regionPicksCanAssign(picked, regions, component) {
	function canAssign(regionIndex, remaining) {
		if (regionIndex === regions.length) return remaining.every(count => count === 0);

		let region = regions[regionIndex];
		let chosen = picked.get(region.mask) || 0;
		let featureIndexes = component
			.map((_, index) => index)
			.filter(index => region.mask & (1 << index));

		function distribute(featureOffset, left, nextRemaining) {
			if (featureOffset === featureIndexes.length) {
				return left === 0 && canAssign(regionIndex + 1, nextRemaining);
			}

			let featureIndex = featureIndexes[featureOffset];
			let maxUse = Math.min(left, nextRemaining[featureIndex]);
			for (let use = 0; use <= maxUse; use++) {
				let after = [...nextRemaining];
				after[featureIndex] -= use;
				if (distribute(featureOffset + 1, left - use, after)) return true;
			}
			return false;
		}

		return distribute(0, chosen, [...remaining]);
	}

	return canAssign(0, component.map(feature => feature.count));
}

// Labels one skill-region term.
function skillRegionLabel(mask, component) {
	let names = component
		.map((feature, index) => (mask & (1 << index) && !featureIsAnySkillChoice(feature) ? featureSourceName(feature) : null))
		.filter(Boolean);
	return names.length ? names.join("/") : genericSkillRegionLabel(component);
}

// Builds overlap-region data for general components.
function generalRegionMathData(component) {
	return regionMathData(
		component,
		generalRegionLabel,
		generalRegionSummary
	);
}

// Summarizes general-region pool sizes.
function generalRegionSummary(regions, component) {
	return regions
		.slice()
		.sort((left, right) => compareMathLabels(
			generalRegionSummaryLabel(left.mask, component),
			generalRegionSummaryLabel(right.mask, component)
		))
		.map(region => `${generalRegionSummaryLabel(region.mask, component)}: ${region.options.length}`)
		.join(", ");
}

// Labels one general-region term.
function generalRegionLabel(mask, component) {
	let descriptors = generalRegionDescriptors(mask, component);
	if (descriptors.length === 1) return descriptors[0].label;
	if (descriptors.every(descriptor => descriptor.kind === "skill")) {
		let names = descriptors
			.map(descriptor => descriptor.summary)
			.filter(name => name !== "skills");
		return names.length ? names.join("/") : "skills";
	}
	return descriptors.map(descriptor => descriptor.label).join(" / ");
}

// Adds a count and pluralization to a region label.
function countedRegionLabel(count, label) {
	let countedLabel = label;
	if (count === 1) {
		countedLabel = pluralizeChoiceLabel(countedLabel, count)
			.replace(/\bproficiencies\b/g, "proficiency");
	}
	return `${count} ${countedLabel}`;
}

// Labels one general-region pool summary.
function generalRegionSummaryLabel(mask, component) {
	let descriptors = generalRegionDescriptors(mask, component);
	if (descriptors.length === 1 && descriptors[0].key === "general") return "other proficiencies";
	if (descriptors.every(descriptor => descriptor.kind === "skill")) {
		let constrainedNames = constrainedSkillRegionNames(component);
		let names = descriptors
			.map(descriptor => descriptor.summary)
			.filter(name => name !== "skills");
		if (!names.length && constrainedNames.length) {
			return "other";
		}
		return names.length ? names.join("/") : "skills";
	}
	let constrainedCount = component.filter(feature => !featureRegionDescriptor(feature).general).length;
	let names = descriptors.map(descriptor => descriptor.summary);
	if (names.length === 1) return names[0];
	return names.join("/");
}

// Builds descriptors for one general overlap region.
function generalRegionDescriptors(mask, component) {
	let descriptors = component
		.map((feature, index) => (mask & (1 << index) ? featureRegionDescriptor(feature) : null))
		.filter(Boolean)
		.filter(descriptor => !descriptor.general);
	descriptors = [...new Map(descriptors.map(descriptor => [descriptor.key, descriptor])).values()];
	return descriptors.length ? descriptors : [{
		key: "general",
		label: "proficiencies",
		summary: "general",
		kind: "general",
		general: true
	}];
}

// Builds the descriptor for a feature region.
function featureRegionDescriptor(feature) {
	let sourceName = featureSourceName(feature);
	let label = feature.label.toLowerCase();
	let options = feature.options || [];
	let allSkills = options.length > 0 && options.every(isSkill);
	if (label.includes("skilled") || (!sourceName && label.includes("proficien"))) {
		return {
			key: "general",
			label: "proficiencies",
			summary: "general",
			kind: "general",
			general: true
		};
	}
	if (sourceName && allSkills) {
		if (featureIsAnySkillChoice(feature)) {
			return {
				key: "general-skills",
				label: "skills",
				summary: "skills",
				kind: "skill"
			};
		}
		return {
			key: `skill:${sourceName}`,
			label: sourceName,
			summary: sourceName,
			kind: "skill"
		};
	}
	let name = sourceName || (label.includes("crafter") ? "Crafter" : label.includes("musician") ? "Musician" : titleCase(feature.label));
	let kind = "proficiencies";
	if (options.length && options.every(option => hasTag(option, "instrument"))) kind = "instruments";
	else if (options.length && options.every(option => hasTag(option, "artisanTool"))) kind = "artisan tools";
	else if (options.length && options.every(option => hasTag(option, "gamingSet"))) kind = "gaming sets";
	else if (options.length && options.every(option => hasTag(option, "tool") || hasTag(option, "instrument"))) kind = "tool choices";
	if (featureIsFullToolPool(feature, kind)) name = kind;
	let nameMatchesKind = name.toLowerCase() === kind;
	let summary = kind === "proficiencies"
		? name
		: nameMatchesKind
			? kind
			: `${name} ${kind}`;
	let displayLabel = nameMatchesKind
		? kind
		: `${name} ${kind}`;
	return {
		key: `${kind}:${name}`,
		label: displayLabel,
		summary,
		kind
	};
}

// Checks whether a feature spans a complete tool pool.
function featureIsFullToolPool(feature, kind) {
	let tagByKind = {
		"instruments": "instrument",
		"artisan tools": "artisanTool",
		"gaming sets": "gamingSet"
	};
	let tag = tagByKind[kind];
	if (!tag) return false;
	let fullPoolSize = getAttributes({ type: "proficiency", tags: { all: [tag] } }).length;
	return (feature.options || []).length === fullPoolSize &&
		feature.options.every(option => hasTag(option, tag));
}

// Renders a simple combined skill term.
function combinedSimpleSkillTermHTML(sections, total) {
	let label = sections
		.map(section => section.simple.label)
		.join(", ");
	let formula = sections
		.map(section => `C(${section.simple.poolSize}, ${section.simple.count})`)
		.join(" x ");
	return `
		<li>
			${renderMathTermLabel(label)}
			${renderFormula(formula, total)}
		</li>
	`;
}

// Labels a simple skill feature term.
function skillFeatureTermLabel(feature) {
	let constraint = skillFeatureConstraint(feature);
	if (constraint) return constraint.replace(/^at least /, "").replace(/\s+skills?$/, "");
	return `${feature.count} ${pluralizeChoiceLabel("skills", feature.count)}`;
}

// SECTION: Specialized Skill Tool And Spell Math
// Renders class-style skill requirement math.
function skillRequirementMathHTML(component, fixedSkillCount) {
	let data = skillRequirementData(component, fixedSkillCount);
	if (!data) return null;

	if (
		data.otherPool.length === 0 &&
		data.terms.length === 1 &&
		data.terms[0].classPicks === data.remainingPicks
	) {
		return renderSingleMathBlock(
			"Skill Math",
			skillPoolSummary(data),
			`${data.remainingPicks} ${data.className}`,
			`C(${data.classPool.length}, ${data.remainingPicks})`,
			data.total
		);
	}

	let termHtml = data.terms.map(term => `
		<li>
			${renderMathTermLabel(skillRequirementTermLabel(data, term))}
			${renderFormula(term.formula, term.value)}
		</li>
	`).join("");
	return `
		<div class="mathBlock">
			<div class="mathTitle">Skill Math <span class="mathMeta">${escape(skillPoolSummary(data))}</span></div>
			<ul class="mathList">${termHtml}</ul>
			<ul class="mathList">
				${renderMathTotalRow("skill sets", data.total)}
			</ul>
		</div>
	`;
}

// Builds data for class-style skill requirement math.
function skillRequirementData(component) {
	if (!component.every(feature => feature.options.every(isSkill))) return null;

	let classFeature = component.find(feature => feature.source?.startsWith("Class: "));
	if (!classFeature) return null;

	if (component.some(feature =>
		!feature.source?.startsWith("Class: ") &&
		feature.options.length !== feature.count &&
		specificSkillTags(feature).length
	)) {
		return null;
	}

	let className = classFeature.source.replace("Class: ", "");
	let classTag = classTagFor(className);
	if (!classFeature.options.every(name => attributeByName.get(name)?.tags.includes(classTag))) {
		return null;
	}

	let mandatoryNames = new Set();
	for (let feature of component) {
		if (feature.source?.startsWith("Class: ")) continue;
		if (feature.options.length === feature.count) {
			for (let option of feature.options) mandatoryNames.add(option);
		}
	}

	let remainingPool = [...new Set(component.flatMap(feature => feature.options))]
		.filter(name => !mandatoryNames.has(name));
	let classPool = remainingPool.filter(name =>
		attributeByName.get(name)?.tags.includes(classTag)
	);
	let otherPool = remainingPool.filter(name =>
		!attributeByName.get(name)?.tags.includes(classTag)
	);
	let remainingPicks =
		component.reduce((sum, feature) => sum + feature.count, 0) -
		mandatoryNames.size;
	let atLeastClass = classFeature.count;
	let regions = [
		{ id: "class", label: className, options: classPool },
		{ id: "other", label: "other", options: otherPool }
	].filter(region => region.options.length);
	let result = overlapRegionTerms(
		regions,
		remainingPicks,
		picked => (picked.get("class") || 0) >= atLeastClass
	);

	return {
		className,
		mandatoryNames,
		remainingPicks,
		atLeastClass,
		classPool,
		otherPool,
		terms: result.terms,
		total: result.total
	};
}

// Summarizes class and other skill pool sizes.
function skillPoolSummary(data) {
	return `${data.className}: ${data.classPool.length}, other: ${data.otherPool.length}`;
}

// Renders mixed artisan-tool/instrument math.
function toolRequirementMathHTML(component) {
	let data = toolRequirementData(component);
	if (!data) return null;

	if (data.terms.length === 1) {
		let term = data.terms[0];
		return `
			<div class="mathBlock">
				<div class="mathTitle">Tool Math <span class="mathMeta">${escape(toolPoolSummary(data))}</span></div>
				<ul class="mathList">
					<li>
						${renderMathTermLabel(term.label)}
						${renderFormula(term.formula, term.value)}
					</li>
				</ul>
			</div>
		`;
	}

	let termHtml = data.terms.map(term => `
		<li>
			${renderMathTermLabel(term.label)}
			${renderFormula(term.formula, term.value)}
		</li>
	`).join("");
	return `
		<div class="mathBlock">
			<div class="mathTitle">Tool Math</div>
			<ul class="mathList">${termHtml}</ul>
			<ul class="mathList">
				${renderMathTotalRow("tool sets", data.total)}
			</ul>
		</div>
	`;
}

// Builds mixed artisan-tool/instrument math data.
function toolRequirementData(component) {
	let allOptions = [...new Set(component.flatMap(feature => feature.options))];
	if (!allOptions.length) return null;
	if (!allOptions.every(name => hasTag(name, "artisanTool") || hasTag(name, "instrument"))) return null;

	let artisanOnlyCount = 0;
	let instrumentOnlyCount = 0;
	let mixedCount = 0;
	for (let feature of component) {
		let hasArtisan = feature.options.some(name => hasTag(name, "artisanTool"));
		let hasInstrument = feature.options.some(name => hasTag(name, "instrument"));
		let allArtisan = feature.options.every(name => hasTag(name, "artisanTool"));
		let allInstrument = feature.options.every(name => hasTag(name, "instrument"));
		let allMixedTool = feature.options.every(name =>
			hasTag(name, "artisanTool") || hasTag(name, "instrument")
		);

		if (allArtisan) artisanOnlyCount += feature.count;
		else if (allInstrument) instrumentOnlyCount += feature.count;
		else if (allMixedTool && hasArtisan && hasInstrument) mixedCount += feature.count;
		else return null;
	}

	if (!artisanOnlyCount && !instrumentOnlyCount && !mixedCount) return null;

	let artisanPool = allOptions.filter(name => hasTag(name, "artisanTool"));
	let instrumentPool = allOptions.filter(name => hasTag(name, "instrument"));
	let regions = [
		{ id: "artisan", label: "artisan tools", options: artisanPool },
		{ id: "instrument", label: "instruments", options: instrumentPool }
	].filter(region => region.options.length);
	let totalPickCount = artisanOnlyCount + instrumentOnlyCount + mixedCount;
	let result = overlapRegionTerms(
		regions,
		totalPickCount,
		picked =>
			(picked.get("artisan") || 0) >= artisanOnlyCount &&
			(picked.get("instrument") || 0) >= instrumentOnlyCount
	);

	return {
		artisanCount: artisanOnlyCount,
		instrumentCount: instrumentOnlyCount,
		mixedCount,
		artisanPool,
		instrumentPool,
		terms: result.terms,
		total: result.total
	};
}

// Summarizes tool pool sizes.
function toolPoolSummary(data) {
	let parts = [];
	if (data.artisanPool.length && (data.artisanCount || data.mixedCount)) {
		parts.push(`artisan tools: ${data.artisanPool.length}`);
	}
	if (data.instrumentPool.length && (data.instrumentCount || data.mixedCount)) {
		parts.push(`instruments: ${data.instrumentPool.length}`);
	}
	return parts.join(", ");
}

// Renders overlapping spell-list math.
function spellRequirementMathHTML(component) {
	let data = spellRequirementData(component);
	if (!data) return null;

	if (data.terms.length === 1) {
		let term = data.terms[0];
		return renderSingleMathBlock(
			data.title,
			spellPoolSummary(data),
			term.label,
			term.formula,
			term.value
		);
	}

	let termHtml = data.terms.map(term => `
		<li>
			${renderMathTermLabel(term.label)}
			${renderFormula(term.formula, term.value)}
		</li>
	`).join("");
	return `
		<div class="mathBlock">
			<div class="mathTitle">${escape(data.title)} <span class="mathMeta">${escape(spellPoolSummary(data))}</span></div>
			<ul class="mathList">${termHtml}</ul>
			<ul class="mathList">
				${renderMathTotalRow(data.resultLabel, data.total)}
			</ul>
		</div>
	`;
}

// Builds overlapping spell-list math data.
function spellRequirementData(component) {
	let types = new Set(component.flatMap(feature =>
		feature.options.map(name => attributeByName.get(name)?.type)
	));
	types.delete(undefined);
	if (types.size !== 1) return null;
	let type = [...types][0];
	if (type !== "cantrip" && type !== "level1spell") return null;

	let requirements = component.map(feature => {
		let tag = inferSpellListTag(feature, type);
		if (!tag) return null;
		return {
			feature,
			tag,
			listName: titleCase(tag),
			count: feature.count
		};
	});
	if (requirements.some(requirement => !requirement)) return null;

	let universe = [...new Set(component.flatMap(feature => feature.options))].sort();
	let totalPickCount = component.reduce((sum, feature) => sum + feature.count, 0);
	let regions = spellRegions(universe, requirements, type)
		.map(region => ({
			...region,
			id: region.key,
			label: spellRegionLabel(region.key)
		}));
	let result = overlapRegionTerms(
		regions,
		totalPickCount,
		picked => spellPickedRegionsSatisfy(picked, regions, requirements)
	);

	let title = type === "cantrip" ? "Cantrip Math" : "Level 1 Spell Math";
	let typeLabelPlural = type === "cantrip" ? "cantrips" : "level 1 spells";
	return {
		type,
		typeLabelPlural,
		requirements,
		regions,
		terms: result.terms,
		total: result.total,
		title,
		resultLabel: type === "cantrip" ? "cantrip sets" : "level 1 spell sets"
	};
}

// Summarizes spell-region pool sizes.
function spellPoolSummary(data) {
	if (data.requirements.length === 1) {
		return `${data.requirements[0].listName}: ${data.requirements[0].feature.options.length}`;
	}
	let regionParts = data.regions.map(region => {
		let label = spellRegionLabel(region.key);
		return `${label}: ${region.options.length}`;
	});
	return regionParts.join(", ");
}

// Infers the spell-list tag for a spell choice.
function inferSpellListTag(feature, type) {
	let knownTags = ["bard", "cleric", "druid", "paladin", "ranger", "sorcerer", "warlock", "wizard"];
	let filterTags = Array.isArray(feature.from?.tags)
		? feature.from.tags
		: feature.from?.tags?.all || [];
	let explicit = filterTags.find(tag => knownTags.includes(tag));
	if (explicit) return explicit;

	let featureSet = new Set(feature.options);
	return knownTags.find(tag => {
		let list = getAttributes({ type, tags: { all: [tag] } }).map(attribute => attribute.name);
		return list.length === featureSet.size && list.every(name => featureSet.has(name));
	});
}

// Groups spells by shared list membership.
function spellRegions(universe, requirements, type) {
	let regionMap = new Map();
	for (let name of universe) {
		let labels = requirements
			.filter(requirement => hasTag(name, requirement.tag))
			.map(requirement => requirement.listName)
			.sort();
		if (!labels.length) continue;
		let key = labels.join("|");
		if (!regionMap.has(key)) {
			regionMap.set(key, { key, labels, options: [] });
		}
		regionMap.get(key).options.push(name);
	}
	return [...regionMap.values()].sort((a, b) =>
		a.labels.length - b.labels.length || a.key.localeCompare(b.key)
	);
}

// Checks whether picked spell regions satisfy every spell-list requirement.
function spellPickedRegionsSatisfy(picked, regions, requirements) {
	return requirements.every(requirement => {
		let count = regions.reduce((sum, region) => {
			if (!region.labels.includes(requirement.listName)) return sum;
			return sum + (picked.get(region.key) || 0);
		}, 0);
		return count >= requirement.count;
	});
}

// Formats one spell-region label.
function spellRegionLabel(key) {
	return [...new Set(key.split("|"))].join("/");
}

// SECTION: Source Description Helpers
// Converts an identifier-like label to title case.
function titleCase(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

// Returns the display label for a feature in math output.
function featureMathLabel(feature) {
	return feature.source ? `${feature.source} ${feature.label}` : feature.label;
}

// Returns origin feats granted by a source.
function featsFromSource(source) {
	let feats = [];
	if (source?.originFeat) feats.push(source.originFeat);
	if (source?.originFeats) feats.push(...source.originFeats);
	if (source?.magicInitiate && !feats.includes("Magic Initiate")) feats.push("Magic Initiate");
	return feats;
}

// Builds the fixed, choice, and modifier display data for a source.
function describeSource(entry, fixed, forcedItems = [], branchSpellChoices = null, suppressedFixedItems = [], branchSourceChoices = [], branchSourceModifiers = []) {
	let source = entry.source;
	let fixedFromChoices = (source.choices || [])
		.flatMap(choice => choiceFixedNames(choice, fixed));
	let fixedFromBranchChoices = branchSourceChoices
		.flatMap(choice => choiceFixedNames(choice, fixed));
	let suppressed = new Set(suppressedFixedItems);
	let fixedItems = [...new Set([
		...(source.fixed || []).filter(name => !suppressed.has(name)),
		...forcedItems,
		...fixedFromChoices,
		...fixedFromBranchChoices
	])];
	let fixedFromBranchSet = new Set(fixedFromBranchChoices);
	let modifiers = source.modifiers
		? Object.entries(source.modifiers).map(([label, value]) => `${label}: ${format(value)}`)
		: [];
	modifiers.push(...branchSourceModifiers.map(({ label, value }) => `${label}: ${format(value)}`));
	let modifierFactors = modifierEntries(source).concat(
		branchSourceModifiers.filter(modifier => !modifier.displayOnly)
	);
	let modifierWeight = modifierFactors.reduce((total, modifier) => total * modifier.value, 1n);
	let combinedChoiceSummary = combinedFeatChoiceSummary(source, fixed);
	let choices = combinedChoiceSummary
		? [combinedChoiceSummary.text]
		: (source.choices || [])
			.filter(choice => !(branchSpellChoices && choiceIsSpellChoice(choice)))
			.filter(choice => !choiceCoveredByForced(choice, forcedItems))
			.map(choice => choiceSummary(choice, fixed, forcedItems))
			.filter(Boolean);
	choices.push(...grantedFeatChoiceSummaries(source, fixed, combinedChoiceSummary?.absorbedFeats || []));
	choices.push(...branchSourceChoices
		.filter(choice => !choiceFixedNames(choice, fixed).some(name => fixedFromBranchSet.has(name)))
		.map(choice => choiceSummary(choice, fixed))
		.filter(Boolean));
	choices.push(...dynamicSpellChoiceSummaries(entry.name, source, fixed, branchSpellChoices));
	return {
		kind: entry.kind,
		name: entry.name,
		fixedItems: fixedItemSummary(fixedItems),
		fixedGroups: fixedItemGroups(fixedItems),
		modifiers,
		modifierFactors,
		modifierWeight,
		choices,
		feats: []
	};
}

// Summarizes choices granted by source feats.
function grantedFeatChoiceSummaries(source, fixed, absorbedFeats = []) {
	let summaries = [];
	for (let feat of featsFromSource(source)) {
		if (absorbedFeats.includes(feat)) continue;
		if (feat === "Magic Initiate") {
			let lists = magicInitiateListsFromSource(source);
			for (let list of lists) {
				summaries.push(...magicInitiateChoices(list).map(choice =>
					choiceSummary(choice, fixed)
				));
			}
			continue;
		}
		summaries.push(...specialFeatChoices(feat).map(choice =>
			choiceSummary(choice, fixed)
		));
	}
	return summaries.filter(Boolean);
}

// Summarizes spell choices after branch consolidation.
function dynamicSpellChoiceSummaries(sourceName, source, fixed, branchSpellChoices = null) {
	let features = branchSpellChoices || [];
	let grouped = new Map();
	for (let feature of features) {
		let options = choicePool(feature, fixed);
		let type = spellChoiceType(options);
		if (!type) continue;
		let tag = inferSpellListTag({ ...feature, options }, type);
		if (!tag) continue;
		let key = `${type}|${tag}`;
		let current = grouped.get(key) || {
			type,
			tag,
			count: 0,
			pool: options.length
		};
		current.count += feature.count;
		grouped.set(key, current);
	}
	return [...grouped.values()].map(group => {
		let label = group.type === "cantrip" ? "cantrips" : "level 1 spells";
		return `${titleCase(group.tag)} ${label}: ${countPoolLabel(group.count, group.pool)}`;
	});
}

// Returns fixed item names grouped as text.
function fixedItemSummary(items) {
	return fixedItemGroups(items)
		.map(group => `${group.label}: ${group.names.join(", ")}`)
		.join("; ") || "None";
}

// Groups fixed items by display type.
function fixedItemGroups(items) {
	if (!items.length) return [];
	let groups = [
		{ label: "Skills", names: [] },
		{ label: "Cantrips", names: [] },
		{ label: "Level 1 spells", names: [] },
		{ label: "Tools", names: [] },
		{ label: "Other", names: [] }
	];
	let byLabel = new Map(groups.map(group => [group.label, group.names]));

	for (let name of items) {
		let attribute = attributeByName.get(name);
		if (attribute?.type === "cantrip") byLabel.get("Cantrips").push(name);
		else if (attribute?.type === "level1spell") byLabel.get("Level 1 spells").push(name);
		else if (attribute?.type === "proficiency" && attribute.tags.includes("skill")) byLabel.get("Skills").push(name);
		else if (attribute?.type === "proficiency") byLabel.get("Tools").push(name);
		else byLabel.get("Other").push(name);
	}

	return groups
		.filter(group => group.names.length);
}

// Combines background feat choices with default tool choices.
function combinedFeatChoiceSummary(source, fixed) {
	let feats = featsFromSource(source);
	let choices = source.choices || [];
	let artisanChoice = choices.find(choice =>
		getAttributes(choice.from).every(attribute => attribute.tags.includes("artisanTool"))
	);
	if (feats.includes("Crafter") && artisanChoice) {
		let count = artisanChoice.count + 3;
		let pool = choicePool(artisanChoice, fixed).length;
		return {
			text: `artisan tools: ${countPoolLabel(count, pool)}`,
			absorbedFeats: ["Crafter"]
		};
	}

	let instrumentChoice = choices.find(choice =>
		getAttributes(choice.from).every(attribute => attribute.tags.includes("instrument"))
	);
	if (feats.includes("Musician") && instrumentChoice) {
		let count = instrumentChoice.count + 3;
		let pool = choicePool(instrumentChoice, fixed).length;
		return {
			text: `instruments: ${countPoolLabel(count, pool)}`,
			absorbedFeats: ["Musician"]
		};
	}

	return null;
}

// Checks whether a choice is already represented by forced items.
function choiceCoveredByForced(choice, forcedItems) {
	if (!forcedItems.length) return false;
	let forcedSet = new Set(forcedItems);
	let rawNames = getAttributes(choice.from).map(attribute => attribute.name);
	return rawNames.length > 0 && rawNames.every(name => forcedSet.has(name));
}

// SECTION: Page Rendering And Controls
// Renders totals and the branch table to the page.
function render(result, elapsedMs) {
	let totalBox = document.getElementById("totalBox");
	let results = document.getElementById("results");

	totalBox.innerHTML = `
		<strong>Total weight:</strong>
		${format(result.baseWeight)}
		&times; ${format(result.globalLanguageWeight)}
		&times; ${format(result.pointBuyWeight)}
		= ${format(result.finalWeight)}
		<br>
		<span>Time: ${elapsedMs.toFixed(2)}ms</span>
	`;

	results.innerHTML = `
		${renderMainTable(result)}
	`;
}

// Renders the main branch result table.
function renderMainTable(result) {
	let rows = result.branchRows.map((row, index) => {
		let hasModifiers = totalModifierWeight(row) !== 1n || row.branchMultiplier !== 1n;
		let sourceRows = row.sourceRows;
		let background = sourceRows.find(source => source.kind === "Background");
		let race = sourceRows.find(source => source.kind === "Race");
		let classRow = sourceRows.find(source => source.kind === "Class");
		let rowSpan = hasModifiers ? 5 : 4;
		return `
			<tr class="sourceNameRow">
				<td rowspan="${rowSpan}">${index + 1}</td>
				<td>${renderSourceName(background, result.backgroundName)}</td>
				<td>${renderSourceName(race, result.raceName)}</td>
				<td>${renderSourceName(classRow, result.className)}</td>
				<td class="mathCell" rowspan="4">
					<div class="branchLabel">${escape(row.label)}</div>
					${row.mathHtml}
				</td>
				<td rowspan="${rowSpan}">${format(row.baseWeight)}</td>
			</tr>
			<tr class="sourceSectionRow">
				<td>${renderSourceSection(background, "Fixed")}</td>
				<td>${renderSourceSection(race, "Fixed")}</td>
				<td>${renderSourceSection(classRow, "Fixed")}</td>
			</tr>
			<tr class="sourceSectionRow">
				<td>${renderSourceSection(background, "Choices")}</td>
				<td>${renderSourceSection(race, "Choices")}</td>
				<td>${renderSourceSection(classRow, "Choices")}</td>
			</tr>
			<tr class="sourceSectionRow">
				<td>${renderSourceSection(background, "Mods")}</td>
				<td>${renderSourceSection(race, "Mods")}</td>
				<td>${renderSourceSection(classRow, "Mods")}</td>
			</tr>
			${hasModifiers ? `
				<tr class="modifierRow">
					<td colspan="3">${sourceModifierMergedSummary(row)}</td>
					<td class="mathCell choiceFooter">${modifierFormula(row.choiceFactors, totalModifierWeight(row))} = ${format(row.baseWeight)}</td>
				</tr>
			` : ""}
		`;
	}).join("");

	return `
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Background</th>
					<th>Race</th>
					<th>Class</th>
					<th>Combined Choices</th>
					<th>Weight</th>
				</tr>
			</thead>
			<tbody>${rows || `<tr><td colspan="6">No choice branches.</td></tr>`}</tbody>
			${renderBranchTotal(result)}
		</table>
	`;
}

// Renders the branch-total footer row.
function renderBranchTotal(result) {
	if (result.branchRows.length <= 1) return "";
	return `
		<tfoot>
			<tr>
				<td colspan="5"><strong>Branch total</strong></td>
				<td><strong>${format(result.baseWeight)}</strong></td>
			</tr>
		</tfoot>
	`;
}

// Multiplies row modifier weights.
function totalModifierWeight(row) {
	return row.staticWeight * row.spellcastingAbility * (row.sourceBranchModifierWeight || 1n);
}

// Builds the with-modifiers multiplication formula.
function modifierFormula(choiceFactors, totalModifier) {
	return [...choiceFactors, totalModifier]
		.filter(value => BigInt(value) !== 1n)
		.map(format)
		.join(" x ");
}

// Renders the selected source name cell.
function renderSourceName(row, selectedName) {
	return `<div class="sourceCell"><strong>${escape(row?.name || selectedName || "None")}</strong></div>`;
}

// Renders one fixed, choices, or mods source section.
function renderSourceSection(row, section) {
	let items = [];
	if (section === "Fixed") {
		let fixedGroups = Array.isArray(row?.fixedGroups) ? row.fixedGroups : [];
		return `
			<div class="sourceCell">
				<span class="cellLabel">${section}</span>
				${fixedGroups.length ? renderFixedGroups(fixedGroups) : `<span class="muted">None</span>`}
			</div>
		`;
	}
	if (section === "Choices") items = row?.choices?.length ? row.choices : [];
	if (section === "Mods") items = row?.modifiers?.length ? row.modifiers : [];
	return `
		<div class="sourceCell">
			<span class="cellLabel">${section}</span>
			${items.length ? renderSourceLineList(items) : `<span class="muted">None</span>`}
		</div>
	`;
}

// Renders grouped fixed items as nested lists.
function renderFixedGroups(groups) {
	return `
		<ul class="fixedGroupList">
			${groups.map(group => `
				<li>
					<div class="fixedGroupLabel">${escape(group.label)}:</div>
					<ul class="fixedItemList">
						${group.names.map(name => `<li>${escape(name)}</li>`).join("")}
					</ul>
				</li>
			`).join("")}
		</ul>
	`;
}

// Renders a simple source-line list.
function renderSourceLineList(items) {
	return `
		<ul class="sourceLineList">
			${items.map(item => `<li>${escape(item)}</li>`).join("")}
		</ul>
	`;
}

// Renders the merged modifier strip across source columns.
function sourceModifierMergedSummary(row) {
	let sourceFactors = (row.sourceRows || []).flatMap(source => source.modifierFactors || []);
	let factors = sourceFactors.map(modifier => modifier.value);
	if (row.spellcastingAbility !== 1n) factors.push(row.spellcastingAbility);
	if (!factors.length) return "";
	return `Modifiers: ${factors.map(format).join(" x ")} = ${format(totalModifierWeight(row))}`;
}

// Escapes text for safe HTML output.
function escape(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

// Fills a select element from a source collection.
function populateSelect(id, collection) {
	let select = document.getElementById(id);
	select.innerHTML = "";
	select.appendChild(new Option("None", "None"));
	for (let name of Object.keys(collection).sort()) {
		select.appendChild(new Option(name, name));
	}
}

// Runs the calculator for the current select values.
function generate() {
	if (typeof clearRandomOutput === "function") clearRandomOutput();
	let start = performance.now();
	let backgroundName = document.getElementById("backgroundSelect").value;
	let raceName = document.getElementById("raceSelect").value;
	let className = document.getElementById("classSelect").value;
	let result = calculate(backgroundName, raceName, className);
	let elapsedMs = performance.now() - start;
	render(result, elapsedMs);
}

// Initializes selects, events, and the first render.
function init() {
	populateSelect("backgroundSelect", BACKGROUNDS);
	populateSelect("raceSelect", RACES);
	populateSelect("classSelect", CLASSES);
	document.getElementById("generateBtn").addEventListener("click", generate);
	generate();
}

if (typeof window !== "undefined") {
	window.calculate = calculate;
	window.addEventListener("DOMContentLoaded", init);
}
