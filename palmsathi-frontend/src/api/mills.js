import API from "./auth";

export const getMills = () => API.get("/mills");
export const runMatching = () => API.post("/bookings/run-matching");
export const getBookings = () => API.get("/bookings");
export const getYieldEstimate = (plotId, millId, season) =>
    API.get(`/yield/estimate?plotId=${plotId}&millId=${millId}&season=${season}`);
export const fileClaim = (data) => API.post("/subsidy", data);
export const getMyClaims = () => API.get("/subsidy/my-claims");
export const getWallet = () => API.get("/wallet");
export const redeemPoints = (points, reason) => API.post("/wallet/redeem", { points, reason });
export const sendChatMessage = (messages) =>
    fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages }),
    });