import { GoalManager } from '../../models/GoalManager';
import { renderGoalCard } from '../components/GoalCard';

export function renderGoalView(
    container: HTMLElement,
    goalManager: GoalManager,
    onChange: () => void
) {
    const activeGoals = goalManager.getActiveGoals();

    container.innerHTML = `
    <div class="p-6">
      <h2 class="text-xl mb-4">Goal</h2>

      <div class="flex gap-2 mb-6">
        <input id="new-goal-title" type="text" placeholder="Tên mục tiêu (VD: IELTS 7.0)"
          class="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
        <input id="new-goal-deadline" type="date"
          class="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm" />
        <button id="btn-add-goal" class="bg-cyan-500 text-black px-4 py-2 rounded text-sm">Thêm</button>
      </div>

      <div id="goal-list">
        ${activeGoals.length ? activeGoals.map(renderGoalCard).join('') : '<p class="text-sm text-gray-500">Chưa có goal nào đang thực hiện.</p>'}
      </div>
    </div>
  `;

    container.querySelector('#btn-add-goal')?.addEventListener('click', () => {
        const titleInput = container.querySelector('#new-goal-title') as HTMLInputElement;
        const deadlineInput = container.querySelector('#new-goal-deadline') as HTMLInputElement;
        const title = titleInput.value.trim();
        if (!title) return;

        const deadline = deadlineInput.value ? new Date(deadlineInput.value) : undefined;
        goalManager.createGoal(title, deadline);
        onChange();
    });

    container.querySelectorAll('.btn-add-attempt').forEach((btn) => {
        btn.addEventListener('click', () => {
            const goalId = (btn as HTMLElement).dataset.id!;
            const resultInput = container.querySelector(
                `.attempt-result-input[data-id="${goalId}"]`
            ) as HTMLInputElement;
            const targetCheckbox = container.querySelector(
                `.attempt-target-checkbox[data-id="${goalId}"]`
            ) as HTMLInputElement;

            const result = resultInput.value.trim();
            if (!result) return;

            goalManager.addAttempt(goalId, result, targetCheckbox.checked);
            onChange();
        });
    });
}