// main.js
// Page rendering and controls for the D&D character counter.

// SECTION: Page Rendering And Controls
// Renders totals and the branch table to the page.
function render(result, elapsedMs) {
	let totalBox = document.getElementById("totalBox");
	let results = document.getElementById("results");

	totalBox.innerHTML = `
		<strong>Point-buy total:</strong>
		${format(result.baseWeight)}
		&times; ${format(result.globalLanguageWeight)}
		&times; ${format(result.pointBuyWeight)}
		= ${format(result.finalWeight)}
		<br>
		<strong>Rolled-score total:</strong>
		${format(result.baseWeight)}
		&times; ${format(result.globalLanguageWeight)}
		&times; ${format(result.rolledAbilityScoreWeight)}
		= ${format(result.rolledFinalWeight)}
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
		let formula = modifierFormula(row.choiceFactors, totalModifierWeight(row));
		let hasFormula = Boolean(formula);
		let sourceRows = row.sourceRows;
		let sourceColumns = ["Background", "Race", "Class"].map(kind =>
			sourceRows.find(source => source.kind === kind)
		);
		let rowSpan = hasFormula ? 5 : 4;
		return `
			<tr class="sourceNameRow">
				<td rowspan="${rowSpan}">${index + 1}</td>
				${renderSourceCells(sourceColumns, (source, kind) => renderSourceName(source, result[`${kind.toLowerCase()}Name`]))}
				<td class="mathCell" rowspan="4">
					<div class="branchLabel">${escape(row.label)}</div>
					${row.mathHtml}
				</td>
				<td rowspan="${rowSpan}">${format(row.baseWeight)}</td>
			</tr>
			${["Fixed", "Choices", "Mods"].map(section => `
				<tr class="sourceSectionRow">
					${renderSourceCells(sourceColumns, source => renderSourceSection(source, section))}
				</tr>
			`).join("")}
			${hasFormula ? `
				<tr class="modifierRow">
					<td colspan="3">${sourceModifierMergedSummary(row)}</td>
					<td class="mathCell choiceFooter">${formula} = ${format(row.baseWeight)}</td>
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

// Renders the three source cells for a branch row.
function renderSourceCells(sourceColumns, renderCell) {
	return sourceColumns
		.map(source => `<td>${renderCell(source, source?.kind || "")}</td>`)
		.join("");
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
	window.addEventListener("DOMContentLoaded", init);
}
