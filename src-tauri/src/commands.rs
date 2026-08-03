use tauri::State;
use crate::AppState;
use chrono::Utc;
use crate::db;
use crate::models::{Task, Goal, TaskStatus, CreateTaskInput, GoalAttempt, CreateGoalInput, CreateGoalAttemptInput, GoalStatus};
//====================================================================================================
// GOAL
//====================================================================================================
#[tauri::command]
pub fn get_all_goals(state: State<AppState>) -> Result<Vec<Goal>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_all_goals(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_goal(input: CreateGoalInput, state: State<AppState>) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    let new_goal = Goal {
        id: uuid::Uuid::new_v4().to_string(),
        title: input.title,
        created_at: Utc::now(),
        status: GoalStatus::Active,
        archived_at: None,
        attempts: vec![],
        deadline: input.deadline,
    };
    db::insert_goal(&conn, &new_goal).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_goal(goal: Goal, state: State<AppState>) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::update_goal(&conn, &goal).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_goal(goal_id: String, state: State<AppState>) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::delete_goal(&conn, &goal_id).map_err(|e| e.to_string())?;
    Ok(())
}
//====================================================================================================
// GOAL ATTEMPT
//====================================================================================================
#[tauri::command]
pub fn get_all_goal_attempts(state: State<AppState>, goal_id: String) -> Result<Vec<GoalAttempt>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_attempts_by_goal_id(&conn, &goal_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_goal_attempt(state: State<AppState>, input: CreateGoalAttemptInput)  -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    let new_goal_attempt = GoalAttempt {
        id: uuid::Uuid::new_v4().to_string(),
        result: input.result,
        goal_id: input.goal_id,
        date: Utc::now(),
        is_target_met: input.is_target_met,
        note: input.note,

    };
    db::insert_goal_attempt(&conn, &new_goal_attempt).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_goal_attempt(state: State<AppState>, attempt: GoalAttempt)  -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::update_goal_attempt(&conn, &attempt).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn delete_goal_attempt(attempt_id: String, state: State<AppState>)  -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::delete_goal_attempt(&conn, &attempt_id).map_err(|e| e.to_string())?;
    Ok(())
}
//====================================================================================================
// TASK
//====================================================================================================
#[tauri::command]
pub fn get_all_tasks(state: State<AppState>) -> Result<Vec<Task>, String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::get_all_tasks(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn insert_task(state: State<AppState>, input: CreateTaskInput) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    let new_task = Task {
        id: uuid::Uuid::new_v4().to_string(),
        title: input.title,
        goal_id: input.goal_id,
        category: input.category,
        status: TaskStatus::Todo,
        created_at: Utc::now(),
        archived_at: None,
        duration_seconds: None,
        feedback: None,
    };
    db::insert_task(&conn, &new_task).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_task(state: State<AppState>, task_id: String) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::delete_task(&conn, &task_id).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn update_task(state: State<AppState>, task: Task) -> Result<(), String> {
    let conn = state.db.lock().map_err(|e| e.to_string())?;
    db::update_task(&conn, &task).map_err(|e| e.to_string())?;

    Ok(())
}