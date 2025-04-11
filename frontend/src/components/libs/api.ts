import axios, { AxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  }
  , validateStatus: function (statusz) {
    //console.log(statusz)
    return true
  }
})

export async function useFetch<T>(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: Record<string, any>): Promise<{ adat: T | null; statuszKod: number } | null> {
  const FetchBeallitasok:AxiosRequestConfig = {
    method,
    url: endpoint,
    data: body || undefined,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authToken"),
      "Content-Type": "application/json"
    }
  }
  const req = await client.request<T>(FetchBeallitasok)
  return {
    adat: req.data, statuszKod: req.status
  }

}
