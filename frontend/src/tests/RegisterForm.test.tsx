import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterForm from "../components/Login/RegisterForm";
import { useAuth } from "../components/Login/LoginContext";
import { BrowserRouter } from "react-router-dom";

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

const mockSetRole = vi.fn();
const mockSetIsLoggedIn = vi.fn();
const mockSetTeacherId = vi.fn();
const mockSetStudentId = vi.fn();
const mockSetTeacherSubject = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (useAuth as any).mockReturnValue({
    role: "teacher",
    setRole: mockSetRole,
    setIsLoggedIn: mockSetIsLoggedIn,
    setTeacherId: mockSetTeacherId,
    setStudentId: mockSetStudentId,
    setTeacherSubject: mockSetTeacherSubject,
  });
});

describe("RegisterForm", () => {
  it("should show alert if passwords don't match", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <BrowserRouter>
        <RegisterForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Vezetéknév"), {
        target: { value: "Test" },
      });
      fireEvent.change(screen.getByPlaceholderText("Keresztnév"), {
        target: { value: "User" },
      });
      fireEvent.change(screen.getByPlaceholderText("Email cím"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Jelszó"), {
        target: { value: "password1" },
      });
      fireEvent.change(screen.getByPlaceholderText("Jelszó újra"), {
        target: { value: "password2" },
      });
      fireEvent.change(screen.getByPlaceholderText("Óradíj"), {
        target: { value: "1000" },
      });
      fireEvent.change(screen.getByDisplayValue("Válassz tantárgyat"), {
        target: { value: "Maths" },
      });
      
      fireEvent.click(screen.getByRole("button", { name: /regisztrálok/i }));
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("A jelszavak nem egyeznek.");
      });
      

    alertSpy.mockRestore();
  });
});
