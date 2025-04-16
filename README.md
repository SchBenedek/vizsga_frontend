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


## 📝 Note

This project will work only by using the appropriate [backend project](https://github.com/BenedekBogardi/backend)!
The login works by using tokens, so you will need the given backend to be able to use the webpage!

## 📃 Document

Here you can find the documentation of the project.
[Download here](https://github.com/SchBenedek/vizsga_frontend/blob/main/BrainBoost_Projekt_Dokumentacio.docx)
