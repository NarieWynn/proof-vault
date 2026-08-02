

export function renderArchiveView(
    container: HTMLElement,
    goalManager: GoalManager,
    taskManager: TaskManager
) {
    const archivedGoals = goalManager.getArchivedGoals();

    container.innerHTML = `
    <h2>archive</h2>
    ${
        archivedGoals.length === 0
            ? '<p class="empty-state">no goals completed yet.</p>'
            : archivedGoals
                .map((goal) => {
                    const summary = taskManager.getCategorySummary(goal.id);
                    const totalSeconds = taskManager.getTotalDuration(goal.id);
                    const tasks = taskManager
                        .getTasksByGoal(goal.id)
                        .filter((t) => t.status === 'archived')
                        .sort((a, b) => (b.archivedAt?.getTime() ?? 0) - (a.archivedAt?.getTime() ?? 0));

                    return `
              <div class="card" style="margin-bottom: 16px;">
                <div class="card-header" style="margin-bottom: 8px;">
                  <span class="title">${goal.title}</span>
                  <span class="meta">${Math.round(totalSeconds / 3600)}h total</span>
                </div>

                <div style="margin-bottom: 10px;">
                  ${Object.entries(summary)
                        .map(([cat, count]) => `<span class="tag">${cat}: ${count}</span>`)
                        .join('')}
                </div>

                <p class="faint">attempt history:</p>
                ${goal.attempts
                        .map(
                            (a) =>
                                `<p class="meta">${new Date(a.date).toLocaleDateString('en-US')} — ${a.result} ${a.isTargetMet ? '✓' : ''}</p>`
                        )
                        .join('')}

                <details>
                  <summary>view daily detail</summary>
                  <div style="margin-top: 6px;">
                    ${tasks
                        .map(
                            (t) => `
                      <div class="task-item">
                        <span class="meta">${new Date(t.archivedAt!).toLocaleDateString('en-US')}</span>
                        — ${t.title} (${t.category})
                        ${t.feedback ? `<p class="feedback-note">${t.feedback}</p>` : ''}
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
  `;
}