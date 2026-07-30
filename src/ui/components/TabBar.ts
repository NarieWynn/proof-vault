export type TabName = 'goal' | 'study' | 'archive' | 'overview';

const TABS: { key: TabName; label: string }[] = [
    { key: 'overview', label: 'overview' },
    { key: 'goal', label: 'goals' },
    { key: 'study', label: 'tasks' },
    { key: 'archive', label: 'archive' },
];

export function renderTabBar(activeTab: TabName): string {
    return `
    <div class="tab-bar">
      ${TABS.map(
        (tab) => `
        <button class="tab-btn ${tab.key === activeTab ? 'active' : ''}" data-tab="${tab.key}">
          ${tab.label}
        </button>
      `
    ).join('')}
    </div>
  `;
}