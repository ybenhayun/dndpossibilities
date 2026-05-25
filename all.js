// all.js
// Full-grid counting for the tagged calculator.

const allCountCache = new Map();
let allCachedHTML = null;
let allCachedBranchRows = null;
let allCachedBaseTotal = null;

function allFormat(value) {
	return BigInt(value).toLocaleString("en-US");
}

function allNow() {
	return performance.now();
}

function allElapsed(ms) {
	if (ms < 1000) return `${ms.toFixed(2)}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}

function allEscape(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function allPercent(part, total, decimals = 8) {
	part = BigInt(part);
	total = BigInt(total);
	if (part === 0n || total === 0n) return "0%";
	let scale = 10n ** BigInt(decimals);
	let scaled = (part * 100n * scale) / total;
	let whole = scaled / scale;
	let fraction = (scaled % scale).toString().padStart(decimals, "0");
	fraction = fraction.replace(/0+$/, "");
	return `${whole}${fraction ? `.${fraction}` : ""}%`;
}

function allComboKey(backgroundName, raceName, className) {
	return `${backgroundName}|${raceName}|${className}`;
}

function allFastCount(backgroundName, raceName, className) {
	let key = allComboKey(backgroundName, raceName, className);
	if (allCountCache.has(key)) return allCountCache.get(key);

	let result = typeof globalThis.calculate === "function"
		? globalThis.calculate(backgroundName, raceName, className)
		: globalThis.calculateDraft(backgroundName, raceName, className);
	let count = {
		branchRows: BigInt((result.branchRows || result.branches).length),
		baseWeight: result.baseWeight
	};
	allCountCache.set(key, count);
	return count;
}

function allEmptyTotals(names) {
	let totals = {};
	for (let name of names) {
		totals[name] = {
			branchRows: 0n,
			baseWeight: 0n
		};
	}
	return totals;
}

function allAddContribution(totals, name, result) {
	totals[name].branchRows += result.branchRows;
	totals[name].baseWeight += result.baseWeight;
}

function allBreakdownHTML(title, label, names, totals, baseTotal) {
	let sortedNames = [...names].sort((left, right) => {
		let diff = totals[right].baseWeight - totals[left].baseWeight;
		if (diff > 0n) return 1;
		if (diff < 0n) return -1;
		return left.localeCompare(right);
	});

	let rows = sortedNames.map(name => {
		let total = totals[name];
		return `
			<tr>
				<td>${allEscape(name)}</td>
				<td>${allFormat(total.branchRows)}</td>
				<td>${allFormat(total.baseWeight)}</td>
				<td>${allPercent(total.baseWeight, baseTotal)}</td>
			</tr>
		`;
	}).join("");

	return `
		<h2>${allEscape(title)}</h2>
		<table>
			<thead>
				<tr>
					<th>${allEscape(label)}</th>
					<th>Branch Rows</th>
					<th>Base Weight</th>
					<th>% of Base Weight</th>
				</tr>
			</thead>
			<tbody>${rows}</tbody>
		</table>
	`;
}

function allTotalHTML(branchRows, baseTotal, elapsedMs, cached = false) {
	let globalLanguage = typeof GLOBAL_LANGUAGE_WEIGHT !== "undefined" ? GLOBAL_LANGUAGE_WEIGHT : BigInt(globalLanguageWeight());
	let standard = BigInt(GLOBALS.standardAbilityScoreWeight);
	let pointBuy = BigInt(GLOBALS.pointBuyWeight);
	let rolledAbilityScores = BigInt(GLOBALS.rolledAbilityScoreWeight);
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
				${allGlobalTotalRow("Standard", baseTotal, globalLanguage, standard)}
				${allGlobalTotalRow("Point Buy", baseTotal, globalLanguage, pointBuy)}
				${allGlobalTotalRow("Rolled Ability", baseTotal, globalLanguage, rolledAbilityScores)}
			</tbody>
		</table>
		${cached ? "" : `<div class="allElapsedLine">Time: ${allElapsed(elapsedMs)}</div>`}
	`;
}

