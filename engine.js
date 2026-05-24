function getBranches() {
	let dropdownsText = selectDropdowns();
	return calculateDraft(dropdownsText.background, dropdownsText.race, dropdownsText.class).branches;
}

function calculateDraft(backgroundName, raceName, className) {
	let backgroundRequirements = copyRequirements(BACKGROUNDS[backgroundName]);
	let raceRequirements = copyRequirements(RACES[raceName]);
	let classRequirements = copyRequirements(CLASSES[className]);

	let requirements = {
		background: backgroundRequirements,
		race: raceRequirements,
		class: classRequirements
	};

	addOriginChoices(requirements.background);
	let attributesCopy = [...ATTRIBUTES];
	let mergedBranches = createBranches(requirements, attributesCopy);
	let baseWeight = mergedBranches.reduce((sum, branch) => sum + branch.merged.weightedTotal, 0n);

	return {
		branches: mergedBranches,
		branchRows: mergedBranches,
		baseWeight
	};
}

function selectDropdowns() {
	return {
		background: document.getElementById("backgroundSelect").value,
		race: document.getElementById("raceSelect").value,
		class: document.getElementById("classSelect").value
	};
}

// copies requirement objects so to not alter originals
function copyRequirements(requirements) {
	return {
		...requirements,
		fixed: [...(requirements?.fixed || [])],
		choices: [...(requirements?.choices || [])],
		modifiers: {...(requirements?.modifiers || {})}
	};
}

function addOriginChoices(background) {
	if (!background.originFeat) return;

	let [originFeat, originFeatDetail] = background.originFeat.split(":");

	if (originFeat === "Skilled") {
		background.skilledCount = (background.skilledCount || 0) + 1;
	} else if (originFeat === "Crafter") {
		background.choices.push({count: 3, all: ["artisanTool"]});
	} else if (originFeat === "Musician") {
		background.choices.push({count: 3, all: ["instrument"]});
	} else if (originFeat === "Magic Initiate") {
		let tag = originFeatDetail.toLowerCase();
		background.choices.push({count: 2, all: ["cantrip", tag]});
		background.choices.push({count: 1, all: ["level1spell", tag]});
		background.modifiers.spellcastingAbility = 3;
	}
}

function createBranches(requirements, attributesCopy) {
	let mergedBranches = [];

	for (let background of requirementBranches(requirements.background)) {
		for (let race of requirementBranches(requirements.race)) {
			let raceBranches = originFeatBranches(race, background); // only needed for human origin feat branches

			for (let raceBranch of raceBranches) {
				for (let classRequirements of requirementBranches(requirements.class)) {
					let branchRequirements = {background, race: raceBranch, class: classRequirements};

					for (let skilledBranch of skilledChoiceBranches(branchRequirements)) {
						let merged = {fixed: []};
						let branchAttributes = [...attributesCopy];

						addFixedRequirements(skilledBranch, merged, branchAttributes);
						for (let group of Object.values(skilledBranch)) {
							group.choices = collectChoices({group}, branchAttributes);
						}
						merged.choiceGroups = choiceGroups(collectChoices(skilledBranch, branchAttributes), branchAttributes);
						addCombinationMath(merged.choiceGroups);
						addModifiers(skilledBranch, merged);
						addExpertise(skilledBranch, merged);
						addWeightedTotal(merged);

						mergedBranches.push({
							merged,
							attributes: branchAttributes,
							background: skilledBranch.background,
							race: skilledBranch.race,
							class: skilledBranch.class
						});
					}
				}
			}
		}
	}

	return mergedBranches;
}

