export interface Task {
    id: string;
    title: string;
    goalTag: string;
    proofOfWork: string;
    isArchived: boolean;
    createdAt: Date;
}