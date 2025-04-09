import { useState, useEffect } from "react";
import { useAuth } from "../../Login/LoginContext";
import { Student, Teacher, User } from "../../libs/types";
import { StudentPageNav } from "../../Navbar/StudentPageNav";

export default function Rating() {
  const { studentID } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [sTeacherId, setsTeacherId] = useState<number>();
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/users/${studentID}`,
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

        const data = await response.json();
        console.log("Fetched id:", data.sTeacherId);
        setsTeacherId(data.sTeacherId);
        console.log("after usestate: ", sTeacherId);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentID) fetchStudent();
  }, [studentID]);

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!sTeacherId) return;

      try {
        const response = await fetch(`http://localhost:3000/users/${sTeacherId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok)
          throw new Error(`Server responded with status ${response.status}`);

        const data: Teacher = await response.json();
        console.log("Fetched teacher:", data);
        setTeacher(data);
        console.log("Teacher: ", teacher);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [sTeacherId]);

  const handleRate = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/users/rateTeacher/${sTeacherId}/${score}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
  
      if (res.ok) {
        setMessage("Köszönjük hogy értékeltél!");
  
        const updated = await fetch(`http://localhost:3000/users/${sTeacherId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (updated.ok) {
          const updatedData: Teacher = await updated.json();
          setTeacher(updatedData);
        }
      } else {
        const err = await res.json();
        setMessage(`Hiba: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Váratlan hiba történt.");
    }
  };
  

  if (!sTeacherId || !teacher) return <p>Loading</p>;

  return (
    <div className="d-flex" style={{ height: "100vh", backgroundColor: "#f8f9fa" }}>
      <StudentPageNav assignments={[]} setFilterAssignments={() => {}} />

      <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1, backgroundColor: "#fff" }}>
        <div className="p-4 rounded shadow alert alert-info">
          <h2 className="text-primary mb-3">Értékeld a tanárod:</h2>
          <div className="card p-4 shadow-sm">
            <h4>
              {teacher?.firstName} {teacher?.lastName}
            </h4>
            <p>Tanított tantárgy: {teacher?.teacher.subject}</p>
            <p>
              Jelenlegi értékelés:{" "}
              <strong>
                {teacher?.teacher.rating.toFixed(2)} / 10 ({teacher?.teacher.numberOfRatings} rating
                {teacher?.teacher.numberOfRatings !== 1 && "s"})
              </strong>
            </p>
            <div className="my-3">
              <label className="form-label">Értékelésed:</label>
              <select
                className="form-select w-auto text-center"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
              >
                <option value={0}>Válassz</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                  <option key={s} value={s}>
                    {s} ⭐
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" onClick={handleRate}>
              Értékelés adása
            </button>
            {message && <div className="mt-3 alert alert-info">{message}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
