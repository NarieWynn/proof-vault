import { invoke } from '@tauri-apps/api/core';
import { Goal, GoalAttempt } from '../types/Goal';
import { Task } from '../types/Task';

function reviveGoalDates(raw: any): Goal {
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

function reviveTaskDates(raw: any): Task {
    return {
        ...raw,
        startedAt: raw.startedAt ? new Date(raw.startedAt) : undefined,
        archivedAt: raw.archivedAt ? new Date(raw.archivedAt) : undefined,
    };
}

export async function fetchAllGoals(): Promise<Goal[]> {
    const rawGoals = await invoke<any[]>('get_all_goals');
    return rawGoals.map(reviveGoalDates);
}

export async function fetchAllTasks(): Promise<Task[]> {
    const rawTasks = await invoke<any[]>('get_all_tasks');
    return rawTasks.map(reviveTaskDates);
}

export async function fetchGoalAttempts(goalId: string): Promise<GoalAttempt[]> {
    const rawAttempts = await invoke<any[]>('get_all_goal_attempts', { goalId });
    return rawAttempts.map((a) => ({
        ...a,
        date: new Date(a.date),
    }));
}