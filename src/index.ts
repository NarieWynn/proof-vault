// 1. Định nghĩa Data Model tối giản
interface Task {
    id: string;
    title: string;
    goalTag: string; // VD: 'IELTS', 'C++', 'Math'
    proofOfWork: string; // Lời ghi nhận / Kết quả
    isArchived: boolean;
    createdAt: Date;
}

// 2. Mock danh sách task
const todoList: Task[] = [];
const archiveVault: Task[] = [];

// 3. Hàm Archive Task (Proof of Work)
function archiveTask(task: Task, proof: string) {
    task.proofOfWork = proof;
    task.isArchived = true;
    archiveVault.push(task);
    console.log(`✅ [ARCHIVED]: ${task.title} | Proof: ${task.proofOfWork}`);
}

// 4. Test thử ngay
const task1: Task = {
    id: '1',
    title: 'Giải 1 bài Reading Passage 1',
    goalTag: 'IELTS',
    proofOfWork: '',
    isArchived: false,
    createdAt: new Date(),
};

archiveTask(task1, 'Pass 11/13 câu, sai 2 câu từ vựng');
console.log('Archive Vault:', archiveVault);