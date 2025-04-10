import axios from "axios";

const BASE_URL = "http://94.74.86.174:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Fungsi untuk set Authorization header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// AUTH
export const login = (username, password) => {
  return api.post("/login", {
    username,
    password,
  });
};

export const register = (username, email, password) => {
  return api.post("/register", {
    username,
    email,
    password,
  });
};

// CHECKLIST
export const getAllChecklists = () => api.get("/checklist");

export const createChecklist = (name) => api.post("/checklist", { name });

export const deleteChecklist = (checklistId) =>
  api.delete(`/checklist/${checklistId}`);

// CHECKLIST ITEMS
export const getChecklistItems = (checklistId) =>
  api.get(`/checklist/${checklistId}/item`);

export const addChecklistItem = (checklistId, itemName) =>
  api.post(`/checklist/${checklistId}/item`, { itemName });

export const getChecklistItemById = (checklistId, itemId) =>
  api.get(`/checklist/${checklistId}/item/${itemId}`);

export const updateItemStatus = (checklistId, itemId) =>
  api.put(`/checklist/${checklistId}/item/${itemId}`);

export const deleteChecklistItem = (checklistId, itemId) =>
  api.delete(`/checklist/${checklistId}/item/${itemId}`);

export const renameChecklistItem = (checklistId, itemId, itemName) =>
  api.put(`/checklist/${checklistId}/item/rename/${itemId}`, { itemName });

export const renameChecklist = (checklistId, name) =>
  api.put(`/checklist/${checklistId}`, { name });

export default api;
