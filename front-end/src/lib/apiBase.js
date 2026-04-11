const explicitApiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
const isLocalHost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);

const apiBase = explicitApiBase || (isLocalHost ? "http://localhost:5001" : "");

export default apiBase;