function allGlobalTotalRow(label, baseTotal, languageWeight, abilityWeight) {
	return `
		<tr>
			<td class="globalTotalLabel">${allEscape(label)}</td>
			<td>${allFormat(baseTotal)}</td>
			<td class="operatorCell">&times;</td>
			<td>${allFormat(languageWeight)}</td>
			<td class="operatorCell">&times;</td>
			<td>${allFormat(abilityWeight)}</td>
			<td class="operatorCell">=</td>
			<td class="globalGrandTotal">${allFormat(baseTotal * languageWeight * abilityWeight)}</td>
		</tr>
	`;
}

function allSetBusy(message) {
	let totalBox = document.getElementById("totalBox");
	let results = document.getElementById("results");
	totalBox.innerHTML = "";
	results.innerHTML = `<div class="totalBox"><b>${allEscape(message)}</b></div>`;
}

async function runAllCombinations() {
	if (typeof clearRandomOutput === "function") clearRandomOutput();
	let start = allNow();
	let totalBox = document.getElementById("totalBox");
	let results = document.getElementById("results");
	let runAllButton = document.getElementById("runAllBtn");

	if (allCachedHTML !== null && allCachedBranchRows !== null && allCachedBaseTotal !== null) {
		totalBox.innerHTML = allTotalHTML(
			allCachedBranchRows,
			allCachedBaseTotal,
			allNow() - start,
			true
		);
		results.innerHTML = allCachedHTML;
		return;
	}

	runAllButton.disabled = true;
	allSetBusy("Running all combinations...");

	let backgroundNames = Object.keys(BACKGROUNDS).sort();
	let raceNames = Object.keys(RACES).sort();
	let classNames = Object.keys(CLASSES).sort();
	let totalCombos = backgroundNames.length * raceNames.length * classNames.length;
	let completed = 0;

	let branchRows = 0n;
	let baseTotal = 0n;
	let backgroundTotals = allEmptyTotals(backgroundNames);
	let raceTotals = allEmptyTotals(raceNames);
	let classTotals = allEmptyTotals(classNames);

	for (let backgroundName of backgroundNames) {
		for (let raceName of raceNames) {
			for (let className of classNames) {
				let count = allFastCount(backgroundName, raceName, className);
				branchRows += count.branchRows;
				baseTotal += count.baseWeight;
				allAddContribution(backgroundTotals, backgroundName, count);
				allAddContribution(raceTotals, raceName, count);
				allAddContribution(classTotals, className, count);

				completed++;
				if (completed % 25 === 0) {
					results.innerHTML = `
						<div class="totalBox">
							<b>Running all combinations...</b><br>
							${allFormat(completed)} / ${allFormat(totalCombos)}
						</div>
					`;
					await new Promise(resolve => setTimeout(resolve, 0));
				}
			}
		}
	}

	let elapsed = allNow() - start;
	let breakdownHTML = [
		allBreakdownHTML("Class Breakdown", "Class", classNames, classTotals, baseTotal),
		allBreakdownHTML("Race Breakdown", "Race", raceNames, raceTotals, baseTotal),
		allBreakdownHTML("Background Breakdown", "Background", backgroundNames, backgroundTotals, baseTotal)
	].join("");

	allCachedHTML = breakdownHTML;
	allCachedBranchRows = branchRows;
	allCachedBaseTotal = baseTotal;

	totalBox.innerHTML = allTotalHTML(branchRows, baseTotal, elapsed);
	results.innerHTML = allCachedHTML;
	runAllButton.disabled = false;
}

function allInit() {
	let runAllButton = document.getElementById("runAllBtn");
	if (!runAllButton) return;
	runAllButton.addEventListener("click", () => {
		runAllCombinations().catch(error => {
			document.getElementById("results").innerHTML = `
				<div class="totalBox"><b>Run all failed:</b> ${allEscape(error.message)}</div>
			`;
			runAllButton.disabled = false;
			throw error;
		});
	});
}

if (typeof window !== "undefined") {
	window.runAllCombinations = runAllCombinations;
	window.addEventListener("DOMContentLoaded", allInit);
}
