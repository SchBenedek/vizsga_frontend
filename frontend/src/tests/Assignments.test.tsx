import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Assignments from "../components/Pages/Assignment/Assigments";

vi.mock("../../Navbar/TeacherPageNav", () => ({
  TeacherPageNav: () => <div>MockTeacherNav</div>,
}));

vi.mock("../../Navbar/StudentPageNav", () => ({
  StudentPageNav: () => <div>MockStudentNav</div>,
}));

vi.mock("../../Login/LoginContext", () => ({
  useAuth: () => ({
    role: mockRole,
    teacherSubject: "Math",
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});
vi.mock('@/api/assignments', () => ({
    getAssignmentsForTeacher: vi.fn().mockResolvedValue([
      {
        id: 1,
        subject: 'Math',
        ageGroup: '12-14',
        description: 'Intro to Algebra',
        isAssigned: false, 
      },
    ]),
  }));
  

let mockRole = "Teacher";

const mockAssignments = [
  {
    id: 1,
    subject: "Math",
    name: "Algebra",
    ageGroup: "12-14",
    description: "Intro to Algebra",
    teacherId: 1,
    teacher: {
      id: 1,
      name: "Mr. Smith",
      subject: "Math",
    },
    students: [],
  },
];

describe("Assignments component", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAssignments),
    }));
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("renders Teacher nav when role is Teacher", async () => {
    mockRole = "Teacher";
    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading assignments...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("MockTeacherNav")).toBeInTheDocument();
      expect(screen.getByText("Feladatok")).toBeInTheDocument();
    });
  });

  it("renders Student nav when role is Student", async () => {
    mockRole = "Student";
    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("MockStudentNav")).toBeInTheDocument();
    });
  });

  it("displays assignment cards", async () => {
    mockRole = "Teacher";
    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes("Math"))).toBeInTheDocument();
    });
  });
  

  it("displays error message if fetch fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    }));

    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Hiba történt/i)).toBeInTheDocument();
    });
  });

  it("shows 'Feladat kiadása' button if assignment choice is made", async () => {
    mockRole = "Teacher";
    localStorage.setItem("isAssignmentChoice", "true");
    localStorage.setItem("studentName", "Anna");

    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Anna")).toBeInTheDocument();
      expect(screen.getByText("Feladat kiadása")).toBeInTheDocument();
    });
  });

  it("disables assign button if already assigned", async () => {
    mockRole = "Teacher";
    localStorage.setItem("isAssignmentChoice", "true");
    localStorage.setItem("studentName", "Anna");
  
    render(
      <MemoryRouter>
        <Assignments />
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(screen.getByText("Anna")).toBeInTheDocument();
    });
  
    const assignBtn = await screen.findByRole('button', { name: /Feladat kiadása/i });
    fireEvent.click(assignBtn);
  
    await waitFor(() => {
      expect(window.alert).toBeCalled();
    });
  });  
});