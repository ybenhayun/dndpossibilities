const fs = require("fs");
const crypto = require("crypto");
const vm = require("vm");

const FILES = ["skills.js", "engine.js", "main.js", "all.js", "index.html", "styles.css"];
const TRICKY_HTML_CASES = [
	["single-race-cantrip", "None", "Astral Elf", "None"],
	["overlap-six-skill-rows", "None", "Changeling", "Fighter"],
	["replacement-and-expertise", "Criminal", "Tabaxi", "Rogue"],
	["large-human-expertise-branches", "Charlatan", "Human", "Rogue"],
	["multi-list-cantrip-overlap", "Guide", "Astral Elf", "Warlock"],
	["mixed-tool-math", "Artisan", "Harengon", "Monk"],
	["species-branches-fixed-spells", "None", "Gnome", "Wizard"],
	["species-branches-fixed-cantrips", "None", "Tiefling", "Wizard"],
	["repeat-magic-initiate-class", "Acolyte", "Human", "Cleric"],
	["kobold-wizard-overlap", "None", "Kobold", "Wizard"],
	["new-race-tool-choice", "Guide", "Warforged", "Warlock"],
	["new-race-cantrip-choice", "Guide", "Astral Elf", "Wizard"],
	["new-race-fixed-spells", "Artisan", "Hexblood", "Bard"],
	["new-race-two-skills", "None", "Autognome", "Rogue"],
	["new-race-rare-style-skill", "None", "Kender", "Rogue"]
];

function element() {
	return {
		addEventListener() {},
		appendChild() {},
		querySelector() { return null; },
		innerHTML: "",
		value: "None",
		style: {},
		textContent: "",
		selectedOptions: [],
		options: []
	};
}

function loadContext() {
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
	return context;
}

function sha256(text) {
	return crypto.createHash("sha256").update(text).digest("hex");
}

function run(context, expression) {
	return vm.runInContext(expression, context);
}

function calculate(context, background, race, klass) {
	return run(
		context,
		`calculate(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)})`
	);
}

function renderHtml(context, background, race, klass) {
	return run(
		context,
		`renderMainTable(calculate(${JSON.stringify(background)}, ${JSON.stringify(race)}, ${JSON.stringify(klass)}))`
	);
}

function sortedNames(context, collectionName) {
	return Object.keys(run(context, collectionName)).sort();
}

function sampleKey(background, race, klass) {
	return `${background}\t${race}\t${klass}`;
}

function inTenPercentSample(background, race, klass) {
	let digest = sha256(sampleKey(background, race, klass));
	return parseInt(digest.slice(0, 8), 16) % 10 === 0;
}

const context = loadContext();
const backgrounds = ["None", ...sortedNames(context, "BACKGROUNDS")];
const races = ["None", ...sortedNames(context, "RACES")];
const classes = ["None", ...sortedNames(context, "CLASSES")];
const allCases = [];
for (const background of backgrounds) {
	for (const race of races) {
		for (const klass of classes) {
			allCases.push({ background, race, klass });
		}
	}
}

const trickyKeys = new Set(TRICKY_HTML_CASES.map(([, background, race, klass]) =>
	sampleKey(background, race, klass)
));
const htmlSampleCases = allCases
	.filter(({ background, race, klass }) =>
		!trickyKeys.has(sampleKey(background, race, klass)) &&
		inTenPercentSample(background, race, klass)
	);

const now = new Date().toISOString();
let lines = [
	"# Golden weights for DND Character Counter",
	"# Exhaustive numeric cases plus HTML output snapshots.",
	`# Exhaustive ALL section size: ${allCases.length} unique background/race/class triples (${backgrounds.length} backgrounds incl None x ${races.length} races incl None x ${classes.length} classes incl None).`,
	`# HTML snapshots: ${TRICKY_HTML_CASES.length} full tricky snapshots + ${htmlSampleCases.length} deterministic 10% hash snapshots from remaining cases.`,
	`# Generated at: ${now}`
];

for (const file of FILES) {
	if (fs.existsSync(file)) {
		lines.push(`# sha256 ${file}: ${sha256(fs.readFileSync(file))}`);
	}
}

lines.push("# Columns: kind\tindex\tnote\tbackground\trace\tclass\tbranch_rows\tbase_weight\tglobal_weight\tfinal_weight");

let index = 1;
for (const { background, race, klass } of allCases) {
	const result = calculate(context, background, race, klass);
	lines.push([
		"ALL",
		index++,
		"exhaustive current schema",
		background,
		race,
		klass,
		result.branchRows.length,
		result.baseWeight,
		result.globalWeight,
		result.finalWeight
	].join("\t"));
}

lines.push("");
lines.push("# HTML Snapshots: renderMainTable(calculate(background, race, class))");
lines.push("# Columns: HTML_SNAPSHOT\tmode\tname\tbackground\trace\tclass\tbranch_rows\tbase_weight\tsha256\tbase64_html");

for (const [name, background, race, klass] of TRICKY_HTML_CASES) {
	const result = calculate(context, background, race, klass);
	const html = renderHtml(context, background, race, klass);
	lines.push([
		"# HTML_SNAPSHOT",
		"full",
		name,
		background,
		race,
		klass,
		result.branchRows.length,
		result.baseWeight,
		sha256(html),
		Buffer.from(html, "utf8").toString("base64")
	].join("\t"));
}

for (const { background, race, klass } of htmlSampleCases) {
	const result = calculate(context, background, race, klass);
	const html = renderHtml(context, background, race, klass);
	lines.push([
		"# HTML_SNAPSHOT",
		"hash",
		"ten-percent-sample",
		background,
		race,
		klass,
		result.branchRows.length,
		result.baseWeight,
		sha256(html),
		""
	].join("\t"));
}

fs.writeFileSync("golden-tests.txt", `${lines.join("\n")}\n`);
console.log(JSON.stringify({
	allCases: allCases.length,
	fullHtmlSnapshots: TRICKY_HTML_CASES.length,
	hashHtmlSnapshots: htmlSampleCases.length
}, null, 2));
