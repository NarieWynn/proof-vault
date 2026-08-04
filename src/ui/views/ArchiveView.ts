export async function renderArchiveView(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = 'archive-view';

    container.innerHTML = `
        <h2>archive</h2>
        <div class="empty-state" style="margin-top: 40px; text-align: center; color: #888;">
            🚧 feature under development
        </div>
    `;

    return container;
}