// creates branches whenever expertise & skilled are both present
function skilledChoiceBranches(requirements) {
	let skilledCount = (requirements.background.skilledCount || 0) + (requirements.race.skilledCount || 0) + (requirements.class.skilledCount || 0);
	if (!skilledCount) return [requirements];

	let totalPicks = skilledCount * 3;

	if (!requirements.class.expertise) {
		let branch = copyBranchRequirements(requirements);
		branch.background.choices.push({count: totalPicks, all: ["proficiency"]});
		return [branch];
	}

	let branches = [];
	for (let skillCount = totalPicks; skillCount >= 0; skillCount--) {
		let branch = copyBranchRequirements(requirements);
		let nonSkillCount = totalPicks - skillCount;
		branch.class.branch = `${skillCount} ${skillCount === 1 ? "skill" : "skills"}, ${nonSkillCount} non-skill ${nonSkillCount === 1 ? "proficiency" : "proficiencies"}`;
		if (skillCount) branch.background.choices.push({count: skillCount, all: ["skill"]});
		if (nonSkillCount) branch.background.choices.push({count: nonSkillCount, all: ["proficiency"], not: ["skill"]});
		branches.push(branch);
	}
	return branches;
}

function copyBranchRequirements(requirements) {
	return {
		background: copyRequirements(requirements.background),
		race: copyRequirements(requirements.race),
		class: copyRequirements(requirements.class)
	};
}

function originFeatBranches(race, background) {
	if (!race.originFeatChoice) return [race];

	return race.originFeatChoice.options.filter(option => !sameOriginFeat(option, background)).map(option => {
		let branch = copyRequirements(race);
		branch.originFeat = option;
		branch.branch = `Origin Feat: ${option}`;
		addOriginChoices(branch);
		return branch;
	});
}

function sameOriginFeat(option, background) {
	if (option === "Skilled" && background.originFeat === "Skilled") return false;
	return option === background.originFeat;
}

function requirementBranches(requirements) {
	if (!requirements.branches?.length) {
		return [copyRequirements(requirements)];
	}

	return requirements.branches.map(branch => addBranchRequirements(requirements, branch));
}

// merges branch object with parent
function addBranchRequirements(requirements, branch) {
	let {branches, ...baseRequirements} = copyRequirements(requirements);

	return {
		...baseRequirements,
		branch: branch.name || null,
		fixed: [...(requirements.fixed || []), ...(branch.fixed || [])],
		choices: [...(requirements.choices || []), ...(branch.choices || [])],
		modifiers: {
			...(requirements.modifiers || {}),
			...(branch.modifiers || {})
		}
	};
}

function addFixedRequirements(requirements, merged, attributesCopy) {
	for (let group of Object.values(requirements)) {
		for (let i = (group.fixed || []).length - 1; i >= 0; i--) {
			let skill = group.fixed[i];
			let j = attributesCopy.findIndex(attribute => attribute.name === skill);

			if (j >= 0) {
				attributesCopy.splice(j, 1);
				merged.fixed.push(skill);
			} else {
				let duplicate = ATTRIBUTES.find(attribute => attribute.name === skill);
				group.fixed.splice(i, 1);
				if (attributeHasTag(duplicate, "skill")) group.choices.push({count: 1, all: ["skill"]});
			}
		}
	}
}

function collectChoices(requirements, attributes) {
	let choices = [];

	for (let group of Object.values(requirements)) {
		for (let choice of group.choices || []) {
			choice.total = attributes.filter(attribute => attributeMatchesChoice(attribute, choice)).length;
			let existingChoice = choices.find(existingChoice => sameChoice(existingChoice, choice));

			if (existingChoice) {
				existingChoice.count += choice.count;
			} else {
				choices.push({...choice});
			}
		}
	}

	return choices;
}

function choiceGroups(choices, attributes) {
	let pools = choices.map(choice => attributes.filter(attribute => attributeMatchesChoice(attribute, choice)));
	let components = choiceComponents(choices, pools);

	return components.map(component => {
		let groupChoices = component.map(index => choices[index]);
		let relevantTags = relevantTagsForComponent(component.map(index => choices[index]));
		let totals = new Map();

		for (let attribute of attributes) {
			if (!component.some(index => attributeMatchesChoice(attribute, choices[index]))) continue;

			let satisfies = relevantTags.filter(tag => attributeHasTag(attribute, tag));
			let key = satisfies.join("|");
			let total = totals.get(key);
			if (!total) {
				total = {count: 0, satisfies};
				totals.set(key, total);
			}
			total.count++;
		}

		let group = {
			choices: groupChoices,
			totals: [...totals.values()]
		};
		group.combinations = validCombinations(group);
		return group;
	});
}

