import {
    fetchAllTasks,
    createTask,
    fetchAllGoals,
    renderTaskItem,
    deleteTask,
} from '../../index';

export async function renderStudyView(): Promise<HTMLElement> {
    const container = document.createElement('div');
    container.className = 'study-view';

    container.innerHTML = `
    <h2>study tracker</h2>

    <!-- Form tạo Task.form-row -->
    <div class="form-row">
      <input type="text" id="task-title-input" placeholder="input task title..." />
      <input type="text" id="task-category-input" placeholder="category (vd: coding)" style="max-width: 160px;" />
      <select id="task-goal-select">
        <option value="">-- choose goal --</option>
      </select>
      <button id="btn-add-task" class="btn btn-primary">+ thêm</button>
    </div>

    <!-- Danh sách Task -->
    <div id="task-list-container">
      <div class="empty-state">empty...</div>
    </div>
  `;

    // 1. Tóm tất cả các ID
    const inputTitle = container.querySelector('#task-title-input') as HTMLInputElement;
    const inputCategory = container.querySelector('#task-category-input') as HTMLInputElement;
    const btnAdd = container.querySelector('#btn-add-task') as HTMLButtonElement;
    const taskList = container.querySelector('#task-list-container') as HTMLElement;
    const selectGoal = container.querySelector('#task-goal-select') as HTMLSelectElement;

    // 2. Hàm load danh sách Task từ DB
    async function loadTasks() {
        const tasks = await fetchAllTasks();
        if (tasks.length === 0) {
            taskList.innerHTML = `<div class="empty-state">empty...</div>`;
            return;
        }
        taskList.innerHTML = tasks.map(t => renderTaskItem(t)).join('');
        const deleteButtons = taskList.querySelectorAll('.btn-delete');

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const target = e.currentTarget as HTMLButtonElement;
                const taskId = target.getAttribute('data-id'); // Lấy id được gắn ở data-id="${task.id}"

                if (!taskId) return;

                // (Tùy chọn) Hỏi lại cho chắc ăn trước khi xóa
                const confirmDelete = confirm('Confirm to delete Task?');
                if (!confirmDelete) return;

                // 3. BẮN ID XUỐNG RUST ĐỂ XÓA TRONG SQLITE
                await deleteTask(taskId);

                // 4. LOAD LẠI MÀN HÌNH ĐỂ MẤT THẺ TASK VỪA XÓA
                await loadTasks();
            });
        });
    }

    // 3. Hàm load danh sách Goal active vào ô <select>
    async function loadGoalOptions() {
        const goals = await fetchAllGoals();
        const activeGoals = goals.filter(g => g.status !== 'completed');

        // Giữ lại option mặc định `-- choose goal --` ở đầu
        selectGoal.innerHTML = `
            <option value="">-- choose goal --</option>
            ${activeGoals.map(g => `<option value="${g.id}">${g.title}</option>`).join('')}
        `;
    }

    // 4. Bắt sự kiện Click nút "+ thêm"
    btnAdd.addEventListener('click', async () => {
        const title = inputTitle.value.trim();
        const category = inputCategory.value.trim() || 'General';
        const goalId = selectGoal.value;

        if (!title || !goalId) {
            alert('Input task and select goal!');
            return;
        }

        await createTask({
            title,
            category,
            goalId
        });

        inputTitle.value = '';
        inputCategory.value = '';
        selectGoal.value = '';

        await loadTasks();
    });

    await loadGoalOptions();
    await loadTasks();

    return container;
}