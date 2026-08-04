export async function renderOverview(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = 'overview';

    container.innerHTML = `
        <h2>overview</h2>
        <div class="empty-state" style="margin-top: 40px; text-align: center; color: #888;">
            🚧 feature under development
        </div>
    `;

    return container;
}