// comes up with every combination that satisfies the needed choice requirements
// ie c(11,4) * c(7,2), c(11,5) * c(7,1), c(11,6) for kenku + rogue
// ie 4 rogue skills/2 general, 5 rogue skills/1 general, 6 rogue skills
function validCombinations(group) {
	let combinations = [];
	let requiredCount = group.choices.reduce((sum, choice) => sum + choice.count, 0);

	function search(index, remaining, picked) {
		if (index === group.totals.length) {
			if (remaining === 0 && choicesAreSatisfied(group, picked)) {
				combinations.push(picked
					.map((count, i) => ({
						count,
						from: group.totals[i].count,
						satisfies: group.totals[i].satisfies
					}))
					.filter(pick => pick.count > 0)
				);
			}
			return;
		}

		let max = Math.min(group.totals[index].count, remaining);
		for (let count = 0; count <= max; count++) {
			picked[index] = count;
			search(index + 1, remaining - count, picked);
		}
	}

	search(0, requiredCount, []);
	return combinations;
}

function addCombinationMath(choiceGroups) {
	for (let group of choiceGroups) {
		group.combinations = group.combinations.map(combination => {
			let parts = combination.map(part => ({
				...part,
				term: `C(${part.from}, ${part.count})`,
				value: choose(part.from, part.count)
			}));

			return {
				parts,
				product: parts.reduce((product, part) => product * part.value, 1n)
			};
		});

		group.sum = group.combinations.reduce((sum, combination) => sum + combination.product, 0n);
	}
}

function choose(n, k) {
	n = BigInt(n);
	k = BigInt(k);
	if (k < 0n || n < 0n || k > n) return 0n;
	if (k > n - k) k = n - k;
	let result = 1n;
	for (let i = 1n; i <= k; i++) {
		result = result * (n - k + i) / i;
	}
	return result;
}

function choicesAreSatisfied(group, picked) {
	let remainingChoices = group.choices.map(choice => choice.count);
	let memo = new Set();

	function assign(totalIndex) {
		while (totalIndex < group.totals.length && !picked[totalIndex]) totalIndex++;
		if (totalIndex === group.totals.length) return remainingChoices.every(count => count === 0);

		let key = `${totalIndex}|${remainingChoices.join(",")}`;
		if (memo.has(key)) return false;

		let total = group.totals[totalIndex];
		let eligibleChoices = group.choices
			.map((choice, choiceIndex) => ({choice, choiceIndex}))
			.filter(({choice, choiceIndex}) => remainingChoices[choiceIndex] && totalSatisfiesChoice(total, choice));

		if (!eligibleChoices.length) {
			memo.add(key);
			return false;
		}

		let allocations = allocationsForTotal(picked[totalIndex], eligibleChoices, remainingChoices);
		for (let allocation of allocations) {
			for (let [choiceIndex, count] of allocation) remainingChoices[choiceIndex] -= count;
			if (assign(totalIndex + 1)) return true;
			for (let [choiceIndex, count] of allocation) remainingChoices[choiceIndex] += count;
		}

		memo.add(key);
		return false;
	}

	return assign(0);
}

function allocationsForTotal(count, eligibleChoices, remainingChoices) {
	let allocations = [];

	function search(index, remaining, allocation) {
		if (index === eligibleChoices.length) {
			if (remaining === 0) allocations.push(allocation.filter(([, amount]) => amount));
			return;
		}

		let choiceIndex = eligibleChoices[index].choiceIndex;
		let max = Math.min(remaining, remainingChoices[choiceIndex]);
		for (let amount = 0; amount <= max; amount++) {
			allocation.push([choiceIndex, amount]);
			search(index + 1, remaining - amount, allocation);
			allocation.pop();
		}
	}

	search(0, count, []);
	return allocations;
}

function totalSatisfiesChoice(total, choice) {
	if (choice.all && !choice.all.every(tag => total.satisfies.includes(tag))) return false;
	if (choice.any && !choice.any.some(tag => total.satisfies.includes(tag))) return false;
	if (choice.not && choice.not.some(tag => total.satisfies.includes(tag))) return false;
	return true;
}

