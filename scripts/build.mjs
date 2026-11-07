import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const probe = fileURLToPath(new URL("./fd-probe.cjs", import.meta.url));

const build = "pnpm exec astro build && pnpm exec pagefind --site dist";

// EdgeOne's build container caps open files at 1024. Raise the soft limit as
// far as the hard limit allows (currently it is capped, this only reports it).
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

// The probe only inspects the descriptor table, it does not change the build.
const env = {
	...process.env,
	NODE_OPTIONS: [process.env.NODE_OPTIONS, `--require ${probe}`]
		.filter(Boolean)
		.join(" "),
};

const { code } = await run(script, env);
process.exit(code);