use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TaskStatus {
    Todo,
    InProgress,
    Completed,
}

impl TaskStatus {
    pub fn from_str (s: &str) -> Self {
        match s {
            "InProgress" => TaskStatus::InProgress,
            "Completed" => TaskStatus::Completed,
            _ => TaskStatus::Todo,
        }
    }

    pub fn as_str (&self) -> &str {
        match self {
            TaskStatus:: Todo => "Todo",
            TaskStatus::InProgress => "InProgress",
            TaskStatus::Completed => "Completed",
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GoalStatus {
    Active,
    Completed,
    Archived,
}

impl GoalStatus {
    pub fn from_str (s: &str) -> Self {
        match s {
            "Completed" => GoalStatus::Completed,
            "Archived" => GoalStatus::Archived,
            _ => GoalStatus::Active,
        }
    }

    pub fn as_str (&self) -> &str {
        match self {
            GoalStatus::Active => "Completed",
            GoalStatus::Completed => "Archived",
            GoalStatus::Archived => "Active",
        }
    }
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub goal_id: String,
    pub category: String,
    pub status: TaskStatus,
    pub started_at: Option <DateTime<Utc>>,
    pub archived_at: Option <DateTime<Utc>>,
    pub duration_seconds: Option <i32>,
    pub feedback: Option<String>
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Goal {
    pub id: String,
    pub title: String,
    pub created_at: DateTime<Utc>,
    pub status: GoalStatus,
    pub deadline: Option <DateTime<Utc>>,
    pub archived_at: Option <DateTime<Utc>>
}
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct GoalAttempt {
    pub id: String,
    pub goal_id: String,
    pub date: DateTime<Utc>,
    pub result: String,
    pub is_target_met: bool,
    pub note: Option <String>
}
