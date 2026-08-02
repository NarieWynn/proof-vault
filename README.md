# Proof-vault

A desktop app for tracking study/work progress by **outcome, not by hours**.

## Why this exists

Most time-tracking apps measure how long you sat with a timer running — which turned out to be a poor proxy for actual progress. It's easy to start a timer, sit for three hours "reading slides," and walk away having produced nothing. This app flips the model: instead of tracking time spent, it tracks **tasks completed** toward a **goal**, and keeps a written record (a journal) of what was actually done and learned along the way.

## Core concept

- **Goal** — a long-term target with a deadline (e.g. "IELTS 7.0"). A goal stays open across multiple attempts; failing an attempt doesn't reset it, it just logs a milestone (e.g. "6.0 → not yet, try again") and keeps the goal active until the target is actually met.
- **Task** — a daily to-do linked to a goal and a category (e.g. "Do 1 reading passage" → goal: IELTS 7.0, category: reading). Time is tracked silently in the background (no visible running clock) so the focus stays on finishing the task, not watching the clock.
- **Reflection** — after completing a task, you can write a short note on what went wrong or what to review later. This becomes searchable study material before exams.
- **Archive** — once a goal's target is met, it moves to the archive, where you can see the full history: total tasks by category, total time invested, and the attempt timeline showing how many tries it took.
- **Overview** — a year-view activity heatmap (GitHub-contribution style) showing which days had activity, clickable to see exactly what was done that day.

## Tech stack

- **Frontend**: TypeScript (vanilla, no framework), plain CSS
- **Desktop shell**: [Tauri](https://tauri.app/) v2
- **Storage**: SQLite via [`rusqlite`](https://github.com/rusqlite/rusqlite) (Rust backend, accessed from the frontend through Tauri commands)

## Project structure

```
src/
├── types/         # Data shape definitions (Goal, GoalAttempt, Task)
├── models/        # Business logic (GoalManager, TaskManager)
├── ui/
│   ├── main.ts        # entry point, tab routing
│   ├── style.css
│   ├── components/    # reusable render functions (TaskItem, GoalCard, TabBar)
│   └── views/         # one file per tab (Goal, Study, Archive, Overview)
src-tauri/
├── src/
│   ├── lib.rs      # Tauri builder, plugin registration
│   └── db.rs       # rusqlite setup and Tauri commands (schema, queries)
```

## Data model

```typescript
interface Goal {
  id: string;
  title: string;
  createdAt: Date;
  deadline?: Date;
  status: 'active' | 'archived';
  attempts: GoalAttempt[];
  archivedAt?: Date;
}

interface GoalAttempt {
  id: string;
  date: Date;
  result: string;
  isTargetMet: boolean;
  note?: string;
}

interface Task {
  id: string;
  title: string;
  goalId: string;
  category: string;
  status: 'todo' | 'in_progress' | 'archived';
  startedAt?: Date;
  archivedAt?: Date;
  durationSeconds?: number;
  feedback?: string;
}
```

## Getting started

```bash
npm install
npm run tauri dev
```

Build a standalone desktop app:

```bash
npm run tauri build
```

The installable bundle (`.AppImage` / `.deb` on Linux) will be under `src-tauri/target/release/bundle/`.

## Status

MVP — core flow (create goal → add task → start/archive task with reflection → view archive/overview) is working. Data persistence has moved from a JSON file to a local SQLite database via rusqlite.

## Roadmap

- [ ] Full multi-year activity heatmap (currently limited to a recent window; needs a year picker)
- [ ] Edit/delete for goals and tasks
- [ ] Export archive data (e.g. to Markdown or CSV) for external review