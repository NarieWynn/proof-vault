import { GoalManager } from '../../models/GoalManager';
import { renderGoalCard } from '../components/GoalCard';

export function renderGoalView(
    container: HTMLElement,
    goalManager: GoalManager,
    onChange: () => void
) {
    const activeGoals = goalManager.getActiveGoals();

    container.innerHTML = `
    <h2>goal</h2>

    <div class="form-row">
      <input id="new-goal-title" type="text" placeholder="e.g. IELTS 7.0" />
      <input id="new-goal-deadline" type="date" style="flex: 0 1 160px;" />
      <button id="btn-add-goal" class="btn btn-primary">add</button>
    </div>

    <div id="goal-list">
      ${activeGoals.length ? activeGoals.map(renderGoalCard).join('') : '<p class="empty-state">no active goals yet.</p>'}
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