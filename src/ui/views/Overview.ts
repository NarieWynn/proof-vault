
function levelForCount(count: number, max: number): string {
    if (count === 0) return '';
    const ratio = count / max;
    if (ratio < 0.33) return 'level-1';
    if (ratio < 0.66) return 'level-2';
    if (ratio < 1) return 'level-3';
    return 'level-4';
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
    <h2>overview</h2>

    <p class="faint" style="margin-bottom: 8px;">last 90 days</p>
    <div class="heatmap-grid">
      ${days
        .map((d) => {
            const info = activity[d.key];
            const count = info?.count ?? 0;
            const title = `${d.date.toLocaleDateString('en-US')}: ${count} task(s), ${Math.round((info?.totalSeconds ?? 0) / 60)} min`;
            return `<div class="day-cell ${levelForCount(count, maxCount)}" title="${title}" data-date="${d.key}"></div>`;
        })
        .join('')}
    </div>

    <p class="faint" style="margin-bottom: 8px;">goals</p>
    <div id="goal-summary-list">
      ${allGoals
        .map(
            (g) => `
        <div class="card card-header">
          <span class="title">${g.title}</span>
          <span class="${g.status === 'archived' ? 'status-done' : 'status-active'}">
            ${g.status === 'archived' ? 'done' : 'active'}
          </span>
        </div>
      `
        )
        .join('') || '<p class="empty-state">no goals yet.</p>'}
    </div>

    <div id="day-detail" style="margin-top: 16px;"></div>
  `;

    const detailPanel = container.querySelector('#day-detail') as HTMLElement;

    container.querySelectorAll('.day-cell').forEach((cell) => {
        cell.addEventListener('click', () => {
            const dateKey = (cell as HTMLElement).dataset.date!;
            const [y, m, d] = dateKey.split('-').map(Number);
            const targetDate = new Date(y, m - 1, d);
            const tasksOfDay = taskManager.getTasksByDate(targetDate);

            if (tasksOfDay.length === 0) {
                detailPanel.innerHTML = `<p class="empty-state">no activity on ${targetDate.toLocaleDateString('en-US')}.</p>`;
                return;
            }

            detailPanel.innerHTML = `
        <div class="card">
          <p class="title" style="margin-bottom: 8px;">${targetDate.toLocaleDateString('en-US')}</p>
          ${tasksOfDay
                .map(
                    (t) => `
            <div class="task-item">
              <span>${t.title} — ${t.category}</span>
              ${t.durationSeconds ? `<span class="meta"> · ${Math.round(t.durationSeconds / 60)} min</span>` : ''}
              ${t.feedback ? `<p class="feedback-note">${t.feedback}</p>` : ''}
            </div>
          `
                )
                .join('')}
        </div>
      `;
        });
    });
}