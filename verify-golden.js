const fs = require("fs");
const crypto = require("crypto");
const vm = require("vm");

const element = () => ({
	addEventListener() {},
	appendChild() {},
	querySelector() { return null; },
	innerHTML: "",
	value: "None",
	style: {},
	textContent: "",
	selectedOptions: [],
	options: []
});

const context = {
	console,
	performance: { now: () => 0 },
	Option: function Option(text, value) { return { text, value }; },
	document: {
		getElementById: () => element(),
		createElement: () => element()
	},
	window: { addEventListener() {} }
};

vm.createContext(context);
for (const file of ["skills.js", "engine.js", "main.js", "all.js"]) {
	vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: file });
}

vm.runInContext(`
	function renderGoldenTable(background, race, klass) {
		let result = calculateDraft(background, race, klass);
		let branches = result.branches;
		let selected = { background, race, class: klass };
		let collapsible = branches.length > 1;
		return \`
			<table>
				\${tableColumnGroupHTML()}
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
				<tbody>
					\${branches.map((branch, index) => renderBranchRows(branch, index, selected, collapsible)).join("")}
					\${renderBranchSumRow(branches)}
				</tbody>
			</table>
		\`;
	}
`, context);

const languageWeight = vm.runInContext("globalLanguageWeight()", context);
const standardWeight = vm.runInContext("BigInt(GLOBALS.standardAbilityScoreWeight)", context);
const pointBuyWeight = vm.runInContext("BigInt(GLOBALS.pointBuyWeight)", context);
const rolledWeight = vm.runInContext("BigInt(GLOBALS.rolledAbilityScoreWeight)", context);

const lines = fs.readFileSync("golden-tests.txt", "utf8")
	.split(/\n/)
	.filter(Boolean);

let weightMismatches = [];
let htmlMismatches = [];

for (let line of lines) {
	if (line.startsWith("# HTML_SNAPSHOT\t")) {
		let parts = line.split("\t");
		let mode;
		let name;
		let background;
		let race;
		let klass;
		let rows;
		let base;
		let expectedHash;
		let expectedHtml64;
		if (parts[1] === "full" || parts[1] === "hash") {
			[, mode, name, background, race, klass, rows, base, expectedHash, expectedHtml64] = parts;
		} else {
			[, name, background, race, klass, rows, base, expectedHash, expectedHtml64] = parts;
			mode = expectedHtml64 ? "full" : "hash";
			}
			let result = vm.runInContext(
				`calculateDraft(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`,
				context
			);
			let html = vm.runInContext(
				`renderGoldenTable(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`,
				context
			);
		let actualHash = crypto.createHash("sha256").update(html).digest("hex");
			let expectedHtml = expectedHtml64 ? Buffer.from(expectedHtml64, "base64").toString("utf8") : null;
			if (
				String(result.branches.length) !== rows ||
				String(result.baseWeight) !== base ||
			actualHash !== expectedHash ||
			(mode === "full" && expectedHtml !== html)
		) {
			htmlMismatches.push({
				mode,
				name,
				background,
				race,
					class: klass,
					expected: { rows, base, hash: expectedHash },
					actual: {
						rows: String(result.branches.length),
						base: String(result.baseWeight),
						hash: actualHash
					}
			});
		}
		continue;
	}

	if (line.startsWith("#")) continue;
	let [kind, index, note, background, race, klass, rows, base, standard, pointBuy, rolled] = line.split("\t");
	let result = vm.runInContext(
		`calculateDraft(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`,
		context
	);
	let standardTotal = result.baseWeight * languageWeight * standardWeight;
	let pointBuyTotal = result.baseWeight * languageWeight * pointBuyWeight;
	let rolledTotal = result.baseWeight * languageWeight * rolledWeight;
	if (
		String(result.branches.length) !== rows ||
		String(result.baseWeight) !== base ||
		String(standardTotal) !== standard ||
		String(pointBuyTotal) !== pointBuy ||
		String(rolledTotal) !== rolled
	) {
		weightMismatches.push({
			kind,
			index,
			note,
			background,
			race,
			class: klass,
			expected: { rows, base, standard, pointBuy, rolled },
			actual: {
				rows: String(result.branches.length),
				base: String(result.baseWeight),
				standard: String(standardTotal),
				pointBuy: String(pointBuyTotal),
				rolled: String(rolledTotal)
			}
		});
	}
}

console.log(JSON.stringify({
	weightMismatches: weightMismatches.length,
	htmlMismatches: htmlMismatches.length,
	firstWeightMismatch: weightMismatches[0] || null,
	firstHtmlMismatch: htmlMismatches[0] || null
}, null, 2));

if (weightMismatches.length || htmlMismatches.length) {
	process.exitCode = 1;
}
