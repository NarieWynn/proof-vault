import {
    renderTabBar,
    TabName,
    renderStudyView,
    renderGoalView,
    renderOverview,
    renderArchiveView
} from '../index';

async function initApp() {
    const appContainer = document.querySelector('#app') as HTMLElement;
    if (!appContainer) return;

    // Mặc định nhảy thẳng vào tab 'study' (Tasks)
    let currentTab: TabName = 'study';

    async function renderApp() {
        // 1. Dựng khung HTML chính
        appContainer.innerHTML = `
            ${renderTabBar(currentTab)}
            <div id="tab-content" style="padding: 16px;"></div>
        `;

        const contentArea = appContainer.querySelector('#tab-content') as HTMLElement;

        // 2. RENDER VIEW TƯƠNG ỨNG THEO TAB
        let viewNode: HTMLElement;

        switch (currentTab) {
            case 'study':
                viewNode = await renderStudyView();
                break;
            case 'goal':
                viewNode = await renderGoalView();
                break;
            case 'overview':
                viewNode = await renderOverview();
                break;
            case 'archive':
                viewNode = await renderArchiveView();
                break;
            default:
                viewNode = await renderStudyView();
        }

        contentArea.appendChild(viewNode);

        // 3. BẮT SỰ KIỆN CLICK CHUYỂN TAB
        const tabButtons = appContainer.querySelectorAll('.tab-btn');
        tabButtons.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const selectedTab = target.getAttribute('data-tab') as TabName;

                if (!selectedTab || selectedTab === currentTab) return;

                currentTab = selectedTab;
                await renderApp();
            });
        });
    }

    // Chạy app lần đầu
    await renderApp();
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', initApp);