import { Task } from '../../index';

export function renderTaskItem(task: Task): string {
    const isTodo = task.status === 'todo';
    const isInProgress = task.status === 'in_progress';

    return `
    <div class="task-item" data-id="${task.id}">
      <div class="task-row">
        <div>
          <span class="title">${task.title}</span>
          <span class="tag">${task.category}</span>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${isTodo ? `<button class="btn-text btn-start" data-id="${task.id}">start</button>` : ''}
          ${isInProgress ? `<button class="btn-text btn-archive" data-id="${task.id}">done</button>` : ''}
          
       
          <button class="btn-text btn-delete" data-id="${task.id}" style="color: #ff5555;">x</button>
        </div>
      </div>
      ${task.feedback ? `<p class="feedback-note">${task.feedback}</p>` : ''}
      ${task.durationSeconds ? `<p class="faint">${Math.round(task.durationSeconds / 60)} min</p>` : ''}
    </div>
  `;
}