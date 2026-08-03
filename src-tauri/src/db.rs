use rusqlite::{Connection, Result, params};
use crate::models::{Goal, Task, TaskStatus, GoalStatus, GoalAttempt};
pub fn init_db (conn: &Connection) -> Result<(), rusqlite::Error> {
    // 1. Create goals table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS goals (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            created_at TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('Active', 'Completed', 'Archived')),
            deadline TEXT,
            archived_at TEXT
        )",
        [],
    )?;

    // 2. Create goal_attempts table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS goal_attempts (
            id TEXT PRIMARY KEY,
            goal_id TEXT NOT NULL,
            date TEXT NOT NULL,
            result TEXT NOT NULL,
            is_target_met INTEGER NOT NULL CHECK (is_target_met IN (0, 1)),
            note TEXT,
            FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
        )",
        [],
    )?;

    // 3.Create tasks table
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            goal_id TEXT NOT NULL,
            category TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('Todo', 'InProgress', 'Completed')),
            started_at TEXT,
            archived_at TEXT,
            duration_seconds INTEGER,
            feedback TEXT,
            FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
        )",
        [],
    )?;

    Ok(())
}

//============================================================================================
// GET ALL TASKS TO RENDER OVERVIEW
//============================================================================================
pub fn get_all_tasks (conn: &Connection) -> Result<Vec<Task>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, title, goal_id, category, status, started_at, archived_at, duration_seconds, feedback FROM tasks"
    )?;

    let tasks = stmt.query_map([], |row| {
        let status_str: String = row.get(4)?;
        Ok(Task {
            id: row.get(0)?,
            title: row.get(1)?,
            goal_id: row.get(2)?,
            category: row.get(3)?,
            status: TaskStatus::from_str(&status_str),
            created_at: row.get(5)?,
            archived_at: row.get(6)?,
            duration_seconds: row.get(7)?,
            feedback: row.get(8)?,
        })
    })?.collect::<Result<Vec<_>, _>>()?;

    Ok(tasks)
}

//============================================================================================
// INSERT NEW TASK
//============================================================================================
pub fn insert_task (conn: &Connection, task: &Task) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO tasks (id, title, goal_id, category, status, started_at, archived_at, duration_seconds, feedback)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            task.id,
            task.title,
            task.goal_id,
            task.category,
            task.status.as_str(),
            task.created_at,
            task.archived_at,
            task.duration_seconds,
            task.feedback,
        ],
    )?;

    Ok(())
}

//============================================================================================
// UPDATE TASK
//============================================================================================
pub fn update_task (conn: &Connection, task: &Task) -> Result<(), rusqlite::Error> {
    conn.execute(
        "UPDATE tasks
        SET title = ?1,
        goal_id = ?2,
        category = ?3,
        status = ?4,
        started_at = ? 5,
        archived_at = ? 6,
        duration_seconds = ?7,
        feedback = ? 8
        WHERE id = ?9",
        params![
            &task.title,
            &task.goal_id,
            &task.category,
            &task.status.as_str(),
            &task.created_at,
            &task.archived_at,
            &task.duration_seconds,
            &task.feedback,
            &task.id,
        ],
    )?;

    Ok(())
}

//============================================================================================
// DELETE TASK
//============================================================================================
pub fn delete_task (conn: &Connection, task_id: &str) -> Result<(), rusqlite::Error> {
    conn.execute(
        "DELETE FROM tasks WHERE id = ?1",
        params![task_id],
    )?;

    Ok(())
}

//============================================================================================
// GET FULL GOAL
//============================================================================================
pub fn get_all_goals (conn: &Connection) -> Result<Vec<Goal>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, title, created_at, status, deadline, archived_at FROM goals"
    )?;

    let goal_iter = stmt.query_map([], |row| {
        let status_str: String = row.get(3)?;
        Ok(Goal {
            id: row.get(0)?,
            title: row.get(1)?,
            created_at: row.get(2)?,
            status: GoalStatus::from_str(&status_str),
            deadline: row.get(4)?,
            archived_at: row.get(5)?,
            attempts: vec![],
        })
    })?;

    let goals = goal_iter.collect::<Result<Vec<_>, _>>()?;

    Ok(goals)
}

