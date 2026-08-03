export interface GoalAttempt {
    id: string;
    goalId: string;
    date: Date;
    result: string;
    isTargetMet: boolean;
    note?: string;
}

export interface Goal {
    id: string;
    title: string;
    createdAt: Date;
    deadline?: Date;
    status: 'active' | 'completed' | 'archived';
    attempts: GoalAttempt[];
    archivedAt?: Date;
}