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
        createdAt: raw.createdAt ? new Date(raw.createdAt) : undefined,
        archivedAt: raw.archivedAt ? new Date(raw.archivedAt) : undefined,
    };
}
//====================================================================================================
// GOAL
//====================================================================================================
export async function fetchAllGoals(): Promise<Goal[]> {
    const rawGoals = await invoke<any[]>('get_all_goals');
    return rawGoals.map(reviveGoalDates);
}

export async function createGoal(input: {title: string; deadline?: string}): Promise<void> {
    await invoke('insert_goal', { input });
}

export async function updateGoal(goal: Goal): Promise<void> {
    await invoke('update_goal', { goal });
}

export async function deleteGoal(goalId: string): Promise<void> {
    await invoke('delete_goal', { goalId });
}
//====================================================================================================
// TASK
//====================================================================================================
export async function fetchAllTasks(): Promise<Task[]> {
    const rawTasks = await invoke<any[]>('get_all_tasks');
    return rawTasks.map(reviveTaskDates);
}

export async function createTask(input: {title: string;  goalId: string; category: string}): Promise<void> {
    await invoke('insert_task', { input });
}

export async function updateTask(task: Task): Promise<void>{
    await invoke('update_task', { task });
}
export async function deleteTask(taskId: string): Promise<void> {
    await invoke('delete_task', {taskId});
}
//====================================================================================================
// GOAL ATTEMPT
//====================================================================================================
export async function fetchGoalAttempts(goalId: string): Promise<GoalAttempt[]> {
    const rawAttempts = await invoke<any[]>('get_all_goal_attempts', { goalId });
    return rawAttempts.map((a) => ({
        ...a,
        date: new Date(a.date),
    }));
}

export async function createGoalAttempt(input: {goalId: string; result: string; isTargetMet: boolean; note?: string}): Promise<void> {
    await invoke('insert_goal_attempt', { input });
}

export async function updateGoalAttempt(attempt: GoalAttempt): Promise<void> {
    await invoke('update_goal_attempt', { attempt });
}

export async function deleteGoalAttempt(attemptId: string): Promise<void> {
    await invoke('delete_goal_attempt', { attemptId });
}
