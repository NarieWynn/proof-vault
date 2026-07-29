import { Goal } from '../../types/Goal';

export function renderGoalCard(goal: Goal): string {
    const isArchived = goal.status === 'archived';
    const lastAttempt = goal.attempts[goal.attempts.length - 1];

    return `
    <div class="goal-card p-4 border border-gray-700 rounded-lg mb-3" data-id="${goal.id}">
      <div class="flex items-center justify-between">
        <span class="font-medium">${goal.title}</span>
        <span class="text-xs ${isArchived ? 'text-green-400' : 'text-gray-400'}">
          ${isArchived ? 'Đã hoàn thành' : `${goal.attempts.length} lần thử`}
        </span>
      </div>
      ${goal.deadline ? `<p class="text-xs text-gray-500 mt-1">Hạn: ${new Date(goal.deadline).toLocaleDateString('vi-VN')}</p>` : ''}
      ${lastAttempt ? `<p class="text-xs text-gray-500 mt-1">Lần gần nhất: ${lastAttempt.result} (${new Date(lastAttempt.date).toLocaleDateString('vi-VN')})</p>` : ''}

      ${!isArchived ? `
        <div class="mt-3 flex gap-2 items-center">
          <input type="text" class="attempt-result-input text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1" placeholder="Kết quả (VD: 6.5)" data-id="${goal.id}" />
          <label class="text-xs flex items-center gap-1">
            <input type="checkbox" class="attempt-target-checkbox" data-id="${goal.id}" /> Đạt mục tiêu
          </label>
          <button class="btn-add-attempt text-xs text-cyan-400" data-id="${goal.id}">Ghi nhận</button>
        </div>
      ` : ''}
    </div>
  `;
}