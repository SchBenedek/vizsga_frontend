# 🚀 BrainBoost

A React application powered by [Vite](https://vitejs.dev/) for development and build performance.

## 📦 Tech Stack

- ⚛️ React
- ⚡ Vite
- 🧑‍💻 TypeScript
- 🎨 Bootstrap
- 📦 NPM

## 🛠️ Getting Started

### ⏮️ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- NPM
- [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/download/) (v5.0 recommended)
- [Vite](https://vite.dev)
 
### ⬇️ Installation

```bash
git clone https://github.com/SchBenedek/vizsga_frontend
cd vizsga_frontend
npm install
```

### 🏃‍♂️‍➡️ Run project

To run this project, read the Notes below!

```bash
npm run dev
o #to open in browser
```

### 🧪 Testing

This project uses [Vitest](https://vitest.dev) for unit testing of core components and logic. You can find the tests inside the ```src/tests``` folder.

You can find them in the documentation.

To execute the test suite, use the following command in your terminal:
```bash
npm run vitest
```

If you want to enter watch mode (tests re-run on file change), you can use:
```bash
npx vitest --watch
```

Or, if you want to include coverage reports:
```bash
npx vitest run --coverage
```

## 📖  Developments documentation

### 🔧 Project Structure

This project is a React + TypeScript frontend application, built and developed using Vite for optimal speed and performance. Styling is handled with Bootstrap 5, enabling a responsive and well-structured UI.

The main directory structure is as follows:

```src/components``` – Reusable React components

```src/pages``` – Page-level components for views like Login, Home, Assignments

```src/services``` – Functions responsible for API communication

```src/hooks``` – Custom React hooks for state and effect management

```src/types``` – TypeScript type definitions

```src/tests``` – Unit tests using Vitest

### 🧐 Features and Modules

The goal of this project is to serve as the frontend of an educational platform where students can rate their teachers and view or complete assignments.

Main features include:

- 🔐 Authentication using token-based login

- 👨‍🏫 Teacher rating functionality

- 📋 Assignment display and filtering based on user roles

- 📬 Dynamic data fetching from the backend API

- 🧪 Unit testing with Vitest

### ⚙️ Development Phases

The development process followed these stages:

- Project initialization with Vite + React + TypeScript

- Page and component scaffolding

- API integration and data modeling

- User interaction handling and state management

- Styling using Bootstrap

- Testing and debugging

- Documentation and README updates

### 🧩 Frontend Types and API (TypeScript)

The following TypeScript types define the structure of the frontend data models used throughout the BrainBoost React application.

| **Type**        | **Field**           | **Description**                                                       |
|-----------------|---------------------|-----------------------------------------------------------------------|
| **Role**        | `Admin`, `Teacher`, `Student` | User roles in the application.                                        |
| **Subjects**    | `Maths`, `History`, `Literature`, `English`, `Science`, `Compsci` | Available subjects for teachers and assignments.                        |
| **Level**       | `Elementary`, `Secondary`, `High`, `University` | Education levels for students.                                         |

---

| **Interface**    | **Field**           | **Type**             | **Description**                                                       |
|------------------|---------------------|----------------------|-----------------------------------------------------------------------|
| **User**         | `id`                | `number`             | Unique user identifier.                                               |
|                  | `firstName`         | `string`             | User's first name.                                                    |
|                  | `lastName`          | `string`             | User's last name.                                                     |
|                  | `email`             | `string`             | User's email address.                                                 |
|                  | `password?`         | `string?`            | User's password (optional in frontend context).                       |
|                  | `role`              | `Role`               | Role of the user (`Admin`, `Teacher`, `Student`).                     |
| **Teacher**      | `subject`           | `Subjects`           | Subject expertise of the teacher.                                      |
|                  | `hourlyRate`        | `number`             | Hourly rate of the teacher.                                            |
|                  | `rating`            | `number`             | Average rating from students.                                          |
|                  | `assignments`       | `Assignment[]`       | List of assignments given by the teacher.                              |
| **Student**      | `ageGroup`          | `Level`              | Educational level of the student.                                      |
|                  | `studentAssignments`| `MarkedAssignment[]` | List of assignments associated with the student.                       |
| **Assignment**   | `id`                | `number`             | Unique assignment identifier.                                          |
|                  | `subject`           | `string`             | Subject of the assignment.                                             |
|                  | `name`              | `string`             | Name of the assignment.                                               |
|                  | `ageGroup`          | `string`             | Age group targeted by the assignment.                                  |
|                  | `description`       | `string`             | Description of the assignment.                                         |
|                  | `teacherId`         | `number`             | ID of the teacher assigning it.                                        |
|                  | `teacher`           | `Teacher`            | Teacher details for the assignment.                                    |
|                  | `students`          | `MarkedAssignment[]` | List of students assigned to this assignment.                          |
|                  | `completed`         | `boolean`            | Whether the assignment is completed by the student.                    |
| **MarkedAssignment** | `assignmentId`    | `number`             | ID of the assignment.                                                  |
|                     | `studentId`       | `number`             | ID of the student.                                                     |
|                     | `completed`       | `boolean`            | Whether the assignment is completed.                                   |
|                     | `mark`            | `number`             | Grade given for the assignment.                                        |
|                     | `assignment?`     | `Assignment?`        | Optional relation to the assignment.                                   |
|                     | `student?`        | `Student?`           | Optional relation to the student.                                      |
| **StudentAssignmentFile** | `assignmentId` | `number`             | ID of the related assignment.                                          |
|                          | `studentId`    | `number`             | ID of the related student.                                             |
|                          | `fileName`     | `string`             | Name of the uploaded file.                                             |
|                          | `fileType`     | `string`             | MIME type of the uploaded file (e.g., `application/pdf`).              |
|                          | `fileData`     | `Blob`               | Binary data of the uploaded file.                                      |
|                          | `uploadedAt`   | `Date`               | Timestamp of when the file was uploaded.                               |

---

### API with Axios

This section outlines the API setup and the utility function `useFetch` for making HTTP requests with `axios`.

| **Field**         | **Description**                                                                 |
|-------------------|---------------------------------------------------------------------------------|
| `client`          | Axios instance configured with base URL and default headers.                    |
| `baseURL`         | The base URL for the API (set to `http://localhost:3000/` by default).           |
| `headers`         | Default headers set to `"Content-Type": "application/json"`.                    |
| `validateStatus`  | Custom status validation function allowing all status codes.                    |
| `useFetch`        | Utility function for making HTTP requests (GET, POST, PUT, DELETE) using `axios`.|

| **Field**             | **Type**                   | **Description**                                                     |
|-----------------------|----------------------------|---------------------------------------------------------------------|
| `endpoint`            | `string`                  | API endpoint for the request.                                       |
| `method`              | `"GET" | "POST" | "PUT" | "DELETE"` | HTTP method for the request.                                        |
| `body`                | `Record<string, any>`      | Optional request body, passed for POST and PUT methods.              |
| `FetchBeallitasok`    | `AxiosRequestConfig`       | Configuration object for the axios request.                         |
| `Authorization`       | `"Bearer " + token`        | Authorization header using a Bearer token from `localStorage`.       |
| `req.data`            | `T`                        | The data returned from the API response.                             |
| `req.status`          | `number`                  | The HTTP status code returned from the API response.                 |

```ts
import axios, { AxiosRequestConfig } from "axios";

// Axios instance configuration
const client = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: function (statusz) {
    return true; // Allow all status codes to pass through
  }
});

// API utility function for making requests (GET, POST, PUT, DELETE)
export async function useFetch<T>(
  endpoint: string, 
  method: "GET" | "POST" | "PUT" | "DELETE", 
  body?: Record<string, any>
): Promise<{ adat: T | null; statuszKod: number } | null> {

  const FetchBeallitasok: AxiosRequestConfig = {
    method,
    url: endpoint,
    data: body || undefined,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"), // Use token from localStorage
      "Content-Type": "application/json"
    }
  };

  const req = await client.request<T>(FetchBeallitasok);

  return {
    adat: req.data, 
    statuszKod: req.status
  };
}
```



## 📝 Note

This project will work only by using the appropriate [backend project](https://github.com/BenedekBogardi/backend)!
The login works by using tokens, so you will need the given backend to be able to use the webpage!

## 📃 Document

Here you can find the documentation of the project.
[Download here](https://github.com/SchBenedek/vizsga_frontend/blob/main/BrainBoost_Projekt_Dokumentacio.docx)
