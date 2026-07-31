use tauri::State;
use crate::AppState;
use crate::models;
use crate::db;

#[tauri::command]
pub fn get_all_goals(state: State<AppState>) -> Result<Vec<models::Goal>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_all_goals(&conn).map_err(|e| e.to_string())
}

