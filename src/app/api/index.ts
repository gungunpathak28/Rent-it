// Use environment variable for production, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = async (endpoint: string, options: any = {}) => {
  try {
    const res = await fetch(BASE_URL + endpoint, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("token") && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      },
      body: options.body,
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.log("TOKEN ERROR: Unauthorized. Redirecting to login...");
        localStorage.removeItem("token");
        localStorage.removeItem("rentit_user");
        window.location.href = "/login";
      }
      const errData = await res.json();
      throw new Error(errData.message || "Request failed");
    }

    return await res.json();
  } catch (err) {
    console.error("API FAILED:", err);
    throw err;
  }
};
