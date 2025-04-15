import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { StudentPageNav } from "../components/Navbar/StudentPageNav";

vi.mock("../components/Login/Logout", () => ({
  default: () => <div>MockLogout</div>,
}));

const mockAssignments = [
  {
    id: 1,
    subject: "Math",
    name: "Algebra Basics",
    ageGroup: "12-14",
    description: "Learn the basics of algebra",
    teacherId: 101,
    teacher: {
      id: 101,
      name: "Mr. Smith",
      subject: "Math",
    },
    students: [],
  },
];

describe("StudentPageNav", () => {
  const mockSetFilterAssignments = vi.fn();

  beforeEach(() => {
    localStorage.setItem("studentName", "Test Student");
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    mockSetFilterAssignments.mockClear();
  });

  it("renders student name from localStorage", () => {
    render(
      <MemoryRouter initialEntries={["/studentmain"]}>
        <StudentPageNav
          assignments={mockAssignments}
          setFilterAssignments={mockSetFilterAssignments}
        />
      </MemoryRouter>
    );
  
    const nameEl = screen.getByTestId("student-name");
    expect(nameEl).toBeInTheDocument();
    expect(nameEl).toHaveTextContent("Student");
  });
  

  it("renders all navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/studentmain"]}>
        <StudentPageNav
          assignments={mockAssignments}
          setFilterAssignments={mockSetFilterAssignments}
        />
      </MemoryRouter>
    );

    const links = [
      "Főoldal",
      "Értékelés",
      "Tanárok",
      "Kiadott feladatok",
      "Visszaküldött feladatok",
    ];

    for (const linkText of links) {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    }

    expect(screen.getByText("MockLogout")).toBeInTheDocument();
  });
});
