use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TaskStatus {
    Todo,
    InProgress,
    Archived,
}

impl TaskStatus {
    pub fn from_str(s: &str) -> Self {
        match s {
            "in_progress" => TaskStatus::InProgress,
            "archived" => TaskStatus::Archived,
            _ => TaskStatus::Todo,
        }
    }

    pub fn as_str(&self) -> &str {
        match self {
            TaskStatus::Todo => "todo",
            TaskStatus::InProgress => "in_progress",
            TaskStatus::Archived => "archived",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum GoalStatus {
    Active,
    Completed,
    Archived,
}


impl GoalStatus {
    pub fn from_str(s: &str) -> Self {
        match s {
            "completed" | "Completed" => GoalStatus::Completed,
            "archived" | "Archived" => GoalStatus::Archived,
            _ => GoalStatus::Active,
        }
    }

    pub fn as_str(&self) -> &str {
        match self {
            GoalStatus::Active => "active",
            GoalStatus::Completed => "completed",
            GoalStatus::Archived => "archived",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub id: String,
    pub title: String,
    pub goal_id: String,
    pub category: String,
    pub status: TaskStatus,
    pub started_at: Option<String>,
    pub archived_at: Option<String>,
    pub duration_seconds: Option<i32>,
    pub feedback: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Goal {
    pub id: String,
    pub title: String,
    pub created_at: String,
    pub status: GoalStatus,
    pub deadline: Option<String>,
    pub archived_at: Option<String>,
    #[serde(default)]
    pub attempts: Vec<GoalAttempt>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GoalAttempt {
    pub id: String,
    pub goal_id: String,
    pub date: String,
    pub result: String,
    pub is_target_met: bool,
    pub note: Option<String>,
}