# E2E macOS spike (throwaway — Option A)

Proof-of-concept that a native Tauri app (real WKWebView + **real Tauri IPC**) can be driven for automated E2E tests on a **free, unattended GitHub-hosted macOS runner**, without touching a local machine.

This is a self-contained minimal Tauri app — it does **not** build or modify tabularis. It exists only to prove the `tauri-webdriver` chain works on macOS CI.

## Why

PR #822 (Postgres nested multi-db) has a class of bug where a frontend call carries the tab's `schema` but not its `database` override, silently targeting the primary database. Those bugs only manifest against a **real backend** — browser-mode testing (which mocks `invoke()`) cannot catch them. Native-mode WebDriver driving of the real WKWebView is the only approach that exercises real IPC, and on macOS there is no built-in WKWebView WebDriver.

[`tauri-webdriver`](https://github.com/danielraffel/tauri-webdriver) (OSS) closes the gap via an in-app plugin + a W3C WebDriver CLI (`tauri-wd`).

## What it proves

If the CI job goes green, the full chain works unattended:

`build (debug binary with in-app WebDriver plugin)` → `tauri-wd (W3C WebDriver :4444)` → `real WKWebView` → `real invoke("ping_real_backend")` → `real Rust command` → `DOM assertion`

The test clicks a button invoking a real Rust command and asserts the marker `REAL_BACKEND_PONG_42` — a value only the actual backend can produce.

## Trigger

On-demand only — run via the Actions tab: **E2E macOS spike → Run workflow**. It never runs on push/PR.

## Run locally

```bash
cd spike/e2e
pnpm install
cargo install tauri-webdriver-automation --version 0.1.3 --locked
pnpm tauri build --debug --no-bundle
# terminal 1
pnpm dev --port 1420
# terminal 2
tauri-wd --port 4444
# terminal 3
pnpm wdio
```

## If green → Option B

The follow-up wires the same chain into the real tabularis app behind an `e2e-testing` Cargo feature flag (plugin registration in `src-tauri/src/lib.rs` under `#[cfg(feature = "e2e-testing")]`), with the adversarial same-name-different-key Postgres fixtures from the harness plan.
