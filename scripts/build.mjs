import { spawn, spawnSync } from "node:child_process";

const build = "pnpm exec astro build && pnpm exec pagefind --site dist";

// EdgeOne's build container caps open files at 1024, and Astro's module graph
// can exhaust that. Raise the soft limit as far as the hard limit allows.
const limits = [1048576, 65535, 32768, 16384, 8192, 4096, 2048];

const run = (script, env) =>
	new Promise((resolve) => {
		const child = spawn(script, {
			shell: true,
			env,
			stdio: ["inherit", "pipe", "pipe"],
		});
		let output = "";
		for (const stream of [child.stdout, child.stderr]) {
			stream.on("data", (chunk) => {
				output += chunk.toString();
				process.stdout.write(chunk);
			});
		}
		child.on("close", (code) => resolve({ code: code ?? 1, output }));
	});

if (process.platform === "win32") {
	const { code } = await run(build, process.env);
	process.exit(code);
}

const raise = limits
	.map((value) => `ulimit -S -n ${value} 2>/dev/null`)
	.join(" || ");
const script = [
	`${raise} || true`,
	'echo "[build] node $(node -v), open files $(ulimit -Sn) (hard $(ulimit -Hn))"',
	build,
].join("; ");

const first = await run(script, process.env);
if (first.code === 0 || !first.output.includes("EMFILE")) {
	process.exit(first.code);
}

// Node's synchronous ESM path (require(esm)) can leak descriptors; retry
// without it when EMFILE is what killed the build.
const supportsFlag =
	spawnSync(process.execPath, ["--no-experimental-require-module", "-e", ""], {
		stdio: "ignore",
	}).status === 0;

if (!supportsFlag) {
	process.exit(first.code);
}

console.log("[build] EMFILE detected, retrying without require(esm)");
const retryEnv = {
	...process.env,
	NODE_OPTIONS: [process.env.NODE_OPTIONS, "--no-experimental-require-module"]
		.filter(Boolean)
		.join(" "),
};
const second = await run(script, retryEnv);
process.exit(second.code);