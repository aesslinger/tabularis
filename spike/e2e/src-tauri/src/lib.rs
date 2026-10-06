// Real Tauri commands exercised by the E2E spike. These exist to prove the
// WebDriver test reaches the actual Rust backend (real IPC), not a mock.
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Returns a deterministic marker string. The UI renders it after an `invoke`
/// call; the E2E test asserts the rendered text matches. Because this value is
/// produced in Rust, only a real-IPC (not mocked) run can surface it.
#[tauri::command]
fn ping_real_backend() -> String {
    "REAL_BACKEND_PONG_42".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, ping_real_backend]);

    // In-app WebDriver server (debug builds only). The tauri-wd CLI connects to
    // this to drive the real WKWebView via the W3C WebDriver protocol on macOS.
    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(tauri_plugin_webdriver_automation::init());
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
