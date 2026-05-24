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
			`calculate(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`,
			context
		);
		let html = vm.runInContext(
			`renderMainTable(calculate(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)}))`,
			context
		);
		let actualHash = crypto.createHash("sha256").update(html).digest("hex");
		let expectedHtml = expectedHtml64 ? Buffer.from(expectedHtml64, "base64").toString("utf8") : null;
		if (
			String(result.branchRows.length) !== rows ||
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
					rows: String(result.branchRows.length),
					base: String(result.baseWeight),
					hash: actualHash
				}
			});
		}
		continue;
	}

	if (line.startsWith("#")) continue;
	let [kind, index, note, background, race, klass, rows, base, global, final] = line.split("\t");
	let result = vm.runInContext(
		`calculate(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`,
		context
	);
	if (
		String(result.branchRows.length) !== rows ||
		String(result.baseWeight) !== base ||
		String(result.globalWeight) !== global ||
		String(result.finalWeight) !== final
	) {
		weightMismatches.push({
			kind,
			index,
			note,
			background,
			race,
			class: klass,
			expected: { rows, base, global, final },
			actual: {
				rows: String(result.branchRows.length),
				base: String(result.baseWeight),
				global: String(result.globalWeight),
				final: String(result.finalWeight)
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
