import { Goal, GoalAttempt } from '../types/Goal';

export class GoalManager {
    private goals: Goal[] = [];

    constructor(initialGoals: Goal[] = []) {
        this.goals = initialGoals;
    }

    createGoal(title: string, deadline?: Date): Goal {
        const goal: Goal = {
            id: crypto.randomUUID(),
            title,
            createdAt: new Date(),
            deadline,
            status: 'active',
            attempts: [],
        };
        this.goals.push(goal);
        return goal;
    }

    getAllGoals(): Goal[] {
        return this.goals;
    }

    getActiveGoals(): Goal[] {
        return this.goals.filter((g) => g.status === 'active');
    }

    getArchivedGoals(): Goal[] {
        return this.goals.filter((g) => g.status === 'archived');
    }

    getGoalById(id: string): Goal | undefined {
        return this.goals.find((g) => g.id === id);
    }

    updateGoal(id: string, updates: Partial<Pick<Goal, 'title' | 'deadline'>>): void {
        const goal = this.getGoalById(id);
        if (!goal) return;
        Object.assign(goal, updates);
    }

    addAttempt( goalId: string, result: string, isTargetMet: boolean, note?: string): GoalAttempt | undefined {
        const goal = this.getGoalById(goalId);
        if (!goal) return undefined;

        const attempt: GoalAttempt = {
            id: crypto.randomUUID(),
            date: new Date(),
            result,
            isTargetMet,
            note,
        };
        goal.attempts.push(attempt);

        if (isTargetMet) {
            goal.status = 'archived';
            goal.archivedAt = new Date();
        }

        return attempt;
    }

    deleteGoal(id: string): void {
        this.goals = this.goals.filter((g) => g.id !== id);
    }

    // Dùng khi load lại dữ liệu từ storage (Date bị serialize thành string)
    static reviveDates(raw: any): Goal {
        return {
            ...raw,
            createdAt: new Date(raw.createdAt),
            deadline: raw.deadline ? new Date(raw.deadline) : undefined,
            archivedAt: raw.archivedAt ? new Date(raw.archivedAt) : undefined,
            attempts: (raw.attempts ?? []).map((a: any) => ({
                ...a,
                date: new Date(a.date),
            })),
        };
    }
}