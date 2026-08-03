export type TaskStatus = 'todo' | 'in_progress' | 'archived';

export interface Task {
    id: string;
    title: string;
    goalId: string;
    category: string;
    status: TaskStatus;
    createdAt: string;
    archivedAt?: string;     // Dùng string
    durationSeconds?: number;
    feedback?: string;
}

export interface CreateTaskInput {
    title: string;
    goalId: string;
    category: string;
}