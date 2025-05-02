export interface Workflow {
    id: number;
    employeeId: number;
    type: string;
    details: any;
    status: 'Pending' | 'Approved' | 'Rejected';
    createdDate?: Date;
    updatedDate?: Date;
}