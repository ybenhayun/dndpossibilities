function populateSelect(id, collection) {
	let select = document.getElementById(id);
	select.innerHTML = "";
	select.appendChild(new Option("None", "None"));
	for (let name of Object.keys(collection).sort()) {
		select.appendChild(new Option(name, name));
	}
}

const DRAFT_ABBREVIATIONS = {
	barbarian: "BAR",
	bard: "BRD",
	cleric: "CLE",
	druid: "DRU",
	fighter: "FIG",
	monk: "MON",
	paladin: "PAL",
	ranger: "RAN",
	rogue: "ROG",
	sorcerer: "SOR",
	warlock: "WAR",
	wizard: "WIZ",
	astralElf: "AEL",
	bugbear: "BUG",
	centaur: "CEN",
	changeling: "CHN",
	eladrin: "ELD",
	elf: "ELF",
	harengon: "HAR",
	kender: "KND",
	kobold: "KOB",
	lizardfolk: "LIZ",
	satyr: "SAT",
	seaElf: "SEA",
	shadarKai: "SHK",
	shifter: "SHF",
	tabaxi: "TAB",
	tortle: "TOR",
	vedalken: "VED"
};
const MATH_ROW_PREVIEW_LIMIT = 3;
const MATH_ROW_EXPAND_THRESHOLD = 7;

function generateSelected() {
	ensureDraftTable();
	renderSourceRows(getBranches());
}

function ensureDraftTable() {
	let results = document.getElementById("results");
	if (document.getElementById("resultsBody")) return;
	results.innerHTML = draftTableHTML();
}

function draftTableHTML() {
	return `
		<table>
			${tableColumnGroupHTML()}
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
			<tbody id="resultsBody">
				<tr class="sourceNameRow">
					<td rowspan="4"></td>
					<td class="sourceCell"></td>
					<td class="sourceCell"></td>
					<td class="sourceCell"></td>
					<td class="mathCell" rowspan="4"><span class="cellLabel">Remaining Requirements</span><span class="muted">None</span></td>
					<td class="mathCell choiceFooter" rowspan="4">1</td>
				</tr>
				<tr class="sourceSectionRow">
					<td class="sourceCell"><span class="cellLabel">Fixed</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Fixed</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Fixed</span><span class="muted">None</span></td>
				</tr>
				<tr class="sourceSectionRow">
					<td class="sourceCell"><span class="cellLabel">Choices</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Choices</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Choices</span><span class="muted">None</span></td>
				</tr>
				<tr class="sourceSectionRow">
					<td class="sourceCell"><span class="cellLabel">Mods</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Mods</span><span class="muted">None</span></td>
					<td class="sourceCell"><span class="cellLabel">Mods</span><span class="muted">None</span></td>
				</tr>
				<tr class="modifierRow">
					<td class="modifierSpacer"></td>
					<td colspan="3"><span class="muted">None</span><div>Branch Total: 1 = 1</div></td>
					<td class="modifierSpacer"></td>
					<td class="modifierSpacer"></td>
				</tr>
			</tbody>
		</table>
	`;
}

function tableColumnGroupHTML() {
	return `
		<colgroup>
			<col class="branchNumberColumn">
			<col class="sourceColumn">
			<col class="sourceColumn">
			<col class="sourceColumn">
			<col class="combinedColumn">
			<col class="weightColumn">
		</colgroup>
	`;
}

function renderSourceRows(branches) {
	let body = document.getElementById("resultsBody");
	let selected = selectDropdowns();
	let collapsible = branches.length > 1;
	document.getElementById("totalBox").innerHTML = renderGlobalTotals(branches);
	body.innerHTML = branches.map((branch, index) => renderBranchRows(branch, index, selected, collapsible)).join("") + renderBranchSumRow(branches);
	wireMathExpanders();
	wireBranchExpanders();
}

