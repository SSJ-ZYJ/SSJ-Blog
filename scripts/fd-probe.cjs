// Temporary diagnostic probe. A separate sampler process inspects the build's
// descriptor table, because once the build exhausts its 1024 descriptors it can
// no longer open anything itself (not even /proc/self/fd).
const { spawn } = require("node:child_process");
const path = require("node:path");

// The sampler runs Node too, so guard against the preload spawning itself again.
if (process.env.FD_PROBE_ACTIVE !== "1") {
	const entry = (process.argv[1] ?? "").replace(/\\/g, "/");
	const isAstroBuild =
		process.env.FD_PROBE_FORCE === "1" ||
		(process.argv.includes("build") && /\/astro\//.test(entry));

	if (isAstroBuild) {
		const sampler = spawn(
			process.execPath,
			[path.join(__dirname, "fd-sampler.cjs"), String(process.pid)],
			{
				stdio: ["ignore", "inherit", "inherit"],
				env: { ...process.env, FD_PROBE_ACTIVE: "1" },
			},
		);
		sampler.unref();
	}
}

// Report the exact call that runs out of descriptors (no extra fd needed).
const fs = require("node:fs");
for (const name of ["openSync", "readFileSync"]) {
	const original = fs[name];
	fs[name] = function (...args) {
		try {
			return original.apply(this, args);
		} catch (err) {
			if (err && (err.code === "EMFILE" || err.code === "ENFILE")) {
				console.error(
					`[fd-probe] ${err.code} from ${name}(${String(args[0]).slice(0, 90)})`,
				);
			}
			throw err;
		}
	};
}