// Samples /proc/<pid>/fd of the build process and prints what holds the
// descriptors. Runs as its own process so it still works when the build itself
// has run out of descriptors.
const fs = require("node:fs");

const pid = Number(process.argv[2]);
const BUCKETS = [400, 600, 800, 950, 1015];
const started = Date.now();

let max = 0;
let nextBucket = 0;

function summarize(target) {
	if (target === "?") return "unknown";
	const pnpm = target.match(/\/\.pnpm\/([^/]+)\//);
	if (pnpm) return `pkg ${pnpm[1].slice(0, 46)}`;
	const kind = target.match(/^(socket|pipe|anon_inode):/);
	if (kind) return kind[1];
	const repo = target.match(/\/(src|dist|public|\.astro)\//);
	if (repo) return `repo ${repo[1]}`;
	const idx = target.lastIndexOf("/");
	if (idx > 0) return `dir ...${target.slice(0, idx).slice(-60)}`;
	return target.slice(0, 60);
}

function dump(reason) {
	let entries;
	try {
		entries = fs.readdirSync(`/proc/${pid}/fd`);
	} catch {
		return;
	}

	const counts = new Map();
	for (const fd of entries) {
		let target = "?";
		try {
			target = fs.readlinkSync(`/proc/${pid}/fd/${fd}`);
		} catch {}
		const key = summarize(target);
		counts.set(key, (counts.get(key) ?? 0) + 1);
	}

	const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
	console.error(
		`[fd-probe] ${reason} → ${entries.length} open files (+${Date.now() - started}ms)`,
	);
	for (const [key, count] of top) {
		console.error(`[fd-probe]   ${String(count).padStart(4)} × ${key}`);
	}
}

const timer = setInterval(() => {
	if (!fs.existsSync(`/proc/${pid}`)) {
		clearInterval(timer);
		process.exit(0);
	}
	let count;
	try {
		count = fs.readdirSync(`/proc/${pid}/fd`).length;
	} catch {
		return;
	}
	if (count > max) max = count;
	if (nextBucket < BUCKETS.length && count >= BUCKETS[nextBucket]) {
		while (nextBucket < BUCKETS.length && count >= BUCKETS[nextBucket]) {
			nextBucket += 1;
		}
		dump(`reached ${count} open files`);
	}
}, 100);

// Keep the sampler (and its interval) alive for as long as the build runs.
process.on("exit", () => {
	console.error(`[fd-probe] peak observed: ${max} open files`);
});