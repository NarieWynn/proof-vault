import { Task } from '../types/Task';

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export class TaskManager {
    private tasks: Task[] = [];

    constructor(initialTasks: Task[] = []) {
        this.tasks = initialTasks;
    }

    createTask(title: string, goalId: string, category: string): Task {
        const task: Task = {
            id: crypto.randomUUID(),
            title,
            goalId,
            category,
            status: 'todo',
        };
        this.tasks.push(task);
        return task;
    }

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTaskById(id: string): Task | undefined {
        return this.tasks.find((t) => t.id === id);
    }

    startTask(id: string): void {
        const task = this.getTaskById(id);
        if (!task) return;
        task.status = 'in_progress';
        task.startedAt = new Date();
    }

    archiveTask(id: string, feedback?: string): void {
        const task = this.getTaskById(id);
        if (!task) return;

        const now = new Date();
        if (task.startedAt) {
            task.durationSeconds = Math.round(
                (now.getTime() - task.startedAt.getTime()) / 1000
            );
        }
        task.status = 'archived';
        task.archivedAt = now;
        if (feedback) task.feedback = feedback;
    }

    updateFeedback(id: string, feedback: string): void {
        const task = this.getTaskById(id);
        if (!task) return;
        task.feedback = feedback;
    }

    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((t) => t.id !== id);
    }

    getTasksByGoal(goalId: string): Task[] {
        return this.tasks.filter((t) => t.goalId === goalId);
    }

    getTasksByDate(date: Date): Task[] {
        return this.tasks.filter(
            (t) => t.archivedAt && isSameDay(t.archivedAt, date)
        );
    }

    // Tổng số task đã hoàn thành theo category, dùng cho archive summary
    getCategorySummary(goalId: string): Record<string, number> {
        const summary: Record<string, number> = {};
        this.getTasksByGoal(goalId)
            .filter((t) => t.status === 'archived')
            .forEach((t) => {
                summary[t.category] = (summary[t.category] ?? 0) + 1;
            });
        return summary;
    }

    // Tổng thời gian (giây) đã bỏ ra cho 1 goal, dùng cho tab tổng quan
    getTotalDuration(goalId: string): number {
        return this.getTasksByGoal(goalId).reduce(
            (sum, t) => sum + (t.durationSeconds ?? 0),
            0
        );
    }

    // Group task theo ngày (yyyy-MM-dd) để vẽ heatmap
    getActivityByDay(): Record<string, { count: number; totalSeconds: number }> {
        const map: Record<string, { count: number; totalSeconds: number }> = {};
        this.tasks
            .filter((t) => t.status === 'archived' && t.archivedAt)
            .forEach((t) => {
                const d = t.archivedAt as Date;
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = { count: 0, totalSeconds: 0 };
                map[key].count += 1;
                map[key].totalSeconds += t.durationSeconds ?? 0;
            });
        return map;
    }

    // Dùng khi load lại dữ liệu từ storage (Date bị serialize thành string)
    static reviveDates(raw: any): Task {
        return {
            ...raw,
            startedAt: raw.startedAt ? new Date(raw.startedAt) : undefined,
            archivedAt: raw.archivedAt ? new Date(raw.archivedAt) : undefined,
        };
    }
}