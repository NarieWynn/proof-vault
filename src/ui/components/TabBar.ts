export type TabName = 'goal' | 'study' | 'archive' | 'overview';

const TABS: { key: TabName; label: string }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'goal', label: 'Goal' },
    { key: 'study', label: 'Study' },
    { key: 'archive', label: 'Archive' },
];

export function renderTabBar(activeTab: TabName): string {
    return `
    <div class="flex gap-1 border-b border-gray-700 mb-4">
      ${TABS.map(
        (tab) => `
        <button
          class="tab-btn px-4 py-2 text-sm ${tab.key === activeTab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}"
          data-tab="${tab.key}"
        >${tab.label}</button>
      `
    ).join('')}
    </div>
  `;
}