function relevantTagsForComponent(choices) {
	let tags = [];
	for (let choice of choices) {
		for (let tag of [...(choice.all || []), ...(choice.any || [])]) {
			if (!tags.includes(tag)) tags.push(tag);
		}
	}
	return tags;
}

function choiceComponents(choices, pools) {
	let components = [];
	let seen = new Set();

	for (let i = 0; i < pools.length; i++) {
		if (seen.has(i)) continue;
		let component = [];
		let queue = [i];
		seen.add(i);

		for (let j = 0; j < queue.length; j++) {
			let current = queue[j];
			component.push(current);
			for (let k = 0; k < pools.length; k++) {
				if (seen.has(k) || !choicesBelongTogether(choices[current], choices[k], pools[current], pools[k])) continue;
				seen.add(k);
				queue.push(k);
			}
		}

		components.push(component);
	}

	return components;
}

function choicesBelongTogether(firstChoice, secondChoice, firstPool, secondPool) {
	return choiceGroupKind(firstChoice) === choiceGroupKind(secondChoice) || poolsOverlap(firstPool, secondPool);
}

function choiceGroupKind(choice) {
	let tags = [...(choice.all || []), ...(choice.any || [])];
	if (tags.includes("cantrip")) return "cantrip";
	if (tags.includes("level1spell")) return "level1spell";
	if (tags.includes("skill")) return "skill";
	if (tags.some(tag => ["tool", "instrument", "artisanTool", "gamingSet"].includes(tag))) return "tool";
	return tags.join("|");
}

function poolsOverlap(first, second) {
	return first.some(attribute => second.includes(attribute));
}

function attributeMatchesChoice(attribute, choice) {
	if (choice.all && !choice.all.every(tag => attributeHasTag(attribute, tag))) return false;
	if (choice.any && !choice.any.some(tag => attributeHasTag(attribute, tag))) return false;
	if (choice.not && choice.not.some(tag => attributeHasTag(attribute, tag))) return false;
	return true;
}

// checks if two choices are of the same type ie: 1/18 skills (for human) + 3/18 skills (for bard)
function sameChoice(first, second) {
	return JSON.stringify({
		all: first.all || null,
		any: first.any || null,
		not: first.not || null
	}) === JSON.stringify({
		all: second.all || null,
		any: second.any || null,
		not: second.not || null
	});
}

function addModifiers(requirements, merged) {
	merged.modifiers = {factors: []};

	for (let group of Object.values(requirements)) {
		for (let modifier in group.modifiers || {}) {
			let value = group.modifiers[modifier];
			merged.modifiers.factors.push(value);
			if (merged.modifiers[modifier]) {
				merged.modifiers[modifier] *= value;
			} else {
				merged.modifiers[modifier] = value;
			}
		}
	}

	merged.modifiers.totalProduct = merged.modifiers.factors.reduce((product, value) => product * BigInt(value), 1n);
}

function addExpertise(requirements, merged) {
	let expertiseCount = requirements.class.expertise?.count;
	if (!expertiseCount) return;

	let fixedSkills = merged.fixed.filter(name => attributeHasTag(ATTRIBUTES.find(attribute => attribute.name === name), "skill")).length;
	let chosenSkills = Object.values(requirements).reduce((sum, group) => {
		return sum + (group.choices || []).reduce((choiceSum, choice) => {
			if (!choice.all?.includes("skill") || choice.not?.includes("skill")) return choiceSum;
			return choiceSum + choice.count;
		}, 0);
	}, 0);
	let totalSkills = fixedSkills + chosenSkills;

	merged.expertise = {
		count: expertiseCount,
		totalSkills,
		term: `C(${totalSkills}, ${expertiseCount})`,
		value: choose(totalSkills, expertiseCount)
	};
}

function addWeightedTotal(merged) {
	let expertiseValue = merged.expertise?.value || 1n;
	merged.weightedTotal = merged.choiceGroups.reduce((total, group) => total * group.sum, merged.modifiers.totalProduct * expertiseValue);
}