function renderBranchRows(branch, index, selected, collapsible = false) {
	let sources = [
		{label: selected.background, data: branch.background},
		{label: selected.race, data: branch.race},
		{label: selected.class, data: branch.class}
	];
	let branchId = `branch-${index}`;
	let rowSpan = collapsible ? 1 : 4;

	return `
		<tr class="sourceNameRow branchStartRow">
			<td rowspan="${rowSpan}" class="branchNumberCell" data-branch-rowspan="${branchId}">
				<div>${index + 1}</div>
				${collapsible ? `<button class="branchToggleButton" data-target="${branchId}" aria-expanded="false">▾</button>` : ""}
			</td>
			${sources.map(source => `<td class="sourceCell">${renderSourceName(source)}</td>`).join("")}
			<td class="mathCell${collapsible ? " branchCollapsedMath" : ""}" rowspan="${rowSpan}" data-branch-rowspan="${branchId}" data-branch-math="${branchId}">
				${collapsible ? `<span class="muted">Collapsed</span>` : renderScrollableCombinedChoices(branch.merged, index)}
				${collapsible ? `<template>${renderScrollableCombinedChoices(branch.merged, index)}</template>` : ""}
			</td>
			<td class="mathCell choiceFooter" rowspan="${rowSpan}" data-branch-rowspan="${branchId}">${formatNumber(branch.merged.weightedTotal)}</td>
		</tr>
		${["Fixed", "Choices", "Mods"].map(section => `
			<tr class="sourceSectionRow${collapsible ? " branchHiddenRow" : ""}" data-branch-detail="${branchId}">
				${sources.map(source => `<td class="sourceCell">${renderSourceSection(source.data, section)}</td>`).join("")}
			</tr>
		`).join("")}
		<tr class="modifierRow">
			<td class="modifierSpacer"></td>
			<td colspan="3">${renderModifierStrip(branch.merged.modifiers)}${renderBranchWeightStrip(branch.merged)}</td>
			<td class="modifierSpacer"></td>
			<td class="modifierSpacer"></td>
		</tr>
	`;
}

function renderScrollableCombinedChoices(merged, index) {
	return `<div class="combinedChoicesScroll">${renderCombinedChoices(merged, index)}</div>`;
}

function renderBranchSumRow(branches) {
	if (branches.length <= 1) return "";
	let total = branches.reduce((sum, branch) => sum + branch.merged.weightedTotal, 0n);
	return `
		<tr class="branchTotalRow">
			<td colspan="5">All Branches Total</td>
			<td class="choiceFooter">${formatNumber(total)}</td>
		</tr>
	`;
}

function renderGlobalTotals(branches) {
	let branchTotal = branches.reduce((sum, branch) => sum + branch.merged.weightedTotal, 0n);
	let languageWeight = globalLanguageWeight();
	let pointBuyWeight = BigInt(GLOBALS.pointBuyWeight);
	let rolledWeight = BigInt(GLOBALS.rolledAbilityScoreWeight);

	return `
		<table class="globalTotalsTable">
			<thead>
				<tr>
					<th></th>
					<th>Weight</th>
					<th></th>
					<th>Languages</th>
					<th></th>
					<th>Ability Scores</th>
					<th></th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				${renderGlobalTotalRow("Point Buy", branchTotal, languageWeight, pointBuyWeight)}
				${renderGlobalTotalRow("Rolled Ability", branchTotal, languageWeight, rolledWeight)}
			</tbody>
		</table>
	`;
}

function renderGlobalTotalRow(label, branchTotal, languageWeight, abilityWeight) {
	return `
		<tr>
			<td class="globalTotalLabel">${label}</td>
			<td>${formatNumber(branchTotal)}</td>
			<td class="operatorCell">×</td>
			<td>${formatNumber(languageWeight)}</td>
			<td class="operatorCell">×</td>
			<td>${formatNumber(abilityWeight)}</td>
			<td class="operatorCell">=</td>
			<td class="globalGrandTotal">${formatNumber(branchTotal * languageWeight * abilityWeight)}</td>
		</tr>
	`;
}

function globalLanguageWeight() {
	let standardLanguageCount = ATTRIBUTES.filter(attribute => attributeHasTag(attribute, "standardLanguage")).length;
	return choose(standardLanguageCount - 1, GLOBALS.languageChoices.count);
}

function renderSourceName(source) {
	let label = source.label === "None" ? "None" : source.label;
	let branch = source.data?.branch ? `<div class="branchLabel">${escapeHtml(source.data.branch)}</div>` : "";
	return `<strong>${escapeHtml(label)}</strong>${branch}`;
}

function renderSourceSection(source, section) {
	let items = [];
	if (section === "Fixed") items = source.fixed || [];
	if (section === "Choices") items = (source.choices || []).map(formatChoice);
	if (section === "Mods") items = Object.entries(source.modifiers || {}).map(([key, value]) => `${key}: ${formatNumber(value)}`);

	return `
		<span class="cellLabel">${section}</span>
		${items.length ? renderList(items) : `<span class="muted">None</span>`}
	`;
}

