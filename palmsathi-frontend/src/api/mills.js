import API from "./auth";

export const getMills = () => API.get("/mills");
export const runMatching = () => API.post("/bookings/run-matching");
export const getBookings = () => API.get("/bookings");
export const getYieldEstimate = (plotId, millId, season) =>
    API.get(`/yield/estimate?plotId=${plotId}&millId=${millId}&season=${season}`);
export const fileClaim = (data) => API.post("/subsidy", data);
export const getMyClaims = () => API.get("/subsidy/my-claims");