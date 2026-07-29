import { TaskManager } from '../../models/TaskManager';
import { GoalManager } from '../../models/GoalManager';
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
    <div class="p-6">
      <h2 class="text-xl mb-4">Study</h2>

      ${
        activeGoals.length === 0
            ? '<p class="text-sm text-gray-500 mb-4">Chưa có goal nào — thêm goal ở tab Goal trước đã.</p>'
            : `
        <div class="flex gap-2 mb-6">
          <input id="new-task-title" type="text" placeholder="VD: Làm 1 bài reading"
            class="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
          <select id="new-task-goal" class="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm">
            ${activeGoals.map((g) => `<option value="${g.id}">${g.title}</option>`).join('')}
          </select>
          <input id="new-task-category" type="text" placeholder="Category (VD: reading)"
            class="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm w-32" />
          <button id="btn-add-task" class="bg-cyan-500 text-black px-4 py-2 rounded text-sm">Thêm</button>
        </div>
      `
    }

      <div id="task-list">
        ${tasks.length ? tasks.map(renderTaskItem).join('') : '<p class="text-sm text-gray-500">Chưa có task nào hôm nay.</p>'}
      </div>

      <div id="feedback-modal" class="hidden fixed inset-0 bg-black/60 flex items-center justify-center">
        <div class="bg-gray-800 p-6 rounded-lg w-96">
          <p class="text-sm mb-2">Ghi nhận lại (không bắt buộc):</p>
          <textarea id="feedback-input" class="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm" rows="3" placeholder="VD: sai câu suy luận từ đồng nghĩa"></textarea>
          <div class="flex justify-end gap-2 mt-3">
            <button id="btn-cancel-archive" class="text-xs text-gray-400">Hủy</button>
            <button id="btn-confirm-archive" class="text-xs bg-green-500 text-black px-3 py-1 rounded">Lưu & hoàn thành</button>
          </div>
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