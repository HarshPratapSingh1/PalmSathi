import API from "./auth";

export const markHarvested = (data) => API.post("/harvest", data);
export const getPendingBatches = () => API.get("/harvest/pending");