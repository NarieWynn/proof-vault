import { GoalManager } from '../../models/GoalManager';
import { TaskManager } from '../../models/TaskManager';

export function renderArchiveView(
    container: HTMLElement,
    goalManager: GoalManager,
    taskManager: TaskManager,
    onChange: () => void
) {
    const archivedGoals = goalManager.getArchivedGoals();

    container.innerHTML = `
    <div class="p-6">
      <h2 class="text-xl mb-4">Archive</h2>
      ${
        archivedGoals.length === 0
            ? '<p class="text-sm text-gray-500">Chưa có goal nào hoàn thành.</p>'
            : archivedGoals
                .map((goal) => {
                    const summary = taskManager.getCategorySummary(goal.id);
                    const totalSeconds = taskManager.getTotalDuration(goal.id);
                    const tasks = taskManager
                        .getTasksByGoal(goal.id)
                        .filter((t) => t.status === 'archived')
                        .sort((a, b) => (b.archivedAt?.getTime() ?? 0) - (a.archivedAt?.getTime() ?? 0));

                    return `
                <div class="mb-6 border border-gray-700 rounded-lg p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">${goal.title}</span>
                    <span class="text-xs text-gray-400">${Math.round(totalSeconds / 3600)} giờ tổng cộng</span>
                  </div>

                  <div class="flex gap-4 mb-3 flex-wrap">
                    ${Object.entries(summary)
                        .map(
                            ([cat, count]) =>
                                `<span class="text-xs bg-gray-800 px-2 py-1 rounded">${cat}: ${count} bài</span>`
                        )
                        .join('')}
                  </div>

                  <p class="text-xs text-gray-500 mb-2">Lịch sử các lần thử:</p>
                  ${goal.attempts
                        .map(
                            (a) =>
                                `<p class="text-xs text-gray-400">${new Date(a.date).toLocaleDateString('vi-VN')} — ${a.result} ${a.isTargetMet ? '✓' : ''}</p>`
                        )
                        .join('')}

                  <details class="mt-3">
                    <summary class="text-xs text-cyan-400 cursor-pointer">Xem chi tiết theo ngày</summary>
                    <div class="mt-2 space-y-1">
                      ${tasks
                        .map(
                            (t) => `
                        <div class="text-xs border-b border-gray-800 py-1">
                          <span class="text-gray-300">${new Date(t.archivedAt!).toLocaleDateString('vi-VN')}</span>
                          — ${t.title} (${t.category})
                          ${t.feedback ? `<p class="text-gray-500 pl-2">${t.feedback}</p>` : ''}
                        </div>
                      `
                        )
                        .join('')}
                    </div>
                  </details>
                </div>
              `;
                })
                .join('')
    }
    </div>
  `;
}