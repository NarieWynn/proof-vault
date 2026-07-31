use tauri::State;
use crate::AppState;
use crate::models;
use crate::db;

#[tauri::command]
pub fn get_all_goals(state: State<AppState>) -> Result<Vec<models::Goal>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_all_goals(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_tasks(state: State<AppState>) -> Result<Vec<models::Task>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_all_tasks(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_all_goal_attempts(state: State<AppState>, goal_id: String) -> Result<Vec<models::GoalAttempt>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_attempts_by_goal_id(&conn, &goal_id).map_err(|e| e.to_string())
}
