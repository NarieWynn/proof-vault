import { Goal } from '../../index';

export function renderGoalCard(goal: Goal): string {
    const isArchived = goal.status === 'archived';
    const lastAttempt = goal.attempts[goal.attempts.length - 1];

    return `
    <div class="card" data-id="${goal.id}">
      <div class="card-header">
        <span class="title">${goal.title}</span>
        <span class="${isArchived ? 'status-done' : 'status-active'}">
          ${isArchived ? 'done' : `${goal.attempts.length} attempt(s)`}
        </span>
      </div>
      ${goal.deadline ? `<p class="meta">deadline: ${new Date(goal.deadline).toLocaleDateString('en-US')}</p>` : ''}
      ${lastAttempt ? `<p class="meta">last attempt: ${lastAttempt.result} (${new Date(lastAttempt.date).toLocaleDateString('en-US')})</p>` : ''}

      ${!isArchived ? `
        <div class="form-row" style="margin-top: 10px; margin-bottom: 0;">
          <input type="text" class="attempt-result-input" placeholder="result (e.g. 6.5)" data-id="${goal.id}" style="flex: 0 1 140px;" />
          <label class="meta" style="display:flex; align-items:center; gap:4px;">
            <input type="checkbox" class="attempt-target-checkbox" data-id="${goal.id}" /> target met
          </label>
          <button class="btn-text btn-add-attempt" data-id="${goal.id}">log</button>
        </div>
      ` : ''}
    </div>
  `;
}