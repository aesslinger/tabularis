// E2E spike: prove the macOS native WebDriver chain exercises REAL Tauri IPC.
//
// The test clicks a button that invokes the `ping_real_backend` Rust command
// and asserts the rendered marker is `REAL_BACKEND_PONG_42` — a value that
// only the actual Rust backend can produce (no mock). A green result proves
// the full chain on an unattended macOS runner: build -> tauri-wd -> real
// WKWebView -> real invoke() -> real Rust command -> DOM assertion.
describe("native IPC spike", () => {
  it("clicks a button that invokes a real Rust command and renders its result", async () => {
    await browser.url("/");
    const button = await $("[data-testid='btn-ping-real-backend']");
    await button.click();
    const result = await $("[data-testid='pong-result']");
    await browser.waitUntil(
      async () => (await result.getText()) === "REAL_BACKEND_PONG_42",
      { timeout: 10000, timeoutMsg: "pong marker never rendered" },
    );
    const text = await result.getText();
    expect(text).toBe("REAL_BACKEND_PONG_42");
  });
});
