# hello-node

Test app for Shiplon's **Node.js** runtime. No dependencies.

| Shiplon setting | Value |
|---|---|
| Runtime | Node.js |
| Install command | (leave empty: `npm ci` is picked from package-lock.json) |
| Build command | `npm run build` |
| Start command | `npm start` |
| Port | `3000` |
| Health check path | `/healthz` |

Optional environment variables: `APP_MESSAGE` (shown on the page), `BUILD_LABEL` (read during the build).

Run locally: `npm run build && npm start`, then open http://localhost:3000.
