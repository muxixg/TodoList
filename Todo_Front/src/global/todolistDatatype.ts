export interface DataType {
    id: string;
    user: string
    name: string;
    description: string;
    completed: boolean;
}

export const BaseApi = 'http://localhost:8000'