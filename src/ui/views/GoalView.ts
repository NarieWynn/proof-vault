export async function renderGoalView(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = 'goal-view';

    container.innerHTML = `
        <h2>goals</h2>
        <div class="empty-state" style="margin-top: 40px; text-align: center; color: #888;">
            🚧 feature under development
        </div>
    `;

    return container;
}