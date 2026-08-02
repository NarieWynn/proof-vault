
import { renderTaskItem } from '../components/TaskItem';

export function renderStudyView(
    container: HTMLElement,
    taskManager: TaskManager,
    goalManager: GoalManager,
    onChange: () => void
) {
    const activeGoals = goalManager.getActiveGoals();
    const tasks = taskManager.getAllTasks().filter((t) => t.status !== 'archived');

    container.innerHTML = `
    <h2>study</h2>

    ${
        activeGoals.length === 0
            ? '<p class="empty-state">no goals yet — add one in the goal tab first.</p>'
            : `
      <div class="form-row">
        <input id="new-task-title" type="text" placeholder="e.g. do 1 reading passage" />
        <select id="new-task-goal" style="flex: 0 1 160px;">
          ${activeGoals.map((g) => `<option value="${g.id}">${g.title}</option>`).join('')}
        </select>
        <input id="new-task-category" type="text" placeholder="category (e.g. reading)" style="flex: 0 1 140px;" />
        <button id="btn-add-task" class="btn btn-primary">add</button>
      </div>
    `
    }

    <div id="task-list">
      ${tasks.length ? tasks.map(renderTaskItem).join('') : '<p class="empty-state">no tasks today.</p>'}
    </div>

    <div id="feedback-modal" class="modal-overlay hidden">
      <div class="modal-box">
        <p class="meta" style="margin-bottom: 8px;">reflection (optional):</p>
        <textarea id="feedback-input" rows="3" placeholder="e.g. missed a synonym-inference question"></textarea>
        <div class="modal-actions">
          <button id="btn-cancel-archive" class="btn-text">cancel</button>
          <button id="btn-confirm-archive" class="btn btn-primary">save & complete</button>
        </div>
      </div>
    </div>
  `;

    container.querySelector('#btn-add-task')?.addEventListener('click', () => {
        const titleInput = container.querySelector('#new-task-title') as HTMLInputElement;
        const goalSelect = container.querySelector('#new-task-goal') as HTMLSelectElement;
        const categoryInput = container.querySelector('#new-task-category') as HTMLInputElement;

        const title = titleInput.value.trim();
        const category = categoryInput.value.trim();
        if (!title || !category) return;

        taskManager.createTask(title, goalSelect.value, category);
        onChange();
    });

    container.querySelectorAll('.btn-start').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = (btn as HTMLElement).dataset.id!;
            taskManager.startTask(id);
            onChange();
        });
    });

    let archivingTaskId: string | null = null;
    const modal = container.querySelector('#feedback-modal') as HTMLElement;

    container.querySelectorAll('.btn-archive').forEach((btn) => {
        btn.addEventListener('click', () => {
            archivingTaskId = (btn as HTMLElement).dataset.id!;
            modal.classList.remove('hidden');
        });
    });

    container.querySelector('#btn-cancel-archive')?.addEventListener('click', () => {
        archivingTaskId = null;
        modal.classList.add('hidden');
    });

    container.querySelector('#btn-confirm-archive')?.addEventListener('click', () => {
        if (!archivingTaskId) return;
        const feedbackInput = container.querySelector('#feedback-input') as HTMLTextAreaElement;
        taskManager.archiveTask(archivingTaskId, feedbackInput.value.trim() || undefined);
        modal.classList.add('hidden');
        onChange();
    });
}