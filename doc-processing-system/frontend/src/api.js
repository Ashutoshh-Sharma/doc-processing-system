import axios from "axios";

const BASE = "http://localhost:8000";

export const uploadFile = (file) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${BASE}/upload`, fd);
};

export const getDocuments = () => {
  return axios.get(`${BASE}/documents`);
};

export const getStatus = (id) => {
  return axios.get(`${BASE}/status/${id}`);
};

export const retryJob = (id) => {
  return axios.post(`${BASE}/retry/${id}`);
};

export const finalizeDoc = (id) => {
  return axios.post(`${BASE}/finalize/${id}`);
};