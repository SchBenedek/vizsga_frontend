import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { TeacherPageNav } from "../components/Navbar/TeacherPageNav";

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

const mockSetFilterAssignments = vi.fn();

describe("TeacherPageNav", () => {
  beforeEach(() => {
    localStorage.setItem("teacherName", "Test Teacher");
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    mockSetFilterAssignments.mockClear();
  });

  it("renders teacher name from localStorage", () => {
    render(
      <MemoryRouter initialEntries={["/teachers/dashboard"]}>
        <TeacherPageNav
          assignments={mockAssignments}
          setFilterAssignments={mockSetFilterAssignments}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Teacher")).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/teachers/dashboard"]}>
        <TeacherPageNav
          assignments={mockAssignments}
          setFilterAssignments={mockSetFilterAssignments}
        />
      </MemoryRouter>
    );

    const links = [
      "Főoldal",
      "Diákok",
      "Feladatok",
      "Kiadott feladatok",
      "Visszaküldött feladatok",
    ];

    for (const linkText of links) {
      expect(screen.getByText(linkText)).toBeInTheDocument();
    }

    expect(screen.getByText("MockLogout")).toBeInTheDocument();
  });
});
