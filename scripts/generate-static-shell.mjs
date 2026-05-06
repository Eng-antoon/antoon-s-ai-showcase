import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const clientDir = path.resolve("dist/client");
const serverAssetsDir = path.resolve("dist/server/assets");

async function findFile(dir, predicate) {
  const files = await readdir(dir);
  const match = files.find(predicate);
  if (!match) {
    throw new Error(`Could not find expected build artifact in ${dir}`);
  }
  return match;
}

const manifestFile = await findFile(
  serverAssetsDir,
  (file) => file.startsWith("_tanstack-start-manifest") && file.endsWith(".js"),
);
const manifestSource = await readFile(path.join(serverAssetsDir, manifestFile), "utf8");
const clientEntry = manifestSource.match(/clientEntry:\s*"([^"]+)"/)?.[1];
const preloads = [...manifestSource.matchAll(/preloads:\s*\[([^\]]*)\]/g)]
  .flatMap(([, value]) => [...value.matchAll(/"([^"]+)"/g)].map(([, preload]) => preload))
  .filter((preload) => preload !== clientEntry);

if (!clientEntry) {
  throw new Error("Could not resolve TanStack Start client entry from build manifest");
}

const cssFile = await findFile(
  clientDir + "/assets",
  (file) => file.startsWith("styles-") && file.endsWith(".css"),
);
const modulePreloads = [clientEntry, ...preloads]
  .map((href) => `    <link rel="modulepreload" href="${href}" />`)
  .join("\n");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Antoon Kamel - AI Technical Product Manager</title>
    <meta
      name="description"
      content="Portfolio of Antoon Kamel Ibrahim - AI Technical Product Manager building logistics, finance, sales, workforce and consumer AI products."
    />
    <meta property="og:title" content="Antoon Kamel - AI Technical Product Manager" />
    <meta
      property="og:description"
      content="Ten shipped products across logistics, marketplaces, finance, sales, workforce operations, AI agents and consumer AI."
    />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    />
    <link rel="stylesheet" href="/assets/${cssFile}" />
${modulePreloads}
  </head>
  <body>
    <script type="module" src="${clientEntry}"></script>
  </body>
</html>
`;

await writeFile(path.join(clientDir, "_shell.html"), html);
await copyFile(path.join(clientDir, "_shell.html"), path.join(clientDir, "index.html"));
