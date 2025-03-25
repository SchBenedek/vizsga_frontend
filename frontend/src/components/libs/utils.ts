import { Assignment } from "./types";

export const sortAssignments = (
    key: keyof Assignment,
    direction: "asc" | "desc",
    assignments: Assignment[]
  ) => {
    const order = ["alsos", "felsos", "kozep_isk", "felso_okt"]; 
  
    const sortedAssignments = [...assignments].sort((a, b) => {
      let valueA = a[key];
      let valueB = b[key];
  
      if (key === "ageGroup" && typeof valueA === "string" && typeof valueB === "string") {
        const indexA = order.indexOf(valueA);
        const indexB = order.indexOf(valueB);
        return direction === "asc" ? indexA - indexB : indexB - indexA;
      }
  
      return 0;
    });
    return { sortedAssignments };
  };  

