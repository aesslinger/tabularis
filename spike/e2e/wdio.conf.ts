// WebDriverIO config for the macOS native-IPC E2E spike.
//
// Architecture: `tauri-wd` (tauri-webdriver-automation CLI) runs a W3C WebDriver
// server on :4444. WebDriverIO connects to it as a remote driver. The
// capability `tauri:options.binary` points at the built Tauri *debug* binary,
// which has the in-app `tauri-plugin-webdriver-automation` server compiled in
// (debug_builds only). The debug binary loads the frontend from `devUrl`
// (http://localhost:1420), so Vite must be running before the app launches.
//
// This exercises the REAL WKWebView + REAL Tauri IPC — the only mode that can
// catch the frontend->backend routing bug class in PR #822.
export const config = {
  runner: "local",
  specs: ["./e2e/**/*.spec.ts"],
  maxInstances: 1,
  capabilities: [
    {
      "tauri:options": {
        binary: "./src-tauri/target/debug/tabularis-orchestration",
      },
    },
  ],
  logLevel: "info",
  port: 4444,
  path: "/",
  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
  reporters: ["spec"],
};
