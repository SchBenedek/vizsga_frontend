import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Rating from "../components/Pages/Student/Rating";

let mockStudentID = 1;

vi.mock("../../Login/LoginContext", () => ({
  useAuth: () => ({
    studentID: mockStudentID,
  }),
}));

vi.mock("../../Navbar/StudentPageNav", () => ({
  StudentPageNav: () => <div>MockStudentNav</div>,
}));

const mockStudentResponse = {
  sTeacherId: 2,
};

const mockTeacherResponse = {
  firstName: "Jane",
  lastName: "Doe",
  teacher: {
    subject: "Math",
    rating: 8.2,
    numberOfRatings: 5,
  },
};

describe("Rating Component", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.setItem("authToken", "mockToken");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    cleanup();
  });

  it("renders no-teacher message when student has no assigned teacher", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <Rating />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText("Még nem választottál tanárt!")
      ).toBeInTheDocument()
    );
  });

  it("fetches teacher data and displays rating interface", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudentResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeacherResponse,
      });

    render(
      <MemoryRouter>
        <Rating />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Értékeld a tanárod:")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText(/Tanított tantárgy: Math/)).toBeInTheDocument();
      expect(screen.getByText(/Jelenlegi értékelés:/)).toBeInTheDocument();
    });
  });

  it("submits a rating and updates teacher info", async () => {
    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStudentResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeacherResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTeacherResponse,
      });
    render(
      <MemoryRouter>
        <Rating />
      </MemoryRouter>
    );

    await screen.findByText(
      (content) => content.includes("Jane") && content.includes("Doe")
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "9" } });

    const rateBtn = screen.getByText("Értékelés adása");
    fireEvent.click(rateBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Köszönjük hogy értékeltél!")
      ).toBeInTheDocument();
    });
  });

  it("shows error message if fetch fails", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(
      <MemoryRouter>
        <Rating />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/🦍/)).toBeInTheDocument();
    });
  });
});
