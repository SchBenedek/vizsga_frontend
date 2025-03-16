export interface User{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface Assignment{
    id: number;
    subject: string;
    ageGroup: string;
    description: string;
    teacher: Teacher;
    teacherId: number;
    students: Student[];
}

export interface Teacher{
    id: number;
    user: User;
    subject: string;
    hourlyRate: number;
    rating: number;
    assignment: string[];
}

export interface Student{
    id: number;
    user: User;
    ageGroup: string;
    studentsAssignment: string[];
}