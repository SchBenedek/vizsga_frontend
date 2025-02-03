export interface Profile{
    id: number;
    name: string;
    email: string;
    username: string
    password: string;
    role: string;
}

export interface Assignment{
    id: number;
    subject: string;
    ageGroup: string;
    assignments: string;
}