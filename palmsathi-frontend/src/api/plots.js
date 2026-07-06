import API from "./auth";

export const getMyPlots = (farmerId) => API.get(`/plots?farmerId=${farmerId}`);
export const getPlotRipeness = (plotId) => API.get(`/plots/${plotId}/ripeness`);
export const getAdvisory = (plotId) => API.get(`/advisory/${plotId}`);
