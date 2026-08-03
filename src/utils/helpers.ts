import { Goal } from '../types/Goal';
import { Task } from '../types/Task';

// 1. Tự sinh Goal object đầy đủ
export function createGoalObject(title: string, deadline?: Date): Goal {
    return {
        id: crypto.randomUUID(),
        title,
        createdAt: new Date(),
        status: 'active',
        deadline,
        attempts: [],
    };
}
// 2. Tự sinh Task object đầy đủ
export function createTaskObject(title: string, goalId: string, category: string): Task {
    return {
        id: crypto.randomUUID(),
        title,
        goalId,
        category,
        status: 'todo',
    };
}