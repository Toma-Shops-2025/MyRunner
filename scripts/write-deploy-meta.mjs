import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "public";
mkdirSync(outDir, { recursive: true });

const meta = {
  commit:
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_REF ||
    process.env.DEPLOY_COMMIT ||
    "local",
  branch:
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.BRANCH ||
    process.env.HEAD ||
    "local",
  context: process.env.VERCEL_ENV || process.env.CONTEXT || "local",
  builtAt: new Date().toISOString(),
};

writeFileSync(join(outDir, "deploy.json"), `${JSON.stringify(meta, null, 2)}\n`);
console.log(`Wrote public/deploy.json (${meta.commit} @ ${meta.branch})`);