import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Startpage from './components/Pages/Startpage.tsx';
import Assigments from './components/Pages/Assigments.tsx';
import { AuthProvider } from './components/Login/LoginContext.tsx';
import StudentMain from './components/Pages/Student/StudentMain.tsx';
import TeacherMain from './components/Pages/Teacher/TeacherMain.tsx';
import Teachers from './components/Pages/Student/StudentsTeacherChoice.tsx';

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
    element: <Assigments />,
  },
  {
    path: "/teachers",
    element: <Teachers />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
