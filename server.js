// Minimal Node.js HTTP server for testing Shiplon's Node.js runtime.
//   GET /         page with runtime details
//   GET /healthz  200 "ok" (set the health check path to /healthz)
//   GET /api/info JSON with the same details
const http = require("node:http");
const fs = require("node:fs");
const os = require("node:os");

const port = Number(process.env.PORT) || 3000;
const started = new Date().toISOString();
let build = null;
try {
  build = JSON.parse(fs.readFileSync("build-info.json", "utf8"));
} catch {
  build = null;
}

function info() {
  return {
    app: "hello-node",
    message: process.env.APP_MESSAGE || "(APP_MESSAGE is not set)",
    node: process.version,
    pod: os.hostname(),
    port,
    startedAt: started,
    build,
  };
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/healthz") {
    res.writeHead(200, { "content-type": "text/plain" });
    return res.end("ok\n");
  }
  if (url.pathname === "/api/info") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify(info(), null, 2) + "\n");
  }
  if (url.pathname !== "/") {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("not found\n");
  }
  const i = info();
  const rows = [
    ["Message (APP_MESSAGE)", i.message],
    ["Node.js", i.node],
    ["Pod", i.pod],
    ["Port", i.port],
    ["Started", i.startedAt],
    ["Built", i.build ? i.build.builtAt : "no build-info.json (build command did not run)"],
    ["Build label (BUILD_LABEL)", i.build && i.build.buildLabel ? i.build.buildLabel : "(not set)"],
  ]
    .map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join("");
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>hello-node</title>
<style>body{font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px}th{text-align:left;padding:6px 16px 6px 0;color:#555;font-weight:500}td{font-family:ui-monospace,monospace}</style>
<h1>hello-node is running (v2)</h1><p>Node.js runtime test app for Shiplon.</p><table>${rows}</table>`);
});

server.listen(port, "0.0.0.0", () => console.log(`hello-node listening on :${port}`));

// Exit cleanly when Kubernetes stops the pod during a rollout.
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing");
  server.close(() => process.exit(0));
});
