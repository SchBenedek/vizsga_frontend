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
import TeacherMain from './components/Pages/teacherMain.tsx';

const router=createBrowserRouter([
  {path: "/",
    element: <Startpage />,
  },
  {
    path: "/teacherMain",
    element: <TeacherMain />,
  },
  {
    path: "/assigments",
    element: <Assigments />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
