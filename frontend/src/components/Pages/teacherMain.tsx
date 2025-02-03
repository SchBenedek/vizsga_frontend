import { useState } from "react";
import { Assignment } from "../libs/types";
import { TeacherPageNav } from "./teacherPageNav";

export default function TeacherMain() {
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <TeacherPageNav 
                assignments={filteredAssignments} 
                setFilterAssignments={setFilterAssignments} 
            />
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
            </main>
        </div>
    );
}
