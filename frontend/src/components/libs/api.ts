export const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");
  
    const response = await fetch("http://localhost:3000/protected-route", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  
    if (!response.ok) {
      throw new Error("Unauthorized access");
    }
  
    return response.json();
  };