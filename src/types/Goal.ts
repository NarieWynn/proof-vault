export interface GoalAttempt {
    id: string;
    goalId: string;
    date: string; // Trả về dạng string ISO từ DateTime<Utc> của Rust
    result: string;
    isTargetMet: boolean;
    note?: string;
}

export type GoalStatus = 'active' | 'completed' | 'archived';

export interface Goal {
    id: string;
    title: string;
    createdAt: string;
    status: GoalStatus;
    deadline?: string;
    archivedAt?: string;
    attempts: GoalAttempt[];
}

// Kiểu input khi gọi createGoal (Khớp với CreateGoalInput bên Rust)
export interface CreateGoalInput {
    title: string;
    deadline?: string; // Dạng "YYYY-MM-DD" hoặc string ISO
}