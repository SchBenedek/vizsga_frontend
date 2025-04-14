import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../components/Login/LoginForm";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "../components/Login/LoginContext";
import { beforeEach, describe, expect, it, vi } from "vitest";
import React from "react";

vi.mock("../components/Login/LoginContext", () => ({
    useAuth: vi.fn(),
  }));  

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

describe("LoginForm (Vitest)", () => {
  const mockSetters = {
    setRole: vi.fn(),
    setIsLoggedIn: vi.fn(),
    setTeacherId: vi.fn(),
    setStudentId: vi.fn(),
    setTeacherSubject: vi.fn(),
  };

  beforeEach(() => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue(mockSetters);
    vi.clearAllMocks();
  });

  it("renders inputs and button", () => {
    renderWithRouter(<LoginForm />);
    expect(screen.getByPlaceholderText("Email cím")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jelszó")).toBeInTheDocument();
    expect(screen.getByText("Bejelentkezés")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderWithRouter(<LoginForm />);
    const passwordInput = screen.getByPlaceholderText("Jelszó");
    const toggleButton = screen.getByRole("button", { name: "" }); 
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("handles failed login", async () => {
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Invalid credentials" }),
      } as Response);

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Email cím"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
      target: { value: "badpass" },
    });
    fireEvent.click(screen.getByText("Bejelentkezés"));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("handles successful teacher login", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: "fake-token" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          role: "Teacher",
          id: 1,
          token: "fake-token",
          subject: "Math",
          firstName: "John",
          lastName: "Doe",
        }),
      } as Response);

    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Email cím"), {
      target: { value: "teacher@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByText("Bejelentkezés"));

    await waitFor(() => {
      expect(mockSetters.setRole).toHaveBeenCalledWith("Teacher");
      expect(mockSetters.setIsLoggedIn).toHaveBeenCalledWith(true);
      expect(mockSetters.setTeacherId).toHaveBeenCalledWith(1);
      expect(mockSetters.setTeacherSubject).toHaveBeenCalledWith("Math");
      expect(mockNavigate).toHaveBeenCalledWith("/teachers/dashboard");
    });
  });
});
