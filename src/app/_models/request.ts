export interface RequestItem {
    name: string;
    quantity: number;
}

export interface Request {
    id?: number;
    type: string;
    employeeId?: number;
    employee?: any;
    items: RequestItem[];
    status?: 'Pending' | 'Approved' | 'Rejected';
    createdDate?: Date;
}