import API from "./auth";

export const getMills = () => API.get("/mills");
export const runMatching = () => API.post("/bookings/run-matching");
export const getBookings = () => API.get("/bookings");