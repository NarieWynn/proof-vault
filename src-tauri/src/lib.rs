pub mod db;
pub mod models;
pub mod commands; // Khai báo module commands
use std::sync::Mutex;
use rusqlite::Connection;

pub struct AppState {
    pub db: Mutex<Connection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let conn = Connection::open("tracker.db").expect("Failed to open db");
    conn.execute_batch("PRAGMA foreign_keys = ON;").unwrap();
    let _ = db::init_db(&conn);

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .manage(AppState { db: Mutex::new(conn) })
        .invoke_handler(tauri::generate_handler![
           commands::get_all_goals, // Gọi qua module commands::
            commands::get_all_tasks,
            commands::get_all_goal_attempts,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}