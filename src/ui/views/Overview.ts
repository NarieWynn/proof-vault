import { GoalManager } from '../../models/GoalManager';
import { TaskManager } from '../../models/TaskManager';

function getColorForCount(count: number, max: number): string {
    if (count === 0) return 'bg-gray-800';
    const ratio = count / max;
    if (ratio < 0.33) return 'bg-teal-900';
    if (ratio < 0.66) return 'bg-teal-700';
    return 'bg-teal-400';
}

export function renderOverviewView(
    container: HTMLElement,
    goalManager: GoalManager,
    taskManager: TaskManager
) {
    const allGoals = goalManager.getAllGoals();
    const activity = taskManager.getActivityByDay();
    const maxCount = Math.max(1, ...Object.values(activity).map((v) => v.count));

    const today = new Date();
    const days: { key: string; date: Date }[] = [];
    for (let i = 89; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        days.push({ key, date: d });
    }

    container.innerHTML = `
    <div class="p-6">
      <h2 class="text-xl mb-4">Tổng quan</h2>

      <p class="text-sm text-gray-400 mb-2">Hoạt động 90 ngày gần đây</p>
      <div class="grid grid-cols-15 gap-1 mb-6" style="grid-template-columns: repeat(15, 1fr);">
        ${days
        .map((d) => {
            const info = activity[d.key];
            const count = info?.count ?? 0;
            const title = `${d.date.toLocaleDateString('vi-VN')}: ${count} task, ${Math.round((info?.totalSeconds ?? 0) / 60)} phút`;
            return `<div class="day-cell aspect-square rounded ${getColorForCount(count, maxCount)}" title="${title}" data-date="${d.key}"></div>`;
        })
        .join('')}
      </div>

      <p class="text-sm text-gray-400 mb-2">Mục tiêu</p>
      <div id="goal-summary-list">
        ${allGoals
        .map(
            (g) => `
          <div class="flex items-center justify-between p-3 border border-gray-700 rounded-lg mb-2">
            <span class="text-sm">${g.title}</span>
            <span class="text-xs ${g.status === 'archived' ? 'text-green-400' : 'text-gray-400'}">
              ${g.status === 'archived' ? 'Đã hoàn thành' : 'Đang thực hiện'}
            </span>
          </div>
        `
        )
        .join('') || '<p class="text-sm text-gray-500">Chưa có goal nào.</p>'}
      </div>

      <div id="day-detail" class="mt-4"></div>
    </div>
  `;

    const detailPanel = container.querySelector('#day-detail') as HTMLElement;

    container.querySelectorAll('.day-cell').forEach((cell) => {
        cell.addEventListener('click', () => {
            const dateKey = (cell as HTMLElement).dataset.date!;
            const [y, m, d] = dateKey.split('-').map(Number);
            const targetDate = new Date(y, m - 1, d);
            const tasksOfDay = taskManager.getTasksByDate(targetDate);

            if (tasksOfDay.length === 0) {
                detailPanel.innerHTML = `<p class="text-sm text-gray-500">Không có hoạt động ngày ${targetDate.toLocaleDateString('vi-VN')}.</p>`;
                return;
            }

            detailPanel.innerHTML = `
        <div class="border border-gray-700 rounded-lg p-4">
          <p class="text-sm font-medium mb-2">${targetDate.toLocaleDateString('vi-VN')}</p>
          ${tasksOfDay
                .map(
                    (t) => `
            <div class="text-xs border-b border-gray-800 py-2">
              <span>${t.title} — ${t.category}</span>
              ${t.durationSeconds ? `<span class="text-gray-500"> · ${Math.round(t.durationSeconds / 60)} phút</span>` : ''}
              ${t.feedback ? `<p class="text-gray-500 mt-1">${t.feedback}</p>` : ''}
            </div>
          `
                )
                .join('')}
        </div>
      `;
        });
    });
}