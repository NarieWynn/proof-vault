import {
    exists,
    mkdir,
    readTextFile,
    writeTextFile,
    BaseDirectory,
} from '@tauri-apps/plugin-fs';
import { Goal } from '../types/Goal';
import { Task } from '../types/Task';
import { GoalManager } from '../models/GoalManager';
import { TaskManager } from '../models/TaskManager';

const DATA_DIR = 'my-journey';
const GOALS_FILE = `${DATA_DIR}/goals.json`;
const TASKS_FILE = `${DATA_DIR}/tasks.json`;

async function ensureDataDir(): Promise<void> {
    const dirExists = await exists(DATA_DIR, { baseDir: BaseDirectory.AppData });
    if (!dirExists) {
        await mkdir(DATA_DIR, { baseDir: BaseDirectory.AppData, recursive: true });
    }
}

export async function saveGoals(goals: Goal[]): Promise<void> {
    await ensureDataDir();
    await writeTextFile(GOALS_FILE, JSON.stringify(goals, null, 2), {
        baseDir: BaseDirectory.AppData,
    });
}

export async function loadGoals(): Promise<Goal[]> {
    await ensureDataDir();
    const fileExists = await exists(GOALS_FILE, { baseDir: BaseDirectory.AppData });
    if (!fileExists) return [];

    const raw = await readTextFile(GOALS_FILE, { baseDir: BaseDirectory.AppData });
    const parsed: any[] = JSON.parse(raw);
    return parsed.map((g) => GoalManager.reviveDates(g));
}

export async function saveTasks(tasks: Task[]): Promise<void> {
    await ensureDataDir();
    await writeTextFile(TASKS_FILE, JSON.stringify(tasks, null, 2), {
        baseDir: BaseDirectory.AppData,
    });
}

export async function loadTasks(): Promise<Task[]> {
    await ensureDataDir();
    const fileExists = await exists(TASKS_FILE, { baseDir: BaseDirectory.AppData });
    if (!fileExists) return [];

    const raw = await readTextFile(TASKS_FILE, { baseDir: BaseDirectory.AppData });
    const parsed: any[] = JSON.parse(raw);
    return parsed.map((t) => TaskManager.reviveDates(t));
}

// Gọi hàm này khi khởi động app để nạp dữ liệu vào 2 Manager
export async function loadAll(): Promise<{ goals: Goal[]; tasks: Task[] }> {
    const [goals, tasks] = await Promise.all([loadGoals(), loadTasks()]);
    return { goals, tasks };
}