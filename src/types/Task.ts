export interface Task {
    id: string;
    title: string;
    goalId: string;
    category: string;
    status: 'todo' | 'in_progress' | 'archived';
    startedAt?: Date;
    archivedAt?: Date;
    durationSeconds?: number;
    feedback?: string;
}