//============================================================================================
// INSERT GOAL
//============================================================================================
pub fn insert_goal (conn: &Connection, goal: &Goal) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO goals (id, title, created_at, status, deadline, archived_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            goal.id,
            goal.title,
            goal.created_at,
            goal.status.as_str(),
            goal.deadline,
            goal.archived_at,
        ]
    )?;

    Ok(())
}

//============================================================================================
// UPDATE GOAL
//============================================================================================
pub fn update_goal (conn: &Connection, goal: &Goal) -> Result<(), rusqlite::Error> {
    conn.execute(
        "UPDATE goals
        SET title = ?1,
        status = ?2,
        deadline = ?3,
        archived_at = ?4
        WHERE id = ?5",
        params![
            goal.title,
            goal.status.as_str(),
            goal.deadline,
            goal.archived_at,
            goal.id,
        ]
    )?;
    Ok(())
}
//============================================================================================
// DELETE GOAL
//============================================================================================
pub fn delete_goal (conn: &Connection, goal_id: &str) -> Result<(), rusqlite::Error> {
    conn.execute(
        "DELETE FROM goals WHERE id = ?1 ",
        params![goal_id],
    )?;
    Ok(())
}
//============================================================================================
// GET ATTEMPTS BY GOAL ID
//============================================================================================
pub fn get_attempts_by_goal_id(conn: &Connection, goal_id: &str) -> Result<Vec<GoalAttempt>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, goal_id, date, result, is_target_met, note
         FROM goal_attempts
         WHERE goal_id = ?1
         ORDER BY date DESC"
    )?;

    let attempt_iter = stmt.query_map(params![goal_id], |row| {
        let is_target_met_int: i32 = row.get(4)?;
        Ok(GoalAttempt {
            id: row.get(0)?,
            goal_id: row.get(1)?,
            date: row.get(2)?,
            result: row.get(3)?,
            is_target_met: is_target_met_int != 0, // Convert SQLite INTEGER (0/1) sang bool
            note: row.get(5)?,
        })
    })?;

    let attempts = attempt_iter.collect::<Result<Vec<_>, _>>()?;
    Ok(attempts)
}

//============================================================================================
// INSERT GOAL ATTEMPT
//============================================================================================
pub fn insert_goal_attempt(conn: &Connection, attempt: &GoalAttempt) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO goal_attempts (id, goal_id, date, result, is_target_met, note)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![
            attempt.id,
            attempt.goal_id,
            attempt.date,
            attempt.result,
            if attempt.is_target_met { 1 } else { 0 },
            attempt.note,
        ],
    )?;

    Ok(())
}

//============================================================================================
// UPDATE GOAL ATTEMPT
//============================================================================================
pub fn update_goal_attempt(conn: &Connection, attempt: &GoalAttempt) -> Result<(), rusqlite::Error> {
    conn.execute(
        "UPDATE goal_attempts
         SET date = ?1,
             result = ?2,
             is_target_met = ?3,
             note = ?4
         WHERE id = ?5",
        params![
            attempt.date,
            attempt.result,
            if attempt.is_target_met { 1 } else { 0 },
            attempt.note,
            attempt.id,
        ],
    )?;

    Ok(())
}

//============================================================================================
// DELETE GOAL ATTEMPT
//============================================================================================
pub fn delete_goal_attempt(conn: &Connection, attempt_id: &str) -> Result<(), rusqlite::Error> {
    conn.execute(
        "DELETE FROM goal_attempts WHERE id = ?1",
        params![attempt_id],
    )?;

    Ok(())
}
