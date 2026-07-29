import { Task } from '../types/task';

const app = document.getElementById('app');

const tasks: Task[] = [
    {
        id: '1',
        title: 'Setup Desktop App Window with Tauri & Vite',
        goalTag: 'DEV',
        proofOfWork: 'Build successful on Arch Linux',
        isArchived: true,
        createdAt: new Date(),
    },
    {
        id: '2',
        title: 'Design Cyberpunk Dashboard UI',
        goalTag: 'UI/UX',
        proofOfWork: 'Integrated Tailwind CSS v4',
        isArchived: false,
        createdAt: new Date(),
    }
];

if (app) {
    app.innerHTML = `
    <!-- Header -->
    <header class="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          PROOF VAULT
        </h1>
        <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Polymath Output Engine</p>
      </div>
      <button class="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all duration-200 cursor-pointer">
        + New Task
      </button>
    </header>

    <!-- Task List -->
    <div class="space-y-4">
      <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Active & Vaulted Proofs</h2>
      ${tasks.map(task => `
        <div class="group relative bg-slate-900/80 border ${task.isArchived ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800'} p-5 rounded-xl shadow-md hover:border-slate-700 transition-all duration-200">
          <div class="flex items-start justify-between">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 text-[10px] font-black rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  ${task.goalTag}
                </span>
                <h3 class="font-semibold text-slate-200 text-base group-hover:text-cyan-300 transition-colors">
                  ${task.title}
                </h3>
              </div>
              <p class="text-sm text-slate-400 pt-1">
                <span class="text-slate-500 font-medium">Proof:</span> ${task.proofOfWork}
              </p>
            </div>
            <div>
              ${task.isArchived
        ? `<span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                     ✓ ARCHIVED
                   </span>`
        : `<span class="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                     ⏳ IN PROGRESS
                   </span>`}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}