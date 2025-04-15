export type Role = 'Admin' | 'Teacher' | 'Student';
export type Subjects = 'Maths' | 'History' | 'Literature' | 'English' | 'Science' | 'Compsci';
export type Level = 'Elementary' | 'Secondary' | 'High' | 'University';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: Role;
}

export interface Teacher extends User {
  subject: Subjects;
  hourlyRate: number;
  rating: number;
  assignments: Assignment[];
}

export interface Student extends User {
  ageGroup: Level;
  studentAssignments: MarkedAssignment[];
}

export interface Assignment {
  id: number;
  subject: string;
  name: string;
  ageGroup: string;
  description: string;
  teacherId: number;
  teacher: Teacher;
  students: MarkedAssignment[];
  completed: boolean; 
}

export interface MarkedAssignment {
  assignmentId: number;
  studentId: number;
  completed: boolean;
  mark: number;
  assignment?: Assignment; 
  student?: Student;
}

export interface StudentAssignmentFile {
  assignmentId: number;
  studentId: number;
  fileName: string;
  fileType: string;
  fileData: Blob; 
  uploadedAt: Date;
}
