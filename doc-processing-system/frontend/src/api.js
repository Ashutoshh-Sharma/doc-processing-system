import axios from "axios";

// const BASE = "http://localhost:8000";
const BASE = "https://doc-processing-system-y8y1.onrender.com";

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${BASE}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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