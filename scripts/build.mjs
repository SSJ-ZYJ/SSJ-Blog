import { spawnSync } from "node:child_process";

const build =
	"pnpm exec astro build && pnpm exec pagefind --site dist";

// EdgeOne's build container starts with a small open-file limit, and Astro's
// module graph exhausts it (EMFILE while `vite build` runs). Raise the soft
// limit as far as the hard limit allows before building.
const raiseLimit =
	"ulimit -n 1048576 2>/dev/null || ulimit -n 65535 2>/dev/null || ulimit -n 16384 2>/dev/null || true";

const script =
	process.platform === "win32"
		? build
		: `${raiseLimit}; echo "[build] open-file limit: $(ulimit -n)"; ${build}`;

const { status } = spawnSync(script, { stdio: "inherit", shell: true });

process.exit(status ?? 1);