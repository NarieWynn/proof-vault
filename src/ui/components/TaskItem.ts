import { Task } from '../../types/Task';

export function renderTaskItem(task: Task): string {
    const isTodo = task.status === 'todo';
    const isInProgress = task.status === 'in_progress';

    return `
    <div class="task-item flex flex-col gap-1 p-3 border-b border-gray-700" data-id="${task.id}">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-sm">${task.title}</span>
          <span class="text-xs text-gray-400 ml-2">${task.category}</span>
        </div>
        <div class="flex gap-2">
          ${isTodo ? `<button class="btn-start text-xs text-cyan-400" data-id="${task.id}">Bắt đầu</button>` : ''}
          ${isInProgress ? `<button class="btn-archive text-xs text-green-400" data-id="${task.id}">Hoàn thành</button>` : ''}
        </div>
      </div>
      ${task.feedback ? `<p class="text-xs text-gray-500">${task.feedback}</p>` : ''}
      ${task.durationSeconds ? `<p class="text-xs text-gray-600">${Math.round(task.durationSeconds / 60)} phút</p>` : ''}
    </div>
  `;
}