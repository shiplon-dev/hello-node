// Build step: records when and with which commit the app was built.
// Shiplon runs this as the build command (npm run build).
const fs = require("node:fs");

const info = {
  builtAt: new Date().toISOString(),
  node: process.version,
  // Build-time variable from the app's environment settings (optional).
  buildLabel: process.env.BUILD_LABEL || null,
};
fs.writeFileSync("build-info.json", JSON.stringify(info, null, 2) + "\n");
console.log("build-info.json written:", info);