function renderList(items) {
	return `<ul class="sourceLineList">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function formatChoice(choice, options = {}) {
	let total = choice.total ?? ATTRIBUTES.filter(attribute => attributeMatchesChoice(attribute, choice)).length;
	return `${formatNumber(choice.count)}/${formatNumber(total)} ${choiceLabel(choice, total, options)}`;
}

function renderModifierStrip(modifiers) {
	let values = modifiers?.factors || [];
	if (!values.length) return `<span class="muted">None</span>`;
	let factors = values.map(formatNumber).join(" × ");
	return `Modifier Total: ${escapeHtml(factors)} = ${formatNumber(modifiers.totalProduct)}`;
}

function renderBranchWeightStrip(merged) {
	let factors = [
		merged.modifiers?.totalProduct || 1,
		...(merged.choiceGroups || []).map(group => group.sum),
		...(merged.expertise ? [merged.expertise.value] : [])
	];
	return `<div>Branch Total: ${factors.map(formatNumber).join(" × ")} = ${formatNumber(merged.weightedTotal)}</div>`;
}

function renderRemainingRequirements(merged) {
	let groups = merged.choiceGroups || [];
	let lines = groups.flatMap(group => group.choices.map(choice => formatChoice(choice, {abbreviate: false})));

	return `
		<div class="mathBlock">
			<div class="mathTitle">Remaining Requirements</div>
			<ul class="overviewList">
				${(lines.length ? lines : ["None"]).map(line => `<li><span>${escapeHtml(line)}</span></li>`).join("")}
			</ul>
		</div>
	`;
}

function renderCombinedChoices(merged, branchIndex) {
	return `${renderRemainingRequirements(merged)}${renderChoiceMathBlocks(merged, branchIndex)}${renderExpertiseMathBlock(merged)}`;
}

function renderExpertiseMathBlock(merged) {
	if (!merged.expertise) return "";

	return `
		<div class="mathBlock">
			<div class="mathTitle">Expertise Math</div>
			<ul class="mathList">
				<li>
					<span class="mathTermLabel"><span>${formatNumber(merged.expertise.count)} expertise choices from ${formatNumber(merged.expertise.totalSkills)} proficient skills</span></span>
					<code class="stackedFormula"><span>${escapeHtml(merged.expertise.term)}</span></code>
					<strong class="formulaProduct">${formatNumber(merged.expertise.value)}</strong>
				</li>
			</ul>
		</div>
	`;
}

function renderChoiceMathBlocks(merged, branchIndex) {
	return (merged.choiceGroups || []).map((group, groupIndex) => {
		let isLong = group.combinations.length > MATH_ROW_EXPAND_THRESHOLD;
		let visibleCombinations = isLong ? group.combinations.slice(0, MATH_ROW_PREVIEW_LIMIT) : group.combinations;
		let hiddenCombinations = isLong ? group.combinations.slice(MATH_ROW_PREVIEW_LIMIT) : [];
		let expandId = `math-extra-${branchIndex}-${groupIndex}`;
		return `
		<div class="mathBlock">
			<div class="mathTitle">${choiceGroupTitle(group)}${choiceGroupMeta(group)}</div>
			<ul class="mathList">
				${isLong ? renderExpandControlRow(expandId, hiddenCombinations) : ""}
				${visibleCombinations.map(combination => renderCombinationRow(combination)).join("")}
				${isLong ? renderEllipsisRow(expandId) : ""}
				${isLong ? hiddenCombinations.map(combination => renderCombinationRow(combination, expandId)).join("") : ""}
				${group.combinations.length > 1 ? `<li class="mathSumRow">
					<span>Group Sum</span>
					<span class="formulaSpacer"></span>
					<strong class="formulaProduct groupSumProduct">${formatNumber(group.sum)}</strong>
				</li>` : ""}
			</ul>
		</div>
	`;
	}).join("");
}

function renderExpandControlRow(expandId, combinations) {
	return `
		<li class="mathExpandRow ${escapeHtml(expandId)}-control">
			<span><button class="mathExpandButton" data-target="${escapeHtml(expandId)}">expand all</button></span>
			<span class="formulaSpacer"></span>
			<span class="mathHiddenCount">${formatNumber(combinations.length)} hidden</span>
		</li>
	`;
}

function renderEllipsisRow(expandId) {
	return `
		<li class="mathEllipsisRow ${escapeHtml(expandId)}-ellipsis">
			<span>...</span>
			<span class="formulaSpacer"></span>
			<span></span>
		</li>
	`;
}

function renderCombinationRow(combination, expandId = null) {
	let parts = sortedParts(combination.parts);
	return `
		<li${expandId ? ` class="mathHiddenRow ${escapeHtml(expandId)}"` : ""}>
			<span class="mathTermLabel">${parts.map(part => `<span>${escapeHtml(partLabel(part))}</span>`).join("")}</span>
			<code class="stackedFormula">${parts.map((part, index) => `<span>${escapeHtml(formatTerm(part, index < parts.length - 1))}</span>`).join("")}</code>
			<strong class="formulaProduct">= ${formatNumber(combination.product)}</strong>
		</li>
	`;
}

function wireMathExpanders() {
	for (let button of document.querySelectorAll(".mathExpandButton")) {
		button.addEventListener("click", () => {
			let target = button.dataset.target;
			let controlRow = button.closest("li");
			let isCollapsed = button.textContent !== "hide";
			for (let row of document.querySelectorAll(`.${target}`)) {
				row.classList.toggle("mathHiddenRow");
			}
			button.textContent = isCollapsed ? "hide" : "expand all";
			controlRow.querySelector(".mathHiddenCount").classList.toggle("mathHiddenRow", isCollapsed);
			document.querySelector(`.${target}-ellipsis`)?.classList.toggle("mathHiddenRow");
		});
	}
}

function wireBranchExpanders() {
	for (let button of document.querySelectorAll(".branchToggleButton")) {
		button.addEventListener("click", () => {
			let target = button.dataset.target;
			let isExpanded = button.getAttribute("aria-expanded") === "true";
			let nextExpanded = !isExpanded;

			for (let row of document.querySelectorAll(`[data-branch-detail="${target}"]`)) {
				row.classList.toggle("branchHiddenRow", !nextExpanded);
			}
			for (let cell of document.querySelectorAll(`[data-branch-rowspan="${target}"]`)) {
				cell.rowSpan = nextExpanded ? 4 : 1;
			}

			let mathCell = document.querySelector(`[data-branch-math="${target}"]`);
			let fullMath = mathCell.querySelector("template")?.innerHTML || "";
			mathCell.classList.toggle("branchCollapsedMath", !nextExpanded);
			for (let node of [...mathCell.childNodes]) {
				if (node.nodeName !== "TEMPLATE") node.remove();
			}
			mathCell.insertAdjacentHTML("afterbegin", nextExpanded ? fullMath : `<span class="muted">Collapsed</span>`);

			button.textContent = nextExpanded ? "▴" : "▾";
			button.setAttribute("aria-expanded", String(nextExpanded));
			wireMathExpanders();
		});
	}
}

function choiceGroupMeta(group) {
	let meta = sortedTotals(group.totals || []).map(total => `${regionLabel(total.satisfies)}: ${formatNumber(total.count)}`).join(", ");
	return meta ? ` <span class="mathMeta">${escapeHtml(meta)}</span>` : "";
}

function choiceGroupTitle(group) {
	let kinds = new Set(group.choices.map(choiceMathKind));
	if (kinds.has("cantrip")) return "Cantrip Math";
	if (kinds.has("level1spell")) return "L1 Spell Math";
	if (kinds.has("proficiency")) return "Proficiency Math";
	if (kinds.has("skill")) return "Skill Math";
	if (kinds.size === 1 && kinds.has("instrument")) return "Instrument Math";
	if ([...kinds].some(kind => ["tool", "instrument", "artisanTool", "gamingSet"].includes(kind))) return "Tool Math";
	return "Choice Math";
}

function choiceMathKind(choice) {
	let tags = [...(choice.all || []), ...(choice.any || [])];
	if (tags.includes("cantrip")) return "cantrip";
	if (tags.includes("level1spell")) return "level1spell";
	if (tags.includes("proficiency")) return "proficiency";
	if (tags.includes("skill")) return "skill";
	if (tags.includes("instrument")) return "instrument";
	if (tags.includes("artisanTool")) return "artisanTool";
	if (tags.includes("gamingSet")) return "gamingSet";
	if (tags.includes("tool")) return "tool";
	return tags.join("|");
}

function sortedParts(parts) {
	return [...parts].sort((left, right) => compareRegionLabels(left.satisfies, right.satisfies));
}

function sortedTotals(totals) {
	return [...totals].sort((left, right) => compareRegionLabels(left.satisfies, right.satisfies));
}

function compareRegionLabels(left, right) {
	return regionPriority(left) - regionPriority(right) || regionLabel(left).localeCompare(regionLabel(right));
}

function regionPriority(tags) {
	let type = regionType(tags);
	let hasDescriptor = tags.some(tag => !["skill", "proficiency", "tool", "instrument", "artisanTool", "gamingSet", "cantrip", "level1spell"].includes(tag));
	if (type === "skill") return hasDescriptor ? 10 : 20;
	if (["instrument", "artisanTool", "gamingSet", "tool"].includes(type)) return hasDescriptor ? 30 : 40;
	if (type === "cantrip") return hasDescriptor ? 50 : 60;
	if (type === "level1spell") return hasDescriptor ? 70 : 80;
	if (type === "proficiency") return 90;
	return 100;
}

function partLabel(part) {
	return `${formatNumber(part.count)} ${regionLabel(part.satisfies, part.count)}`;
}

function formatTerm(part, showMultiplier = false) {
	return `C(${formatNumber(part.from)}, ${formatNumber(part.count)})${showMultiplier ? " ×" : ""}`;
}

function choiceLabel(choice, count, {abbreviate = true} = {}) {
	if (choice.any) {
		return choice.any.map(tag => pluralize(tagLabel(tag, abbreviate), count)).join(" or ");
	}

	let tags = choice.all || [];
	let type = tags.find(tag => ["skill", "proficiency", "tool", "instrument", "artisanTool", "gamingSet", "cantrip", "level1spell"].includes(tag));
	let descriptors = tags.filter(tag => tag !== type).map(tag => tagLabel(tag, abbreviate)).sort();
	let label = pluralize(tagLabel(type, abbreviate), count);

	if (choice.not?.includes("skill") && type === "proficiency") {
		label = `non-skill ${label}`;
	}

	let prefix = descriptors.length ? `${descriptors.join("/")} ` : "";
	return `${prefix}${label}`;
}

function tagLabel(tag, abbreviate = true) {
	let labels = {
		artisanTool: "artisan tool",
		gamingSet: "gaming set",
		level1spell: "L1 spell"
	};
	return labels[tag] || (abbreviate ? DRAFT_ABBREVIATIONS[tag] : null) || tag;
}

function regionLabel(tags, count = 2) {
	let type = regionType(tags);
	let typeTags = ["skill", "proficiency", "tool", "instrument", "artisanTool", "gamingSet", "cantrip", "level1spell"];
	let descriptors = tags.filter(tag => !typeTags.includes(tag)).map(tag => tagLabel(tag)).sort();
	let typeLabel = regionTypeLabel(type, descriptors.length, count);
	let prefix = descriptors.length ? `${descriptors.join("/")} ` : "";
	return `${prefix}${typeLabel}`;
}

function regionType(tags) {
	return ["skill", "instrument", "artisanTool", "gamingSet", "tool", "cantrip", "level1spell", "proficiency"]
		.find(type => tags.includes(type));
}

function regionTypeLabel(type, hasDescriptors, count) {
	if (type === "skill") return hasDescriptors ? pluralize("skill", count) : `other ${pluralize("skill", count)}`;
	if (type === "proficiency") return `other ${pluralize("proficiency", count)}`;
	return pluralize(tagLabel(type), count);
}

function pluralize(label, count) {
	if (count === 1) return label;
	if (label === "proficiency") return "proficiencies";
	if (label.endsWith("s")) return label;
	return `${label}s`;
}

function escapeHtml(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function formatNumber(value) {
	if (typeof value === "number" || typeof value === "bigint") return value.toLocaleString("en-US");
	return String(value).replace(/\d+/g, number => Number(number).toLocaleString("en-US"));
}

function initDraftPage() {
	populateSelect("backgroundSelect", BACKGROUNDS);
	populateSelect("raceSelect", RACES);
	populateSelect("classSelect", CLASSES);
	document.getElementById("generateBtn").addEventListener("click", generateSelected);
	generateSelected();
}

window.addEventListener("DOMContentLoaded", initDraftPage);
