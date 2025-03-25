export interface User{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    role: string;
}

export interface Assignment{
    id: number;
    subject: string;
    name: string;
    ageGroup: string;
    description: string;
    teacher: Teacher;
    teacherId: number;
    students: Student[];
}

export interface Teacher extends User{
    subject: string;
    hourlyRate: number;
    rating: number;
    assignment: string[];
}

export interface Student extends User{
    ageGroup: string;
}