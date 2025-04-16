import { useEffect, useState } from "react";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { useAuth } from "../../Login/LoginContext";
import { Assignment, Teacher } from "../../libs/types";

export default function Teachers() {
  const { studentID } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filterTeachers, setFilterTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorServer, setErrorServer] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const [selectedTId, setSelectedTId] = useState<number | null>(null);

  const fetchTeachers = () => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/users/teachers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("A kért erőforrás nem található (404)!");
        }
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data: Teacher[]) => {
        setTeachers(data);
        setFilterTeachers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSelectTeacher = async (teacherId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/selectTeacher`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentID,
            sTeacherId: teacherId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to select teacher");
      }

      setSelectedTId(teacherId);
      alert("Teacher selected successfully!");
    } catch (error) {
      alert("Error selecting teacher");
    }
  };

  const getIfTeacher = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/${studentID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to select teacher");
      }

      setSelectedTId(data.sTeacherId);
    } catch (error) {
      alert("Error selecting teacher");
    }
  };

  useEffect(() => {
    getIfTeacher();
  }, []);

  if (errorServer) {
    return <p>{errorServer}</p>;
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Hiba történt: {error}.</p>;
  }

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <StudentPageNav
        assignments={[]}
        setFilterAssignments={function (assignments: Assignment[]): void {
          throw new Error("Function not implemented.");
        }}
      />
      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1 }}
      >
        <div className="text-center">
          <div className="alert alert-info p-4 shadow-sm" role="alert">
            <h1 className="alert-heading text-primary">
              Válassz tanárt, akitől tanulni szeretnél:
            </h1>
          </div>
        </div>
        <div className="row">
          {filterTeachers.map((teacher) => (
            <div className="col-md-6 col-lg-4 mb-4" key={teacher.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold text-primary">
                    {teacher.firstName} {teacher.lastName}
                  </h5>
                  <p className="card-text text-muted">
                    <strong>Szakterület:</strong> {teacher.teacher.subject}
                    <br />
                    <strong>Email:</strong> {teacher.email}
                    <br />
                    <strong>Óradíj:</strong> {teacher.teacher.hourlyRate} Ft
                    <br />
                    <strong>Értékelés:</strong> {teacher.teacher.rating.toFixed(2)}
                  </p>
                  {selectedTId != teacher.id ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSelectTeacher(teacher.id)}
                    >
                      Tanulok tőle
                    </button>
                  ) : (
                    <h5>
                      <i>Your teacher</i>
                    </h5>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
