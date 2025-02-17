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

export interface Teacher{
    id: number;
    name: string;
    subjectTeacher: string;
    hourlyRate: number;
    email: string;
    numberOfStudents: number;
    rating: number;
    password: string;
    role: string;
}

export interface Student{
    id: number;
    name: string;
    email: string;
    ageGroup: string;
    password: string;
    role: string;
}