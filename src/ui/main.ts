import { fetchAllGoals, fetchAllTasks } from '../storage/dbService';
import { renderTabBar, TabName } from './components/TabBar';
import { renderGoalView } from './views/GoalView';
import { renderStudyView } from './views/StudyView';
import { renderArchiveView } from './views/ArchiveView';
import { renderOverviewView } from './views/Overview';
import './style.css';

const app = document.getElementById('app');

let currentTab: TabName = 'overview';
let goalManager: GoalManager;
let taskManager: TaskManager;

function renderApp() {
    if (!app) return;

    app.innerHTML = `<div id="tab-bar"></div><div id="tab-content"></div>`;
    const tabBarEl = document.getElementById('tab-bar')!;
    const contentEl = document.getElementById('tab-content')!;

    tabBarEl.innerHTML = renderTabBar(currentTab);
    tabBarEl.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentTab = (btn as HTMLElement).dataset.tab as TabName;
            renderApp();
        });
    });

    const onChange = () => {
        renderApp();
    };

    switch (currentTab) {
        case 'goal':
            renderGoalView(contentEl, goalManager, onChange);
            break;
        case 'study':
            renderStudyView(contentEl, taskManager, goalManager, onChange);
            break;
        case 'archive':
            renderArchiveView(contentEl, goalManager, taskManager);
            break;
        case 'overview':
            renderOverviewView(contentEl, goalManager, taskManager);
            break;
    }
}

async function init() {
    try {
        const [goals, tasks] = await Promise.all([
            fetchAllGoals(),
            fetchAllTasks()
        ]);

        goalManager = new GoalManager(goals);
        taskManager = new TaskManager(tasks);

        renderApp();
    } catch (error) {
        console.error("Error cannot access data in SQLite:", error);
    }
}

init().catch((err) => console.error("Uncaught init error:", err));