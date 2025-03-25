import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Startpage from './components/Pages/Startpage.tsx';
import Assignments from './components/Pages/Assignment/Assigments.tsx';
import { AuthProvider } from './components/Login/LoginContext.tsx';
import StudentMain from './components/Pages/Student/StudentMain.tsx';
import TeacherMain from './components/Pages/Teacher/TeacherMain.tsx';
import Teachers from './components/Pages/Student/StudentsTeacherChoice.tsx';
import TeacherStudents from './components/Pages/Teacher/TeachersStudents.tsx';
import AssignmentCard from './components/Pages/Assignment/AssignmentCard.tsx';
import ChoosenStudent from './components/Pages/Teacher/ChoosenStudent.tsx';
import AssignedTasks from './components/Pages/Assignment/AssignedTasks.tsx';

const router=createBrowserRouter([
  {
    path: "/",
    element: <Startpage />,
  },
  {
    path: "/teachers/dashboard",
    element: <TeacherMain />,
  },
  {
    path: "/student/teacher/:teacherID", 
    element: <TeacherMain />
  },
  {
    path: "/studentmain",
    element: <StudentMain />,
  },
  {
    path: "/assigments",
    element: <Assignments />
  },
  {
    path: "assignmentCard",
    element: <AssignmentCard />
  },
  {
    path: "/teachers",
    element: <Teachers />
  },
  {
    path: "/teacher/students",
    element: <TeacherStudents />
  },
  {
    path: "/choosenStudent",
    element: <ChoosenStudent />
  },
  {
    path: "/assignedTasks",
    element: <AssignedTasks />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
