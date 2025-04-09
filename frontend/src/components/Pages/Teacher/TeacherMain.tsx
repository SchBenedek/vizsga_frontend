import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Assignment, Student, Teacher } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { useFetch } from "../../libs/api";

export default function TeacherMain() {
  const { teacherID: authTeacherID } = useAuth();
  const { teacherID: routeTeacherID } = useParams<{ teacherID: string }>();
  const token = localStorage.getItem("authToken");

  const teacherID = routeTeacherID || authTeacherID;

  const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>(
    []
  );
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [teacherRating, setTeacherRating] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetchTeacher();
  }, [teacherID]);

  const fetchTeacher = async () => {
    try {
      setLoading(true);

      const response = await useFetch<Teacher | null>(
        `http://localhost:3000/auth/self`,
        "GET"
      );

      if (!response || response.statuszKod !== 200) {
        throw new Error(`Failed to fetch teacher: ${response?.statuszKod}`);
      }

      const data = response.adat;

      if (!data) {
        throw new Error("No student data received.");
      }

      console.log(data);
      setTeacher(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTeacherRating = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${teacherID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok)
          throw new Error(`Server responded with status ${response.status}`);

        const data: Teacher = await response.json();
        setTeacherRating(data.teacher.rating);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchTeacherRating();
  }, [teacherID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!teacher) return <p>No teacher found.</p>;
  if (teacher)
    return (
      <div
        className="d-flex"
        style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
      >
        {showSuccess && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
              borderRadius: "10px",
              zIndex: 1000,
              textAlign: "center",
            }}
          >
            <h3>✅ Successfully Added!</h3>
          </div>
        )}

        {routeTeacherID ? (
          <StudentPageNav
            assignments={filteredAssignments}
            setFilterAssignments={setFilterAssignments}
          />
        ) : (
          <TeacherPageNav
            assignments={filteredAssignments}
            setFilterAssignments={setFilterAssignments}
          />
        )}

        <main
          className="container-fluid p-4 overflow-auto"
          style={{
            flexGrow: 1,
            backgroundColor: "#fff",
            color: "#212529",
          }}
        >
          <div className="p-4 rounded shadow alert alert-info">
            <h1 className="text-primary mb-3">
              {routeTeacherID
                ? `${teacher.firstName} ${teacher.lastName}`
                : `Üdvözlünk, ${teacher.firstName} ${teacher.lastName}!`}
            </h1>
            <h4 className="text-dark">{teacher.email}</h4>
            {routeTeacherID && (
              <h5 className="text-secondary">{teacher.subject}</h5>
            )}

            <hr />
            <h5 className="text-dark">
              {routeTeacherID ? "Értékelés:" : "A Te értékelésed:"}{" "}
              <strong>{teacherRating?.toFixed(2)} / 10</strong>
            </h5>
          </div>
        </main>
      </div>
    );
}
